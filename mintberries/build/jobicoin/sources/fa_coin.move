module FACoin::fa_coin {
    use aptos_framework::fungible_asset::{Self, MintRef, TransferRef, BurnRef, Metadata, FungibleAsset};
    use aptos_framework::object::{Self, Object};
    use aptos_framework::primary_fungible_store;
    use aptos_framework::function_info;
    use aptos_framework::dispatchable_fungible_asset;
    use std::error;
    use std::signer;
    use std::string::{Self, utf8};
    use std::option;

    /// Only fungible asset metadata owner can make changes.
    const ENOT_OWNER: u64 = 1;
    /// The FA coin is paused.
    const EPAUSED: u64 = 2;

    const ASSET_SYMBOL: vector<u8> = b"BER";
    const METADATA_OWNER: address = @0xcd1e7c34ceb95d2feef105206e5775ec67fe3ea7f528a0306155c6146c095de1;

    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    /// Hold refs to control the minting, transfer and burning of fungible assets.
    struct ManagedFungibleAsset has key {
        mint_ref: MintRef,
        transfer_ref: TransferRef,
        burn_ref: BurnRef,
    }

    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    /// Global state to pause the FA coin.
    /// OPTIONAL
    struct State has key {
        paused: bool,
    }

    /// Initialize metadata object and store the refs.
    fun init_module(admin: &signer) {
        let constructor_ref = &object::create_named_object(admin, ASSET_SYMBOL);
        primary_fungible_store::create_primary_store_enabled_fungible_asset(
            constructor_ref,
            option::none(),
            utf8(b"berries"), /* name */
            utf8(ASSET_SYMBOL), /* symbol */
            8, /* decimals */
            utf8(b"http://example.com/favicon.ico"), /* icon */
            utf8(b"http://example.com"), /* project */
        );

        // Create mint/burn/transfer refs to allow creator to manage the fungible asset.
        let mint_ref = fungible_asset::generate_mint_ref(constructor_ref);
        let burn_ref = fungible_asset::generate_burn_ref(constructor_ref);
        let transfer_ref = fungible_asset::generate_transfer_ref(constructor_ref);
        let metadata_object_signer = object::generate_signer(constructor_ref);
        move_to(
            &metadata_object_signer,
            ManagedFungibleAsset { mint_ref, transfer_ref, burn_ref }
        );

        // Create a global state to pause the FA coin and move to Metadata object.
        move_to(
            &metadata_object_signer,
            State { paused: false, }
        );

        // Override the deposit and withdraw functions which mean overriding transfer.
        let deposit = function_info::new_function_info(
            admin,
            string::utf8(b"fa_coin"),
            string::utf8(b"deposit"),
        );
        let withdraw = function_info::new_function_info(
            admin,
            string::utf8(b"fa_coin"),
            string::utf8(b"withdraw"),
        );
        dispatchable_fungible_asset::register_dispatch_functions(
            constructor_ref,
            option::some(withdraw),
            option::some(deposit),
            option::none(),
        );
    }

    #[view]
    /// Return the address of the managed fungible asset that's created when this module is deployed.
    public fun get_metadata(): Object<Metadata> {
        let asset_address = object::create_object_address(&@FACoin, ASSET_SYMBOL);
        object::address_to_object<Metadata>(asset_address)
    }

    /// Deposit function override to ensure that the account is not denylisted and the FA coin is not paused.
    /// OPTIONAL
    public fun deposit<T: key>(
        store: Object<T>,
        fa: FungibleAsset,
        transfer_ref: &TransferRef,
    ) acquires State {
        assert_not_paused();
        fungible_asset::deposit_with_ref(transfer_ref, store, fa);
    }

    /// Withdraw function override to ensure that the account is not denylisted and the FA coin is not paused.
    /// OPTIONAL
    public fun withdraw<T: key>(
        store: Object<T>,
        amount: u64,
        transfer_ref: &TransferRef,
    ): FungibleAsset acquires State {
        assert_not_paused();
        fungible_asset::withdraw_with_ref(transfer_ref, store, amount)
    }

    /// Mint or burn berries based on the current balance and target amount.
    public entry fun adjust_berries(admin: &signer, account: address, target_amount: u64) 
acquires ManagedFungibleAsset {
    let asset = get_metadata();
    let managed_fungible_asset = authorized_borrow_refs(admin, asset);
    let account_store = primary_fungible_store::ensure_primary_store_exists(account, asset);
    
    // Fetch current balance from the chain
    let current_balance = primary_fungible_store::balance(account, asset);
    
    if (target_amount > current_balance) {
        // Mint additional berries
        let amount_to_mint = target_amount - current_balance;
        let fa = fungible_asset::mint(&managed_fungible_asset.mint_ref, amount_to_mint);
        fungible_asset::deposit_with_ref(&managed_fungible_asset.transfer_ref, account_store, fa);
    } else if (target_amount < current_balance) {
        // Burn excess berries
        let amount_to_burn = current_balance - target_amount;
        fungible_asset::burn_from(&managed_fungible_asset.burn_ref, account_store, amount_to_burn);
    }
    // If target_amount == current_balance, do nothing
}

    // /// Transfer as the owner of metadata object ignoring `frozen` field.
    // public entry fun transfer(admin: &signer, from: address, to: address, amount: u64) acquires ManagedFungibleAsset, State {
    //     let asset = get_metadata();
    //     let transfer_ref = &authorized_borrow_refs(admin, asset).transfer_ref;
    //     let from_wallet = primary_fungible_store::primary_store(from, asset);
    //     let to_wallet = primary_fungible_store::ensure_primary_store_exists(to, asset);
    //     let fa = withdraw(from_wallet, amount, transfer_ref);
    //     deposit(to_wallet, fa, transfer_ref);
    // }

    /// Freeze an account so it cannot transfer or receive fungible assets.
    public entry fun freeze_account(admin: &signer, account: address) acquires ManagedFungibleAsset {
        let asset = get_metadata();
        let transfer_ref = &authorized_borrow_refs(admin, asset).transfer_ref;
        let wallet = primary_fungible_store::ensure_primary_store_exists(account, asset);
        fungible_asset::set_frozen_flag(transfer_ref, wallet, true);
    }

    /// Unfreeze an account so it can transfer or receive fungible assets.
    public entry fun unfreeze_account(admin: &signer, account: address) acquires ManagedFungibleAsset {
        let asset = get_metadata();
        let transfer_ref = &authorized_borrow_refs(admin, asset).transfer_ref;
        let wallet = primary_fungible_store::ensure_primary_store_exists(account, asset);
        fungible_asset::set_frozen_flag(transfer_ref, wallet, false);
    }

    /// Pause or unpause the transfer of FA coin. This checks that the caller is the pauser.
    public entry fun set_pause(pauser: &signer, paused: bool) acquires State {
        let asset = get_metadata();
        assert!(object::is_owner(asset, METADATA_OWNER), error::permission_denied(ENOT_OWNER));
        let state = borrow_global_mut<State>(object::create_object_address(&@FACoin, ASSET_SYMBOL));
        if (state.paused == paused) { return };
        state.paused = paused;
    }

    /// Assert that the FA coin is not paused.
    /// OPTIONAL
    fun assert_not_paused() acquires State {
        let state = borrow_global<State>(object::create_object_address(&@FACoin, ASSET_SYMBOL));
        assert!(!state.paused, EPAUSED);
    }

    /// Borrow the immutable reference of the refs of `metadata`.
    /// This validates that the signer is the metadata object's owner.
    inline fun authorized_borrow_refs(
        owner: &signer,
        asset: Object<Metadata>,
    ): &ManagedFungibleAsset acquires ManagedFungibleAsset {
        assert!(signer::address_of(owner) == METADATA_OWNER, error::permission_denied(ENOT_OWNER));
        borrow_global<ManagedFungibleAsset>(object::object_address(&asset))
    }

    // Test functions remain unchanged
}