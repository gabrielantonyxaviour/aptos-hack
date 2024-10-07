"use client";
import SideBar from "@/components/sections/side-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import WalletInfo from "@/components/ui/custom/wallet-info";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { formattedNumber } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function CollabPage() {
  const router = useRouter();
  const berries = 20000;
  const collabs = [
    {
      id: 1,
      name: "Louis Vuitton",
      image: "/onboarding/1.png",
      description:
        "Looking for a fashion influencer to promote our new collection.",
      niche: ["Fashion", "Luxury"],
      requiredBerries: 50000,
      minimumPay: 5000,
      maximumPay: 20000,
    },
    {
      id: 2,
      name: "Nike",
      image: "/onboarding/2.jpg",
      description:
        "Looking for a fitness influencer to promote our new collection.",
      niche: ["Fitness", "Sportswear"],
      requiredBerries: 10000,
      minimumPay: 500,
      maximumPay: 5000,
    },
    {
      id: 3,
      name: "Apple",
      image: "/onboarding/3.jpg",
      description:
        "Looking for a tech influencer to promote our new collection.",
      niche: ["Tech", "Gadgets"],
      requiredBerries: 100000,
      minimumPay: 2000,
      maximumPay: 7000,
    },
    {
      id: 4,
      name: "Tesla",
      image: "/onboarding/4.jpg",
      description:
        "Looking for a tech influencer to promote our new collection.",
      niche: ["Tech", "Electric Vehicles"],
      requiredBerries: 20000,
      minimumPay: 2500,
      maximumPay: 8000,
    },
    {
      id: 5,
      name: "Samsung",
      image: "/onboarding/4.jpg",
      description:
        "Looking for a tech influencer to promote our new collection.",
      niche: ["Tech", "Gadgets"],
      requiredBerries: 2000,
      minimumPay: 500,
      maximumPay: 4000,
    },
  ];
  const preferences = ["Travel", "Fashion", "Music", "Food & Drink", "Gaming"];
  const [adDesc, setAdDesc] = useState<string>("");
  const [minBerries, setMinBerries] = useState<string>("0");
  const [minAptos, setMinAptos] = useState<string>("1,000");
  const [maxAptos, setMaxAptos] = useState<string>("10,000");
  const [showInfluencer, setShowInfluencer] = useState(true);

  const influencers = [
    {
      id: 1,
      name: "Marshal",
      username: "marshal.aptos",
      berries: 10000,
      dragonFruitBlasts: 100,
      collabs: 10,
      followers: 420,
      following: 69,
      image: "/onboarding/1.png",
      posts: 1,
      niches: ["Travel", "Fashion", "Music", "Food & Drink", "Gaming"],
    },
    {
      id: 2,
      name: "Tabitha",
      username: "tabitha.aptos",
      berries: 12000,
      dragonFruitBlasts: 50,
      collabs: 4,
      followers: 1000,
      following: 120,
      image: "/onboarding/2.jpg",
      posts: 1,
      niches: ["Travel", "Fashion", "Music", "Food & Drink", "Gaming"],
    },
  ];

  useEffect(() => {}, [minAptos, maxAptos]);
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
          {showInfluencer ? (
            <div className="grid grid-cols-4 gap-2 w-full py-4 pr-4">
              {collabs.map((collab, idx) => (
                <Card key={idx}>
                  <CardContent className="p-0 ">
                    <div className="flex flex-col justify-center ">
                      <Image
                        src={collab.image}
                        width={300}
                        height={300}
                        alt="Collab"
                        className="rounded-t-lg"
                      />
                      <div className="w-full rounded-b-lg p-2 flex justify-center space-x-2 bg-secondary">
                        <Image
                          src={"/logo.png"}
                          width={20}
                          height={20}
                          alt="Logo"
                        />
                        <p className="text-center">
                          {"Min.  " + formattedNumber(collab.requiredBerries)}
                        </p>
                      </div>
                      <div className="p-2">
                        <p className="font-semibold text-lg">{collab.name}</p>
                        <p className="text-md text-muted-foreground">
                          {collab.description}
                        </p>

                        <div className="flex justify-center space-x-4  px-4 pt-2">
                          <div className="flex items-center space-x-2">
                            <Image
                              src={"/aptos.png"}
                              width={20}
                              height={20}
                              alt="aptos"
                              className="rounded-full"
                            />
                            <p className="text-md font-semibold">
                              {formattedNumber(collab.minimumPay)}
                            </p>
                          </div>
                          <div className="">-</div>
                          <div className="flex items-center space-x-2">
                            <Image
                              src={"/aptos.png"}
                              width={20}
                              height={20}
                              alt="aptos"
                              className="rounded-full"
                            />
                            <p className="text-md font-semibold">
                              {formattedNumber(collab.maximumPay)}
                            </p>
                          </div>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex space-x-2 py-1">
                          {collab.niche.map((n, idx) => (
                            <Badge key={idx} className="text-sm">
                              {n}
                            </Badge>
                          ))}
                        </div>
                        <Separator className="my-2" />
                        <Button
                          variant={"secondary"}
                          className="w-full font-semibold"
                          disabled={berries < collab.requiredBerries}
                        >
                          {collab.requiredBerries > berries
                            ? "Insufficient Berries"
                            : "Apply"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col space-y-4 w-full pr-4 py-4">
              <div className="flex justify-center py-6 ">
                <Image
                  src={"/onboarding/1.png"}
                  width={250}
                  height={250}
                  alt="Collab"
                  className="rounded-full"
                />
                <div className="flex flex-col  space-y-2 px-12 justify-center">
                  <p className="text-lg font-semibold">gabrielaxy.aptos</p>
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
              <div className="flex-1 px-2 flex flex-col space-y-2">
                <p className="font-semibold text-lg">Collab Description</p>
                <Input
                  className="ml-1"
                  value={adDesc}
                  onChange={(e) => {
                    setAdDesc(e.target.value);
                  }}
                ></Input>
                <p className="text-sm text-muted-foreground">
                  Describe the collab you are looking for.
                </p>
              </div>
              <div className="flex justify-center w-full">
                <div className="px-2 flex flex-col w-[50%]">
                  <p className=" font-semibold text-lg  my-auto">
                    Minimum Berries
                  </p>
                  <div className="flex justify-betwwen w-full items-center space-x-4 ">
                    <Slider
                      defaultValue={[1000]}
                      max={10000000}
                      step={1000}
                      className="w-full"
                      value={[parseFloat(minBerries.replace(/,/g, ""))]}
                      onValueChange={([value]) => {
                        setMinBerries(value.toLocaleString());
                      }}
                    />
                    <div className="flex items-center space-x-2">
                      <Image
                        src={"/logo.png"}
                        width={20}
                        height={20}
                        alt="aptos"
                      />
                      <Input
                        value={minBerries}
                        className="bg-accent text-md"
                        onChange={(e) => {
                          const value = parseFloat(
                            e.target.value.replace(/,/g, "")
                          );
                          if (isNaN(value) || value < 0) {
                            setMinBerries("0");
                          } else if (value > 1_000_000_000) {
                            setMinBerries("1,000,000,000");
                          } else {
                            setMinBerries(value.toLocaleString());
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <p className=" font-semibold text-lg my-auto">Rewards</p>
              <div className="flex justify-between">
                <div className="px-2 flex flex-col w-[40%]">
                  <div className="flex justify-betwwen w-full items-center space-x-4 ">
                    <p className="font-semibold text-md">Min</p>
                    <Slider
                      defaultValue={[parseFloat(minAptos.replace(/,/g, ""))]}
                      max={1_000_000}
                      step={1_000}
                      className="w-full"
                      value={[parseFloat(minAptos.replace(/,/g, ""))]}
                      onValueChange={([value]) => {
                        if (value < 900_000) {
                          if (value > parseFloat(maxAptos.replace(/,/g, "")))
                            setMaxAptos((value + 10000).toLocaleString());
                          setMinAptos(value.toLocaleString());
                        }
                      }}
                    />
                    <div className="flex items-center space-x-2">
                      <Image
                        src={"/aptos.png"}
                        width={20}
                        height={20}
                        alt="aptos"
                      />
                      <Input
                        value={minAptos}
                        className="bg-accent text-md"
                        onChange={(e) => {
                          const value = parseFloat(
                            e.target.value.replace(/,/g, "")
                          );
                          if (isNaN(value) || value < 0) {
                            setMinAptos("0");
                          } else if (value > 900_000) {
                            setMaxAptos("1,000,000");
                            setMinAptos("900,000");
                          } else {
                            if (value > parseFloat(maxAptos.replace(/,/g, "")))
                              setMaxAptos((value + 10_000).toLocaleString());
                            setMinAptos(value.toLocaleString());
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="px-2 flex flex-col w-[40%]">
                  <div className="flex justify-betwwen w-full items-center space-x-4 ">
                    <p className="font-semibold text-md">Max</p>
                    <Slider
                      defaultValue={[parseFloat(maxAptos.replace(/,/g, ""))]}
                      max={1_000_000}
                      step={1_000}
                      className="w-full"
                      value={[parseFloat(maxAptos.replace(/,/g, ""))]}
                      onValueChange={([value]) => {
                        if (value > 2_000) {
                          if (value < parseFloat(minAptos.replace(/,/g, "")))
                            setMinAptos((value - 2_000).toLocaleString());
                          setMaxAptos(value.toLocaleString());
                        }
                      }}
                    />
                    <div className="flex items-center space-x-2">
                      <Image
                        src={"/aptos.png"}
                        width={20}
                        height={20}
                        alt="aptos"
                      />
                      <Input
                        value={maxAptos}
                        className="bg-accent text-md"
                        onChange={(e) => {
                          const value = parseFloat(
                            e.target.value.replace(/,/g, "")
                          );
                          if (isNaN(value) || value < 0) {
                            setMaxAptos("0");
                          } else if (value > 1_000_000) {
                            setMaxAptos("1,000,000");
                          } else {
                            if (value > 2_000) {
                              if (
                                value < parseFloat(minAptos.replace(/,/g, ""))
                              )
                                setMinAptos((value - 2_000).toLocaleString());
                              setMaxAptos(value.toLocaleString());
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center space-x-4">
                <Button variant={"ghost"} className="font-medium px-12 text-lg">
                  Reset
                </Button>
                <Button
                  variant={"secondary"}
                  className="font-semibold px-12 text-lg"
                >
                  Update
                </Button>
              </div>

              <p className="font-semibold text-lg pt-4">Influencers</p>
              <div className="flex flex-col space-y-2">
                {influencers.map((i, idx) => (
                  <Card key={idx}>
                    <CardContent className="p-4">
                      <div className="flex justify-between">
                        <div
                          className="flex space-x-4  hover:scale-110 cursor-pointer transition ease-in-out duration-150"
                          onClick={() => {
                            router.push("/profile");
                          }}
                        >
                          <Image
                            src={i.image}
                            width={50}
                            height={50}
                            alt="User"
                            className="rounded-full"
                          />
                          <div>
                            <p className="font-semibold text-lg">{i.name}</p>
                            <p className="text-muted-foreground ">
                              {i.username}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-6">
                          <div className="flex space-x-2 items-center">
                            <Image
                              src={"/logo.png"}
                              width={35}
                              height={35}
                              alt="berries"
                            />
                            <p className="text-lg font-semibold">
                              {formattedNumber(i.berries)}
                            </p>
                          </div>
                          <div className="flex space-x-2 items-center">
                            <Image
                              src={"/dragon.jpg"}
                              width={35}
                              height={35}
                              alt="dragon"
                              className="rounded-full"
                            />
                            <p className="text-lg font-semibold">
                              {formattedNumber(i.dragonFruitBlasts)}
                            </p>
                          </div>
                          <div className="flex space-x-2 items-center">
                            <Image
                              src={"/collab.png"}
                              width={35}
                              height={35}
                              alt="collab"
                            />
                            <p className="text-lg font-semibold">
                              {formattedNumber(i.collabs)}
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-center space-x-2">
                          <Button
                            variant={"ghost"}
                            className="font-medium text-lg"
                          >
                            Dismiss
                          </Button>
                          <Button
                            variant={"outline"}
                            className="font-semibold text-lg"
                          >
                            Confirm
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
          <ScrollBar orientation="vertical" className="ml-4 border-r-card" />
        </ScrollArea>
      </div>
    </div>
  );
}
