import { 
  Account, 
  Aptos, 
  AptosConfig, 
  Network 
} from "@aptos-labs/ts-sdk";

// Replace with your deployed module's address
const SOCIAL_MEDIA_MODULE = "0xb539b2f09388d40e14ac1c5997edd3f650ace3c227ac7df49128c68dba658d6c::SocialMedia";
const INITIAL_BALANCE = 100_000_000; // Funding for the account

async function main() {
  const config = new AptosConfig({ network: Network.TESTNET });
  const aptos = new Aptos(config);

  // Create user account
  const user = Account.generate();
  console.log(`User's address is: ${user.accountAddress}`);

  // Fund user's account
  await aptos.fundAccount({
    accountAddress: user.accountAddress,
    amount: INITIAL_BALANCE,
  });
  console.log("User's account has been funded!");

  // Create a post
  const contentHash = new TextEncoder().encode("QmSomeIPFSHashForPostContent"); // Content hash
  const isPromotional = false;
  const promotedProfile = null; // No promoted profile for this example

  const createPostTxn = await aptos.transaction.build.simple({
    sender: user.accountAddress,
    data: {
      function: `${SOCIAL_MEDIA_MODULE}::create_post`,
      functionArguments: [
        Array.from(contentHash),    // Post content hash as Uint8Array
        isPromotional,              // Boolean for promotional post
        promotedProfile             // Promoted profile (Optional: null if not promotional)
      ],
      typeArguments: [],
    },
  });

  const committedCreatePostTxn = await aptos.signAndSubmitTransaction({
    signer: user,
    transaction: createPostTxn,
  });

  const executedCreatePostTxn = await aptos.waitForTransaction({
    transactionHash: committedCreatePostTxn.hash,
  });
  console.log("Post created successfully! Transaction hash:", executedCreatePostTxn.hash);

  // Like a post
  const postCreator = user.accountAddress; // Same user who created the post
  const postIndex = 0; // First post

  const likePostTxn = await aptos.transaction.build.simple({
    sender: user.accountAddress,
    data: {
      function: `${SOCIAL_MEDIA_MODULE}::like_post`,
      functionArguments: [
        postCreator,  // Address of the post creator
        postIndex     // Post index (e.g., 0 for the first post)
      ],
      typeArguments: [],
    },
  });

  const committedLikePostTxn = await aptos.signAndSubmitTransaction({
    signer: user,
    transaction: likePostTxn,
  });

  const executedLikePostTxn = await aptos.waitForTransaction({
    transactionHash: committedLikePostTxn.hash,
  });
  console.log("Post liked successfully! Transaction hash:", executedLikePostTxn.hash);

  // Comment on a post
  const commentContent = new TextEncoder().encode("This is a comment!");

  const commentPostTxn = await aptos.transaction.build.simple({
    sender: user.accountAddress,
    data: {
      function: `${SOCIAL_MEDIA_MODULE}::comment_on_post`,
      functionArguments: [
        postCreator,               // Address of the post creator
        postIndex,                 // Post index (e.g., 0 for the first post)
        Array.from(commentContent) // Comment content as bytes
      ],
      typeArguments: [],
    },
  });

  const committedCommentPostTxn = await aptos.signAndSubmitTransaction({
    signer: user,
    transaction: commentPostTxn,
  });

  const executedCommentPostTxn = await aptos.waitForTransaction({
    transactionHash: committedCommentPostTxn.hash,
  });
  console.log("Comment added successfully! Transaction hash:", executedCommentPostTxn.hash);
}

main().catch(console.error);
