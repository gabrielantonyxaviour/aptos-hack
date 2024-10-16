"use client";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useEnvironmentStore } from "./context";
import { CORE_MODULE } from "@/lib/aptos";
import { hexToNumberArray, hexToString } from "@/lib/utils";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { account } = useWallet();
  const router = useRouter();
  const pathName = usePathname();
  const {
    updateProfile,
    setHasProfile,
    setHasPosts,
    updateBrand,
    updatePosts,
    setPosts,
    setApplications,
    setBrands,
  } = useEnvironmentStore((store) => store);
  useEffect(() => {
    if (account == undefined) {
      router.push("/");
      setHasProfile(2);
    } else {
      (async function () {
        try {
          const res = await fetch(
            `/api/user?AccountAddress=${account.address}`
          );
          const response = await res.json();
          const { resources } = response.data;

          // FETCH PROFILE
          const profile = (resources as any[]).find(
            (r) => r.type === `${CORE_MODULE}::SocialMediaPlatform::Profile`
          );
          if (profile != undefined) {
            console.log("Profile found");
            setHasProfile(1);
            updateProfile({
              username: hexToString(profile.data.user_name.slice(2)),
              name: hexToString(profile.data.display_name.slice(2)),
              bio: hexToString(profile.data.bio.slice(2)),
              image: hexToString(profile.data.profile_pic_cid.slice(2)),
              following: 0,
              followers: 0,
              niches: hexToNumberArray(profile.data.niche.slice(2)),
              preferences: hexToNumberArray(profile.data.preferences.slice(2)),
              humanness_nullifier: hexToString(
                profile.data.worldcoin_nullifier_hash.slice(2)
              ),
              balance: "0",
            });
            if (pathName === "/") {
              router.push("/home");
            }
          } else {
            setHasProfile(2);
            console.log("Profile not found");
          }

          // FETCH POSTS
          const posts = (resources as any[]).filter(
            (r) => r.type === `${CORE_MODULE}::SocialMediaPlatform::UserPosts`
          );
          if (posts != undefined && posts.length > 0) {
            console.log(posts);
            console.log("Posts found");
            const allPosts = posts[0].data.posts;
            const formattedPosts = [];
            for (let i = 0; i < allPosts.length; i++) {
              formattedPosts.push({
                id: i,
                caption: hexToString(allPosts[i].caption.slice(2)),
                comments: allPosts[i].comments,
                image: hexToString(allPosts[i].content_hash.slice(2)),
                creator: allPosts[i].creator,
                status: hexToString(allPosts[i].status.slice(2)),
                isPromotional: allPosts[i].is_promotional,
                likes: allPosts[i].likes,
                promotedProfile: allPosts[i].is_promotional
                  ? allPosts[i].promoted_profile
                  : "0x",
              });
            }
            updatePosts({ posts: formattedPosts });
            setHasPosts(1);
          } else {
            setHasPosts(2);
            console.log("Posts not found");
          }
          const brandProfile = (resources as any[]).find(
            (r) =>
              r.type === `${CORE_MODULE}::SocialMediaPlatform::BrandProfile`
          );
          if (brandProfile != undefined) {
            console.log("Brand Profile found");
            updateBrand({
              brandDescription: hexToString(
                brandProfile.data.collab_description.slice(2)
              ),
              minBerries: parseInt(brandProfile.data.min_berries_required, 16),
              minRewards: parseInt(brandProfile.data.min_rewards, 16),
              maxRewards: parseInt(brandProfile.data.max_rewards, 16),
            });
          } else {
            console.log("Brand Profile not found");
          }
        } catch (e) {
          console.log(e);
        }
      })();
      (async function () {
        try {
          const res = await fetch(`/api/user?AccountAddress=${CORE_MODULE}`);
          const response = await res.json();
          const { resources } = response.data;

          // FETCH PROFILE
          const comprehensiveData = (resources as any[]).find(
            (r) =>
              r.type ===
              `${CORE_MODULE}::SocialMediaPlatform::ComprehensiveData`
          );
          if (comprehensiveData != undefined) {
            console.log("Environment Data found");
            console.log(comprehensiveData);
            const { posts, applications, brand_profiles } =
              comprehensiveData.data;

            setPosts(
              posts.data.map((post: any, idx: number) => {
                return {
                  id: idx,
                  caption: post.value[0].caption,
                  comments: post.value[0].comments,
                  image: post.value[0].content_hash,
                  status: post.value[0].status,
                  isPromotional: post.value[0].is_promotional,
                  likes: 0,
                  promotedProfile: post.is_promotional
                    ? post.promoted_profile
                    : "0x",
                };
              })
            );
            setApplications(
              applications.data.map((app: any, idx: number) => {
                return {
                  id: idx,
                  description: app.value[0].description,
                  minRewards: app.value[0].min_rewards,
                  maxRewards: app.value[0].max_rewards,
                  minBerries: app.value[0].min_berries_required,
                };
              })
            );
            setBrands(
              brand_profiles.data.map((brand: any) => {
                return {
                  id: brand.value[0].id,
                  owner: brand.value[0].key,
                  brandDescription: brand.value[0].collab_description,
                  minBerries: brand.value[0].min_berries_required,
                  minRewards: brand.value[0].min_rewards,
                  maxRewards: brand.value[0].max_rewards,
                };
              })
            );
          } else {
            setHasProfile(2);
            console.log("Environment Data not found");
          }
        } catch (e) {
          console.log(e);
        }
      })();
    }
  }, [account]);
  return <>{children}</>;
}
