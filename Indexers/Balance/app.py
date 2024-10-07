from fastapi import FastAPI, Query
import requests

app = FastAPI()

GRAPHQL_URL = "https://aptos-testnet.nodit.io/hc7lkqT6G~1HLw~rQUcPPuagh39b1E~K/v1/graphql"

@app.get("/coin_balances/")
async def get_coin_balances(address: str = Query(..., description="Account address to query")):
    query = f"""
    query MyQuery {{
      current_fungible_asset_balances(
        where: {{
          owner_address: {{_eq: "{address}"}},
          asset_type: {{_eq: "0x9a973cf48c71b8c4923d12dd1a6adc4308f80cec3ecacbf6ede4bf137fb91aaa"}}
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

        # Return the result if the query was successful
        if "data" in response_data:
            return response_data["data"]
        else:
            # If there is an error in the GraphQL query
            return {"error": response_data.get("errors", "Unknown error")}
    
    except Exception as e:
        return {"error": str(e)}