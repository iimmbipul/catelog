"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/store";
import { money } from "@/lib/format";
import { Breadcrumbs } from "./Breadcrumbs";
import { Arrow, Close } from "@/components/ui/Icons";
import type { Coupon } from "@/lib/types";

export function CartClient({ coupons, freeShippingAbove }: { coupons: Coupon[]; freeShippingAbove: number }) {
  const { items, setQty, remove, giftMessage, notes, setGiftMessage, setNotes, couponCode, applyCoupon } = useCart();
  const [code, setCode] = useState(couponCode ?? "");
  const [couponMsg, setCouponMsg] = useState<string | null>(null);

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const active = coupons.find((c) => c.code === couponCode && c.active);
  const discount = active
    ? active.type === "percent"
      ? Math.min(active.maxDiscount ?? Infinity, Math.round(subtotal * (active.value / 100)))
      : Math.min(active.value, subtotal)
    : 0;
  const shipping = subtotal >= freeShippingAbove || subtotal === 0 ? 0 : 60;
  const total = Math.max(0, subtotal - discount + shipping);

  const apply = () => {
    const c = coupons.find((x) => x.code.toLowerCase() === code.trim().toLowerCase() && x.active);
    if (!c) {
      setCouponMsg("That code isn’t valid or has expired.");
      applyCoupon(null);
      return;
    }
    if (c.minOrder && subtotal < c.minOrder) {
      setCouponMsg(`Minimum order for this coupon is ${money(c.minOrder)}.`);
      applyCoupon(null);
      return;
    }
    applyCoupon(c.code);
    setCouponMsg(`Coupon “${c.code}” applied.`);
  };

  return (
    <div className="container-page pt-8 lg:pt-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Cart" }]} />
      <h1 className="mt-6 heading-serif text-hero">Your cart</h1>

      {items.length === 0 ? (
        <div className="mt-12 rounded-3xl border hairline bg-ivory-50 p-16 text-center">
          <p className="font-serif text-2xl text-cocoa-700">Nothing here yet.</p>
          <p className="mt-2 text-sm text-cocoa-500">Every White & Wick order is packed by hand — let&apos;s find something you love.</p>
          <Link href="/shop" className="mt-6 inline-flex items-center gap-2 rounded-full bg-cocoa-700 px-7 py-3 text-sm uppercase tracking-widish text-ivory-50 hover:bg-cocoa-500">
            Shop candles <Arrow />
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-4">
            {items.map((i) => (
              <div key={`${i.productId}::${i.fragrance ?? ""}::${i.color ?? ""}`} className="flex gap-5 rounded-2xl border hairline bg-ivory-50 p-4">
                <div className="relative h-32 w-28 flex-none overflow-hidden rounded-xl bg-ivory-100">
                  <Image src={i.image} alt={i.name} fill className="object-cover" sizes="112px" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link href={`/product/${i.slug}`} className="font-serif text-xl text-cocoa-700">{i.name}</Link>
                      <p className="mt-1 text-xs text-cocoa-400">
                        {[i.color, i.fragrance].filter(Boolean).join(" · ") || "220g · Soy wax blend"}
                      </p>
                    </div>
                    <button onClick={() => remove(i.productId, i.fragrance, i.color)} className="grid h-8 w-8 place-items-center rounded-full text-cocoa-400 hover:text-cocoa-700">
                      <Close />
                    </button>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="inline-flex items-center rounded-full border hairline">
                      <button onClick={() => setQty(i.productId, i.qty - 1, i.fragrance, i.color)} className="h-9 w-9 text-cocoa-500 hover:text-cocoa-700">−</button>
                      <span className="w-8 text-center text-sm">{i.qty}</span>
                      <button onClick={() => setQty(i.productId, i.qty + 1, i.fragrance, i.color)} className="h-9 w-9 text-cocoa-500 hover:text-cocoa-700">+</button>
                    </div>
                    <div className="text-right">
                      <p className="font-serif text-xl text-cocoa-700">{money(i.price * i.qty)}</p>
                      {i.mrp > i.price && (
                        <p className="text-xs text-cocoa-400 line-through">{money(i.mrp * i.qty)}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="rounded-2xl border hairline bg-ivory-50 p-5">
              <label className="block eyebrow">Gift message</label>
              <textarea
                value={giftMessage}
                onChange={(e) => setGiftMessage(e.target.value)}
                placeholder="A short note we&apos;ll hand-write on our card."
                rows={3}
                className="mt-3 w-full rounded-xl border hairline bg-transparent p-3 text-sm focus:outline-none focus:border-cocoa-500"
              />
              <label className="mt-5 block eyebrow">Order notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Anything we should know about your order."
                rows={2}
                className="mt-3 w-full rounded-xl border hairline bg-transparent p-3 text-sm focus:outline-none focus:border-cocoa-500"
              />
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 h-max space-y-6 rounded-3xl border hairline bg-ivory-50 p-6">
            <div className="flex justify-between text-sm text-cocoa-500">
              <span>Subtotal</span>
              <span className="text-cocoa-700">{money(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-cocoa-500">
              <span>Discount</span>
              <span className="text-cocoa-700">− {money(discount)}</span>
            </div>
            <div className="flex justify-between text-sm text-cocoa-500">
              <span>Shipping</span>
              <span className="text-cocoa-700">
                {shipping === 0 ? "Free" : money(shipping)}
              </span>
            </div>
            <div className="border-t hairline pt-4 flex justify-between">
              <span className="font-serif text-lg text-cocoa-700">Total</span>
              <span className="font-serif text-2xl text-cocoa-700">{money(total)}</span>
            </div>

            <div>
              <label className="eyebrow">Coupon code</label>
              <div className="mt-2 flex overflow-hidden rounded-full border hairline">
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="WELCOME10"
                  className="flex-1 bg-transparent px-4 py-2.5 text-sm focus:outline-none"
                />
                <button onClick={apply} className="bg-cocoa-700 px-5 text-xs uppercase tracking-widish text-ivory-50 hover:bg-cocoa-500">
                  Apply
                </button>
              </div>
              {couponMsg && <p className="mt-2 text-xs text-cocoa-500">{couponMsg}</p>}
              <p className="mt-3 text-[11px] text-cocoa-400">
                Try WELCOME10 or FIRSTORDER — full list managed by admin.
              </p>
            </div>

            <div className="rounded-xl bg-cocoa-700/5 p-4 text-xs text-cocoa-500">
              Estimated delivery — 3 to 6 business days across India.
            </div>

            <Link href="/checkout" className="block w-full rounded-full bg-cocoa-700 py-4 text-center text-sm uppercase tracking-widish text-ivory-50 hover:bg-cocoa-500">
              Proceed to checkout
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
