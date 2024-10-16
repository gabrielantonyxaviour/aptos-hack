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
import { availableCatgegories } from "@/lib/utils";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Check, Plus, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ProfilePage() {
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
  const { account } = useWallet();
  const [profilePosts, setProfilePosts] = useState<any>(null);

  useEffect(() => {
    if (account == undefined) return;
    console.log("ProfilePage");
    setProfilePosts(posts.filter((p) => p.creator == account.address));
  }, [account]);
  return (
    <div className="flex h-screen select-none">
      <SideBar />
      <div className="pt-7 px-7 flex-1 flex justify-center space-x-12">
        <div className="w-[50%]">
          <ScrollArea className="h-[95vh]">
            <div className="flex space-x-16 px-4">
              <Image
                src={`https://aggregator-devnet.walrus.space/v1/${image}`}
                width={180}
                height={180}
                alt="hero"
                className="rounded-full my-6"
              />
              <div className="flex flex-col flex-1 space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-lg font-semibold">{username}</p>
                  <WalletInfo />
                </div>
                <div className="flex justify-start space-x-16 pt-4">
                  <p className="text-md font-semibold">1 post</p>
                  <p className="text-md font-semibold">{followers} followers</p>
                  <p className="text-md font-semibold">{following} following</p>
                </div>
                <p className="font-semibold pt-4">{name}</p>
                <p className=" text-sm">{bio}</p>
                <div className="flex space-x-2 flex-wrap pb-2">
                  {niches.map((p, idx) => (
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
                      {(parseInt(balance) / 10 ** 8).toFixed(3).toString()}
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
        </div>
      </div>
    </div>
  );
}
