from fastapi import FastAPI, HTTPException, Query
import httpx
import re

app = FastAPI()

# Define the base URL for the Aptos testnet API
APTOS_API_URL = "https://fullnode.testnet.aptoslabs.com/v1/accounts/{account_address}/resources"

@app.get("/user_posts/")
async def get_user_posts(AccountAddress: str = Query(..., description="The Aptos account address")):
    # Validate account address format (simple regex check)
    if not re.match(r"^0x[a-fA-F0-9]{64}$", AccountAddress):
        raise HTTPException(status_code=400, detail="Invalid account address format")

    # Construct the URL with the provided account address
    url = APTOS_API_URL.format(account_address=AccountAddress)

    async with httpx.AsyncClient() as client:
        response = await client.get(url)

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Error fetching data from Aptos API")

    resources = response.json()
    
    # Filter for UserPosts resource
    user_posts_resource = next(
        (resource for resource in resources if "SocialMedia::UserPosts" in resource["type"]),
        None
    )

    if user_posts_resource is None:
        raise HTTPException(status_code=404, detail="UserPosts resource not found")

    return user_posts_resource