module mergedcontract::SocialMediaPlatform {
    use std::signer;
    use std::vector;
    use std::option::{Self, Option};
    use aptos_std::table::{Self, Table};

    // User Profile Structs
    struct Profile has key {
        user_name: vector<u8>,
        display_name: vector<u8>,
        bio: vector<u8>,
        profile_pic_cid: vector<u8>,  // IPFS CID for profile picture
        preferences: vector<u8>,
        niche: vector<u8>,
        following_count: u64,
        followers_count: u64,
    }

    struct SocialConnections has key {
        following: Table<address, vector<u8>>,
        followers: Table<address, vector<u8>>,
    }

    // Post Related Structs
    struct Post has store {
        creator: address,
        content_hash: vector<u8>,
        status: vector<u8>,  // Added status field
        is_promotional: bool,
        promoted_profile: Option<address>,
        like_count: u64,
        comments: vector<Comment>,
    }

    struct Comment has copy, drop, store {
        commenter: address,
        content: vector<u8>,
    }

    struct UserPosts has key {
        posts: vector<Post>,
    }

    // Brand Related Struct
    struct BrandProfile has key {
        collab_description: vector<u8>,
        min_berries_required: u64,
        min_rewards: u64,
        max_rewards: u64,
        is_active: bool,
    }

    // Constants
    const MAX_PREFERENCES: u64 = 5;
    const MAX_NICHE: u64 = 5;

    // Error codes
    const PROFILE_ALREADY_EXISTS: u64 = 1;
    const PROFILE_DOES_NOT_EXIST: u64 = 2;
    const MAX_PREFERENCES_EXCEEDED: u64 = 3;
    const MAX_NICHE_EXCEEDED: u64 = 4;
    const ALREADY_FOLLOWING: u64 = 5;
    const NOT_FOLLOWING: u64 = 6;
    const BRAND_PROFILE_ALREADY_EXISTS: u64 = 7;
    const BRAND_PROFILE_DOES_NOT_EXIST: u64 = 8;
    const POST_INDEX_INVALID: u64 = 9;

