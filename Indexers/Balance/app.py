from fastapi import FastAPI, Query
import requests
import os
import uvicorn

app = FastAPI()

GRAPHQL_URL = "https://aptos-testnet.nodit.io/hc7lkqT6G~1HLw~rQUcPPuagh39b1E~K/v1/graphql"
COINGECKO_API_URL = "https://api.coingecko.com/api/v3/simple/price"

# Function to get the current Aptos (APT) price in USD
def get_aptos_price_usd():
    try:
        response = requests.get(COINGECKO_API_URL, params={
            "ids": "aptos",
            "vs_currencies": "usd"
        })
        data = response.json()
        return data.get("aptos", {}).get("usd", None)
    except Exception as e:
        print(f"Error fetching APT price: {str(e)}")
        return None

@app.get("/coin_balances/")
async def get_coin_balances(address: str = Query(..., description="Account address to query")):
    query = f"""
    query MyQuery {{
      current_fungible_asset_balances(
        where: {{
          owner_address: {{_eq: "{address}"}}  
        }},
        limit: 10,
        offset: 0
      ) {{
        owner_address
        amount
        storage_id
        last_transaction_version
        last_transaction_timestamp
        is_frozen
        metadata {{
          asset_type
          name
          symbol
          supply_v2
        }}
      }}
    }}
    """

    try:
        response = requests.post(GRAPHQL_URL, json={"query": query})
        response_data = response.json()

        # Fetch the Aptos price in USD
        aptos_price_usd = get_aptos_price_usd()

        # Filter the balances for Aptos Coin and Berries
        if "data" in response_data:
            coin_balances = response_data["data"]["current_fungible_asset_balances"]

            latest_balances = []
            for balance in coin_balances:
                asset_type = balance["metadata"]["asset_type"]
                if asset_type == "0x1::aptos_coin::AptosCoin":
                    if aptos_price_usd is not None:
                        # Convert the amount of Aptos Coin to USD
                        balance["amount_in_usd"] = balance["amount"] * aptos_price_usd / 10**8
                    else:
                        balance["amount_in_usd"] = "Unable to fetch price"
                    latest_balances.append(balance)

                elif "berries" in balance["metadata"]["name"].lower():
                    # Assuming berries token can be filtered by name containing 'berries'
                    latest_balances.append(balance)

            return {"latest_balances": latest_balances}
        else:
            return {"error": response_data.get("errors", "Unknown error")}

    except Exception as e:
        return {"error": str(e)}

# Entry point to run the app using Uvicorn
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    uvicorn.run(app, host="0.0.0.0", port=port)
