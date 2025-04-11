// components/NavBar
'use client'

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import home from "@/assets/home.svg";
import feed from "@/assets/feed.svg";
import search from "@/assets/search.svg";
import profile from "@/assets/profile.svg";
import notifs from "@/assets/notifications.svg";

const NavBar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="bg-trade-green fixed bottom-0 left-0 w-full pb-6">
      <nav className="flex justify-around p-4">
        <Link href="/pages/home">
          <Image
            src={home}
            alt="Home"
            width={32}
            height={32}
            className="fill-current"
            style={{ opacity: pathname === "/pages/home" ? 1 : 0.6 }}
          />
        </Link>
        <Link href="/pages/feed">
          <Image
            src={feed}
            alt="Feed"
            width={32}
            height={32}
            className="fill-current"
            style={{ opacity: pathname === "/pages/feed" ? 1 : 0.6 }}
          />
        </Link>
        <Link href="/pages/search">
          <Image
            src={search}
            alt="Search"
            width={32}
            height={32}
            className="fill-current"
            style={{ opacity: pathname === "/pages/search" ? 1 : 0.6 }}
          />
        </Link>
        <Link href="/pages/profile">
          <Image
            src={profile}
            alt="Profile"
            width={36}
            height={36}
            className="fill-current"
            style={{ opacity: pathname === "/pages/profile" ? 1 : 0.6 }}
          />
        </Link>
        <Link href="/pages/activity">
          <Image
            src={notifs}
            alt="Notifications"
            width={24}
            height={24}
            className="fill-current translate-y-[8px]"
            style={{ opacity: pathname === "/pages/activity" ? 1 : 0.6 }}
          />
        </Link>
      </nav>
    </aside>
  );
};

export default NavBar;