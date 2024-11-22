"use client";

import Link from "next/link";
import React from "react";
import SignInOutButton from "./SignInOutButton";
import { useSession } from "next-auth/react";
import { usePathname } from 'next/navigation';
import Image from "next/image";

const Navbar = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  const menuItems = [
    { label: "Home", href: "/", show: pathname !== '/' },
    {
      label: "Admin",
      href: "/admin",
      show: session?.user?.role?.toUpperCase() === "ADMIN" && !getPathRegex('admin').test(pathname),
    },
    {
      label: "Editor",
      href: "/admin",
      show: session?.user?.role?.toUpperCase() === "EDITOR" && !getPathRegex('admin').test(pathname),
    },
  ].filter(item => item.show); // Filter out items that should not be shown

  return (
    <nav aria-label="Main Navigation" className="z-30 px-4 py-3 fixed top-0 w-full bg-white dark:bg-gray-900 shadow-md dark:shadow-gray-700">
      <div className="flex justify-between max-w-7xl m-auto">
        <div className="flex flex-col justify-between items-center md:flex-row md:items-center">
          <div>
            <Link href="/" className="flex gap-1 items-center" aria-label="Homepage">
              <Image src={'/icons/icon.png'} alt="icon" width={50} height={50} className="dark:bg-white dark:rounded-2xl dark:border-2"></Image>
              <span className="ml-2 text-3xl font-medium dark:text-white pt-1.5">
                Woorden Boek
              </span>
            </Link>
          </div>
        </div>
        <div className="w-fit flex flex-row-reverse items-center gap-10">
          <SignInOutButton />
          <div className="flex justify-end gap-4 text-gray-900 dark:text-white mt-2">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                className="pt-2 pb-1 px-4 cursor-pointer border-b-2 hover:border-b-2 border-transparent hover:border-gray-900 dark:hover:border-white transition"
                href={item.href}
                aria-label={`Go to ${item.label}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

const getPathRegex = (path: string) => {
  const escapedPath = path.replace(/[-\/\\^$.*+?()[\]{}|]/g, '\\$&');
  const regexPattern = `^/${escapedPath}(\\?.*)?$`;
  return new RegExp(regexPattern);
}