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

          const aptosCoin = (resources as any[]).find(
            (r) => r.type === `0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>`
          );

          const aptosValue = aptosCoin.data.coin.value;

          // FETCH PROFILE
          const profile = (resources as any[]).find(
            (r) => r.type === `${CORE_MODULE}::SocialMediaPlatform::Profile`
          );
          if (profile != undefined) {
            console.log("Profile found");
            console.log({
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
              balance: aptosValue,
            });
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
              balance: aptosValue,
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
            console.log({ posts: formattedPosts });
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
            const { posts, applications, brand_profiles } =
              comprehensiveData.data;
            console.log(
              posts.data.map((post: any, idx: number) => {
                return {
                  id: idx,
                  caption: hexToString(post.value[0].caption.slice(2)),
                  comments: post.value[0].comments,
                  image: hexToString(post.value[0].content_hash.slice(2)),
                  status: hexToString(post.value[0].status.slice(2)),
                  isPromotional: post.value[0].is_promotional,
                  likes: 0,
                  promotedProfile: post.is_promotional
                    ? post.promoted_profile
                    : "0x",
                };
              })
            );
            setPosts(
              posts.data.map((post: any, idx: number) => {
                return {
                  id: idx,
                  caption: hexToString(post.value[0].caption.slice(2)),
                  comments: post.value[0].comments,
                  image: hexToString(post.value[0].content_hash.slice(2)),
                  status: hexToString(post.value[0].status.slice(2)),
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
                  applicant: app.key,
                };
              })
            );
            setBrands(
              brand_profiles.data.map((brand: any, idx: number) => {
                return {
                  id: idx,
                  owner: brand.key,
                  brandDescription: hexToString(
                    brand.value.collab_description.slice(2)
                  ),
                  minBerries: brand.value.min_berries_required,
                  minRewards: brand.value.min_rewards,
                  maxRewards: brand.value.max_rewards,
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
