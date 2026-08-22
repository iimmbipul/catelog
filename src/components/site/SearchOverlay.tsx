"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useUI } from "@/lib/store";
import { Close, Search } from "@/components/ui/Icons";
import { money } from "@/lib/format";
import type { Product } from "@/lib/types";

export function SearchOverlay({ initialProducts }: { initialProducts?: Product[] } = {}) {
  const { searchOpen, setSearchOpen } = useUI();
  const [q, setQ] = useState("");
  const [products, setProducts] = useState<Product[]>(initialProducts ?? []);

  useEffect(() => {
    if (!searchOpen || products.length) return;
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => setProducts(d.products ?? []));
  }, [searchOpen, products.length]);

  const results = useMemo(() => {
    if (!q.trim()) return products.slice(0, 6);
    const lc = q.toLowerCase();
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(lc) ||
          p.fragrance.toLowerCase().includes(lc) ||
          p.category.toLowerCase().includes(lc) ||
          p.tags.some((t) => t.toLowerCase().includes(lc)),
      )
      .slice(0, 8);
  }, [q, products]);

  if (!searchOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-cocoa-700/50 backdrop-blur" onClick={() => setSearchOpen(false)} />
      <div className="relative mx-auto mt-16 max-w-3xl px-4">
        <div className="rounded-3xl bg-[color:var(--color-mist)] shadow-card overflow-hidden">
          <div className="flex items-center gap-3 border-b hairline px-6 py-4">
            <Search className="text-cocoa-500" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search candles, fragrances, gifts…"
              className="flex-1 bg-transparent text-lg placeholder:text-cocoa-400 focus:outline-none font-serif"
            />
            <button
              onClick={() => setSearchOpen(false)}
              className="grid h-9 w-9 place-items-center rounded-full hover:bg-cocoa-500/5"
              aria-label="Close search"
            >
              <Close />
            </button>
          </div>
          <div className="max-h-[60vh] overflow-y-auto admin-scroll">
            {results.length === 0 ? (
              <p className="px-6 py-10 text-center text-sm text-cocoa-400">No candles match “{q}”.</p>
            ) : (
              <ul className="divide-y hairline">
                {results.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/product/${p.slug}`}
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center gap-4 px-6 py-3 hover:bg-cocoa-500/5"
                    >
                      <div className="relative h-14 w-12 flex-none overflow-hidden rounded-lg bg-ivory-100">
                        <Image src={p.images[0]?.url} alt={p.name} fill className="object-cover" sizes="48px" />
                      </div>
                      <div className="flex-1">
                        <p className="font-serif text-lg text-cocoa-700">{p.name}</p>
                        <p className="text-xs text-cocoa-400">{p.fragrance}</p>
                      </div>
                      <span className="text-sm text-cocoa-500">{money(p.price)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
