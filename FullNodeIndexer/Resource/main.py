from fastapi import FastAPI, Query
import requests
import json

app = FastAPI()

# Your API key here
API_KEY = "hc7lkqT6G~1HLw~rQUcPPuagh39b1E~K"

@app.get("/get-user-posts")
def get_user_posts(account_address: str = Query(..., alias="AccountAddress")):
    url = f"https://aptos-testnet.nodit.io/v1/accounts/{account_address}/resources"
    headers = {
        "accept": "application/json",
        "X-API-KEY": API_KEY
    }

    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        response_data = response.json()

        # Extract the "UserPosts" data
        user_posts = None
        for resource in response_data:
            if "SocialMedia::UserPosts" in resource["type"]:
                user_posts = resource["data"]["posts"]

        # Format the output to match your desired structure
        if user_posts:
            formatted_data = {
                "posts": []
            }
            for i, post in enumerate(user_posts):
                formatted_data["posts"].append({
                    "comments": post["comments"],
                    "content_hash": post["content_hash"],
                    "creator": post["creator"],
                    "is_promotional": post["is_promotional"],
                    "like_count": post["like_count"],
                    "promoted_profile": post["promoted_profile"]
                })
            
            return formatted_data
        else:
            return {"message": "No user posts found."}
    else:
        return {"error": "Failed to fetch data from Aptos API"}

