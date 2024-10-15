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
  const { updateProfile, setHasProfile, setHasPosts } = useEnvironmentStore(
    (store) => store
  );
  useEffect(() => {
    if (account == undefined) {
      router.push("/");
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
            if (pathName === "/onboarding") {
              router.push("/home");
            }
          } else {
            setHasProfile(2);
            console.log("Profile not found");
          }

          // FETCH POSTS
          const posts = (resources as any[]).filter(
            (r) => r.type === `${CORE_MODULE}::SocialMediaPlatform::Post`
          );
          if (posts != undefined && posts.length > 0) {
            console.log(posts);
            console.log("Posts found");
            setHasPosts(1);

            // // updatePosts({})
          } else {
            setHasPosts(2);
            console.log("Posts not found");
          }
        } catch (e) {
          console.log(e);
        }
      })();
    }
  }, [account]);
  return <>{children}</>;
}
