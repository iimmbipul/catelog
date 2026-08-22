"use client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { Settings } from "@/lib/types";
import { saveHomepageAction } from "./actions";

export function HomepageForm({ settings }: { settings: Settings }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        start(async () => {
          await saveHomepageAction(fd);
          router.refresh();
        });
      }}
      className="grid gap-6 lg:grid-cols-2"
    >
      <div className="lg:col-span-2">
        <label className="eyebrow">Announcement bar</label>
        <input name="announcementBar" defaultValue={settings.announcementBar} className="mt-2 w-full rounded-xl border hairline bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-cocoa-500" />
      </div>

      <div className="lg:col-span-2">
        <label className="eyebrow">Hero heading (line breaks with \n)</label>
        <textarea name="heroHeading" rows={2} defaultValue={settings.homepage.heroHeading} className="mt-2 w-full rounded-xl border hairline bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-cocoa-500" />
      </div>

      <div className="lg:col-span-2">
        <label className="eyebrow">Hero sub-heading</label>
        <textarea name="heroSubheading" rows={3} defaultValue={settings.homepage.heroSubheading} className="mt-2 w-full rounded-xl border hairline bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-cocoa-500" />
      </div>

      <div className="lg:col-span-2">
        <label className="eyebrow">Hero image URL</label>
        <input name="heroImage" defaultValue={settings.homepage.heroImage} className="mt-2 w-full rounded-xl border hairline bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-cocoa-500" />
      </div>

      <div>
        <label className="eyebrow">Primary CTA label</label>
        <input name="heroCtaLabel" defaultValue={settings.homepage.heroCtaLabel} className="mt-2 w-full rounded-xl border hairline bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-cocoa-500" />
      </div>
      <div>
        <label className="eyebrow">Primary CTA link</label>
        <input name="heroCtaHref" defaultValue={settings.homepage.heroCtaHref} className="mt-2 w-full rounded-xl border hairline bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-cocoa-500" />
      </div>
      <div>
        <label className="eyebrow">Secondary CTA label</label>
        <input name="secondaryCtaLabel" defaultValue={settings.homepage.secondaryCtaLabel} className="mt-2 w-full rounded-xl border hairline bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-cocoa-500" />
      </div>
      <div>
        <label className="eyebrow">Secondary CTA link</label>
        <input name="secondaryCtaHref" defaultValue={settings.homepage.secondaryCtaHref} className="mt-2 w-full rounded-xl border hairline bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-cocoa-500" />
      </div>

      <div className="lg:col-span-2">
        <button disabled={pending} className="rounded-full bg-cocoa-700 px-8 py-3 text-sm uppercase tracking-widish text-ivory-50 hover:bg-cocoa-500 disabled:opacity-50">
          {pending ? "Saving…" : "Save homepage"}
        </button>
      </div>
    </form>
  );
}
