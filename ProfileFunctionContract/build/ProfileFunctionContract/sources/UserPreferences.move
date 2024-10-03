module 0x2a24a3707383e0293a3b786848519a55ce21f38eb78c3217829c9a3926179cd8::UserPreferences {
    use std::signer;
    
    // Struct to store user preferences and profile information
    struct Preferences has key, copy, drop {
        cooking: bool,
        dancing: bool,
        art: bool,
        account_address: address,
        account_name: vector<u8>,
        world_id_nullifier_hash: vector<u8>,
    }
    
    // Create a resource for storing preferences and profile
    public entry fun create_preferences(
        account: signer, 
        cooking: bool, 
        dancing: bool, 
        art: bool, 
        account_name: vector<u8>, 
        world_id_nullifier_hash: vector<u8>
    ) {
        let account_address = signer::address_of(&account);
        assert!(!exists<Preferences>(account_address), 1);  // Ensure preferences don't already exist
        let preferences = Preferences { 
            cooking, 
            dancing, 
            art, 
            account_address, 
            account_name, 
            world_id_nullifier_hash 
        };
        move_to(&account, preferences);
    }
    
    // Update existing preferences and profile
    public entry fun update_preferences(
        account: signer, 
        cooking: bool, 
        dancing: bool, 
        art: bool, 
        account_name: vector<u8>, 
        world_id_nullifier_hash: vector<u8>
    ) acquires Preferences {
        let account_address = signer::address_of(&account);
        let preferences_ref = borrow_global_mut<Preferences>(account_address);
        preferences_ref.cooking = cooking;
        preferences_ref.dancing = dancing;
        preferences_ref.art = art;
        preferences_ref.account_name = account_name;
        preferences_ref.world_id_nullifier_hash = world_id_nullifier_hash;
    }
    
    // Retrieve user preferences (returns a copy instead of a reference)
    #[view]
    public fun get_preferences(account_address: address): Preferences acquires Preferences {
        assert!(exists<Preferences>(account_address), 1);  // Ensure preferences exist
        *borrow_global<Preferences>(account_address)
    }
}
