"use client";

import { useEnvironmentStore } from "@/components/context";
import SideBar from "@/components/sections/side-nav";
import Post from "@/components/ui/custom/post";
import Suggested from "@/components/ui/custom/suggested";
import { ScrollBar, ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect } from "react";

export default function HomePage() {
  const { posts } = useEnvironmentStore((store) => store);
  useEffect(() => {
    console.log("POSTS OUTPUT");
    console.log(posts);
  }, [posts]);
  return (
    <div className="flex h-screen">
      <SideBar />
      <div className="pt-7 px-7 flex-1 flex justify-center space-x-12">
        <div className={posts.length == 0 ? "w-[600px]" : "max-w-[1000px]"}>
          <Tabs defaultValue="suggested">
            <div className=" flex justify-between w-full">
              <p className="font-semibold text-lg">Your Feed</p>
              <TabsList>
                <TabsTrigger value="suggested" className="px-6 font-semibold">
                  Suggested
                </TabsTrigger>
                <TabsTrigger value="following" className="px-6 font-semibold">
                  Following
                </TabsTrigger>
              </TabsList>
            </div>
            <div className="flex flex-col items-center w-full">
              <ScrollArea className="h-[90vh] mt-4 w-full">
                {posts.map((post, idx) => (
                  <Post key={idx} post={post} />
                ))}
                <ScrollBar
                  orientation="vertical"
                  className="ml-4 border-r-card"
                />
              </ScrollArea>
            </div>
          </Tabs>
        </div>
        <Suggested />
      </div>
    </div>
  );
}
