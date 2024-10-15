import Image from "next/image";
import Link from "next/link";

import { UserAuthForm } from "./auth";
import { Separator } from "@/components/ui/separator";

export default function SignInSignUp() {
  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <div className="flex space-x-3 items-end justify-center">
          <Image src={"/logo.png"} width={60} height={60} alt="Logo" />
          <p className="font-semibold text-2xl mb-2">SocioBerries</p>
        </div>
        <div className="flex justify-center">
          <Separator className="w-[85%]" />
        </div>
        <p className="text-muted-foreground font-medium text-sm">
          Connecting Influencers and Businesses for the good.
        </p>
      </div>
      <UserAuthForm />
      <p className="px-8 text-center text-sm text-muted-foreground">
        By using our app, you agree to our{" "}
        <Link
          href="/terms"
          className="underline underline-offset-4 hover:text-primary"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          className="underline underline-offset-4 hover:text-primary"
        >
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
