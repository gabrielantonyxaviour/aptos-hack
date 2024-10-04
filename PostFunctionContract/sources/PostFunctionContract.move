module 0xb539b2f09388d40e14ac1c5997edd3f650ace3c227ac7df49128c68dba658d6c::SocialMedia {
    use std::signer;
    use std::vector;
    use std::option::Option;

    // Struct to represent a post
    struct Post has store {
        creator: address, // Who posted it
        content_hash: vector<u8>, // Reference to IPFS or off-chain storage
        is_promotional: bool, // If it's a promotional post
        promoted_profile: Option<address>, // If it's promoting a user
        like_count: u64, // Number of likes
        comments: vector<Comment>, // List of comments
    }

    // Struct to represent a comment
    struct Comment has copy, drop, store {
        commenter: address, // Address of the person commenting
        content: vector<u8>, // Comment content
    }

    // Resource to store all posts created by a user
    struct UserPosts has key {
        posts: vector<Post>,
    }

    // Create a post
    public entry fun create_post(
        creator: &signer,
        content_hash: vector<u8>, // Content stored off-chain, referenced via hash
        is_promotional: bool,
        promoted_profile: Option<address>,
    ) acquires UserPosts {
        let creator_address = signer::address_of(creator);
        let post = Post {
            creator: creator_address,
            content_hash,
            is_promotional,
            promoted_profile,
            like_count: 0,
            comments: vector::empty(),
        };

        // Check if UserPosts resource exists, otherwise create it
        if (!exists<UserPosts>(creator_address)) {
            move_to(creator, UserPosts { 
                posts: vector::empty() 
            });
        };

        // Get UserPosts resource and push the new post
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
        let post = vector::borrow_mut(&mut user_posts.posts, (post_index as u64));
        post.like_count = post.like_count + 1;
    }

    // Comment on a post
    public entry fun comment_on_post(
        commenter: &signer,
        post_creator: address,
        post_index: u64,
        comment_content: vector<u8>
    ) acquires UserPosts {
        let comment = Comment {
            commenter: signer::address_of(commenter),
            content: comment_content,
        };
        
        let user_posts = borrow_global_mut<UserPosts>(post_creator);
        let post = vector::borrow_mut(&mut user_posts.posts, (post_index as u64));
        vector::push_back(&mut post.comments, comment);
    }

    // Helper function to check if a user has any posts
    public fun has_posts(user_address: address): bool {
        exists<UserPosts>(user_address)
    }

    // Helper function to get the number of posts for a user
    public fun get_post_count(user_address: address): u64 acquires UserPosts {
        if (!exists<UserPosts>(user_address)) return 0;
        let user_posts = borrow_global<UserPosts>(user_address);
        vector::length(&user_posts.posts)
    }
}