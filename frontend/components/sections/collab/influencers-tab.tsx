import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formattedNumber } from "@/lib/utils";
import Image from "next/image";

export default function InfluencersTab() {
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
  return (
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
                <Image src={"/logo.png"} width={20} height={20} alt="Logo" />
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
  );
}
