"use client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { Settings } from "@/lib/types";
import { saveAboutAction } from "./actions";

export function AboutForm({ settings }: { settings: Settings }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const about = settings.about ?? {};

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        start(async () => {
          await saveAboutAction(fd);
          router.refresh();
        });
      }}
      className="grid gap-5"
    >
      <Field name="eyebrow" label="Top eyebrow label" defaultValue={about.eyebrow} placeholder="About White & Wick" />
      <Field name="heading" label="Page headline" defaultValue={about.heading} placeholder="Made slowly, to be lived with." />
      <Textarea name="intro" label="Intro paragraph" rows={3} defaultValue={about.intro} />

      <Field name="image" label="Studio image URL" defaultValue={about.image} placeholder="https://res.cloudinary.com/..." />

      <div className="grid gap-4 md:grid-cols-2">
        <Field name="craftEyebrow" label="Second-section eyebrow" defaultValue={about.craftEyebrow} placeholder="Our craft" />
        <Field name="quoteEyebrow" label="Closing-quote eyebrow" defaultValue={about.quoteEyebrow} placeholder="The house" />
      </div>

      <Textarea
        name="craftBody"
        label="Our craft body (blank line for a paragraph break)"
        rows={8}
        defaultValue={about.craftBody}
      />

      <Textarea
        name="quote"
        label="Closing quote (leave blank to hide the whole quote block)"
        rows={2}
        defaultValue={about.quote}
      />

      <button
        disabled={pending}
        className="mt-2 rounded-full bg-cocoa-700 px-8 py-3 text-sm uppercase tracking-widish text-ivory-50 hover:bg-cocoa-500 disabled:opacity-50"
      >
        {pending ? "Saving…" : "Save About page"}
      </button>
    </form>
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
