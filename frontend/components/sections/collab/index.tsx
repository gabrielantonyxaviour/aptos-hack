"use client";

import SideBar from "@/components/sections/side-nav";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import BusinessTab from "./business-tab";
import InfluencersTab from "./influencers-tab";

export default function CollabComponent() {
  const [showInfluencer, setShowInfluencer] = useState(true);

  return (
    <div className="flex h-screen ">
      <SideBar />
      <div className="h-full pt-14 px-7 flex-1 flex flex-col items-center max-w-[1200px] mx-auto">
        <div className="flex justify-between items-center w-full">
          <div>
            <p className="font-semibold text-xl">Collabs</p>
            <p className="text-md text-muted-foreground">
              {showInfluencer
                ? "Create a promotional post with your favourite brands and get paid."
                : "Post a collab and get influencers to promote your brand."}
            </p>
          </div>
          <Tabs
            defaultValue={showInfluencer ? "influencer" : "business"}
            onValueChange={(val) => {
              setShowInfluencer(val === "influencer");
            }}
          >
            <TabsList className="h-full">
              <TabsTrigger
                value="influencer"
                className="px-6 font-semibold text-md"
              >
                Influencers
              </TabsTrigger>
              <TabsTrigger
                value="business"
                className="px-6 font-semibold text-md"
              >
                Business
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <ScrollArea className="h-[90vh] mt-4 w-full">
          {showInfluencer ? <InfluencersTab /> : <BusinessTab />}
          <ScrollBar orientation="vertical" className="ml-4 border-r-card" />
        </ScrollArea>
      </div>
    </div>
  );
}
