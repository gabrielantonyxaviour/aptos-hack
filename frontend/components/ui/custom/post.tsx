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
import { useEnvironmentStore } from "@/components/context";
export default function Post() {
  const router = useRouter();
  const { username, image } = useEnvironmentStore((store) => store);
  return (
    <Card className="mb-4 mr-4">
      <CardHeader className="p-3 m-0">
        <div className="flex justify-between">
          <div
            className="flex items-center space-x-4 cursor-pointer"
            onClick={() => {
              // TODO: Go to profile page
            }}
          >
            <Image
              src={`https://aggregator-devnet.walrus.space/v1/${image}`}
              width={30}
              height={30}
              alt="Avatar"
              className="rounded-full"
            />
            <div className="flex flex-col">
              <p className="font-semibold hover:scale-105 hover:-translate-y-[1px] transition duration-150 ease-in-out">
                {username}
              </p>
              <p className="text-xs text-muted-foreground">📍Singapore</p>
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
          router.push("/post/1");
        }}
      >
        <div className="flex justify-center bg-card">
          <Image src={"/post/hi.jpg"} width={500} height={500} alt="Post" />
        </div>
        <div className="flex space-x-4 p-3 text-muted-foreground">
          <div className="flex space-x-1 items-center">
            <Heart className="h-5 w-5 fill-red-500 text-red-500" />
            <p className="text-sm">100</p>
          </div>
          <div className="flex space-x-1 items-center">
            <MessageCircle className="h-5 w-5" />
            <p className="text-sm">100</p>
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
          {username} &nbsp;
          <span className="text-sm font-medium">too cool for this app</span>
        </p>
        <p className="px-4 pt-1 text-muted-foreground text-sm">
          View all 24 comments
        </p>
        <div className="flex px-3 items-center">
          <Image
            src={`https://aggregator-devnet.walrus.space/v1/${image}`}
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
