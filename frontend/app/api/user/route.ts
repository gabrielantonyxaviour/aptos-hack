export async function GET(req: Request) {
  const request = new URL(req.url);
  const accountAddress = request.searchParams.get("AccountAddress");

  try {
    const response = await fetch(
      `https://resources-bfih.onrender.com/get-user-posts?AccountAddress=${accountAddress}`
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
      data,
    });
  } catch (error) {
    console.error("Error fetching data from external API:", error);
    Response.json({ message: "Internal server error" });
  }
}
