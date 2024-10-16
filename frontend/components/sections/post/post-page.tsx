import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BarChart, Heart, MessageCircle, UserMinusIcon } from "lucide-react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { CORE_MODULE, getAptosClient } from "@/lib/aptos";
import { useEnvironmentStore } from "@/components/context";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { hexToString } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function PostPage({ postId }: { postId: number }) {
  const isLiked = false; // TODO: Remove hardcoding
  const { account, signAndSubmitTransaction } = useWallet();
  const { posts } = useEnvironmentStore((store) => store);
  const [post, setPost] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const router = useRouter();
  useEffect(() => {
    console.log("PostPage");
    setPost(posts.find((p) => p.id == postId));
    if (post != null)
      (async function () {
        try {
          const res = await fetch(`/api/user?AccountAddress=${post.creator}`);
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
            });
          }
        } catch (e) {
          console.log(e);
        }
      })();
  }, [post]);

  return post == null || profile == null ? (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[625px] w-[450px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  ) : (
    <Card className="mb-4 mr-4 h-[90vh]">
      <CardHeader className="p-3 m-0">
        <div className="flex justify-between">
          <div
            className="flex items-center space-x-4 cursor-pointer"
            onClick={() => {
              router.push(`/profile/${post.creator}`);
            }}
          >
            <Image
              src={`https://aggregator-devnet.walrus.space/v1/${profile.image}`}
              width={30}
              height={30}
              alt="Avatar"
              className="rounded-full"
            />
            <div className="flex flex-col">
              <p className="font-semibold hover:scale-105 hover:-translate-y-[1px] transition duration-150 ease-in-out">
                {profile.username}
              </p>
              <p className="text-xs text-muted-foreground">{post.status}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <p className="font-medium text-xl cursor-pointer px-2">...</p>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onSelect={() => {
                  // TODO: Implement unfollow
                }}
                className="gap-2 cursor-pointer"
              >
                <UserMinusIcon className="h-4 w-4" /> Unfollow
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="py-2 px-0 m-0 ">
        <div className="flex justify-center bg-card">
          <Image
            src={`https://aggregator-devnet.walrus.space/v1/${post.image}`}
            width={500}
            height={500}
            alt="Post"
          />
        </div>
        <div className="flex space-x-4 p-3 text-muted-foreground">
          <div className="flex space-x-1 items-center">
            <Heart
              className={`h-5 w-5 ${
                isLiked
                  ? "fill-red-500 text-red-500"
                  : "hover:fill-red-300 hover:text-red-300 transition duration-50 ease-in-out hover:scale-110"
              }  cursor-pointer`}
              onClick={async () => {
                if (account == undefined) return;

                if (!isLiked) {
                  const aptos = getAptosClient();
                  const likePostTx = await signAndSubmitTransaction({
                    sender: account.address,
                    data: {
                      function: `${CORE_MODULE}::SocialMediaPlatform::like_post`,
                      functionArguments: [
                        "0x2df1944b5fcffc2a53d2c75d4a86be38c1ab7cb32bba9db38f7141385786969a", // TODO: remove hardcooing
                        postId,
                      ],
                      typeArguments: [],
                    },
                  });
                  console.log(likePostTx);
                  const executedTransaction = await aptos.waitForTransaction({
                    transactionHash: likePostTx.hash,
                  });

                  console.log(executedTransaction);
                }
              }}
            />
            <p className="text-sm">
              {(post.likes == undefined ? 0 : post.likes).toString()}
            </p>
          </div>
          <div className="flex space-x-1 items-center">
            <MessageCircle className="h-5 w-5" />
            <p className="text-sm">{post.comments.length}</p>
          </div>
          <TooltipProvider>
            <Tooltip delayDuration={50}>
              <TooltipTrigger>
                <div className="flex space-x-1 items-center">
                  <BarChart className="h-5 w-5" />
                  <p className="text-sm">??</p>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Coming Soon</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="font-semibold px-3">
          {post.username} &nbsp;
          <span className="text-sm font-medium">{post.caption}</span>
        </p>
      </CardContent>
    </Card>
  );
}
