from fastapi import FastAPI, Query
import requests
import os
import uvicorn

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

        # Return all resources
        all_resources = []
        
        for resource in response_data:
            all_resources.append({
                "type": resource["type"],
                "data": resource["data"]
            })

        return {"resources": all_resources}
    else:
        return {"error": "Failed to fetch data from Aptos API"}

# Entry point to run the app using Uvicorn
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    uvicorn.run(app, host="0.0.0.0", port=port)
