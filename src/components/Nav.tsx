"use client";

import Link from "next/link";
import { SignInButton, Show, UserButton } from "@clerk/nextjs";

export function Nav() {
  return (
    <nav className="gradient-header text-cornsilk shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold hover:opacity-90">
            School Canteen
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/snacks" className="hover:underline font-medium">
              Snacks
            </Link>
            <Link href="/students" className="hover:underline font-medium">
              Students
            </Link>
            <Link href="/students/create" className="hover:underline font-medium">
              Create Student
            </Link>
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="gradient-button text-cornsilk px-4 py-2 rounded-lg font-medium shadow hover:shadow-md transition-all">
                  Login
                </button>
              </SignInButton>
            </Show>
            <Show when="signed-in">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9 ring-2 ring-olive-leaf/60 rounded-full overflow-hidden bg-gradient-to-br from-olive-leaf to-black-forest",
                  },
                  variables: {
                    colorPrimary: "#606c38",
                    colorPrimaryForeground: "#fefae0",
                  },
                }}
              />
            </Show>
          </div>
        </div>
      </div>
    </nav>
  );
}
