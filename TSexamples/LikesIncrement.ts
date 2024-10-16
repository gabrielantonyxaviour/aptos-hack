import { 
    Aptos, 
    AptosConfig, 
    Account, 
    Network 
  } from "@aptos-labs/ts-sdk";
  
  // Replace with your deployed module's address and post creator's address
  const SOCIAL_MEDIA_MODULE = "0xb539b2f09388d40e14ac1c5997edd3f650ace3c227ac7df49128c68dba658d6c::SocialMedia";
  const POST_CREATOR = "0xc63fd65dbb272428c37b46ddee5b6e375929648af361dcce653da406c94e7190"; // Replace with the creator's address
  const POST_INDEX = 0; // The index of the post to like
  
  async function main() {
    const config = new AptosConfig({ network: Network.TESTNET });
    const aptos = new Aptos(config);
  
    // Create an account that will "like" the post (or use an existing account)
    const user = Account.generate();
    console.log(`User's address is: ${user.accountAddress}`);
  
    // Fund the user's account so they can pay for gas fees
    await aptos.fundAccount({
      accountAddress: user.accountAddress,
      amount: 100_000_000, // Adjust the amount based on testnet limits
    });
    console.log("User's account has been funded!");
  
    // Create the transaction to like the post
    const likeTxn = await aptos.transaction.build.simple({
      sender: user.accountAddress,
      data: {
        function: `${SOCIAL_MEDIA_MODULE}::like_post`,
        functionArguments: [
          POST_CREATOR,   // The address of the post creator
          POST_INDEX      // The index of the post
        ],
        typeArguments: [], // No type arguments needed for this function
      },
    });
  
    // Sign and submit the transaction
    const committedTxn = await aptos.signAndSubmitTransaction({
      signer: user,
      transaction: likeTxn,
    });
  
    // Wait for the transaction to be confirmed
    const executedTransaction = await aptos.waitForTransaction({
      transactionHash: committedTxn.hash,
    });
    
    console.log(`Post liked successfully! Transaction hash: ${executedTransaction.hash}`);
    
    // Check the updated like count for the post
    await checkLikesCount(POST_CREATOR, POST_INDEX);
  }
  
  async function checkLikesCount(creator: string, postIndex: number) {
    const config = new AptosConfig({ network: Network.TESTNET });
    const aptos = new Aptos(config);
  
    try {
      // Fetch the UserPosts resource
      const resource = await aptos.getAccountResource({
        accountAddress: creator,
        resourceType: `${SOCIAL_MEDIA_MODULE}::UserPosts`,
      });
  
      // Get the posts array
      const posts = resource.data.posts;
  
      // Check if the post exists at the given index
      if (posts.length > postIndex) {
        const post = posts[postIndex];
        console.log(`Post ${postIndex} like count:`, post.like_count);
      } else {
        console.log(`Post at index ${postIndex} does not exist.`);
      }
    } catch (error) {
      console.error("Error fetching UserPosts resource:", error);
    }
  }
  
  main().catch(console.error);
  