from fastapi import FastAPI, Query
import requests

app = FastAPI()

GRAPHQL_URL = "https://aptos-testnet.nodit.io/hc7lkqT6G~1HLw~rQUcPPuagh39b1E~K/v1/graphql"

@app.get("/coin_balances/")
async def get_coin_balances(address: str = Query(..., description="Account address to query")):
    query = """
    query MyQuery {
      coin_balances(
        where: {owner_address: {_eq: "%s"}},
        limit: 1
      ) {
        coin_type
        amount
      }
    }
    """ % address

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
