"use client";

import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import {
  LogIn,
  LogOut,
  User as UserIcon,
  Settings,
  Moon,
  Sun,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/DropdownMenu";
import { Button } from "@/components/ui/Button";
import { useTheme } from "next-themes";
import { useState } from "react";
import { toast } from "sonner";
import Spinner from "./ui/Spinner";

const SignInOutButton = () => {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut({
        redirect: true,
        callbackUrl: '/'
      });
      toast.success("Signed Out", {
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      console.log("Sign Out Failed", error)
      toast.error("Sign Out Failed", {
        description: "Unable to sign out. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) {
    return (
      <Button
        variant="outline"
        onClick={() => signIn()}
        disabled={isLoading}
        className="flex items-center gap-2"
      >
        <LogIn className="w-6 h-6" />
        Sign In
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="rounded-full p-0 w-10 h-10">
          {session.user?.image ? (
            <Image
              src={session.user.image}
              alt="User profile"
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <UserIcon className="ml-2 w-5 h-5" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="p-4 bg-white dark:bg-gray-900 text-black dark:text-white">
        <DropdownMenuLabel>
          <div className="flex items-center space-x-2">
            {session.user?.image && (
              <Image
                src={session.user.image}
                alt="User profile"
                width={32}
                height={32}
                className="rounded-full"
              />
            )}
            <div>
              <p className="text-sm font-medium">{session.user?.name}</p>
              <p className="text-xs text-muted-foreground">{session.user?.email}</p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => setTheme(theme => theme === 'light' ? 'dark' : 'light')}
          className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          {theme === 'dark' ? (
            <Sun className="mr-2 h-4 w-4" />
          ) : (
            <Moon className="mr-2 h-4 w-4" />
          )}
          <span>
            {theme === 'dark' ? 'Light Mode' :
              theme === 'system' ? 'System Mode' :
                'Dark Mode'}
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {/* Navigate to profile/settings */ }}
          className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleSignOut}
          className="cursor-pointer text-destructive focus:text-destructive hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          {isLoading ? (
            <Spinner />
          ) : (
            <>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};


export default SignInOutButton;