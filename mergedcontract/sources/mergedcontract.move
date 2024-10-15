module approval::SocialMediaPlatform {
    use std::signer;
    use std::vector;
    use std::string::{Self, String};
    use std::option::Option;
    use aptos_std::table::{Self, Table};
    use aptos_std::simple_map::{Self, SimpleMap};
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
        worldcoin_nullifier_hash: vector<u8>,
        total_likes: u64,
        total_comments: u64,
    }

    struct SocialConnections has key {
        following: Table<address, vector<u8>>,
        followers: Table<address, vector<u8>>,
    }
    struct ComprehensiveData has key {
        posts: SimpleMap<address, vector<PostData>>,
        brand_profiles: SimpleMap<address, BrandProfileData>,
        applications: SimpleMap<address, vector<address>>,
    }
    struct PostData has store, copy, drop {
       content_hash: vector<u8>,
        status: vector<u8>,
        caption: vector<u8>,
        is_promotional: bool,
        promoted_profile: Option<address>,
        like_count: u64,
        comments: vector<CommentData>,
    }

    struct CommentData has store, copy, drop {
        commenter: address,
        content: vector<u8>,
    }

    struct BrandProfileData has store, drop, copy {
        collab_description: vector<u8>,
        min_berries_required: u64,
        min_rewards: u64,
        max_rewards: u64,
        is_active: bool,
    }


    // Post Related Structs
    struct Post has store {
        creator: address,
        content_hash: vector<u8>,
        status: vector<u8>,
        caption: vector<u8>,
        is_promotional: bool,
        promoted_profile: Option<address>,
        like_count: u64,
        comments: vector<CommentData>,
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

    struct CollaborationApplications has key {
        applicants: vector<address>,
        approved_applicants: Table<address, bool>,
    }

    // New struct to store existing usernames
    struct UsernameRegistry has key {
        usernames: Table<String, bool>,
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
    const NOT_BRAND_OWNER: u64 = 10;
    const USER_NOT_APPLIED: u64 = 11;
    const USERNAME_ALREADY_EXISTS: u64 = 12;

    fun init_module(account: &signer) {
    move_to(account, UsernameRegistry {
        usernames: table::new(),
        // Assuming init_comprehensive_data is a function you want to call separately
    });
    init_comprehensive_data(account); // Call this function outside of the struct initialization
}
    fun update_post_data(creator: address, post: &Post) acquires ComprehensiveData {
        let comprehensive_data = borrow_global_mut<ComprehensiveData>(@approval);
        let post_data = PostData {
            content_hash: *&post.content_hash,
            status: *&post.status,
            caption: *&post.caption,
            is_promotional: post.is_promotional,
            promoted_profile: *&post.promoted_profile,
            like_count: post.like_count,
            comments: *&post.comments,
        };
        if (!simple_map::contains_key(&comprehensive_data.posts, &creator)) {
            simple_map::add(&mut comprehensive_data.posts, creator, vector::empty());
        };
        let user_posts = simple_map::borrow_mut(&mut comprehensive_data.posts, &creator);
        vector::push_back(user_posts, post_data);
    }

    // Function to initialize the ComprehensiveData resource
    fun init_comprehensive_data(account: &signer) {
        if (!exists<ComprehensiveData>(@approval)) {
            move_to(account, ComprehensiveData {
                posts: simple_map::create(),
                brand_profiles: simple_map::create(),
                applications: simple_map::create(),
            });
        };
    }


    // Helper function to check if a username exists
    fun username_exists(username: &String): bool acquires UsernameRegistry {
        let registry = borrow_global<UsernameRegistry>(@approval);
        table::contains(&registry.usernames, *username)
    }

    // Helper function to register a username
    fun register_username(username: String) acquires UsernameRegistry {
        let registry = borrow_global_mut<UsernameRegistry>(@approval);
        table::add(&mut registry.usernames, username, true);
    }

    // Create a user profile
    public entry fun create_profile(
        account: &signer,
        user_name: vector<u8>,
        display_name: vector<u8>,
        bio: vector<u8>,
        profile_pic_cid: vector<u8>,
        preferences: vector<u8>,
        niche: vector<u8>,
        worldcoin_nullifier_hash: vector<u8>
    ) acquires UsernameRegistry {
        let account_address = signer::address_of(account);
        assert!(!exists<Profile>(account_address), PROFILE_ALREADY_EXISTS);
        assert!(vector::length(&preferences) <= MAX_PREFERENCES, MAX_PREFERENCES_EXCEEDED);
        assert!(vector::length(&niche) <= MAX_NICHE, MAX_NICHE_EXCEEDED);

        let username_string = string::utf8(user_name);
        assert!(!username_exists(&username_string), USERNAME_ALREADY_EXISTS);

        let profile = Profile {
            user_name,
            display_name,
            bio,
            profile_pic_cid,
            preferences,
            niche,
            following_count: 0,
            followers_count: 0,
            worldcoin_nullifier_hash,
            total_likes: 0,
            total_comments: 0,
        };
        move_to(account, profile);

        let social_connections = SocialConnections {
            following: table::new(),
            followers: table::new(),
        };
        move_to(account, social_connections);

        register_username(username_string);
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
    ) acquires Profile, UsernameRegistry {
        let account_address = signer::address_of(account);
        assert!(exists<Profile>(account_address), PROFILE_DOES_NOT_EXIST);
        
        assert!(vector::length(&preferences) <= MAX_PREFERENCES, MAX_PREFERENCES_EXCEEDED);
        assert!(vector::length(&niche) <= MAX_NICHE, MAX_NICHE_EXCEEDED);
        
        let profile = borrow_global_mut<Profile>(account_address);
        let new_username_string = string::utf8(user_name);
        let old_username_string = string::utf8(profile.user_name);

        // Check if the new username is different from the old one and not already taken
        if (!compare_strings(&old_username_string, &new_username_string)) {
           assert!(!username_exists(&new_username_string), USERNAME_ALREADY_EXISTS);
        
           // Unregister old username and register new one
           let registry = borrow_global_mut<UsernameRegistry>(@approval);
           table::remove(&mut registry.usernames, old_username_string);
           table::add(&mut registry.usernames, new_username_string, true);
    };

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
        caption: vector<u8>,
        is_promotional: bool,
        promoted_profile: Option<address>,
    ) acquires UserPosts, ComprehensiveData {
        let creator_address = signer::address_of(creator);
        let post = Post {
            creator: creator_address,
            content_hash,
            status,
            caption,
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

        // Update ComprehensiveData
        update_post_data(creator_address, vector::borrow(&user_posts.posts, vector::length(&user_posts.posts) - 1));
    }

    // Like a post
    public entry fun like_post(
        _user: &signer, 
        post_creator: address, 
        post_index: u64
    ) acquires UserPosts, Profile, ComprehensiveData {
        let comprehensive_data = borrow_global_mut<ComprehensiveData>(@approval);
        let user_posts = simple_map::borrow_mut(&mut comprehensive_data.posts, &post_creator);
        let post_data = vector::borrow_mut(user_posts, post_index);
        post_data.like_count = post_data.like_count + 1;
        let user_posts = borrow_global_mut<UserPosts>(post_creator);
        assert!(post_index < vector::length(&user_posts.posts), POST_INDEX_INVALID);
        
        let post = vector::borrow_mut(&mut user_posts.posts, post_index);
        post.like_count = post.like_count + 1;

        // Update the creator's total likes
        let creator_profile = borrow_global_mut<Profile>(post_creator);
        creator_profile.total_likes = creator_profile.total_likes + 1;
    }

    // Comment on a post
    public entry fun comment_on_post(
        commenter: &signer,
        post_creator: address,
        post_index: u64,
        comment_content: vector<u8>
    ) acquires UserPosts, Profile, ComprehensiveData {
        let user_posts = borrow_global_mut<UserPosts>(post_creator);
        assert!(post_index < vector::length(&user_posts.posts), POST_INDEX_INVALID);
        
        let comment = CommentData {
            commenter: signer::address_of(commenter),
            content: comment_content,
        
        };
        
        let post = vector::borrow_mut(&mut user_posts.posts, post_index);
        vector::push_back(&mut post.comments, comment);
        let comprehensive_data = borrow_global_mut<ComprehensiveData>(@approval);
        let user_posts = simple_map::borrow_mut(&mut comprehensive_data.posts, &post_creator);
        let post_data = vector::borrow_mut(user_posts, post_index);
        vector::push_back(&mut post_data.comments, CommentData {
            commenter: signer::address_of(commenter),
            content: comment_content,
        });

        // Update the creator's total comments
        let creator_profile = borrow_global_mut<Profile>(post_creator);
        creator_profile.total_comments = creator_profile.total_comments + 1;
        
    }

    // Create brand profile
    public entry fun create_brand_profile(
        account: &signer,
        collab_description: vector<u8>,
        min_berries_required: u64,
        min_rewards: u64,
        max_rewards: u64
    ) acquires ComprehensiveData {
        let account_address = signer::address_of(account);
        let comprehensive_data = borrow_global_mut<ComprehensiveData>(@approval);
        simple_map::add(&mut comprehensive_data.brand_profiles, account_address, BrandProfileData {
            collab_description,
            min_berries_required,
            min_rewards,
            max_rewards,
            is_active: true,
        });
        assert!(!exists<BrandProfile>(account_address), BRAND_PROFILE_ALREADY_EXISTS);

        let brand_profile = BrandProfile {
            collab_description,
            min_berries_required,
            min_rewards,
            max_rewards,
            is_active: true,
        };
        move_to(account, brand_profile);

        // Also create the CollaborationApplications resource with an empty Table for approved applicants
        move_to(account, CollaborationApplications {
            applicants: vector::empty(),
            approved_applicants: table::new(),
        });
    }

    // Update brand profile
    public entry fun update_brand_profile(
        account: &signer,
        collab_description: vector<u8>,
        min_berries_required: u64,
        min_rewards: u64,
        max_rewards: u64
    ) acquires BrandProfile, ComprehensiveData {
        let account_address = signer::address_of(account);
        let comprehensive_data = borrow_global_mut<ComprehensiveData>(@approval);
        let brand_profile_data = simple_map::borrow_mut(&mut comprehensive_data.brand_profiles, &account_address);
        assert!(exists<BrandProfile>(account_address), BRAND_PROFILE_DOES_NOT_EXIST);
        
        let brand_profile = borrow_global_mut<BrandProfile>(account_address);
        brand_profile.collab_description = collab_description;
        brand_profile.min_berries_required = min_berries_required;
        brand_profile.min_rewards = min_rewards;
        brand_profile.max_rewards = max_rewards;
    }

    // Toggle brand profile active status
    public entry fun toggle_brand_status(account: &signer) acquires BrandProfile, ComprehensiveData {
        let account_address = signer::address_of(account);
        let comprehensive_data = borrow_global_mut<ComprehensiveData>(@approval);
        let brand_profile_data = simple_map::borrow_mut(&mut comprehensive_data.brand_profiles, &account_address);
        assert!(exists<BrandProfile>(account_address), BRAND_PROFILE_DOES_NOT_EXIST);
        
        let brand_profile = borrow_global_mut<BrandProfile>(account_address);
        brand_profile.is_active = !brand_profile.is_active;
    }

    // Apply to a brand's collaboration post
    public entry fun apply_to_brand_collaboration(
        applicant: &signer,
        brand_address: address
    ) acquires CollaborationApplications, ComprehensiveData {
        assert!(exists<BrandProfile>(brand_address), BRAND_PROFILE_DOES_NOT_EXIST);
        assert!(exists<CollaborationApplications>(brand_address), BRAND_PROFILE_DOES_NOT_EXIST);
        
        let applicant_address = signer::address_of(applicant);
        let comprehensive_data = borrow_global_mut<ComprehensiveData>(@approval);
        if (!simple_map::contains_key(&comprehensive_data.applications, &brand_address)) {
            simple_map::add(&mut comprehensive_data.applications, brand_address, vector::empty());
        };
        let applicants = simple_map::borrow_mut(&mut comprehensive_data.applications, &brand_address);

        let applications = borrow_global_mut<CollaborationApplications>(brand_address);
        if (!vector::contains(&applications.applicants, &applicant_address)) {
            vector::push_back(&mut applications.applicants, applicant_address);
        };
        
        if (!table::contains(&applications.approved_applicants, applicant_address)) {
            table::add(&mut applications.approved_applicants, applicant_address, false);
        };
    }

    // New: Approve applicants for collaboration
    public entry fun approve_applicants(
        brand: &signer,
        approved_addresses: vector<address>
    ) acquires CollaborationApplications {
        let brand_address = signer::address_of(brand);
        assert!(exists<BrandProfile>(brand_address), BRAND_PROFILE_DOES_NOT_EXIST);
        
        let applications = borrow_global_mut<CollaborationApplications>(brand_address);
        
        let i = 0;
        while (i < vector::length(&approved_addresses)) {
            let applicant = *vector::borrow(&approved_addresses, i);
            assert!(vector::contains(&applications.applicants, &applicant), USER_NOT_APPLIED);
            table::upsert(&mut applications.approved_applicants, applicant, true);
            i = i + 1;
        };
    }

    // New: Check if user is approved for collaboration
    public fun is_approved_for_collab(brand_address: address, user_address: address): bool acquires CollaborationApplications {
        assert!(exists<CollaborationApplications>(brand_address), BRAND_PROFILE_DOES_NOT_EXIST);
        
        let applications = borrow_global<CollaborationApplications>(brand_address);
        table::contains(&applications.approved_applicants, user_address) &&
        *table::borrow(&applications.approved_applicants, user_address)
    }

    // Helper function to compare two strings
    fun compare_strings(a: &String, b: &String): bool {
        let a_bytes = string::bytes(a);
        let b_bytes = string::bytes(b);
        if (vector::length(a_bytes) != vector::length(b_bytes)) {
            false
        } else {
            let i = 0;
            let len = vector::length(a_bytes);
            while (i < len) {
                if (*vector::borrow(a_bytes, i) != *vector::borrow(b_bytes, i)) {
                    return false
                };
                i = i + 1;
            };
            true
        }
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
        u64,
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
            profile.followers_count,
            profile.total_likes,
            profile.total_comments
        )
    }
    #[view]
    public fun get_user_posts(user_address: address): vector<PostData> acquires ComprehensiveData {
        let comprehensive_data = borrow_global<ComprehensiveData>(@approval);
        if (simple_map::contains_key(&comprehensive_data.posts, &user_address)) {
            *simple_map::borrow(&comprehensive_data.posts, &user_address)
        } else {
            vector::empty<PostData>()
        }
    }

    #[view]
    public fun get_post_data(user_address: address, post_index: u64): PostData acquires ComprehensiveData {
        let comprehensive_data = borrow_global<ComprehensiveData>(@approval);
        assert!(simple_map::contains_key(&comprehensive_data.posts, &user_address), PROFILE_DOES_NOT_EXIST);
        let user_posts = simple_map::borrow(&comprehensive_data.posts, &user_address);
        assert!(post_index < vector::length(user_posts), POST_INDEX_INVALID);
        *vector::borrow(user_posts, post_index)
    }

    #[view]
    public fun get_brand_profile_data(brand_address: address): BrandProfileData acquires ComprehensiveData {
        let comprehensive_data = borrow_global<ComprehensiveData>(@approval);
        assert!(simple_map::contains_key(&comprehensive_data.brand_profiles, &brand_address), BRAND_PROFILE_DOES_NOT_EXIST);
        *simple_map::borrow(&comprehensive_data.brand_profiles, &brand_address)
    }

    #[view]
    public fun get_brand_applicants(brand_address: address): vector<address> acquires ComprehensiveData {
        let comprehensive_data = borrow_global<ComprehensiveData>(@approval);
        if (simple_map::contains_key(&comprehensive_data.applications, &brand_address)) {
            *simple_map::borrow(&comprehensive_data.applications, &brand_address)
        } else {
            vector::empty()
        }
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

    #[view]
    public fun get_collaboration_applicants(brand_address: address): vector<address> acquires CollaborationApplications {
        assert!(exists<CollaborationApplications>(brand_address), BRAND_PROFILE_DOES_NOT_EXIST);
        let applications = borrow_global<CollaborationApplications>(brand_address);
        applications.applicants
    }
}