"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { ensureStudentForUser } from "@/lib/db";

export function StudentSync() {
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    if (!isSignedIn || !user) return;
    const name = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.emailAddresses[0]?.emailAddress || "User";
    ensureStudentForUser(user.id, name).catch(console.error);
  }, [isSignedIn, user]);

  return null;
}
