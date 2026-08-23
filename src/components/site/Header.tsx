"use client";
import Link from "next/link";
import { useState } from "react";
import { Logo } from "./Logo";
import { Bag, Heart, Menu, Search, User, ChevronDown, Close } from "@/components/ui/Icons";
import { useCart, useUI, useWishlist } from "@/lib/store";
import { cn } from "@/lib/cn";
import { CartDrawer } from "./CartDrawer";
import { SearchOverlay } from "./SearchOverlay";
import { useHydrated } from "@/lib/hydrated";

const NAV = [
  { label: "Shop", href: "/shop", submenu: ["Best Sellers", "New Arrivals", "Floral", "Luxury", "Minimal"] },
  { label: "Collections", href: "/collections" },
  { label: "About", href: "/about" },
  { label: "Gifting", href: "/gifting" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const hydrated = useHydrated();
  const cartCount = useCart((s) => s.items.reduce((n, i) => n + i.qty, 0));
  const wishCount = useWishlist((s) => s.ids.length);
  const displayCart = hydrated ? cartCount : 0;
  const displayWish = hydrated ? wishCount : 0;
  const { setCartOpen, setSearchOpen, menuOpen, setMenuOpen } = useUI();
  const [dropdown, setDropdown] = useState<string | null>(null);

  return (
    <>
      <header className="sticky top-0 z-40 border-b hairline bg-[color:var(--color-mist)]/85 backdrop-blur">
        <div className="container-page flex h-16 items-center justify-between lg:h-20">
          <button
            className="grid h-9 w-9 place-items-center rounded-full text-cocoa-500 hover:bg-cocoa-500/5 lg:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu />
          </button>

          <Logo />

          <nav className="hidden lg:flex" onMouseLeave={() => setDropdown(null)}>
            <ul className="flex items-center gap-8 text-[13px] tracking-widish uppercase text-cocoa-500">
              {NAV.map((n) => (
                <li key={n.label} className="relative" onMouseEnter={() => setDropdown(n.submenu ? n.label : null)}>
                  <Link href={n.href} className="inline-flex items-center gap-1 py-3 hover:text-cocoa-700">
                    {n.label}
                    {n.submenu && <ChevronDown className="h-3 w-3" />}
                  </Link>
                  {n.submenu && dropdown === n.label && (
                    <div className="absolute left-1/2 top-full w-48 -translate-x-1/2 rounded-xl border hairline bg-white/90 p-3 shadow-soft backdrop-blur">
                      <ul className="space-y-1 text-[12px] normal-case tracking-normal text-cocoa-500">
                        {n.submenu.map((s) => (
                          <li key={s}>
                            <Link
                              href={`/collections/${s.toLowerCase().replace(/\s+/g, "-")}`}
                              className="block rounded-lg px-3 py-2 hover:bg-cocoa-500/5 hover:text-cocoa-700"
                            >
                              {s}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1 text-cocoa-500">
            <button
              onClick={() => setSearchOpen(true)}
              className="grid h-9 w-9 place-items-center rounded-full hover:bg-cocoa-500/5"
              aria-label="Search"
            >
              <Search />
            </button>
            <Link href="/account" aria-label="Account" className="hidden sm:grid h-9 w-9 place-items-center rounded-full hover:bg-cocoa-500/5">
              <User />
            </Link>
            <Link href="/account/wishlist" aria-label="Wishlist" className="relative hidden sm:grid h-9 w-9 place-items-center rounded-full hover:bg-cocoa-500/5">
              <Heart />
              {displayWish > 0 && <Badge n={displayWish} />}
            </Link>
            <button
              onClick={() => setCartOpen(true)}
              aria-label="Cart"
              className="relative grid h-9 w-9 place-items-center rounded-full hover:bg-cocoa-500/5"
            >
              <Bag />
              {displayCart > 0 && <Badge n={displayCart} />}
            </button>
          </div>
        </div>
      </header>

      {menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} />}
      <CartDrawer />
      <SearchOverlay />
    </>
  );
}

function Badge({ n }: { n: number }) {
  return (
    <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-rose-400 px-1 text-[10px] font-medium text-ivory-50">
      {n}
    </span>
  );
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-cocoa-700/40 backdrop-blur-sm" onClick={onClose} />
      <aside className="relative flex h-full w-[86%] max-w-sm flex-col bg-[color:var(--color-mist)] shadow-card animate-fade-up">
        <div className="flex items-center justify-between border-b hairline px-5 py-4">
          <Logo small />
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full hover:bg-cocoa-500/5">
            <Close />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-5 py-6">
          <ul className="space-y-4 text-2xl font-serif text-cocoa-700">
            {NAV.map((n) => (
              <li key={n.label}>
                <Link href={n.href} onClick={onClose} className={cn("block link-underline")}>
                  {n.label}
                </Link>
              </li>
            ))}
            <li className="pt-2 border-t hairline">
              <Link href="/account" onClick={onClose} className="text-base uppercase tracking-widish text-cocoa-500">
                Account
              </Link>
            </li>
            <li>
              <Link href="/account/wishlist" onClick={onClose} className="text-base uppercase tracking-widish text-cocoa-500">
                Wishlist
              </Link>
            </li>
          </ul>
        </nav>
        <div className="border-t hairline px-5 py-4 text-xs text-cocoa-400">
          © White & Wick · Hand-poured in Bengaluru
        </div>
      </aside>
    </div>
  );
}
