"use client";
import Image from "next/image";
import Link from "next/link";
import { useCart, useUI } from "@/lib/store";
import { money } from "@/lib/format";
import { Close } from "@/components/ui/Icons";

export function CartDrawer() {
  const { cartOpen, setCartOpen } = useUI();
  const { items, remove, setQty } = useCart();
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);

  if (!cartOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-cocoa-700/40 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
      <aside className="relative flex h-full w-full max-w-md flex-col bg-[color:var(--color-mist)] shadow-card">
        <div className="flex items-center justify-between border-b hairline px-6 py-5">
          <h2 className="font-serif text-2xl text-cocoa-700">Your cart</h2>
          <button
            onClick={() => setCartOpen(false)}
            className="grid h-9 w-9 place-items-center rounded-full hover:bg-cocoa-500/5"
            aria-label="Close cart"
          >
            <Close />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="font-serif text-xl text-cocoa-500">Your cart is empty</p>
            <p className="text-sm text-cocoa-400 max-w-xs">
              Add a candle, a hamper, or a little trio — free shipping over ₹999.
            </p>
            <Link
              href="/shop"
              onClick={() => setCartOpen(false)}
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-cocoa-700 px-6 py-3 text-sm uppercase tracking-widish text-ivory-50 hover:bg-cocoa-500"
            >
              Shop candles
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto admin-scroll px-6 py-4">
              <ul className="divide-y hairline">
                {items.map((i) => (
                  <li key={`${i.productId}::${i.fragrance ?? ""}::${i.color ?? ""}`} className="flex gap-4 py-5">
                    <div className="relative h-24 w-20 flex-none overflow-hidden rounded-xl bg-ivory-100">
                      <Image src={i.image} alt={i.name} fill className="object-cover" sizes="80px" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Link
                            href={`/product/${i.slug}`}
                            onClick={() => setCartOpen(false)}
                            className="font-serif text-lg text-cocoa-700"
                          >
                            {i.name}
                          </Link>
                          <p className="mt-1 text-xs text-cocoa-400">
                            {[i.color, i.fragrance].filter(Boolean).join(" · ") || "220g · Soy wax blend"}
                          </p>
                        </div>
                        <button
                          onClick={() => remove(i.productId, i.fragrance, i.color)}
                          className="text-xs uppercase tracking-widish text-cocoa-400 hover:text-cocoa-700"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="inline-flex items-center rounded-full border hairline">
                          <button
                            onClick={() => setQty(i.productId, i.qty - 1, i.fragrance, i.color)}
                            className="h-8 w-8 text-cocoa-500 hover:text-cocoa-700"
                          >
                            −
                          </button>
                          <span className="w-6 text-center text-sm">{i.qty}</span>
                          <button
                            onClick={() => setQty(i.productId, i.qty + 1, i.fragrance, i.color)}
                            className="h-8 w-8 text-cocoa-500 hover:text-cocoa-700"
                          >
                            +
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="font-serif text-lg text-cocoa-700">{money(i.price * i.qty)}</p>
                          {i.mrp > i.price && (
                            <p className="text-xs text-cocoa-400 line-through">{money(i.mrp * i.qty)}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t hairline bg-ivory-50/60 px-6 py-5">
              <div className="mb-3 flex items-center justify-between text-sm text-cocoa-500">
                <span>Subtotal</span>
                <span className="font-serif text-xl text-cocoa-700">{money(subtotal)}</span>
              </div>
              <p className="mb-4 text-xs text-cocoa-400">
                Shipping and taxes calculated at checkout.
              </p>
              <Link
                href="/checkout"
                onClick={() => setCartOpen(false)}
                className="block w-full rounded-full bg-cocoa-700 py-4 text-center text-sm uppercase tracking-widish text-ivory-50 hover:bg-cocoa-500"
              >
                Proceed to checkout
              </Link>
              <Link
                href="/cart"
                onClick={() => setCartOpen(false)}
                className="mt-3 block text-center text-xs uppercase tracking-widish text-cocoa-400 hover:text-cocoa-700"
              >
                View cart
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
