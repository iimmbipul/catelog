"use client";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/* Rendered in the account page's signed-out view. The storefront doesn't load
 * Clerk, so a client-side visit can reach the server with an expired session
 * cookie. Once Clerk has loaded and renewed it, re-render with the real session. */
export function SessionRecheck() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) router.refresh();
  }, [isLoaded, isSignedIn, router]);

  return null;
}
