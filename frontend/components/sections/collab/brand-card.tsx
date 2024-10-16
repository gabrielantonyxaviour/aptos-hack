import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CORE_MODULE, getAptosClient } from "@/lib/aptos";
import {
  availableCatgegories,
  formattedNumber,
  hexToNumberArray,
  hexToString,
} from "@/lib/utils";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function BrandCard({ idx, brand }: { idx: number; brand: any }) {
  const [profile, setProfile] = useState<any>();
  const { account, signAndSubmitTransaction } = useWallet();

  useEffect(() => {
    console.log("Brand Card");
    console.log(brand);

    (async function () {
      try {
        const res = await fetch(`/api/user?AccountAddress=${brand.owner}`);
        const response = await res.json();
        const { resources } = response.data;

        // FETCH PROFILE
        const profile = (resources as any[]).find(
          (r) => r.type === `${CORE_MODULE}::SocialMediaPlatform::Profile`
        );
        if (profile != undefined) {
          setProfile({
            image: hexToString(profile.data.profile_pic_cid.slice(2)),
            username: hexToString(profile.data.user_name.slice(2)),
            name: hexToString(profile.data.display_name.slice(2)),
            niche: hexToNumberArray(profile.data.niche.slice(2)),
          });
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  const berries = 20000; // TODO : Remove hardcoding
  return (
    <Card key={idx}>
      <CardContent className="p-0 ">
        <div className="flex flex-col justify-center ">
          <Image
            src={brand.image}
            width={300}
            height={300}
            alt="Collab"
            className="rounded-t-lg"
          />
          <div className="w-full rounded-b-lg p-2 flex justify-center space-x-2 bg-secondary">
            <Image src={"/logo.png"} width={20} height={20} alt="Logo" />
            <p className="text-center">
              {"Min.  " + formattedNumber(parseInt(brand.minBerries))}
            </p>
          </div>
          <div className="p-2">
            <p className="font-semibold text-lg">{profile.name}</p>
            <p className="text-md text-muted-foreground">{brand.description}</p>

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
                  {formattedNumber(parseInt(brand.minRewards))}
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
                  {formattedNumber(parseInt(brand.maxRewards))}
                </p>
              </div>
            </div>
            <Separator className="my-2" />
            <div className="flex space-x-2 py-1">
              {profile.niche.map((n: any, idx: number) => (
                <Badge key={idx} className="text-sm">
                  {availableCatgegories[n]}
                </Badge>
              ))}
            </div>
            <Separator className="my-2" />
            <Button
              variant={"secondary"}
              className="w-full font-semibold"
              disabled={berries < brand.minBerries}
              onClick={async () => {
                if (account == undefined) return;

                const aptos = getAptosClient();
                const applyCollabTx = await signAndSubmitTransaction({
                  sender: account.address,
                  data: {
                    function: `${CORE_MODULE}::SocialMediaPlatform::apply_collab`,
                    functionArguments: [
                      "0x0000000000000000000000000000000000000000000000000000000000000000", // TODO: Need to remove hardcoding
                    ],
                    typeArguments: [],
                  },
                });
                console.log(applyCollabTx);
                const executedTransaction = await aptos.waitForTransaction({
                  transactionHash: applyCollabTx.hash,
                });

                console.log(executedTransaction);
              }}
            >
              {brand.minBerries > berries ? "Insufficient Berries" : "Apply"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
