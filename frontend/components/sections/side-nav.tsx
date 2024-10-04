import {
  Bell,
  GitGraph,
  Home,
  LineChart,
  Plus,
  Search,
  User,
} from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
export default function SideBar() {
  const pathname = usePathname();
  const router = useRouter();
  const navs = [
    {
      id: 1,
      name: "Home",
      icon: Home,
      href: "/home",
    },
    {
      id: 2,
      name: "Search",
      icon: Search,
      href: "/search",
    },
    {
      id: 3,
      name: "Create",
      icon: Plus,
      href: "/create",
    },
    {
      id: 4,
      name: "Notifications",
      icon: Bell,
      href: "/notifications",
    },
    {
      id: 5,
      name: "Dashboard",
      icon: LineChart,
      href: "/dashboard",
    },
    {
      id: 6,
      name: "Profile",
      icon: User,
      href: "/profile",
    },
  ];

  return (
    <div className="h-full border-r-[1px] border-r-secondary py-4 px-8">
      <div className="flex space-x-4 items-end mb-12">
        <Image src={"/logo.png"} width={40} height={40} alt="Logo" />
        <p className="font-semibold text-xl mb-[1px]">SocioBerries</p>
      </div>
      <div className="flex flex-col space-y-4">
        {navs.map((nav) => (
          <div
            key={nav.id}
            className={`flex items-center gap-4 p-2 cursor-pointer hover:translate-x-2 transition ease-out delay-150  ${
              pathname === nav.href
                ? "text-primary font-semibold "
                : "text-white font-medium"
            }`}
            onClick={() => {
              router.push(nav.href);
            }}
          >
            {pathname === nav.href ? (
              <nav.icon size={24} className="text-primary" />
            ) : (
              <nav.icon size={24} className="text-white" />
            )}
            <p className="">{nav.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
