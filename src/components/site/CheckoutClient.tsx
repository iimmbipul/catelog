"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { placeOrder } from "@/app/(site)/checkout/actions";
import { useCart } from "@/lib/store";
import { money } from "@/lib/format";
import type { Coupon } from "@/lib/types";

const INDIAN_STATES = [
  "Andhra Pradesh","Assam","Bihar","Chhattisgarh","Delhi","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Uttar Pradesh","Uttarakhand","West Bengal",
];

export function CheckoutClient({ coupons }: { coupons: Coupon[] }) {
  const router = useRouter();
  const { items, giftMessage, notes, couponCode, clear } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [payment, setPayment] = useState<"razorpay" | "cod">("razorpay");

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const active = coupons.find((c) => c.code === couponCode && c.active);
  const discount = active
    ? active.type === "percent"
      ? Math.min(active.maxDiscount ?? Infinity, Math.round(subtotal * (active.value / 100)))
      : Math.min(active.value, subtotal)
    : 0;
  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 60;
  const total = Math.max(0, subtotal - discount + shipping);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (items.length === 0) return;
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const address = {
      name: String(fd.get("name")),
      email: String(fd.get("email")),
      phone: String(fd.get("phone")),
      line1: String(fd.get("line1")),
      area: String(fd.get("area")),
      city: String(fd.get("city")),
      state: String(fd.get("state")),
      pincode: String(fd.get("pincode")),
    };
    const res = await placeOrder({
      items,
      coupon: couponCode,
      giftMessage,
      notes,
      address,
    });
    clear();
    router.push(`/order/${res.orderNumber}`);
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
      <div className="space-y-8">
        <Fieldset title="Contact">
          <Field name="email" label="Email" type="email" required autoComplete="email" />
          <Field name="phone" label="Mobile number" required autoComplete="tel" />
        </Fieldset>

        <Fieldset title="Shipping address">
          <Field name="name" label="Full name" required autoComplete="name" />
          <Field name="line1" label="Flat / House number, Building" required autoComplete="address-line1" />
          <Field name="area" label="Area / Landmark" required />
          <Field name="city" label="City" required autoComplete="address-level2" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="eyebrow">State</label>
              <select name="state" required className="w-full rounded-xl border hairline bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-cocoa-500">
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <Field name="pincode" label="Pincode" required inputMode="numeric" />
          </div>
        </Fieldset>

        <Fieldset title="Payment">
          <div className="space-y-3">
            <Radio label="Razorpay — UPI, cards, netbanking" hint="You&apos;ll be redirected to complete payment. (API key required — see Settings.)" checked={payment === "razorpay"} onChange={() => setPayment("razorpay")} />
            <Radio label="Cash on delivery" hint="Available on select pincodes." checked={payment === "cod"} onChange={() => setPayment("cod")} />
          </div>
        </Fieldset>
      </div>

      <aside className="lg:sticky lg:top-24 h-max space-y-6 rounded-3xl border hairline bg-ivory-50 p-6">
        <h2 className="font-serif text-xl text-cocoa-700">Order summary</h2>
        <ul className="divide-y hairline">
          {items.map((i) => (
            <li key={`${i.productId}::${i.fragrance ?? ""}::${i.color ?? ""}`} className="flex items-start gap-4 py-4">
              <div className="relative h-16 w-14 flex-none overflow-hidden rounded-lg bg-ivory-100">
                <Image src={i.image} alt={i.name} fill className="object-cover" sizes="56px" />
                <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-cocoa-700 text-[10px] text-ivory-50">
                  {i.qty}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-serif text-base text-cocoa-700">{i.name}</p>
                <p className="text-xs text-cocoa-400">
                  {[i.color, i.fragrance].filter(Boolean).join(" · ") || "220g · Soy wax blend"}
                </p>
              </div>
              <span className="text-sm text-cocoa-700">{money(i.price * i.qty)}</span>
            </li>
          ))}
        </ul>

        <div className="space-y-2 text-sm text-cocoa-500">
          <div className="flex justify-between"><span>Subtotal</span><span className="text-cocoa-700">{money(subtotal)}</span></div>
          {discount > 0 && (
            <div className="flex justify-between text-rose-500"><span>Discount ({couponCode})</span><span>− {money(discount)}</span></div>
          )}
          <div className="flex justify-between"><span>Shipping</span><span className="text-cocoa-700">{shipping === 0 ? "Free" : money(shipping)}</span></div>
          <div className="mt-3 flex items-baseline justify-between border-t hairline pt-4">
            <span className="font-serif text-lg text-cocoa-700">Total</span>
            <span className="font-serif text-2xl text-cocoa-700">{money(total)}</span>
          </div>
        </div>

        <button
          disabled={submitting || items.length === 0}
          className="block w-full rounded-full bg-cocoa-700 py-4 text-center text-sm uppercase tracking-widish text-ivory-50 hover:bg-cocoa-500 disabled:opacity-50"
        >
          {submitting ? "Placing order…" : "Place order"}
        </button>
        <p className="text-center text-[11px] text-cocoa-400">
          By placing this order you agree to our <Link href="/terms" className="link-underline">Terms</Link> and <Link href="/privacy" className="link-underline">Privacy Policy</Link>.
        </p>
      </aside>
    </form>
  );
}

function Fieldset({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border hairline bg-ivory-50 p-6">
      <h2 className="mb-5 font-serif text-xl text-cocoa-700">{title}</h2>
      <div className="grid gap-4">{children}</div>
    </section>
  );
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string; name: string }) {
  const { label, ...rest } = props;
  return (
    <div className="space-y-1.5">
      <label className="eyebrow">{label}</label>
      <input {...rest} className="w-full rounded-xl border hairline bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-cocoa-500" />
    </div>
  );
}

function Radio({ label, hint, checked, onChange }: { label: string; hint?: string; checked: boolean; onChange: () => void }) {
  return (
    <label className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 ${checked ? "border-cocoa-700 bg-white" : "hairline"}`}>
      <input type="radio" checked={checked} onChange={onChange} className="mt-1" />
      <div>
        <p className="text-sm text-cocoa-700">{label}</p>
        {hint && <p className="mt-1 text-xs text-cocoa-400">{hint}</p>}
      </div>
    </label>
  );
}
