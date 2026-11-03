import { ClerkProvider } from "@clerk/nextjs";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth";

export const metadata = { title: "Admin", robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Keeps non-admins out of the shell. This does not protect the pages or
  // server actions underneath: each one calls requireAdmin() itself.
  await requireAdmin();
  return (
    <ClerkProvider>
      <AdminShell>{children}</AdminShell>
    </ClerkProvider>
  );
}
