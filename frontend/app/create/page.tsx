"use client";
import SideBar from "@/components/sections/side-nav";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Trash } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import uploadToWalrus from "@/lib/walrus/upload";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { CORE_MODULE, getAptosClient } from "@/lib/aptos";

export default function CreatePage() {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageCid, setImageCid] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [postStatus, setPostStatus] = useState<string>("");
  const [caption, setCaption] = useState<string>("");
  const [isPromotion, setIsPromotion] = useState<boolean>(false);
  const [selectedPromotion, setSelectedPromotion] = useState<number>(0);
  const { account, signAndSubmitTransaction } = useWallet();
  const promotions = [
    {
      id: 1,
      name: "Louis Vitton",
      image: "/onboarding/1.png",
    },
    {
      id: 2,
      name: "Nike",
      image: "/onboarding/2.jpg",
    },
    {
      id: 3,
      name: "Tesla",
      image: "/onboarding/4.jpg",
    },
  ];

  const { toast } = useToast();
  return (
    <div className="flex h-screen ">
      <SideBar />
      <div className="h-full pt-14 px-7 flex-1 flex flex-col space-y-4 items-center max-w-[1200px] mx-auto">
        <p className="text-xl font-semibold text-center">Create Post</p>
        <ScrollArea className="h-[90vh] mt-4 w-full">
          <div className="flex justify-center py-6 ">
            {image != null && imagePreview != null ? (
              <div className="relative group">
                <Image
                  src={imagePreview}
                  alt="uploaded"
                  width={500}
                  height={500}
                  className="cursor-pointer rounded-lg transition-opacity duration-300 ease-in-out group-hover:opacity-50"
                  onClick={() => {
                    setImage(null);
                    setImagePreview(null);
                  }}
                />
                <div
                  className="cursor-pointer absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
                  onClick={() => {
                    setImage(null);
                    setImagePreview(null);
                  }}
                >
                  <Trash className="w-8 h-8 " />
                </div>
              </div>
            ) : (
              <label
                htmlFor="imageUpload"
                className="flex justify-center items-center w-[500px] h-[500px] border border-dashed border-secondary cursor-pointer"
              >
                <input
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    const file = event.target.files?.[0]; // Get the first selected file

                    if (file) {
                      if (file.size > 2 * 1024 * 1024) {
                        // Restrict size to 2MB
                        setError("File size exceeds 2MB");
                        toast({
                          variant: "destructive",
                          title: "Error",
                          description: "File size exceeds 2MB",
                        });
                        setImage(null);
                        setImagePreview(null);
                        return;
                      }

                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setImagePreview(reader.result as string); // Convert the file to a base64 string
                        setError(null);
                      };
                      setImage(file);
                      reader.readAsDataURL(file); // Read the file as a data URL
                    }
                  }}
                  className="hidden"
                />
                <p className="text-sm text-muted-foreground text-center">
                  Click here to <br /> upload
                </p>
              </label>
            )}
          </div>
          <div className="flex flex-col space-y-4 w-full pr-4">
            <div className="flex justify-between space-x-4">
              <div className="flex-1 px-2 flex flex-col space-y-2">
                <p className="font-semibold text-md">Status</p>
                <Input
                  value={postStatus}
                  onChange={(e) => {
                    setPostStatus(e.target.value);
                  }}
                ></Input>
                <p className="text-sm text-muted-foreground">
                  Will be displayed near your profile handle.
                </p>
              </div>
              <div className="flex-1 px-2 flex flex-col space-y-2">
                <p className="font-semibold text-md">Caption</p>
                <Input
                  value={caption}
                  onChange={(e) => {
                    setCaption(e.target.value);
                  }}
                ></Input>{" "}
                <p className="text-sm text-muted-foreground">
                  Will be displayed below your post.
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-center space-y-1 items-center">
              <p className="text-lg font-semibold">Promotion</p>
              <Switch
                checked={isPromotion}
                onCheckedChange={(val) => {
                  setIsPromotion(val);
                }}
              />
            </div>
            {isPromotion && (
              <div className="flex justify-center space-x-4 py-2 transition ease-in-out duration-150">
                {promotions.length > 0 ? (
                  promotions.map((p, idx) => (
                    <Card
                      key={idx}
                      onClick={() => {
                        setSelectedPromotion(idx);
                      }}
                      className={
                        "hover:scale-110 cursor-pointer transition ease-in-out duration-150" +
                        (idx == selectedPromotion
                          ? " border-[3px] border-primary "
                          : "")
                      }
                    >
                      <CardContent className="p-0 m-0 ">
                        <div className="flex items-center space-x-4 ">
                          <Image
                            src={p.image}
                            width={180}
                            height={30}
                            alt="louis"
                            className="rounded-t-md"
                          />
                        </div>
                        <p className="w-full text-center rounded-b-md p-1 text-lg">
                          {p.name}
                        </p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-muted-foreground">
                    You dont&apos;t have any promotions yet.
                  </p>
                )}
              </div>
            )}
          </div>
          <div className="flex justify-center py-4">
            <Button
              className="font-bold text-lg"
              onClick={async () => {
                if (image == null || account == undefined) {
                  console.log(image);
                  console.log(account);
                  console.log("Image or Accont is null");
                  return;
                }
                let blob = "8TABojg6drQTZB2C_LwdMnW4aPOSFIFLdu_SbzvCTek";
                if (blob == "") {
                  await uploadToWalrus(
                    image,
                    (blobId) => {
                      blob = blobId;
                      console.log(blobId);
                      setImageCid(blobId);
                    },
                    (error) => {
                      console.log(error);
                    }
                  );
                }
                const aptos = getAptosClient();

                const createPostTx = await signAndSubmitTransaction({
                  sender: account.address,
                  data: {
                    function: `${CORE_MODULE}::SocialMediaPlatform::create_post`,
                    functionArguments: [
                      blob,
                      // Array.from(new TextEncoder().encode(caption)),
                      Array.from(new TextEncoder().encode(postStatus)),
                      isPromotion,
                      "0x0000000000000000000000000000000000000000000000000000000000000000", // TODO: Need to remove hardcoding
                    ],
                    typeArguments: [],
                  },
                });
                console.log(createPostTx);
                const executedTransaction = await aptos.waitForTransaction({
                  transactionHash: createPostTx.hash,
                });

                console.log(executedTransaction);
              }}
            >
              Confirm
            </Button>
          </div>
          <ScrollBar
            orientation="vertical"
            className="ml-4 border-r-secondary"
          />
        </ScrollArea>
      </div>
    </div>
  );
}
