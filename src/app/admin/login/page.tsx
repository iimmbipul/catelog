import { redirect } from "next/navigation";

/* Keeps the old /admin/login URL working — just forwards to the Clerk-hosted
 * sign-in page. After sign-in, Clerk routes the user back to /admin. */
export default function AdminLoginRedirect() {
  redirect("/sign-in?redirect_url=/admin");
}
