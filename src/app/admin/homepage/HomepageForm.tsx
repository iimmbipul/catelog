"use client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { Settings } from "@/lib/types";
import { saveHomepageAction } from "./actions";

export function HomepageForm({ settings }: { settings: Settings }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const story = settings.homepage.story ?? {};
  const gift = settings.homepage.giftingBanner ?? {};

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
      className="grid gap-8"
    >
      <Section title="Announcement bar">
        <Field name="announcementBar" defaultValue={settings.announcementBar} label="Announcement bar text" />
      </Section>

      <Section title="Hero">
        <Textarea name="heroHeading" rows={2} defaultValue={settings.homepage.heroHeading} label="Hero heading (line breaks with \n)" />
        <Textarea name="heroSubheading" rows={3} defaultValue={settings.homepage.heroSubheading} label="Hero sub-heading" />
        <Field name="heroImage" defaultValue={settings.homepage.heroImage} label="Hero image URL (leave blank for illustrated candle scene)" />
        <div className="grid gap-4 md:grid-cols-2">
          <Field name="heroCtaLabel" defaultValue={settings.homepage.heroCtaLabel} label="Primary CTA label" />
          <Field name="heroCtaHref" defaultValue={settings.homepage.heroCtaHref} label="Primary CTA link" />
          <Field name="secondaryCtaLabel" defaultValue={settings.homepage.secondaryCtaLabel} label="Secondary CTA label" />
          <Field name="secondaryCtaHref" defaultValue={settings.homepage.secondaryCtaHref} label="Secondary CTA link" />
        </div>
      </Section>

      <Section title="Our story section" subtitle="Appears after the best sellers.">
        <div className="grid gap-4 md:grid-cols-2">
          <Field name="storyEyebrow" defaultValue={story.eyebrow} label="Eyebrow" placeholder="Our story" />
          <Textarea name="storyHeading" rows={2} defaultValue={story.heading} label="Heading (line breaks with newline)" />
        </div>
        <Textarea name="storyBody1" rows={4} defaultValue={story.body1} label="First paragraph" />
        <Textarea name="storyBody2" rows={3} defaultValue={story.body2} label="Second paragraph (leave blank to hide)" />
        <Field name="storyImage" defaultValue={story.image} label="Image URL (leave blank for the default studio image)" />
        <div className="grid gap-4 md:grid-cols-2">
          <Field name="storyCtaLabel" defaultValue={story.ctaLabel} label="CTA label" placeholder="More about White & Wick" />
          <Field name="storyCtaHref" defaultValue={story.ctaHref} label="CTA link" placeholder="/about" />
        </div>
      </Section>

      <Section title="Gifting banner" subtitle="The dark banner after new arrivals.">
        <div className="grid gap-4 md:grid-cols-2">
          <Field name="giftEyebrow" defaultValue={gift.eyebrow} label="Eyebrow" placeholder="Gifting" />
          <Textarea name="giftHeading" rows={2} defaultValue={gift.heading} label="Heading (line breaks with newline)" />
        </div>
        <Textarea name="giftBody" rows={3} defaultValue={gift.body} label="Body text" />
        <Field name="giftImage" defaultValue={gift.image} label="Image URL (leave blank for the default gifting image)" />
        <div className="grid gap-4 md:grid-cols-2">
          <Field name="giftCtaLabel" defaultValue={gift.ctaLabel} label="CTA label" placeholder="Explore gifting" />
          <Field name="giftCtaHref" defaultValue={gift.ctaHref} label="CTA link" placeholder="/gifting" />
        </div>
      </Section>

      <div className="sticky bottom-2">
        <button
          disabled={pending}
          className="rounded-full bg-cocoa-700 px-8 py-3 text-sm uppercase tracking-widish text-ivory-50 hover:bg-cocoa-500 disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save homepage"}
        </button>
      </div>
    </form>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border hairline bg-ivory-50 p-6">
      <div className="mb-4">
        <p className="eyebrow">{title}</p>
        {subtitle && <p className="mt-1 text-xs text-cocoa-400">{subtitle}</p>}
      </div>
      <div className="grid gap-4">{children}</div>
    </section>
  );
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, ...rest } = props;
  return (
    <div>
      <label className="eyebrow">{label}</label>
      <input
        {...rest}
        className="mt-2 w-full rounded-xl border hairline bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-cocoa-500"
      />
    </div>
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  const { label, ...rest } = props;
  return (
    <div>
      <label className="eyebrow">{label}</label>
      <textarea
        {...rest}
        className="mt-2 w-full rounded-xl border hairline bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-cocoa-500"
      />
    </div>
  );
}
