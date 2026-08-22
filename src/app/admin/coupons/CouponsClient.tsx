"use client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Card } from "@/components/admin/ui";
import { saveCouponAction } from "./actions";

export function CouponsClient() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();

  return (
    <>
      <div className="flex justify-end">
        <button
          onClick={() => setOpen(true)}
          className="rounded-full bg-cocoa-700 px-5 py-2.5 text-xs uppercase tracking-widish text-ivory-50 hover:bg-cocoa-500"
        >
          + New coupon
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-cocoa-700/40 p-4">
          <Card className="w-full max-w-lg">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-2xl text-cocoa-700">New coupon</h3>
              <button onClick={() => setOpen(false)} className="text-xs uppercase tracking-widish text-cocoa-500">Cancel</button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                start(async () => {
                  await saveCouponAction(fd);
                  setOpen(false);
                  router.refresh();
                });
              }}
              className="mt-6 grid gap-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <Field name="code" label="Code" required />
                <div>
                  <label className="eyebrow">Type</label>
                  <select name="type" className="mt-2 w-full rounded-xl border hairline bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-cocoa-500">
                    <option value="percent">Percent off</option>
                    <option value="fixed">Fixed amount</option>
                  </select>
                </div>
                <Field name="value" label="Value" type="number" required />
                <Field name="minOrder" label="Min order (₹)" type="number" />
                <Field name="maxDiscount" label="Max discount (₹)" type="number" />
                <Field name="usageLimit" label="Usage limit" type="number" />
                <Field name="perCustomerLimit" label="Per customer" type="number" />
                <label className="mt-6 flex items-center gap-3 text-sm text-cocoa-700">
                  <input type="checkbox" name="active" defaultChecked />
                  Active
                </label>
              </div>
              <button
                disabled={pending}
                className="mt-2 rounded-full bg-cocoa-700 py-3 text-sm uppercase tracking-widish text-ivory-50 hover:bg-cocoa-500 disabled:opacity-50"
              >
                {pending ? "Saving…" : "Save coupon"}
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
