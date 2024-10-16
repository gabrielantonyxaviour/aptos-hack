"use client";
import SideBar from "@/components/sections/side-nav";
import WalletInfo from "@/components/ui/custom/wallet-info";
import Notification from "@/components/sections/notifications/notification";
import { Separator } from "@/components/ui/separator";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
export default function NotificationsPage() {
  const notifications: any[] = [];
  return (
    <div className="flex h-screen ">
      <SideBar />
      <div className="pt-7 px-7 flex-1 flex justify-center space-x-12">
        <div className="w-[40%]">
          <div className="flex justify-between">
            <p className="font-semibold text-lg">Notifications</p>
            <WalletInfo />
          </div>
          <Separator className="my-4" />
          <ScrollArea className="h-[90vh] mt-4 w-full">
            {notifications.length == 0 ? (
              <p className="text-center text-muted-foreground">
                No notifications yet.
              </p>
            ) : (
              notifications.map((not, idx) => (
                <Notification
                  key={idx}
                  type={not.type}
                  user={not.user.name}
                  image={not.ref.image}
                  url={not.ref.url}
                />
              ))
            )}
            <ScrollBar orientation="vertical" className="ml-4 border-r-card" />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
