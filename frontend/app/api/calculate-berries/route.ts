export async function GET(req: Request) {
  const request = new URL(req.url);
  const accountAddress = request.searchParams.get("account_address");
  const ownerAddress = request.searchParams.get("owner_address");

  try {
    const response = await fetch(
      `https://aptos-hack.onrender.com/fetch_and_calculate?account_address=${accountAddress}&owner_address=${ownerAddress}`
    );
    if (!response.ok) {
      return Response.json({
        message: "Failed to fetch from external API",
      });
    }

    // Parse the response
    const data = await response.json();
    console.log(data);
    // Send the response back to the frontend
    return Response.json({
      berries: parseInt(data.berries),
    });
  } catch (error) {
    console.log("Error fetching data from external API:", error);
    Response.json({ message: "Internal server error" });
  }
}
