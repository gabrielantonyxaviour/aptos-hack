import { Button } from "@/components/ui/button";

import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Check, Trash } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import WalletInfo from "@/components/ui/custom/wallet-info";
import { CORE_MODULE, getAptosClient } from "@/lib/aptos";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import uploadToWalrus from "@/lib/walrus/upload";
import {
  IDKitWidget,
  VerificationLevel,
  ISuccessResult,
} from "@worldcoin/idkit";
import { availableCatgegories } from "@/lib/utils";
import { useEnvironmentStore } from "@/components/context";

export default function NewUser() {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageCid, setImageCid] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [niches, setNiches] = useState<number[]>([]);
  const [preferences, setPreferences] = useState<number[]>([]);
  const { toast } = useToast();
  const { account, signAndSubmitTransaction } = useWallet();
  const router = useRouter();

  const { updateProfile } = useEnvironmentStore((store) => store);

  const [nullifierHash, setNullifierHash] = useState("");

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 ">
      <div className="flex justify-between items-center">
        <div className="flex space-x-3 items-end justify-center">
          <Image src={"/logo.png"} width={40} height={40} alt="Logo" />
          <p className="font-semibold text-lg mb-1">SocioBerries</p>
        </div>
        <WalletInfo />
      </div>
      <div>
        <p className="text-xl font-semibold text-center">Create Account</p>
        <p className="text-md text-center text-muted-foreground">
          Welcome to SocioBerries. Let&apos;s get started by creating your
          profile.
        </p>
      </div>

      <ScrollArea className="h-[80vh] ">
        <div className="flex w-full flex-col justify-center space-y-6 pr-4">
          <div className="flex justify-center">
            {imagePreview != null && image != null ? (
              <div className="relative group">
                <Image
                  src={imagePreview}
                  alt="uploaded"
                  width={200}
                  height={200}
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
                className="flex justify-center items-center w-[200px] h-[200px] border border-dashed border-secondary cursor-pointer"
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
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between">
              <div className="flex-1 px-2 flex flex-col space-y-2">
                <p className="font-semibold text-md">User Name</p>
                <Input
                  className="ml-1"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                ></Input>{" "}
                <p className="text-sm text-muted-foreground">
                  A unique username or id of your profile.
                </p>
              </div>
              <div className="flex-1 px-2 flex flex-col space-y-2">
                <p className="font-semibold text-md">Display Name</p>
                <Input
                  className="ml-1"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                ></Input>
                <p className="text-sm text-muted-foreground">
                  The name that will be displayed on your profile.
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <div className="flex flex-col space-y-2 px-2">
              <p className="font-semibold text-md">Bio</p>
              <Textarea
                className="ml-1"
                value={bio}
                onChange={(e) => {
                  setBio(e.target.value);
                }}
              />
              <p className="text-sm text-muted-foreground">
                Tell something about yourself and what you do.
              </p>
            </div>
          </div>
          <div className="flex flex-col space-y-2 px-2">
            <p className="font-semibold text-md">Your Niche</p>
            <div className="">
              {availableCatgegories.map((category, idx) => (
                <Badge
                  key={idx}
                  className={`m-1 cursor-pointer text-sm ${
                    niches.includes(idx)
                      ? "bg-primary"
                      : `bg-secondary ${
                          niches.length >= 5
                            ? "text-muted-foreground hover:bg-secondary cursor-not-allowed"
                            : "text-white"
                        }`
                  }`}
                  onClick={() => {
                    if (niches.includes(idx)) {
                      setNiches(niches.filter((n, id) => n !== idx));
                    } else {
                      if (niches.length < 5) setNiches([...niches, idx]);
                    }
                  }}
                >
                  {category}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Choose your content niche to reach your target audience.
            </p>
          </div>
          <div className="flex flex-col space-y-2 px-2">
            <p className="font-semibold text-md">Preferences</p>
            <div>
              {availableCatgegories.map((category, idx) => (
                <Badge
                  key={idx}
                  className={`m-1 cursor-pointer text-sm ${
                    preferences.includes(idx)
                      ? "bg-primary"
                      : `, bg-secondary ${
                          preferences.length >= 5
                            ? "text-muted-foreground hover:bg-secondary cursor-not-allowed"
                            : "text-white"
                        }`
                  }`}
                  onClick={() => {
                    if (preferences.includes(idx)) {
                      setPreferences(preferences.filter((n) => n !== idx));
                    } else {
                      if (preferences.length < 5)
                        setPreferences([...preferences, idx]);
                    }
                  }}
                >
                  {category}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Choose the type of content you want to see on your feed.
            </p>
          </div>

          <div className="flex justify-end pb-4 space-x-2">
            <IDKitWidget
              app_id={
                (process.env.NEXT_PUBLIC_WORLDCOIN_APP_ID as `app_${string}`) ||
                "app_xxx"
              }
              action="verify-humanness"
              onSuccess={(res: ISuccessResult) => {
                console.log("PROOF OF HUMNITY SUCCESS");
                console.log(res);
                setNullifierHash(res.nullifier_hash);
              }}
              handleVerify={(res: ISuccessResult) => {
                console.log("PROOF OF HUMNITY HANDLE GENERATED");
                console.log(res);
                setNullifierHash(res.nullifier_hash);
              }}
              verification_level={VerificationLevel.Orb}
            >
              {({ open }) => (
                <Button
                  className="p-6 flex space-x-2 items-center"
                  variant={"outline"}
                  onClick={() => {
                    open();
                  }}
                  disabled={nullifierHash != ""}
                >
                  {nullifierHash != "" ? (
                    <>
                      <Check className="w-5 h-5" />
                      <p className="font-semibold">Verified Human</p>
                    </>
                  ) : (
                    <>
                      <Image
                        src={"/worldcoin.png"}
                        width={25}
                        height={25}
                        alt="worldcoin"
                        className="rounded-full"
                      />
                      <p className="font-semibold">Verify Humaness</p>
                    </>
                  )}
                </Button>
              )}
            </IDKitWidget>
            <Button
              variant={"default"}
              className="font-semibold text-md p-6"
              disabled={
                nullifierHash == "" ||
                image == null ||
                account == undefined ||
                name == "" ||
                username == "" ||
                bio == "" ||
                niches.length == 0 ||
                preferences.length == 0
              }
              onClick={async () => {
                if (
                  nullifierHash == "" ||
                  image == null ||
                  account == undefined ||
                  name == "" ||
                  username == "" ||
                  bio == "" ||
                  niches.length == 0 ||
                  preferences.length == 0
                ) {
                  console.log(image);
                  console.log(account);
                  console.log("Image or Accont is null");
                  toast({
                    title: "Error",
                    description: "Please fill all the fields",
                  });
                  return;
                }

                // // Upload the image to Walrus
                toast({
                  title: "Creating Profile 1/3",
                  description: "Uploading your profile to Walrus...",
                });
                let blob = "";
                if (blob == "") {
                  await uploadToWalrus(
                    image,
                    (blobId) => {
                      blob = blobId;
                      setImageCid(blobId);
                    },
                    (error) => {
                      console.log(error);
                    }
                  );
                }

                const aptos = getAptosClient();
                toast({
                  title: "Creating Profile 2/3",
                  description: "Triggering transaction ...",
                });
                const createProfileTx = await signAndSubmitTransaction({
                  sender: account.address,
                  data: {
                    function: `${CORE_MODULE}::SocialMediaPlatform::create_profile`,
                    functionArguments: [
                      Array.from(new TextEncoder().encode(username)),
                      Array.from(new TextEncoder().encode(name)),
                      Array.from(new TextEncoder().encode(bio)),
                      blob,
                      preferences,
                      niches,
                      nullifierHash,
                    ],
                    typeArguments: [],
                  },
                });
                console.log(createProfileTx);
                const executedTransaction = await aptos.waitForTransaction({
                  transactionHash: createProfileTx.hash,
                });

                console.log(executedTransaction);
                toast({
                  title: "Creating Profile 3/3",
                  description: "Profile created Successfully.",
                });
                updateProfile({
                  name: name,
                  username: username,
                  bio: bio,
                  niches: niches,
                  preferences: preferences,
                  image: blob,
                  followers: 0,
                  following: 0,
                  balance: "0",
                  humanness_nullifier: nullifierHash,
                });
                router.push("/home");
              }}
            >
              Get Started
            </Button>
          </div>
        </div>

        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
}
