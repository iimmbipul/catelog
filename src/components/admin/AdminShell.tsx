"use client";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "./Sidebar";
import { MobileTopbar } from "./MobileTopbar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const login = path?.startsWith("/admin/login");
  if (login)
    return <>{children}</>;
  return (
    <div className="min-h-screen bg-[color:var(--color-mist)]">
      <AdminSidebar />
      <div className="lg:ml-[240px]">
        <MobileTopbar />
        <main className="mx-auto max-w-[1400px] px-5 py-6 lg:px-10 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
