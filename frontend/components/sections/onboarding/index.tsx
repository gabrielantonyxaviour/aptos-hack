import { Metadata } from "next";

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import NewUser from "./new-user";
import SignInSignUp from "./sign-in-sign-up";
import { useEffect } from "react";
import { useEnvironmentStore } from "@/components/context";
import Loading from "@/components/loading";
import { usePathname } from "next/navigation";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

export default function OnboardingPage() {
  const { connected, account, isLoading } = useWallet();
  const { hasProfile } = useEnvironmentStore((store) => store);
  const pathName = usePathname();
  useEffect(() => {
    if (pathName == "/" && hasProfile == 1) {
      window.location.href = "/home";
    }
  }, [pathName, account]);

  return (
    <>
      <div className="lg:p-8 max-w-[1000px] mx-auto flex flex-col justify-center items-center h-screen">
        {hasProfile == 0 || isLoading ? (
          <Loading />
        ) : connected ? (
          hasProfile == 1 ? (
            <></>
          ) : (
            <NewUser />
          )
        ) : (
          <SignInSignUp />
        )}
      </div>
    </>
  );
}
