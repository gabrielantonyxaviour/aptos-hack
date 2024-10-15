from fastapi import FastAPI, Query
import requests

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

        # Instead of filtering for specific "UserPosts", return all resources
        all_resources = []
        
        for resource in response_data:
            # Append each resource to the list
            all_resources.append({
                "type": resource["type"],
                "data": resource["data"]
            })

        # Return the entire resources list
        return {"resources": all_resources}
    else:
        return {"error": "Failed to fetch data from Aptos API"}
