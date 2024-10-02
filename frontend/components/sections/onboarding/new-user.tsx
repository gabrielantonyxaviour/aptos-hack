import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  APTOS_CONNECT_ACCOUNT_URL,
  isAptosConnectWallet,
  truncateAddress,
  useWallet,
} from "@aptos-labs/wallet-adapter-react";
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { Copy, LogOut, User } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
export default function NewUser() {
  const { account, disconnect, wallet } = useWallet();
  const { toast } = useToast();
  const copyAddress = useCallback(async () => {
    if (!account?.address) return;
    try {
      await navigator.clipboard.writeText(account.address);
      toast({
        title: "Success",
        description: "Copied wallet address to clipboard.",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy wallet address.",
      });
    }
  }, [account?.address, toast]);
  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] lg:w-[450px] xl:w-[550px]">
      <div className="flex justify-between items-center">
        <div className="flex space-x-3 items-end justify-center">
          <Image src={"/logo.png"} width={40} height={40} alt="Logo" />
          <p className="font-semibold text-lg mb-1">SocioBerries</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"secondary"} className="font-semibold">
              {account?.ansName ||
                truncateAddress(account?.address) ||
                "Unknown"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={copyAddress} className="gap-2">
              <Copy className="h-4 w-4" /> Copy address
            </DropdownMenuItem>
            {wallet && isAptosConnectWallet(wallet) && (
              <DropdownMenuItem asChild>
                <a
                  href={APTOS_CONNECT_ACCOUNT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-2"
                >
                  <User className="h-4 w-4" /> Account
                </a>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onSelect={disconnect} className="gap-2">
              <LogOut className="h-4 w-4" /> Disconnect
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <p className="text-lg font-medium text-center">Create Account</p>
      <div className="flex flex-col space-y-2">
        <p className="font-semibold text-sm">User Name</p>
        <Input className="ml-1"></Input>
        <p className="text-xs text-muted-foreground">
          A unique username or id of your profile.
        </p>
      </div>
      <div className="flex flex-col space-y-2">
        <p className="font-semibold text-sm">Display Name</p>
        <Input className="ml-1"></Input>
        <p className="text-xs text-muted-foreground">
          The name that will be displayed on your profile.
        </p>
      </div>
      <p>Bio</p>
      <p>Your Niche</p>
      <p>Preferences</p>
    </div>
  );
}
