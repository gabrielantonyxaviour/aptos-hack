import { useEnvironmentStore } from "@/components/context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { CORE_MODULE, getAptosClient } from "@/lib/aptos";
import { formattedNumber } from "@/lib/utils";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function BusinessTab() {
  const router = useRouter();
  const { toast } = useToast();
  const [adDesc, setAdDesc] = useState<string>("");
  const [minBerries, setMinBerries] = useState<string>("0");
  const [minAptos, setMinAptos] = useState<string>("1,000");
  const [maxAptos, setMaxAptos] = useState<string>("10,000");
  const preferences = ["Travel", "Fashion", "Music", "Food & Drink", "Gaming"];
  const { account, signAndSubmitTransaction } = useWallet();

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
  const { username, name, followers, following, bio, image } =
    useEnvironmentStore((store) => store);

  const brandProfileCreated = false;

  return (
    <div className="flex flex-col space-y-4 w-full pr-4 py-4">
      <div className="flex justify-center py-6 ">
        <Image
          src={`https://aggregator-devnet.walrus.space/v1/${image}`}
          width={250}
          height={250}
          alt="Collab"
          className="rounded-full"
        />
        <div className="flex flex-col  space-y-2 px-12 justify-center">
          <p className="text-lg font-semibold">{username}</p>
          <div className="flex justify-start space-x-16 pt-4">
            <p className="text-md font-semibold">1 post</p>
            <p className="text-md font-semibold">{followers} followers</p>
            <p className="text-md font-semibold">{following} following</p>
          </div>
          <p className="font-semibold pt-4">{name}</p>
          <p className=" text-sm">{bio}</p>
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
          <p className=" font-semibold text-lg  my-auto">Minimum Berries</p>
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
              <Image src={"/logo.png"} width={20} height={20} alt="aptos" />
              <Input
                value={minBerries}
                className="bg-accent text-md"
                onChange={(e) => {
                  const value = parseFloat(e.target.value.replace(/,/g, ""));
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
              <Image src={"/aptos.png"} width={20} height={20} alt="aptos" />
              <Input
                value={minAptos}
                className="bg-accent text-md"
                onChange={(e) => {
                  const value = parseFloat(e.target.value.replace(/,/g, ""));
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
              <Image src={"/aptos.png"} width={20} height={20} alt="aptos" />
              <Input
                value={maxAptos}
                className="bg-accent text-md"
                onChange={(e) => {
                  const value = parseFloat(e.target.value.replace(/,/g, ""));
                  if (isNaN(value) || value < 0) {
                    setMaxAptos("0");
                  } else if (value > 1_000_000) {
                    setMaxAptos("1,000,000");
                  } else {
                    if (value > 2_000) {
                      if (value < parseFloat(minAptos.replace(/,/g, "")))
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
          onClick={async () => {
            if (account == undefined) return;

            const aptos = getAptosClient();
            if (brandProfileCreated) {
              toast({
                title: "Updating Brand Profile 1/2",
                description: "Waiting to Approve Transacttion...",
              });
              const updateBrandProfileTx = await signAndSubmitTransaction({
                sender: account.address,
                data: {
                  function: `${CORE_MODULE}::SocialMediaPlatform::update_brand_profile`,
                  functionArguments: [
                    Array.from(new TextEncoder().encode(adDesc)),
                    parseInt(minBerries.replace(/,/g, "")),
                    parseInt(minAptos.replace(/,/g, "")),
                    parseInt(maxAptos.replace(/,/g, "")),
                  ],
                  typeArguments: [],
                },
              });
              console.log(updateBrandProfileTx);
              const executedTransaction = await aptos.waitForTransaction({
                transactionHash: updateBrandProfileTx.hash,
              });
              toast({
                title: "Updating Brand Profile 2/2",
                description: "Brand Profile Updated.",
              });
              console.log(executedTransaction);
            } else {
              toast({
                title: "Creating Brand Profile 1/2",
                description: "Waiting to Approve Transacttion...",
              });
              const createBrandProfileTx = await signAndSubmitTransaction({
                sender: account.address,
                data: {
                  function: `${CORE_MODULE}::SocialMediaPlatform::create_brand_profile`,
                  functionArguments: [
                    Array.from(new TextEncoder().encode(adDesc)),
                    parseInt(minBerries.replace(/,/g, "")),
                    parseInt(minAptos.replace(/,/g, "")),
                    parseInt(maxAptos.replace(/,/g, "")),
                  ],
                  typeArguments: [],
                },
              });
              console.log(createBrandProfileTx);
              const executedTransaction = await aptos.waitForTransaction({
                transactionHash: createBrandProfileTx.hash,
              });
              toast({
                title: "Creating Brand Profile 2/2",
                description: "Brand Profile Created.",
              });
              console.log(executedTransaction);
            }
          }}
        >
          {brandProfileCreated ? "Update" : "Create"}
        </Button>
      </div>
      {brandProfileCreated && (
        <>
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
                        <p className="text-muted-foreground ">{i.username}</p>
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
                      <Button variant={"ghost"} className="font-medium text-lg">
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
        </>
      )}
    </div>
  );
}
