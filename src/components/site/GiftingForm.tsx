"use client";
import { useState } from "react";
import { submitGiftEnquiry } from "@/app/(site)/gifting/actions";

const OCCASIONS = ["Wedding", "Anniversary", "Birthday", "Corporate", "Rakhi", "Housewarming", "Just because"];

export function GiftingForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const fd = new FormData(e.currentTarget);
    try {
      await submitGiftEnquiry({
        name: String(fd.get("name")),
        email: String(fd.get("email")),
        phone: String(fd.get("phone")),
        occasion: String(fd.get("occasion")),
        budget: String(fd.get("budget")),
        quantity: String(fd.get("quantity")),
        fragrance: String(fd.get("fragrance") ?? ""),
        candle: String(fd.get("candle") ?? ""),
        message: String(fd.get("message") ?? ""),
        additional: String(fd.get("additional") ?? ""),
      });
      setState("sent");
      (e.target as HTMLFormElement).reset();
    } catch {
      setState("error");
    }
  }

  if (state === "sent")
    return (
      <div className="rounded-3xl border hairline bg-ivory-50 p-10 text-center">
        <p className="eyebrow">Received</p>
        <h3 className="mt-3 font-serif text-3xl text-cocoa-700">Thank you — we&apos;ll be in touch.</h3>
        <p className="mt-3 text-sm text-cocoa-500">You&apos;ll hear from us within a working day with a proposal and photos.</p>
        <button onClick={() => setState("idle")} className="mt-6 rounded-full border border-cocoa-700 px-6 py-3 text-xs uppercase tracking-widish text-cocoa-700">
          Send another enquiry
        </button>
      </div>
    );

  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-3xl border hairline bg-ivory-50 p-6 md:p-10">
      <div className="grid gap-4 md:grid-cols-2">
        <Input name="name" label="Your name" required />
        <Input name="email" type="email" label="Email" required />
        <Input name="phone" label="Phone" required />
        <div>
          <label className="eyebrow">Occasion</label>
          <select name="occasion" required className="mt-2 w-full rounded-xl border hairline bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-cocoa-500">
            {OCCASIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <Input name="budget" label="Budget per hamper" placeholder="₹" />
        <Input name="quantity" label="Number of hampers" />
        <Input name="fragrance" label="Preferred fragrances" placeholder="Rose, Vanilla, Amber…" />
        <Input name="candle" label="Preferred candles" placeholder="Rose Bloom + Amber Dusk…" />
      </div>
      <Textarea name="message" label="Custom message on card" placeholder="A short note to appear on the card." rows={2} />
      <Textarea name="additional" label="Additional requirements" placeholder="Custom labels, delivery city, timeline…" rows={3} />
      <div>
        <label className="eyebrow">Reference image (optional)</label>
        <div className="mt-2 flex items-center gap-3 rounded-xl border border-dashed hairline p-4 text-sm text-cocoa-400">
          <button type="button" className="rounded-full border hairline bg-white px-4 py-1.5 text-xs uppercase tracking-widish text-cocoa-700">
            Upload
          </button>
          <span>PNG, JPG up to 5 MB — image upload is handled by the storage provider (Supabase / S3 hookup).</span>
        </div>
      </div>
      <button
        disabled={state === "sending"}
        className="mt-4 rounded-full bg-cocoa-700 px-8 py-4 text-sm uppercase tracking-widish text-ivory-50 hover:bg-cocoa-500 disabled:opacity-50"
      >
        {state === "sending" ? "Sending…" : "Send enquiry"}
      </button>
      {state === "error" && <p className="text-sm text-rose-500">Something went wrong — please try again.</p>}
    </form>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, ...rest } = props;
  return (
    <div>
      <label className="eyebrow">{label}</label>
      <input {...rest} className="mt-2 w-full rounded-xl border hairline bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-cocoa-500" />
    </div>
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  const { label, ...rest } = props;
  return (
    <div>
      <label className="eyebrow">{label}</label>
      <textarea {...rest} className="mt-2 w-full rounded-xl border hairline bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-cocoa-500" />
    </div>
  );
}
