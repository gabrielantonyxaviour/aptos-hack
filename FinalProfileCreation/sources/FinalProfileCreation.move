module 0x80c309297bfc69d6f2fbfd0e7d1bde369ac5a7d9b1a5b40e31edc79c2dccd7e8::UserPreferences {
    use std::signer;
    use std::vector;

    // Struct to store user profile information
    struct Profile has key, copy, drop {
        account_address: address,
        account_name: vector<u8>,
        world_id_nullifier_hash: vector<u8>,
        preferences: vector<u8>,  // List of preference IDs (max 5)
    }

    const MAX_PREFERENCES: u64 = 5;
    const COOKING: u8 = 1;
    const DANCING: u8 = 2;
    const ART: u8 = 3;

    // Create a resource for storing profile and preferences
    public entry fun create_profile(
        account: signer,
        account_name: vector<u8>,
        world_id_nullifier_hash: vector<u8>,
        preferences: vector<u8>
    ) {
        let account_address = signer::address_of(&account);
        assert!(!exists<Profile>(account_address), 1);  // Ensure profile doesn't already exist
        assert!(vector::length(&preferences) <= MAX_PREFERENCES, 2);  // Ensure max 5 preferences

        let profile = Profile {
            account_address,
            account_name,
            world_id_nullifier_hash,
            preferences
        };
        move_to(&account, profile);
    }

    // Update existing preferences and profile
    public entry fun update_profile(
        account: signer,
        account_name: vector<u8>,
        world_id_nullifier_hash: vector<u8>,
        preferences: vector<u8>
    ) acquires Profile {
        let account_address = signer::address_of(&account);
        let profile_ref = borrow_global_mut<Profile>(account_address);
        assert!(vector::length(&preferences) <= MAX_PREFERENCES, 2);  // Ensure max 5 preferences

        profile_ref.account_name = account_name;
        profile_ref.world_id_nullifier_hash = world_id_nullifier_hash;
        profile_ref.preferences = preferences;
    }

    // Retrieve user profile (returns a copy instead of a reference)
    #[view]
    public fun get_profile(account_address: address): Profile acquires Profile {
        assert!(exists<Profile>(account_address), 1);  // Ensure profile exists
        *borrow_global<Profile>(account_address)
    }
}