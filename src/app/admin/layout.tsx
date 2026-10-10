import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { isAdmin } from "@/lib/auth";

export const metadata = { title: "Admin" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Clerk already blocks unauthenticated access via proxy.ts. This second
  // check enforces the email allowlist: any signed-in Clerk user whose
  // primary email isn't in ADMIN_EMAILS (default: whiteandwick@gmail.com)
  // gets bounced back to the storefront.
  const admin = await isAdmin();
  if (!admin) redirect("/");
  return <AdminShell>{children}</AdminShell>;
}
