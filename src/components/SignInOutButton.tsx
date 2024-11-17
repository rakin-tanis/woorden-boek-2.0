"use client"

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { usePathname } from 'next/navigation';

const isSingInPath = (pathname: string) => {
  return pathname.startsWith('/auth/signIn');
};

const SignInOutButton = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  if (status === "authenticated") {
    return (
      <div className="flex gap-4 ml-auto">
        <p className="dark:text-sky-300 text-sky-900">{session?.user?.name}</p>
        <Image
          className="cursor-pointer"
          src={"/icons/sign-out.svg"}
          onClick={() => signOut()}
          alt="sign out"
          width={20}
          height={20}
        />
      </div>
    );
  } else if (status === "unauthenticated") {
    if (!isSingInPath(pathname)) {
      return (
        <div>
          <Link className="cursor-pointer" href="auth/signIn">
            <Image src={"/icons/login.svg"} alt="sign in" width={20} height={20} />
          </Link>
        </div>
      );
    }
  }
}

export default SignInOutButton
