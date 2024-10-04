import { 
    Account, 
    Aptos, 
    AptosConfig, 
    Network, 
  } from "@aptos-labs/ts-sdk";
  
  // Replace with your deployed module's address
  const PREFERENCES_MODULE = "0x80c309297bfc69d6f2fbfd0e7d1bde369ac5a7d9b1a5b40e31edc79c2dccd7e8::UserPreferences";
  const ALICE_INITIAL_BALANCE = 100_000_000;
  
  async function main() {
    const config = new AptosConfig({ network: Network.TESTNET });
    const aptos = new Aptos(config);
  
    // Create Alice's account
    const alice = Account.generate();
    console.log(`Alice's address is: ${alice.accountAddress}`);
  
    // Fund Alice's account
    await aptos.fundAccount({
      accountAddress: alice.accountAddress,
      amount: ALICE_INITIAL_BALANCE,
    });
    console.log("Alice's account has been funded!");
  
    // Convert preferences to a single byte array
    const preferences = new Uint8Array([1, 2, 3]); // [COOKING, DANCING, ART]
  
    const preferencesTxn = await aptos.transaction.build.simple({
      sender: alice.accountAddress,
      data: {
        function: `${PREFERENCES_MODULE}::create_profile`,
        functionArguments: [
          // Convert strings to hex-encoded bytes
          Array.from(new TextEncoder().encode("Alice")),
          Array.from(new TextEncoder().encode("example_world_id_hash")),
          // Pass preferences as a single array of bytes
          Array.from(preferences)
        ],
        typeArguments: [],
      },
    });
  
    const committedTxn = await aptos.signAndSubmitTransaction({
      signer: alice,
      transaction: preferencesTxn,
    });
  
    const executedTransaction = await aptos.waitForTransaction({
      transactionHash: committedTxn.hash,
    });
  
    console.log("Transaction hash:", executedTransaction.hash);
    console.log(`You can view the transaction at: https://explorer.aptoslabs.com/txn/${executedTransaction.hash}?network=testnet`);
  
    // Try to get the profile to verify it was created
    try {
      const resource = await aptos.getAccountResource({
        accountAddress: alice.accountAddress,
        resourceType: `${PREFERENCES_MODULE}::Profile`,
      });
      console.log("\nCreated profile:", resource.data);
    } catch (error) {
      console.log("Error fetching profile:", error);
    }
  }
  
  // Helper function to convert hex string to readable string
  function hexToString(hex: string): string {
    hex = hex.replace('0x', '');
    let str = '';
    for (let i = 0; i < hex.length; i += 2) {
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return str;
  }
  
  main().catch(console.error);
  