"use client";
import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/site/Logo";
import { Menu, Close } from "@/components/ui/Icons";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/inventory", label: "Inventory" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/coupons", label: "Coupons" },
  { href: "/admin/collections", label: "Collections" },
  { href: "/admin/enquiries", label: "Gift Enquiries" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/banners", label: "Banners" },
  { href: "/admin/homepage", label: "Homepage" },
  { href: "/admin/about", label: "About page" },
  { href: "/admin/instagram", label: "Instagram gallery" },
  { href: "/admin/faqs", label: "FAQs" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/settings", label: "Settings" },
];

export function MobileTopbar() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="sticky top-0 z-30 flex items-center justify-between border-b hairline bg-white px-5 py-3 lg:hidden">
        <Logo small />
        <button onClick={() => setOpen(true)} className="grid h-9 w-9 place-items-center rounded-full text-cocoa-700 hover:bg-cocoa-500/5">
          <Menu />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-cocoa-700/40" onClick={() => setOpen(false)} />
          <aside className="absolute right-0 top-0 h-full w-[86%] max-w-sm overflow-y-auto bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="eyebrow">Admin</p>
              <button onClick={() => setOpen(false)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-cocoa-500/5">
                <Close />
              </button>
            </div>
            <ul className="mt-6 space-y-1 text-sm">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-cocoa-700 hover:bg-cocoa-500/5">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      )}
    </>
  );
}
