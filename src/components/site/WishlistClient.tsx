"use client";
import Link from "next/link";
import { ProductCard } from "./ProductCard";
import { useWishlist } from "@/lib/store";
import type { Product } from "@/lib/types";

export function WishlistClient({ products }: { products: Product[] }) {
  const ids = useWishlist((s) => s.ids);
  const wished = products.filter((p) => ids.includes(p.id));

  if (wished.length === 0)
    return (
      <div className="rounded-3xl border hairline bg-ivory-50 p-16 text-center">
        <p className="font-serif text-2xl text-cocoa-700">No wishlist yet.</p>
        <p className="mt-2 text-sm text-cocoa-500">Tap the heart on any candle to save it here.</p>
        <Link href="/shop" className="mt-6 inline-block rounded-full bg-cocoa-700 px-7 py-3 text-sm uppercase tracking-widish text-ivory-50 hover:bg-cocoa-500">
          Shop candles
        </Link>
      </div>
    );

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
      {wished.map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
