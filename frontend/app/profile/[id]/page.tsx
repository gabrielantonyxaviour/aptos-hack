"use client";
import { useEnvironmentStore } from "@/components/context";
import SideBar from "@/components/sections/side-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Post from "@/components/ui/custom/post";
import WalletInfo from "@/components/ui/custom/wallet-info";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { CORE_MODULE, getAptosClient } from "@/lib/aptos";
import {
  availableCatgegories,
  hexToNumberArray,
  hexToString,
} from "@/lib/utils";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Check, Plus, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ProfilePage({ params }: { params: { id: string } }) {
  const {
    username,
    image,
    name,
    followers,
    following,
    bio,
    niches,
    posts,
    balance,
  } = useEnvironmentStore((store) => store);
  const { account, signAndSubmitTransaction } = useWallet();
  const [profilePosts, setProfilePosts] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [hoveringUnfollow, setHoveringUnfollow] = useState<boolean>(false);
  useEffect(() => {
    console.log("ProfilePage");
    setProfilePosts(posts.filter((p) => p.creator == params.id));
    (async function () {
      try {
        const res = await fetch(`/api/user?AccountAddress=${params.id}`);
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
          setProfile({
            username: hexToString(profile.data.user_name.slice(2)),
            name: hexToString(profile.data.display_name.slice(2)),
            bio: hexToString(profile.data.bio.slice(2)),
            image: hexToString(profile.data.profile_pic_cid.slice(2)),
            following: 0,
            followers: 0,
            niches: hexToNumberArray(profile.data.niche.slice(2)),
            humanness_nullifier: hexToString(
              profile.data.worldcoin_nullifier_hash.slice(2)
            ),
            balance: aptosValue,
          });
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);
  return (
    <div className="flex h-screen select-none">
      <SideBar />
      <div className="pt-7 px-7 flex-1 flex justify-center space-x-12">
        <div className="w-[50%]">
          {profile == null || profilePosts == null ? (
            <div className="loader"></div>
          ) : (
            <ScrollArea className="h-[95vh]">
              <div className="flex space-x-16 px-4">
                <Image
                  src={`https://aggregator-devnet.walrus.space/v1/${profile.image}`}
                  width={180}
                  height={180}
                  alt="hero"
                  className="rounded-full my-6"
                />
                <div className="flex flex-col flex-1 space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-semibold">{profile.username}</p>
                    <Button
                      variant={"secondary"}
                      className={`flex space-x-2 ${
                        isFollowing
                          ? "hover:bg-destructive transition ease-in-out duration-400 hover:scale-105"
                          : "hover:bg-primary hover:text-black transition ease-in-out duration-400 hover:scale-105"
                      } `}
                      onMouseEnter={() => setHoveringUnfollow(true)}
                      onMouseLeave={() => setHoveringUnfollow(false)}
                      onClick={async () => {
                        if (account == undefined) return;

                        const aptos = getAptosClient();
                        if (isFollowing) {
                          const unfollowProfileTx =
                            await signAndSubmitTransaction({
                              sender: account.address,
                              data: {
                                function: `${CORE_MODULE}::SocialMediaPlatform::unfollow_user`,
                                functionArguments: [
                                  "0x2df1944b5fcffc2a53d2c75d4a86be38c1ab7cb32bba9db38f7141385786969a", // TODO: Remove hardcoding
                                ],
                                typeArguments: [],
                              },
                            });
                          console.log(unfollowProfileTx);
                          const executedTransaction =
                            await aptos.waitForTransaction({
                              transactionHash: unfollowProfileTx.hash,
                            });

                          console.log(executedTransaction);
                          setIsFollowing(true);
                        } else {
                          const followProfileTx =
                            await signAndSubmitTransaction({
                              sender: account.address,
                              data: {
                                function: `${CORE_MODULE}::SocialMediaPlatform::follow_user`,
                                functionArguments: [
                                  "0x2df1944b5fcffc2a53d2c75d4a86be38c1ab7cb32bba9db38f7141385786969a", // TODO: Remove hardcoding
                                  "gabrielaxy", // TODO: Remove hardcoding
                                ],
                                typeArguments: [],
                              },
                            });
                          console.log(followProfileTx);
                          const executedTransaction =
                            await aptos.waitForTransaction({
                              transactionHash: followProfileTx.hash,
                            });

                          console.log(executedTransaction);
                        }
                      }}
                    >
                      {isFollowing ? (
                        hoveringUnfollow ? (
                          <>
                            <X className="w-4 h-4" />
                            <p className="font-semibold">Unfollow</p>
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4" />
                            <p className="font-semibold">Following</p>
                          </>
                        )
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          <p className="font-semibold">Follow</p>
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="flex justify-start space-x-16 pt-4">
                    <p className="text-md font-semibold">
                      {profilePosts != null ? profilePosts.length : 0} posts
                    </p>
                    <p className="text-md font-semibold">
                      {profile.followers} followers
                    </p>
                    <p className="text-md font-semibold">
                      {profile.following} following
                    </p>
                  </div>
                  <p className="font-semibold pt-4">{profile.name}</p>
                  <p className=" text-sm">{profile.bio}</p>
                  <div className="flex space-x-2 flex-wrap pb-2">
                    {profile.niches.map((p: number, idx: number) => (
                      <Badge key={idx} className="m-0 my-0.5">
                        {availableCatgegories[p]}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 px-4">
                <Card className="p-0 m-0">
                  <CardContent className="p-0 m-0 flex flex-col justify-between items-center h-full">
                    <div></div>
                    <div className="flex items-center space-x-4  py-3">
                      <p className="font-semibold text-lg">
                        {(parseInt(profile.balance) / 10 ** 8)
                          .toFixed(3)
                          .toString()}
                      </p>
                      <Image
                        src="/aptos.png"
                        width={30}
                        height={30}
                        alt="aptos"
                        className="rounded-full"
                      />
                    </div>
                    <p className="font-semibold bg-primary w-full text-center text-card rounded-b-md p-1 text-md">
                      Aptos
                    </p>
                  </CardContent>
                </Card>
                <Card className="p-0 m-0">
                  <CardContent className="p-0 m-0 flex flex-col justify-between items-center h-full">
                    <div></div>
                    <div className="flex items-center space-x-4 py-3">
                      <p className="font-semibold text-lg">12.3k</p>
                      <Image
                        src="/logo.png"
                        width={30}
                        height={30}
                        alt="aptos"
                        className="rounded-full"
                      />
                    </div>
                    <p className="font-semibold bg-primary w-full text-center text-card rounded-b-md p-1 text-md">
                      Berries
                    </p>
                  </CardContent>
                </Card>
                <Card className="p-0 m-0">
                  <CardContent className="p-0 m-0 flex flex-col justify-between items-center h-full">
                    <div></div>
                    <div className="flex items-center space-x-4 py-3">
                      <p className="font-semibold text-lg">12</p>
                      <Image
                        src="/dragon.jpg"
                        width={30}
                        height={30}
                        alt="aptos"
                        className="rounded-full"
                      />
                    </div>
                    <p className="font-semibold bg-primary w-full text-center text-card rounded-b-md p-1 text-md">
                      DragonFruit Blasts
                    </p>
                  </CardContent>
                </Card>
                <Card className="p-0 m-0">
                  <CardContent className="p-0 m-0 flex flex-col justify-between items-center h-full">
                    <div></div>
                    <div className="flex items-center space-x-4 py-3">
                      <p className="font-semibold text-lg">3</p>
                      <Image
                        src="/collab.png"
                        width={30}
                        height={30}
                        alt="aptos"
                        className="rounded-full"
                      />
                    </div>
                    <p className="font-semibold bg-primary w-full text-center text-card rounded-b-md p-1 text-md">
                      Collabs
                    </p>
                  </CardContent>
                </Card>
              </div>
              <p className="text-center py-4 font-semibold text-lg">Posts</p>
              {profilePosts != null ? (
                profilePosts.map((p: any, idx: number) => (
                  <Post key={idx} post={p} />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center space-y-3">
                  <Skeleton className="h-[625px] w-[450px] rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              )}
              <ScrollBar className="ml-12" />
            </ScrollArea>
          )}
        </div>
      </div>
    </div>
  );
}
