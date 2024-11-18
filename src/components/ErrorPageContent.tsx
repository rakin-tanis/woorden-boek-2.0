"use client"

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ErrorPageContent() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "authenticated") {
    router.push(`/`);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold text-red-500">Authentication Error</h1>
      <p>There was an issue signing in. Please try again.</p>
      <button
        onClick={() => signIn()}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Try Again
      </button>
    </div>
  )
}