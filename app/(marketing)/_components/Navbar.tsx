"use client";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { ModeToggle } from "@/components/mode-toggle";
import { SessionProvider, useSession } from "next-auth/react";
import { signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const Navbar = () => {
  const session = useSession();

  return (
    <SessionProvider>
      <div
        className={cn(
          "z-50 fixed top-0 w-full px-5 py-2 flex items-center justify-between bg-white dark:bg-[#161618] transition-all md:py-5"
        )}
      >
        {/* Logo */}
        <div className="flex items-center">
          <Logo />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-x-6 sm:gap-x-4">
          {session.status === "authenticated" ? (
            <div className="flex items-center gap-x-4">
              <span className="hidden sm:block text-gray-700 dark:text-gray-300 font-medium">
                Welcome, {session.data.user?.name}
              </span>
              <button
                onClick={() => signOut()}
                className="px-4 py-2 text-sm font-semibold bg-gray-900 text-white rounded-lg shadow-md 
                           hover:bg-gray-700 transition-all"
              >
                Sign Out
              </button>
              <Link href="/documents">
                <Button className="hidden md:block">Get Jotion</Button>
              </Link>
            </div>
          ) : (
            <div>
              <button
                onClick={() => signIn()}
                className="px-4 py-2 text-sm font-semibold bg-gray-900 text-white rounded-lg shadow-md 
                         hover:bg-gray-700 transition-all"
              >
                Sign In
              </button>
            </div>
          )}

          {/* Mode Toggle */}
          <ModeToggle />
        </div>
      </div>
    </SessionProvider>
  );
};
