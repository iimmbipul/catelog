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

const RAZORPAY_SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

interface RazorpaySuccess {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  order_id: string;
  prefill?: { name?: string; email?: string; contact?: string };
  notes?: Record<string, string>;
  theme?: { color?: string };
  handler: (response: RazorpaySuccess) => void;
  modal?: { ondismiss?: () => void };
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, cb: (payload: unknown) => void) => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

function loadRazorpayScript(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);
  return new Promise((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${RAZORPAY_SCRIPT_SRC}"]`,
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => resolve(false));
      return;
    }
    const s = document.createElement("script");
    s.src = RAZORPAY_SCRIPT_SRC;
    s.async = true;
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export function CheckoutClient({ coupons }: { coupons: Coupon[] }) {
  const router = useRouter();
  const { items, giftMessage, notes, couponCode, clear } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [payment, setPayment] = useState<"razorpay" | "cod">("razorpay");
  const [error, setError] = useState<string | null>(null);

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const active = coupons.find((c) => c.code === couponCode && c.active);
  const discount = active
    ? active.type === "percent"
      ? Math.min(active.maxDiscount ?? Infinity, Math.round(subtotal * (active.value / 100)))
      : Math.min(active.value, subtotal)
    : 0;
  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 60;
  const total = Math.max(0, subtotal - discount + shipping);

  async function payWithRazorpay(args: {
    orderNumber: string;
    amountPaise: number;
    name: string;
    email: string;
    phone: string;
  }) {
    const publicKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    if (!publicKey) {
      throw new Error("Razorpay public key is not configured.");
    }
    const ok = await loadRazorpayScript();
    if (!ok || !window.Razorpay) {
      throw new Error("Could not load Razorpay checkout. Check your network and retry.");
    }

    const orderRes = await fetch("/api/razorpay/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: args.amountPaise,
        currency: "INR",
        receipt: args.orderNumber,
      }),
    });
    if (!orderRes.ok) {
      const data = await orderRes.json().catch(() => ({}));
      throw new Error(data.error || "Failed to start payment.");
    }
    const orderData = (await orderRes.json()) as {
      order_id: string;
      amount: number;
      currency: string;
    };

    return new Promise<void>((resolve, reject) => {
      const Razorpay = window.Razorpay;
      if (!Razorpay) {
        reject(new Error("Razorpay is unavailable."));
        return;
      }
      const rzp = new Razorpay({
        key: publicKey,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "White & Wick",
        description: `Order ${args.orderNumber}`,
        order_id: orderData.order_id,
        prefill: { name: args.name, email: args.email, contact: args.phone },
        notes: { orderNumber: args.orderNumber },
        theme: { color: "#4a352a" },
        handler: async (response) => {
          try {
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...response,
                orderNumber: args.orderNumber,
              }),
            });
            if (!verifyRes.ok) {
              const data = await verifyRes.json().catch(() => ({}));
              reject(new Error(data.error || "Payment could not be verified."));
              return;
            }
            resolve();
          } catch (err) {
            reject(err instanceof Error ? err : new Error("Payment verification failed."));
          }
        },
        modal: {
          ondismiss: () => reject(new Error("Payment cancelled.")),
        },
      });
      rzp.on("payment.failed", (payload: unknown) => {
        const message =
          typeof payload === "object" &&
          payload &&
          "error" in payload &&
          typeof (payload as { error?: { description?: string } }).error?.description === "string"
            ? (payload as { error: { description: string } }).error.description
            : "Payment failed. Please try again.";
        reject(new Error(message));
      });
      rzp.open();
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (items.length === 0) return;
    setError(null);
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
    try {
      const res = await placeOrder({
        items,
        coupon: couponCode,
        giftMessage,
        notes,
        address,
      });
      if (payment === "razorpay") {
        await payWithRazorpay({
          orderNumber: res.orderNumber,
          amountPaise: Math.max(100, Math.round(total * 100)),
          name: address.name,
          email: address.email,
          phone: address.phone,
        });
      }
      clear();
      router.push(`/order/${res.orderNumber}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
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
            <Radio label="Razorpay — UPI, cards, netbanking" hint="You&apos;ll complete payment in a secure modal before your order is confirmed." checked={payment === "razorpay"} onChange={() => setPayment("razorpay")} />
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

        {error && (
          <p className="rounded-2xl bg-rose-50 px-4 py-3 text-xs text-rose-600" role="alert">
            {error}
          </p>
        )}

        <button
          disabled={submitting || items.length === 0}
          className="block w-full rounded-full bg-cocoa-700 py-4 text-center text-sm uppercase tracking-widish text-ivory-50 hover:bg-cocoa-500 disabled:opacity-50"
        >
          {submitting ? (payment === "razorpay" ? "Opening payment…" : "Placing order…") : payment === "razorpay" ? `Pay ${money(total)}` : "Place order"}
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
