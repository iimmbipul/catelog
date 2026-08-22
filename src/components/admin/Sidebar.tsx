"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { Logo } from "@/components/site/Logo";

const NAV = [
  { section: "Overview", items: [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/analytics", label: "Analytics" },
  ]},
  { section: "Catalog", items: [
    { href: "/admin/products", label: "Products" },
    { href: "/admin/collections", label: "Collections" },
    { href: "/admin/inventory", label: "Inventory" },
  ]},
  { section: "Sales", items: [
    { href: "/admin/orders", label: "Orders" },
    { href: "/admin/customers", label: "Customers" },
    { href: "/admin/coupons", label: "Coupons & Discounts" },
    { href: "/admin/enquiries", label: "Gift Enquiries" },
  ]},
  { section: "Content", items: [
    { href: "/admin/reviews", label: "Reviews" },
    { href: "/admin/banners", label: "Banners" },
    { href: "/admin/homepage", label: "Homepage" },
    { href: "/admin/faqs", label: "FAQs" },
  ]},
  { section: "System", items: [
    { href: "/admin/settings", label: "Settings" },
  ]},
];

export function AdminSidebar() {
  const path = usePathname();
  if (path?.startsWith("/admin/login")) return null;
  const isActive = (href: string) =>
    href === "/admin" ? path === href : path.startsWith(href);
  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-[240px] flex-col border-r hairline bg-white">
      <div className="border-b hairline px-6 py-5">
        <Logo small />
        <p className="mt-2 eyebrow">Admin</p>
      </div>
      <nav className="flex-1 overflow-y-auto admin-scroll px-3 py-4">
        {NAV.map((sec) => (
          <div key={sec.section} className="mb-6">
            <p className="px-3 eyebrow">{sec.section}</p>
            <ul className="mt-2 space-y-0.5">
              {sec.items.map((it) => (
                <li key={it.href}>
                  <Link
                    href={it.href}
                    className={cn(
                      "block rounded-lg px-3 py-2 text-sm",
                      isActive(it.href) ? "bg-cocoa-700 text-ivory-50" : "text-cocoa-500 hover:bg-cocoa-500/5 hover:text-cocoa-700",
                    )}
                  >
                    {it.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      <div className="border-t hairline p-4 text-xs text-cocoa-400">
        Signed in as <span className="text-cocoa-700">admin</span>
        <form action="/admin/logout" method="post" className="mt-2">
          <button className="text-xs uppercase tracking-widish text-rose-500 hover:text-cocoa-700">Sign out</button>
        </form>
      </div>
    </aside>
  );
}
