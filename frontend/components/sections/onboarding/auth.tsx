"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import {
  APTOS_CONNECT_ACCOUNT_URL,
  AnyAptosWallet,
  AptosPrivacyPolicy,
  WalletItem,
  getAptosConnectWallets,
  isAptosConnectWallet,
  isInstallRequired,
  partitionWallets,
  truncateAddress,
  useWallet,
} from "@aptos-labs/wallet-adapter-react";
interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { wallets = [] } = useWallet();

  const { aptosConnectWallets, otherWallets } = getAptosConnectWallets(wallets);

  const { defaultWallets, moreWallets } = partitionWallets(otherWallets);

  // const wallets = [
  //   {
  //     id: 1,
  //     name: "Petra",
  //     image: "/wallets/petra.jpeg",
  //   },
  //   {
  //     id: 2,
  //     name: "Nightly",
  //     image: "/wallets/nightly.jpg",
  //   },
  //   {
  //     id: 3,
  //     name: "Pontem Wallet",
  //     image: "/wallets/pontem.png",
  //   },
  // ];

  React.useEffect(() => {
    console.log(aptosConnectWallets);
  }, [aptosConnectWallets]);

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <div className="flex flex-col space-y-2">
        {/* <Card className="bg-transparent p-0 mb-2">
          <CardContent className="px-3 py-2 m-0 flex justify-between">
            <div className="flex space-x-3 items-center">
              <Image
                src={"/wallets/petra.jpeg"}
                width={25}
                height={25}
                alt="Logo"
                className="rounded-md"
              />
              <p className="text-sm font-semibold">Pontem</p>
            </div>
            <Button
              variant="ghost"
              size={"sm"}
              disabled={isLoading}
              className="font-semibold"
            >
              Install
            </Button>
          </CardContent>
        </Card> */}

        {defaultWallets.map((wallet) => (
          <WalletRow key={wallet.name} wallet={wallet} onConnect={close} />
        ))}
        {!!moreWallets.length &&
          moreWallets.map((wallet) => (
            <WalletRow key={wallet.name} wallet={wallet} onConnect={close} />
          ))}
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or</span>
        </div>
      </div>
      {aptosConnectWallets.map((wallet) => (
        <AptosConnectWalletRow
          key={wallet.name}
          wallet={wallet}
          onConnect={close}
        />
      ))}
    </div>
  );
}

interface WalletRowProps {
  wallet: AnyAptosWallet;
  onConnect?: () => void;
}

function WalletRow({ wallet, onConnect }: WalletRowProps) {
  return (
    <WalletItem
      wallet={wallet}
      onConnect={onConnect}
      className="flex items-center justify-between px-4 py-3 gap-4 border rounded-md"
    >
      <div className="flex items-center gap-4">
        <WalletItem.Icon className="h-6 w-6" />
        <WalletItem.Name className="text-base font-normal" />
      </div>
      {isInstallRequired(wallet) ? (
        <Button size="sm" variant="ghost" asChild className="font-semibold">
          <WalletItem.InstallLink />
        </Button>
      ) : (
        <WalletItem.ConnectButton asChild>
          <Button size="sm" variant={"secondary"} className="font-semibold">
            Connect
          </Button>
        </WalletItem.ConnectButton>
      )}
    </WalletItem>
  );
}

function AptosConnectWalletRow({ wallet, onConnect }: WalletRowProps) {
  return (
    <WalletItem wallet={wallet} onConnect={onConnect}>
      <WalletItem.ConnectButton asChild>
        <Button size="lg" variant="outline" className="w-full gap-4">
          <WalletItem.Icon className="h-5 w-5" />
          <WalletItem.Name className="text-base font-normal" />
        </Button>
      </WalletItem.ConnectButton>
    </WalletItem>
  );
}
