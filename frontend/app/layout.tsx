import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { WalletProvider } from "@/components/providers/wallet-provider";
import { WrongNetworkAlert } from "@/components/ui/custom/wrong-network-alert";
import { EnvironmentStoreProvider } from "@/components/context";
import Layout from "@/components/layout";

export const metadata: Metadata = {
  title: "SocioBerries",
  description:
    "SocioBerries is a decentralized social media platform built on the Aptos Blockchain, where businesses and creators collaborate through promotional content.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <WalletProvider>
            <EnvironmentStoreProvider>
              <Toaster />
              <WrongNetworkAlert />
              <Layout>{children}</Layout>
            </EnvironmentStoreProvider>
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
