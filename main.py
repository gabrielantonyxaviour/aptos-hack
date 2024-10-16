from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
import joblib
import numpy as np
import logging
import requests

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="SocioBerries API",
    description="API to calculate Credibility Weight and Influencer Score (Berries) in a single step",
    version="1.0.0"
)

# Load the ML models at startup
try:
    credibility_model = joblib.load('credibility_model.joblib')
    influencer_model = joblib.load('influencer_model.joblib')
    logger.info("Models loaded successfully.")
except FileNotFoundError as e:
    logger.error(f"Model file not found: {e}")
    raise HTTPException(status_code=500, detail="Model files not found")
except Exception as e:
    logger.error(f"Error loading models: {e}")
    raise HTTPException(status_code=500, detail="Error loading models")

# Define Pydantic model for the input and output
class CombinedInput(BaseModel):
    followers: int
    likes: int
    comments: int
    average_likes_per_day: float
    average_comments_per_day: float

class CombinedOutput(BaseModel):
    credibility_weight: float
    correlation_factor: float
    berries: float
    berries_correlation_factor: float

@app.post("/calculate_all", response_model=CombinedOutput)
def calculate_all(input: CombinedInput, onchain_net_worth: float):
    """
    Calculate Credibility Weight and use it to calculate the Influencer Score (Berries).
    The onchain_net_worth is used along with followers_of_followers.
    """
    logger.info(f"Received Combined Input: {input} and onchain_net_worth: {onchain_net_worth}")

    try:
        # Step 1: Calculate the Credibility Weight and Correlation Factor
        credibility_features = np.array([[onchain_net_worth, 5000]])  # Using onchain_net_worth and hardcoded followers_of_followers
        credibility_prediction = credibility_model.predict(credibility_features)

        credibility_weight = credibility_prediction[0] if credibility_prediction.ndim == 1 else credibility_prediction[0][0]
        credibility_correlation_factor = 1.0 if credibility_prediction.ndim == 1 else credibility_prediction[0][1]

        logger.info(f"Calculated Credibility Weight: {credibility_weight}, Correlation Factor: {credibility_correlation_factor}")

        # Step 2: Use Credibility Weight to calculate the Influencer Score (Berries)
        influencer_features = np.array([[input.followers, input.likes, input.comments, 500,  # ads_purchased_from_profile hardcoded to 500
                                         input.average_likes_per_day, input.average_comments_per_day, credibility_weight]])
        influencer_prediction = influencer_model.predict(influencer_features)

        berries = influencer_prediction[0] if influencer_prediction.ndim == 1 else influencer_prediction[0][0]
        berries_correlation_factor = 1.0 if influencer_prediction.ndim == 1 else influencer_prediction[0][1]

        logger.info(f"Calculated Berries: {berries}, Correlation Factor: {berries_correlation_factor}")

        # Return combined output
        return CombinedOutput(
            credibility_weight=credibility_weight,
            correlation_factor=credibility_correlation_factor,
            berries=berries,
            berries_correlation_factor=berries_correlation_factor
        )

    except Exception as e:
        logger.exception("Error in calculate_all")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@app.get("/fetch_and_calculate")
def fetch_and_calculate(account_address: str):
    """
    Fetch user data from external API and calculate Credibility Weight and Influencer Score.
    The average_likes_per_day is calculated based on total likes divided by total posts.
    The average_comments_per_day is calculated based on total comments divided by total posts.
    The onchain_net_worth is fetched from an external API using the account_address.
    """
    logger.info(f"Fetching data for account address: {account_address}")

    try:
        # Fetch user posts from external API
        response = requests.get(f"https://resources-bfih.onrender.com/get-user-posts?AccountAddress={account_address}")
        if response.status_code != 200:
            logger.error(f"Error fetching user posts: {response.text}")
            raise HTTPException(status_code=400, detail="Error fetching user posts")

        user_data = response.json()
        
        # Extract followers count and total likes from the response
        followers_count = int(user_data['resources'][1]['data']['followers_count'])
        total_likes = int(user_data['resources'][1]['data']['total_likes'])
        
        # Extract posts data to calculate total comments and average likes/comments per day
        posts = user_data['resources'][2]['data']['posts']
        
        total_posts = len(posts)
        
        # Calculate total comments (assuming 'comment_count' exists in each post)
        total_comments = sum(int(post.get('comment_count', 0)) for post in posts)  
        
        # Calculate average likes per post (to be used as average_likes_per_day)
        average_likes_per_day = total_likes / total_posts if total_posts > 0 else 0
        
        # Calculate average comments per post (to be used as average_comments_per_day)
        average_comments_per_day = total_comments / total_posts if total_posts > 0 else 0

        logger.info(f"Extracted followers_count: {followers_count}, total_likes: {total_likes}, "
                    f"total_comments: {total_comments}, total_posts: {total_posts}, "
                    f"average_likes_per_day: {average_likes_per_day}, "
                    f"average_comments_per_day: {average_comments_per_day}")

        # Fetch onchain_net_worth from an external API using account_address
        balance_response = requests.get(f"https://balance-7m39.onrender.com/coin_balances?address={account_address}")
        
        if balance_response.status_code != 200:
            logger.error(f"Error fetching balance data: {balance_response.text}")
            raise HTTPException(status_code=400, detail="Error fetching balance data")

        balance_data = balance_response.json()
        
        # Extract amount_in_usd from latest_balances; adjust according to actual API response structure
        onchain_net_worth = next((item['amount_in_usd'] for item in balance_data['latest_balances'] 
                                   if item.get('metadata', {}).get('asset_type') == '0x1::aptos_coin::AptosCoin'), None)

        if onchain_net_worth is None:
            logger.error("Aptos Coin balance not found for the provided address")
            raise HTTPException(status_code=400, detail="Aptos Coin balance not found for the provided address")

        logger.info(f"Fetched onchain_net_worth: {onchain_net_worth}")

        # Prepare input for calculation including onchain_net_worth
        combined_input = CombinedInput(
            followers=followers_count,
            likes=total_likes,
            comments=total_comments,
            average_likes_per_day=average_likes_per_day,
            average_comments_per_day=average_comments_per_day  
        )

        # Call calculate_all with extracted data including onchain_net_worth
        return calculate_all(combined_input, onchain_net_worth)

    except Exception as e:
        logger.exception("Error in fetch_and_calculate")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@app.get("/")
def read_root():
    return {"message": "Welcome to the unified SocioBerries API"}
# Entry point to run the app using Uvicorn
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    uvicorn.run(app, host="0.0.0.0", port=port)
