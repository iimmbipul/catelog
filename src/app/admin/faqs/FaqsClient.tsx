"use client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { FAQ } from "@/lib/types";
import { deleteFaqAction, saveFaqAction } from "./actions";

export function FaqsClient({ faqs }: { faqs: FAQ[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [editing, setEditing] = useState<FAQ | null>(null);
  const [creating, setCreating] = useState(false);

  const save = (fd: FormData) => {
    start(async () => {
      await saveFaqAction(fd);
      setEditing(null);
      setCreating(false);
      router.refresh();
    });
  };

  return (
    <div>
      <div className="flex justify-end">
        <button onClick={() => setCreating(true)} className="rounded-full bg-cocoa-700 px-5 py-2.5 text-xs uppercase tracking-widish text-ivory-50 hover:bg-cocoa-500">
          + New FAQ
        </button>
      </div>

      <ul className="mt-6 divide-y hairline">
        {faqs.map((f) => (
          <li key={f.id} className="py-4">
            {editing?.id === f.id ? (
              <FaqForm faq={f} onSubmit={save} onCancel={() => setEditing(null)} pending={pending} />
            ) : (
              <div>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <p className="font-serif text-lg text-cocoa-700">{f.question}</p>
                  <div className="flex gap-2 text-xs uppercase tracking-widish">
                    <button onClick={() => setEditing(f)} className="text-cocoa-700 hover:text-cocoa-500 link-underline">Edit</button>
                    <button
                      onClick={() => { if (!confirm("Delete this FAQ?")) return; start(async () => { await deleteFaqAction(f.id); router.refresh(); }); }}
                      className="text-rose-500 hover:text-cocoa-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="mt-2 text-sm text-cocoa-500">{f.answer}</p>
                <p className="mt-2 text-xs text-cocoa-400">{f.category ?? "General"} · order {f.order}</p>
              </div>
            )}
          </li>
        ))}
      </ul>

      {creating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-cocoa-700/40 p-4">
          <div className="w-full max-w-lg rounded-2xl border hairline bg-white p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-2xl text-cocoa-700">New FAQ</h3>
              <button onClick={() => setCreating(false)} className="text-xs uppercase tracking-widish text-cocoa-500">Cancel</button>
            </div>
            <div className="mt-6">
              <FaqForm onSubmit={save} onCancel={() => setCreating(false)} pending={pending} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FaqForm({
  faq,
  onSubmit,
  onCancel,
  pending,
}: {
  faq?: FAQ;
  onSubmit: (fd: FormData) => void;
  onCancel: () => void;
  pending: boolean;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(new FormData(e.currentTarget));
      }}
      className="grid gap-3"
    >
      {faq && <input type="hidden" name="id" defaultValue={faq.id} />}
      <input name="question" defaultValue={faq?.question} placeholder="Question" required className="rounded-xl border hairline bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-cocoa-500" />
      <textarea name="answer" rows={3} defaultValue={faq?.answer} placeholder="Answer" required className="rounded-xl border hairline bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-cocoa-500" />
      <div className="grid grid-cols-2 gap-3">
        <input name="category" defaultValue={faq?.category} placeholder="Category" className="rounded-xl border hairline bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-cocoa-500" />
        <input name="order" type="number" defaultValue={faq?.order ?? 1} placeholder="Order" className="rounded-xl border hairline bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-cocoa-500" />
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="rounded-full border hairline px-4 py-2 text-xs uppercase tracking-widish text-cocoa-700">Cancel</button>
        <button disabled={pending} className="rounded-full bg-cocoa-700 px-5 py-2 text-xs uppercase tracking-widish text-ivory-50 hover:bg-cocoa-500 disabled:opacity-50">
          {pending ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );
}
