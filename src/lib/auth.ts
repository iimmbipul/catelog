import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { cache } from "react";

/* White & Wick admin allowlist.
 *
 * Default: only whiteandwick@gmail.com. Override with the ADMIN_EMAILS env
 * var (comma-separated) to grant more people access.
 *
 *   ADMIN_EMAILS="owner@example.com,ops@example.com"
 */
const DEFAULT_ADMIN_EMAILS = ["whiteandwick@gmail.com"];

function allowedEmails(): string[] {
  const raw = (process.env.ADMIN_EMAILS ?? "").trim();
  if (!raw) return DEFAULT_ADMIN_EMAILS.map((e) => e.toLowerCase());
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/* Only a verified address counts. Cached so a layout and page checking during
 * the same render share one Clerk lookup. */
export const isAdmin = cache(async (): Promise<boolean> => {
  const user = await currentUser();
  if (!user) return false;
  const allow = allowedEmails();
  return user.emailAddresses.some(
    (e) => e.verification?.status === "verified" && allow.includes(e.emailAddress.toLowerCase()),
  );
});

/* Must be the first statement of every admin page and server action;
 * scripts/check-admin-guards.mjs fails the build otherwise. The admin layout
 * and proxy.ts are not enough: a page still renders when its layout redirects,
 * server actions run without the layout, and proxy.ts only checks for a session. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/");
}
