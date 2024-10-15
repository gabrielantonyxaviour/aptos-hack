"use client";
import SideBar from "@/components/sections/side-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Post from "@/components/ui/custom/post";
import WalletInfo from "@/components/ui/custom/wallet-info";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { CORE_MODULE, getAptosClient } from "@/lib/aptos";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Check, Plus, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function ProfilePage() {
  const preferences = ["Travel", "Fashion", "Music", "Food & Drink", "Gaming"];
  const isYourProfile = false;
  const isFollowing = false;
  const { account, signAndSubmitTransaction } = useWallet();
  const [hoveringUnfollow, setHoveringUnfollow] = useState<boolean>(false);
  return (
    <div className="flex h-screen select-none">
      <SideBar />
      <div className="pt-7 px-7 flex-1 flex justify-center space-x-12">
        <div className="w-[50%]">
          <ScrollArea className="h-[95vh]">
            <div className="flex space-x-16 px-4">
              <Image
                src={"/avatar.jpeg"}
                width={180}
                height={180}
                alt="hero"
                className="rounded-full my-6"
              />
              <div className="flex flex-col flex-1 space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-lg font-semibold">gabrielaxy.aptos</p>
                  {isYourProfile ? (
                    <WalletInfo />
                  ) : (
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
                  )}
                </div>
                <div className="flex justify-start space-x-16 pt-4">
                  <p className="text-md font-semibold">1 post</p>
                  <p className="text-md font-semibold">420 followers</p>
                  <p className="text-md font-semibold">69 following</p>
                </div>
                <p className="font-semibold pt-4">Gabriel</p>
                <p className=" text-sm">
                  I am him. He is me. My prononus are Sig/ma
                </p>
                <div className="flex space-x-2">
                  {preferences.map((p, idx) => (
                    <Badge key={idx} className="m-0">
                      {p}
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
                    <p className="font-semibold text-lg">1.45</p>
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
            <Post />
            <Post />
            <ScrollBar className="ml-12" />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
