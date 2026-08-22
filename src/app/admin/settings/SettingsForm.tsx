"use client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { Settings } from "@/lib/types";
import { saveSettingsAction } from "./actions";

export function SettingsForm({ settings }: { settings: Settings }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        start(async () => { await saveSettingsAction(fd); router.refresh(); });
      }}
      className="grid gap-5"
    >
      <div>
        <label className="eyebrow">Announcement bar text</label>
        <input name="announcementBar" defaultValue={settings.announcementBar} className="mt-2 w-full rounded-xl border hairline bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-cocoa-500" />
      </div>
      <div>
        <label className="eyebrow">Free shipping above (₹)</label>
        <input name="freeShippingAbove" type="number" defaultValue={settings.freeShippingAbove} className="mt-2 w-full rounded-xl border hairline bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-cocoa-500" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Field name="email" label="Contact email" defaultValue={settings.contact.email} />
        <Field name="phone" label="Contact phone" defaultValue={settings.contact.phone} />
        <Field name="address" label="Studio address" defaultValue={settings.contact.address} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field name="instagram" label="Instagram URL" defaultValue={settings.socials.instagram} />
        <Field name="whatsapp" label="WhatsApp URL" defaultValue={settings.socials.whatsapp} />
        <Field name="pinterest" label="Pinterest URL" defaultValue={settings.socials.pinterest} />
        <Field name="facebook" label="Facebook URL" defaultValue={settings.socials.facebook} />
      </div>

      <button disabled={pending} className="mt-2 rounded-full bg-cocoa-700 px-8 py-3 text-sm uppercase tracking-widish text-ivory-50 hover:bg-cocoa-500 disabled:opacity-50">
        {pending ? "Saving…" : "Save settings"}
      </button>
    </form>
  );
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, ...rest } = props;
  return (
    <div>
      <label className="eyebrow">{label}</label>
      <input {...rest} className="mt-2 w-full rounded-xl border hairline bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-cocoa-500" />
    </div>
  );
}
