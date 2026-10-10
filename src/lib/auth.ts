import { currentUser } from "@clerk/nextjs/server";

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

export async function isAdmin(): Promise<boolean> {
  const user = await currentUser();
  if (!user) return false;
  const allow = allowedEmails();
  const emails = user.emailAddresses.map((e) => e.emailAddress.toLowerCase());
  return emails.some((e) => allow.includes(e));
}
