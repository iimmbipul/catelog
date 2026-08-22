"use client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Card } from "@/components/admin/ui";
import { saveBannerAction } from "./actions";

export function BannerActions() {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  const router = useRouter();
  return (
    <>
      <div className="flex justify-end">
        <button onClick={() => setOpen(true)} className="rounded-full bg-cocoa-700 px-5 py-2.5 text-xs uppercase tracking-widish text-ivory-50 hover:bg-cocoa-500">
          + New banner
        </button>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-cocoa-700/40 p-4">
          <Card className="w-full max-w-lg">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-2xl text-cocoa-700">New banner</h3>
              <button onClick={() => setOpen(false)} className="text-xs uppercase tracking-widish text-cocoa-500">Cancel</button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                start(async () => {
                  await saveBannerAction(fd);
                  setOpen(false);
                  router.refresh();
                });
              }}
              className="mt-6 grid gap-4"
            >
              <Field name="title" label="Title" required />
              <Field name="subtitle" label="Subtitle" />
              <Field name="image" label="Image URL" required placeholder="https://..." />
              <div className="grid grid-cols-2 gap-4">
                <Field name="link" label="Link" defaultValue="/collections/best-sellers" />
                <Field name="cta" label="CTA label" defaultValue="Shop now" />
                <Field name="order" label="Order" type="number" defaultValue={1} />
                <label className="mt-6 flex items-center gap-3 text-sm text-cocoa-700">
                  <input type="checkbox" name="active" defaultChecked /> Active
                </label>
              </div>
              <button disabled={pending} className="mt-2 rounded-full bg-cocoa-700 py-3 text-sm uppercase tracking-widish text-ivory-50 hover:bg-cocoa-500 disabled:opacity-50">
                {pending ? "Saving…" : "Save banner"}
              </button>
            </form>
          </Card>
        </div>
      )}
    </>
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
