// components/NavBar
'use client'

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation"; // Import usePathname

import home from "@/assets/home.svg";
import feed from "@/assets/feed.svg";
import search from "@/assets/search.svg";
import profile from "@/assets/profile.svg";
import notifs from "@/assets/notifications.svg";

const NavBar: React.FC = () => {
  const pathname = usePathname(); // Get the current pathname using usePathname

  return (
    <aside className="bg-trade-green fixed bottom-0 left-0 w-full pb-6">
      <nav className="flex justify-around p-4">
        <Link href="/">
          <Image
            src={home}
            alt="Home"
            width={24}
            height={24}
            className="fill-current"
            style={{ opacity: pathname === "/" ? 1 : 0.6 }}
          />
        </Link>
        <Link href="/feed">
          <Image
            src={feed}
            alt="Feed"
            width={24}
            height={24}
            className="fill-current"
            style={{ opacity: pathname === "/feed" ? 1 : 0.6 }}
          />
        </Link>
        <Link href="/search">
          <Image
            src={search}
            alt="Search"
            width={24}
            height={24}
            className="fill-current"
            style={{ opacity: pathname === "/search" ? 1 : 0.6 }}
          />
        </Link>
        <Link href="/profile">
          <Image
            src={profile}
            alt="Profile"
            width={24}
            height={24}
            className="fill-current"
            style={{ opacity: pathname === "/profile" ? 1 : 0.6 }}
          />
        </Link>
        <Link href="/notifications">
          <Image
            src={notifs}
            alt="Notifications"
            width={24}
            height={24}
            className="fill-current"
            style={{ opacity: pathname === "/notifications" ? 1 : 0.6 }}
          />
        </Link>
      </nav>
    </aside>
  );
};

export default NavBar;