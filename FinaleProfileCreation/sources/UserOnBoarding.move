module 0x2dc39de1d2f276615cd4a9cd936b51663024354e4e3d73f5e3c04202a7b9aa16::UserProfile {
    use std::signer;
    use std::vector;
    use aptos_std::table::{Self, Table};

    // Struct to store user profile information
    struct Profile has key {
        user_name: vector<u8>,
        display_name: vector<u8>,
        bio: vector<u8>,
        preferences: vector<u8>,  // List of preference IDs (max 5)
        niche: vector<u8>,  // List of niche IDs (max 5)
        following_count: u64,
        followers_count: u64,
    }

    // Separate resource to store following and followers
    struct SocialConnections has key {
        following: Table<address, vector<u8>>,  // Map of following addresses to usernames
        followers: Table<address, vector<u8>>,  // Map of follower addresses to usernames
    }

    const MAX_PREFERENCES: u64 = 5;
    const MAX_NICHE: u64 = 5;

    // Error codes
    const PROFILE_ALREADY_EXISTS: u64 = 1;
    const PROFILE_DOES_NOT_EXIST: u64 = 2;
    const MAX_PREFERENCES_EXCEEDED: u64 = 3;
    const MAX_NICHE_EXCEEDED: u64 = 4;
    const ALREADY_FOLLOWING: u64 = 5;
    const NOT_FOLLOWING: u64 = 6;

    // Create a resource for storing profile and preferences
    public entry fun create_profile(
        account: &signer,
        user_name: vector<u8>,
        display_name: vector<u8>,
        bio: vector<u8>,
        preferences: vector<u8>,
        niche: vector<u8>
    ) {
        let account_address = signer::address_of(account);
        assert!(!exists<Profile>(account_address), PROFILE_ALREADY_EXISTS);
        assert!(vector::length(&preferences) <= MAX_PREFERENCES, MAX_PREFERENCES_EXCEEDED);
        assert!(vector::length(&niche) <= MAX_NICHE, MAX_NICHE_EXCEEDED);

        let profile = Profile {
            user_name,
            display_name,
            bio,
            preferences,
            niche,
            following_count: 0,
            followers_count: 0,
        };
        move_to(account, profile);

        let social_connections = SocialConnections {
            following: table::new(),
            followers: table::new(),
        };
        move_to(account, social_connections);
    }

    // Update existing profile
    public entry fun update_profile(
        account: &signer,
        user_name: vector<u8>,
        display_name: vector<u8>,
        bio: vector<u8>,
        preferences: vector<u8>,
        niche: vector<u8>
    ) acquires Profile {
        let account_address = signer::address_of(account);
        assert!(exists<Profile>(account_address), PROFILE_DOES_NOT_EXIST);
        let profile = borrow_global_mut<Profile>(account_address);
        
        assert!(vector::length(&preferences) <= MAX_PREFERENCES, MAX_PREFERENCES_EXCEEDED);
        assert!(vector::length(&niche) <= MAX_NICHE, MAX_NICHE_EXCEEDED);

        profile.user_name = user_name;
        profile.display_name = display_name;
        profile.bio = bio;
        profile.preferences = preferences;
        profile.niche = niche;
    }

    // Follow another user
    public entry fun follow_user(
        follower: &signer,
        followed_address: address,
        followed_username: vector<u8>
    ) acquires Profile, SocialConnections {
        let follower_address = signer::address_of(follower);
        assert!(exists<Profile>(follower_address), PROFILE_DOES_NOT_EXIST);
        assert!(exists<Profile>(followed_address), PROFILE_DOES_NOT_EXIST);

        let follower_connections = borrow_global_mut<SocialConnections>(follower_address);
        assert!(!table::contains(&follower_connections.following, followed_address), ALREADY_FOLLOWING);

        table::add(&mut follower_connections.following, followed_address, followed_username);

        let follower_profile = borrow_global_mut<Profile>(follower_address);
        follower_profile.following_count = follower_profile.following_count + 1;

        let followed_connections = borrow_global_mut<SocialConnections>(followed_address);
        table::add(&mut followed_connections.followers, follower_address, *&follower_profile.user_name);

        let followed_profile = borrow_global_mut<Profile>(followed_address);
        followed_profile.followers_count = followed_profile.followers_count + 1;
    }

    // Unfollow a user
    public entry fun unfollow_user(
        follower: &signer,
        followed_address: address
    ) acquires Profile, SocialConnections {
        let follower_address = signer::address_of(follower);
        assert!(exists<Profile>(follower_address), PROFILE_DOES_NOT_EXIST);
        assert!(exists<Profile>(followed_address), PROFILE_DOES_NOT_EXIST);

        let follower_connections = borrow_global_mut<SocialConnections>(follower_address);
        assert!(table::contains(&follower_connections.following, followed_address), NOT_FOLLOWING);

        table::remove(&mut follower_connections.following, followed_address);

        let follower_profile = borrow_global_mut<Profile>(follower_address);
        follower_profile.following_count = follower_profile.following_count - 1;

        let followed_connections = borrow_global_mut<SocialConnections>(followed_address);
        table::remove(&mut followed_connections.followers, follower_address);

        let followed_profile = borrow_global_mut<Profile>(followed_address);
        followed_profile.followers_count = followed_profile.followers_count - 1;
    }

    // Retrieve user profile (returns a copy instead of a reference)
    #[view]
    public fun get_profile(account_address: address): (
        vector<u8>,
        vector<u8>,
        vector<u8>,
        vector<u8>,
        vector<u8>,
        u64,
        u64
    ) acquires Profile {
        assert!(exists<Profile>(account_address), PROFILE_DOES_NOT_EXIST);
        let profile = borrow_global<Profile>(account_address);
        (
            profile.user_name,
            profile.display_name,
            profile.bio,
            profile.preferences,
            profile.niche,
            profile.following_count,
            profile.followers_count
        )
    }

    // Check if a user is following another user
    #[view]
    public fun is_following(follower_address: address, followed_address: address): bool acquires SocialConnections {
        assert!(exists<SocialConnections>(follower_address), PROFILE_DOES_NOT_EXIST);
        let connections = borrow_global<SocialConnections>(follower_address);
        table::contains(&connections.following, followed_address)
    }

    // Helper function to check if a user has a profile
    public fun has_profile(user_address: address): bool {
        exists<Profile>(user_address)
    }
}