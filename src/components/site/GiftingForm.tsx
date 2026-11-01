"use client";
import { useState } from "react";
import { submitGiftEnquiry } from "@/app/(site)/gifting/actions";
import {
  PHONE_COUNTRY_CODE,
  normalizePhone,
  validateEmail,
  validatePhone,
  validateRequired,
} from "@/lib/validation";

const OCCASIONS = ["Wedding", "Anniversary", "Birthday", "Corporate", "Rakhi", "Housewarming", "Just because"];

export function GiftingForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  type Key = "name" | "email" | "phone";
  const [errs, setErrs] = useState<Partial<Record<Key, string>>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "");
    const email = String(fd.get("email") ?? "");
    const phone = String(fd.get("phone") ?? "");
    const next: Partial<Record<Key, string>> = {};
    const n = validateRequired(name, "Your name"); if (n) next.name = n;
    const em = validateEmail(email); if (em) next.email = em;
    const ph = validatePhone(phone); if (ph) next.phone = ph;
    if (Object.keys(next).length > 0) {
      setErrs(next);
      const first = Object.keys(next)[0] as Key;
      (document.querySelector<HTMLInputElement>(`[name="${first}"]`))?.focus();
      return;
    }
    setErrs({});
    setState("sending");
    try {
      await submitGiftEnquiry({
        name,
        email,
        phone: normalizePhone(phone),
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
    <form onSubmit={onSubmit} noValidate className="grid gap-4 rounded-3xl border hairline bg-ivory-50 p-6 md:p-10">
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          name="name"
          label="Your name"
          required
          error={errs.name}
          onBlur={(e) => {
            const err = validateRequired(e.currentTarget.value, "Your name");
            setErrs((p) => ({ ...p, name: err ?? undefined }));
          }}
        />
        <Input
          name="email"
          type="email"
          label="Email"
          required
          error={errs.email}
          onBlur={(e) => {
            const err = validateEmail(e.currentTarget.value);
            setErrs((p) => ({ ...p, email: err ?? undefined }));
          }}
        />
        <PhoneInput
          error={errs.phone}
          onBlur={(e) => {
            const err = validatePhone(e.currentTarget.value);
            setErrs((p) => ({ ...p, phone: err ?? undefined }));
          }}
        />
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

function Input(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  const { label, error, ...rest } = props;
  return (
    <div>
      <label className="eyebrow" htmlFor={props.name}>{label}</label>
      <input
        id={props.name}
        {...rest}
        aria-invalid={!!error}
        className={`mt-2 w-full rounded-xl border bg-transparent px-4 py-3 text-sm focus:outline-none ${
          error ? "border-rose-500 focus:border-rose-500" : "hairline focus:border-cocoa-500"
        }`}
      />
      {error && <p className="mt-1 text-xs text-rose-500" role="alert">{error}</p>}
    </div>
  );
}

function PhoneInput({ error, onBlur }: { error?: string; onBlur: React.FocusEventHandler<HTMLInputElement> }) {
  return (
    <div>
      <label className="eyebrow" htmlFor="phone">Phone</label>
      <div className={`mt-2 flex items-stretch overflow-hidden rounded-xl border ${error ? "border-rose-500" : "hairline"}`}>
        <span className="flex items-center bg-ivory-100 px-3 text-sm text-cocoa-700">{PHONE_COUNTRY_CODE}</span>
        <input
          id="phone"
          name="phone"
          type="tel"
          inputMode="numeric"
          required
          autoComplete="tel-national"
          maxLength={10}
          pattern="[6-9]\d{9}"
          placeholder="98765 43210"
          onBlur={onBlur}
          aria-invalid={!!error}
          className="w-full bg-transparent px-4 py-3 text-sm focus:outline-none"
        />
      </div>
      {error && <p className="mt-1 text-xs text-rose-500" role="alert">{error}</p>}
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
