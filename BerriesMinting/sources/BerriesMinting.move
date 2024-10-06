module berries_minting::berries_coin {
    use aptos_framework::fungible_asset::{Self, MintRef, TransferRef, BurnRef, Metadata};
    use aptos_framework::object::{Self, Object};
    use aptos_framework::primary_fungible_store;
    use std::error;
    use std::signer;
    use std::string::utf8;
    use std::option;

    /// Only fungible asset metadata owner can make changes.
    const ENOT_OWNER: u64 = 1;

    const ASSET_SYMBOL: vector<u8> = b"BER";

    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    struct ManagedFungibleAsset has key {
        mint_ref: MintRef,
        transfer_ref: TransferRef,
        burn_ref: BurnRef,
    }

    fun init_module(admin: &signer) {
        let constructor_ref = &object::create_named_object(admin, ASSET_SYMBOL);
        primary_fungible_store::create_primary_store_enabled_fungible_asset(
            constructor_ref,
            option::none(),
            utf8(b"Berries"), /* name */
            utf8(ASSET_SYMBOL), /* symbol */
            8, /* decimals */
            utf8(b"http://example.com/berries-icon.ico"), /* icon */
            utf8(b"http://berries-project.com"), /* project */
        );

        let mint_ref = fungible_asset::generate_mint_ref(constructor_ref);
        let burn_ref = fungible_asset::generate_burn_ref(constructor_ref);
        let transfer_ref = fungible_asset::generate_transfer_ref(constructor_ref);
        let metadata_object_signer = object::generate_signer(constructor_ref);
        
        // Store the refs
        move_to(
            &metadata_object_signer,
            ManagedFungibleAsset { mint_ref, burn_ref, transfer_ref }
        );
    }

    #[view]
    /// Return the metadata object of Berries coin
    public fun get_metadata(): Object<Metadata> {
        let asset_address = object::create_object_address(&@berries_minting, ASSET_SYMBOL);
        object::address_to_object<Metadata>(asset_address)
    }

    /// Mint new Berries tokens to a specified address.
    /// This function can be called from the frontend with the desired amount.
    public entry fun mint_berries(admin: &signer, to: address, amount: u64) acquires ManagedFungibleAsset {
        let asset = get_metadata();
        let managed_fungible_asset = authorized_borrow_refs(admin, asset);
        let to_wallet = primary_fungible_store::ensure_primary_store_exists(to, asset);
        let fa = fungible_asset::mint(&managed_fungible_asset.mint_ref, amount);
        fungible_asset::deposit_with_ref(&managed_fungible_asset.transfer_ref, to_wallet, fa);
    }

    /// Transfer Berries from one address to another
    public entry fun transfer(admin: &signer, from: address, to: address, amount: u64) 
        acquires ManagedFungibleAsset {
        let asset = get_metadata();
        let transfer_ref = &authorized_borrow_refs(admin, asset).transfer_ref;
        let from_wallet = primary_fungible_store::primary_store(from, asset);
        let to_wallet = primary_fungible_store::ensure_primary_store_exists(to, asset);
        let fa = fungible_asset::withdraw_with_ref(transfer_ref, from_wallet, amount);
        fungible_asset::deposit_with_ref(transfer_ref, to_wallet, fa);
    }

    /// Helper function to authorize and borrow refs
    inline fun authorized_borrow_refs(
        owner: &signer,
        asset: Object<Metadata>,
    ): &ManagedFungibleAsset acquires ManagedFungibleAsset {
        assert!(object::is_owner(asset, signer::address_of(owner)), error::permission_denied(ENOT_OWNER));
        borrow_global<ManagedFungibleAsset>(object::object_address(&asset))
    }

    #[test(creator = @berries_minting)]
    fun test_minting(creator: &signer) acquires ManagedFungibleAsset {
        init_module(creator);
        let creator_address = signer::address_of(creator);
        let test_address = @0xface;

        // Test minting
        mint_berries(creator, test_address, 100);
        let asset = get_metadata();
        assert!(primary_fungible_store::balance(test_address, asset) == 100, 4);

        // Test transfer
        transfer(creator, test_address, creator_address, 50);
        assert!(primary_fungible_store::balance(test_address, asset) == 50, 5);
        assert!(primary_fungible_store::balance(creator_address, asset) == 50, 6);
    }
}