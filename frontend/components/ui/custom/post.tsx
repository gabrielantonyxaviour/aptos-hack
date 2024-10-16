import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Input } from "../input";
import { useRouter } from "next/navigation";
import { Post as PostType } from "@/lib/type";
import { useEffect, useState } from "react";
import { CORE_MODULE } from "@/lib/aptos";
import { hexToString } from "@/lib/utils";
import { Skeleton } from "../skeleton";

export default function Post({ key, post }: { key: number; post: PostType }) {
  const { id, caption, image, creator, status, likes, comments } = post;
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const isLiked = false;
  useEffect(() => {
    console.log("Post");
    console.log(post);

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
  }, []);

  return profile == null ? (
    <div className="flex flex-col space-y-3" key={key}>
      <Skeleton className="h-[625px] w-[450px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  ) : (
    <Card className="mb-4 mr-4" key={key}>
      <CardHeader className="p-3 m-0">
        <div className="flex justify-between">
          <div
            className="flex items-center space-x-4 cursor-pointer"
            onClick={() => {
              router.push(`/profile/${creator}`);
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
              <p className="text-xs text-muted-foreground">{status}</p>
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
      <CardContent
        className="pb-0 px-0 m-0 cursor-pointer"
        onClick={() => {
          // TODO: Go to post page
          router.push(`/post/${id}`);
        }}
      >
        <div className="flex justify-center bg-card">
          <Image
            src={`https://aggregator-devnet.walrus.space/v1/${image}`}
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
            />
            <p className="text-sm">
              {(likes == undefined ? 0 : likes).toString()}
            </p>
          </div>
          <div className="flex space-x-1 items-center">
            <MessageCircle className="h-5 w-5" />
            <p className="text-sm">{comments.length}</p>
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
          {profile.username} &nbsp;
          <span className="text-sm font-medium">{caption}</span>
        </p>
        <p className="px-4 pt-1 text-muted-foreground text-sm">
          View all {comments.length} comments
        </p>
        <div className="flex px-3 items-center">
          <Image
            src={`https://aggregator-devnet.walrus.space/v1/${profile.image}`}
            width={30}
            height={30}
            alt="Avatar"
            className="rounded-full"
          />
          <div className="flex-1">
            <Input
              className="bg-transparent border-none px-3 w-[200px] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
              placeholder="Add a comment"
            ></Input>
          </div>

          <p className="text-muted-foreground text-xs">2 minutes ago</p>
        </div>
      </CardContent>
    </Card>
  );
}
