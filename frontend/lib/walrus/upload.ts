export default async function uploadToWalrus(
  image: File,
  onSuccess: (blobId: string) => void,
  onError: (error: Error) => void
) {
  try {
    const epochs = 5;
    const force = true;
    const response = await fetch(
      `https://publisher-devnet.walrus.space/v1/store?epochs=${epochs}&force=${force}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/octet-stream",
        },
        body: image, // Image being uploaded
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to upload image: ${response.statusText}`);
    }

    const responseData = await response.json();

    // Extract blobId and call onSuccess callback
    const blobId = responseData.newlyCreated.blobObject.blobId;
    onSuccess(blobId); // Call success callback with blobId
  } catch (error) {
    onError(error as Error); // Call error callback
  }
}