    // Create a user profile
    public entry fun create_profile(
        account: &signer,
        user_name: vector<u8>,
        display_name: vector<u8>,
        bio: vector<u8>,
        profile_pic_cid: vector<u8>,
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
            profile_pic_cid,
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

    // Update profile
    public entry fun update_profile(
        account: &signer,
        user_name: vector<u8>,
        display_name: vector<u8>,
        bio: vector<u8>,
        profile_pic_cid: vector<u8>,
        preferences: vector<u8>,
        niche: vector<u8>
    ) acquires Profile {
        let account_address = signer::address_of(account);
        assert!(exists<Profile>(account_address), PROFILE_DOES_NOT_EXIST);
        
        assert!(vector::length(&preferences) <= MAX_PREFERENCES, MAX_PREFERENCES_EXCEEDED);
        assert!(vector::length(&niche) <= MAX_NICHE, MAX_NICHE_EXCEEDED);
        
        let profile = borrow_global_mut<Profile>(account_address);
        profile.user_name = user_name;
        profile.display_name = display_name;
        profile.bio = bio;
        profile.profile_pic_cid = profile_pic_cid;
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

    // Create a post
    public entry fun create_post(
        creator: &signer,
        content_hash: vector<u8>,
        status: vector<u8>,
        is_promotional: bool,
        promoted_profile: Option<address>,
    ) acquires UserPosts {
        let creator_address = signer::address_of(creator);
        let post = Post {
            creator: creator_address,
            content_hash,
            status,
            is_promotional,
            promoted_profile,
            like_count: 0,
            comments: vector::empty(),
        };

        if (!exists<UserPosts>(creator_address)) {
            move_to(creator, UserPosts { posts: vector::empty() });
        };

        let user_posts = borrow_global_mut<UserPosts>(creator_address);
        vector::push_back(&mut user_posts.posts, post);
    }

    // Like a post
    public entry fun like_post(
        _user: &signer, 
        post_creator: address, 
        post_index: u64
    ) acquires UserPosts {
        let user_posts = borrow_global_mut<UserPosts>(post_creator);
        assert!(post_index < vector::length(&user_posts.posts), POST_INDEX_INVALID);
        
        let post = vector::borrow_mut(&mut user_posts.posts, post_index);
        post.like_count = post.like_count + 1;
    }

    // Comment on a post
    public entry fun comment_on_post(
        commenter: &signer,
        post_creator: address,
        post_index: u64,
        comment_content: vector<u8>
    ) acquires UserPosts {
        let user_posts = borrow_global_mut<UserPosts>(post_creator);
        assert!(post_index < vector::length(&user_posts.posts), POST_INDEX_INVALID);
        
        let comment = Comment {
            commenter: signer::address_of(commenter),
            content: comment_content,
        };
        
        let post = vector::borrow_mut(&mut user_posts.posts, post_index);
        vector::push_back(&mut post.comments, comment);
    }

    // Create brand profile
    public entry fun create_brand_profile(
        account: &signer,
        collab_description: vector<u8>,
        min_berries_required: u64,
        min_rewards: u64,
        max_rewards: u64
    ) {
        let account_address = signer::address_of(account);
        assert!(!exists<BrandProfile>(account_address), BRAND_PROFILE_ALREADY_EXISTS);

        let brand_profile = BrandProfile {
            collab_description,
            min_berries_required,
            min_rewards,
            max_rewards,
            is_active: true,
        };
        move_to(account, brand_profile);
    }

    // Update brand profile
    public entry fun update_brand_profile(
        account: &signer,
        collab_description: vector<u8>,
        min_berries_required: u64,
        min_rewards: u64,
        max_rewards: u64
    ) acquires BrandProfile {
        let account_address = signer::address_of(account);
        assert!(exists<BrandProfile>(account_address), BRAND_PROFILE_DOES_NOT_EXIST);
        
        let brand_profile = borrow_global_mut<BrandProfile>(account_address);
        brand_profile.collab_description = collab_description;
        brand_profile.min_berries_required = min_berries_required;
        brand_profile.min_rewards = min_rewards;
        brand_profile.max_rewards = max_rewards;
    }

    // Toggle brand profile active status
    public entry fun toggle_brand_status(account: &signer) acquires BrandProfile {
        let account_address = signer::address_of(account);
        assert!(exists<BrandProfile>(account_address), BRAND_PROFILE_DOES_NOT_EXIST);
        
        let brand_profile = borrow_global_mut<BrandProfile>(account_address);
        brand_profile.is_active = !brand_profile.is_active;
    }

    // View Functions
    #[view]
    public fun get_profile(account_address: address): (
        vector<u8>,
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
            profile.profile_pic_cid,
            profile.preferences,
            profile.niche,
            profile.following_count,
            profile.followers_count
        )
    }

    #[view]
    public fun get_brand_profile(brand_address: address): (vector<u8>, u64, u64, u64, bool) acquires BrandProfile {
        assert!(exists<BrandProfile>(brand_address), BRAND_PROFILE_DOES_NOT_EXIST);
        let profile = borrow_global<BrandProfile>(brand_address);
        (
            profile.collab_description,
            profile.min_berries_required,
            profile.min_rewards,
            profile.max_rewards,
            profile.is_active
        )
    }

    #[view]
    public fun is_following(follower_address: address, followed_address: address): bool acquires SocialConnections {
        assert!(exists<SocialConnections>(follower_address), PROFILE_DOES_NOT_EXIST);
        let connections = borrow_global<SocialConnections>(follower_address);
        table::contains(&connections.following, followed_address)
    }

    #[view]
    public fun has_profile(user_address: address): bool {
        exists<Profile>(user_address)
    }

    #[view]
    public fun has_brand_profile(address: address): bool {
        exists<BrandProfile>(address)
    }

    #[view]
    public fun get_post_count(user_address: address): u64 acquires UserPosts {
        if (!exists<UserPosts>(user_address)) return 0;
        let user_posts = borrow_global<UserPosts>(user_address);
        vector::length(&user_posts.posts)
    }
}