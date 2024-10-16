import { useEnvironmentStore } from "@/components/context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CORE_MODULE, getAptosClient } from "@/lib/aptos";
import { formattedNumber } from "@/lib/utils";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import Image from "next/image";
import { useEffect } from "react";
import BrandCard from "./brand-card";

export default function InfluencersTab() {
  const { account, signAndSubmitTransaction } = useWallet();
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
  const { brands } = useEnvironmentStore((store) => store);

  return (
    <div className="grid grid-cols-4 gap-2 w-full py-4 pr-4">
      {brands.map((brand, idx) => (
        <BrandCard brand={brand} idx={idx} />
      ))}
    </div>
  );
}
