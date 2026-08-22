"use client";
import Image from "next/image";
import Link from "next/link";
import { Heart, Bag } from "@/components/ui/Icons";
import { money, pct, computeDiscount } from "@/lib/format";
import type { Product } from "@/lib/types";
import { useCart, useWishlist } from "@/lib/store";
import { cn } from "@/lib/cn";

export function ProductCard({ product, compact }: { product: Product; compact?: boolean }) {
  const add = useCart((s) => s.add);
  const toggle = useWishlist((s) => s.toggle);
  const wished = useWishlist((s) => s.ids.includes(product.id));
  const discount = product.discountPercent ?? computeDiscount(product.mrp, product.price);
  const outOfStock = product.stock <= 0 || product.status === "out_of_stock";

  return (
    <article className={cn("product-card group relative")}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-ivory-100">
        <Link href={`/product/${product.slug}`} className="block h-full w-full">
          <Image
            src={product.images[0]?.url}
            alt={product.images[0]?.alt ?? product.name}
            fill
            className="product-img object-cover"
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          />
        </Link>

        <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between text-[10px] uppercase tracking-widish">
          <div className="pointer-events-auto flex flex-col gap-1.5">
            {product.bestSeller && (
              <span className="rounded-full bg-cocoa-700 px-2.5 py-1 text-ivory-50">Best seller</span>
            )}
            {product.newArrival && (
              <span className="rounded-full bg-ivory-50 px-2.5 py-1 text-cocoa-700 border hairline">New</span>
            )}
            {discount > 0 && (
              <span className="rounded-full bg-rose-400 px-2.5 py-1 text-ivory-50">{pct(discount)} off</span>
            )}
          </div>

          <div className="pointer-events-auto opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={(e) => {
                e.preventDefault();
                toggle(product.id);
              }}
              aria-label="Wishlist"
              className={cn(
                "grid h-8 w-8 place-items-center rounded-full bg-ivory-50 shadow-soft",
                wished ? "text-rose-400" : "text-cocoa-500 hover:text-cocoa-700",
              )}
            >
              <Heart filled={wished} />
            </button>
          </div>
        </div>

        {outOfStock && (
          <div className="absolute inset-0 grid place-items-center bg-ivory-50/80">
            <span className="rounded-full border hairline bg-ivory-50 px-4 py-1.5 text-[11px] uppercase tracking-widish text-cocoa-500">
              Out of stock
            </span>
          </div>
        )}

        {!outOfStock && !compact && (
          <button
            onClick={() =>
              add({
                productId: product.id,
                slug: product.slug,
                name: product.name,
                image: product.images[0]?.url,
                price: product.price,
                mrp: product.mrp,
                qty: 1,
              })
            }
            className="absolute inset-x-3 bottom-3 flex translate-y-2 items-center justify-center gap-2 rounded-full bg-cocoa-700 py-3 text-[11px] uppercase tracking-widish text-ivory-50 opacity-0 shadow-soft transition-all duration-500 ease-expo group-hover:translate-y-0 group-hover:opacity-100"
          >
            <Bag className="h-4 w-4" />
            Add to cart
          </button>
        )}
      </div>

      <div className="mt-4 space-y-1.5">
        <div className="flex items-start justify-between gap-3">
          <Link href={`/product/${product.slug}`} className="font-serif text-lg text-cocoa-700 hover:text-cocoa-500">
            {product.name}
          </Link>
          <div className="text-right">
            <p className="font-serif text-lg text-cocoa-700">{money(product.price)}</p>
            {product.mrp > product.price && (
              <p className="text-xs text-cocoa-400 line-through">{money(product.mrp)}</p>
            )}
          </div>
        </div>
        <p className="text-xs text-cocoa-400">{product.fragrance}</p>
      </div>
    </article>
  );
}
