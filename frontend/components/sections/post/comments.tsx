import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Comment from "./comment";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { CORE_MODULE, getAptosClient } from "@/lib/aptos";
import { useEnvironmentStore } from "@/components/context";
export default function Comments({
  post,
  profile,
}: {
  post: any;
  profile: any;
}) {
  const [comment, setComment] = useState<string>("");
  const { account, signAndSubmitTransaction } = useWallet();
  const { image } = useEnvironmentStore((store) => store);
  return (
    <Card className="h-[90vh] flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg">Comments</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <ScrollArea className="h-[74vh]">
          {post.comments.map((c: any, idx: number) => (
            <Comment key={idx} comment={c} />
          ))}
          <ScrollBar orientation="vertical" />
        </ScrollArea>

        <Separator className="my-2" />
        <div className="flex items-center">
          <Image
            src={`https://aggregator-devnet.walrus.space/v1/${image}`}
            width={30}
            height={30}
            alt="Avatar"
            className="rounded-full"
          />
          <div className="flex-1">
            <Input
              className="bg-transparent border-none px-3 w-[400px] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
              placeholder="Add a comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></Input>
          </div>
          <Button
            size={"sm"}
            className="flex space-x-1 pl-3 pr-2"
            onClick={async () => {
              if (account == undefined || comment == "") {
                console.log("Please connect wallet and write a comment");
                console.log(account);
                console.log(comment);
                return;
              }
              const aptos = getAptosClient();
              const createCommentTx = await signAndSubmitTransaction({
                sender: account.address,
                data: {
                  function: `${CORE_MODULE}::SocialMediaPlatform::comment_on_post`,
                  functionArguments: [
                    "0x2df1944b5fcffc2a53d2c75d4a86be38c1ab7cb32bba9db38f7141385786969a", // TODO: Replace with actual post creator
                    post.id,
                    Array.from(new TextEncoder().encode(comment)),
                  ],
                  typeArguments: [],
                },
              });
              console.log(createCommentTx);
              const executedTransaction = await aptos.waitForTransaction({
                transactionHash: createCommentTx.hash,
              });
              console.log(executedTransaction);
            }}
          >
            <p className="font-semibold">Send</p>{" "}
            <ChevronRight className="w-5 h-5" />{" "}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
