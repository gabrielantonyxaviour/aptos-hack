# main.py

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import numpy as np
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="SocioBerries API",
    description="API to calculate Credibility Weight and Influencer Score (Berries)",
    version="1.0.0"
)

# Load the ML models at startup
try:
    credibility_model = joblib.load('credibility_model.joblib')
    influencer_model = joblib.load('influencer_model.joblib')
    logger.info("Models loaded successfully.")
except FileNotFoundError as e:
    logger.error(f"Model file not found: {e}")
    raise e
except Exception as e:
    logger.error(f"Error loading models: {e}")
    raise e

# Define Pydantic models for request and response

class CredibilityInput(BaseModel):
    onchain_net_worth: float
    followers_of_followers: int

class CredibilityOutput(BaseModel):
    credibility_weight: float
    correlation_factor: float

class InfluencerInput(BaseModel):
    followers: int
    likes: int
    comments: int
    ads_purchased_from_profile: int
    average_likes_per_day: float
    average_comments_per_day: float
    credibility_weight: float

class InfluencerOutput(BaseModel):
    berries: float
    correlation_factor: float

@app.post("/calculate_credibility", response_model=CredibilityOutput)
def calculate_credibility(input: CredibilityInput):
    """
    Calculate the Credibility Weight based on On-chain Net Worth and Followers of Followers.
    """
    logger.info(f"Received Credibility Input: {input}")
    try:
        # Prepare input for the model
        features = np.array([[input.onchain_net_worth, input.followers_of_followers]])

        # Predict Credibility Weight and Correlation Factor
        prediction = credibility_model.predict(features)

        # Check if prediction has multiple outputs
        if prediction.ndim > 1 and prediction.shape[1] >= 2:
            credibility_weight = prediction[0][0]
            correlation_factor = prediction[0][1]
        elif prediction.ndim == 1 and prediction.shape[0] >= 2:
            credibility_weight = prediction[0]
            correlation_factor = prediction[1]
        else:
            credibility_weight = prediction[0]
            correlation_factor = 1.0  # Default if only one output

        logger.info(f"Calculated Credibility Weight: {credibility_weight}, Correlation Factor: {correlation_factor}")

        return CredibilityOutput(
            credibility_weight=credibility_weight,
            correlation_factor=correlation_factor
        )
    except Exception as e:
        logger.exception(f"Error in calculate_credibility: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.post("/calculate_berries", response_model=InfluencerOutput)
def calculate_berries(input: InfluencerInput):
    """
    Calculate the Influencer Score (Berries) based on various engagement metrics and Credibility Weight.
    """
    logger.info(f"Received Influencer Input: {input}")
    try:
        # Prepare input for the model
        features = np.array([[
            input.followers,
            input.likes,
            input.comments,
            input.ads_purchased_from_profile,
            input.average_likes_per_day,
            input.average_comments_per_day,
            input.credibility_weight
        ]])

        # Predict Berries and Correlation Factor
        prediction = influencer_model.predict(features)

        # Check if prediction has multiple outputs
        if prediction.ndim > 1 and prediction.shape[1] >= 2:
            berries = prediction[0][0]
            correlation_factor = prediction[0][1]
        elif prediction.ndim == 1 and prediction.shape[0] >= 2:
            berries = prediction[0]
            correlation_factor = prediction[1]
        else:
            berries = prediction[0]
            correlation_factor = 1.0  # Default if only one output

        logger.info(f"Calculated Berries: {berries}, Correlation Factor: {correlation_factor}")

        return InfluencerOutput(
            berries=berries,
            correlation_factor=correlation_factor
        )
    except Exception as e:
        logger.exception(f"Error in calculate_berries: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

# Optional: Root endpoint for testing
@app.get("/")
def read_root():
    return {"message": "Welcome to SocioBerries API"}
