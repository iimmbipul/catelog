"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Card } from "@/components/admin/ui";
import type { InstagramPost } from "@/lib/types";
import { deleteInstagramPostAction, saveInstagramPostAction } from "./actions";

type Mode = { kind: "new" } | { kind: "edit"; post: InstagramPost } | null;

export function InstagramClient({ posts }: { posts: InstagramPost[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [mode, setMode] = useState<Mode>(null);

  const submit = (fd: FormData) => {
    start(async () => {
      await saveInstagramPostAction(fd);
      setMode(null);
      router.refresh();
    });
  };

  const remove = (id: string, image: string) => {
    if (!confirm("Remove this Instagram post from the home page gallery?")) return;
    start(async () => {
      await deleteInstagramPostAction(id);
      router.refresh();
    });
    void image;
  };

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-cocoa-500 max-w-2xl">
          Add up to any number of Instagram posts. The first 6 (by order) show as a grid on
          the home page. Clicking a tile takes visitors to that specific Instagram post URL.
        </p>
        <button
          onClick={() => setMode({ kind: "new" })}
          className="rounded-full bg-cocoa-700 px-5 py-2.5 text-xs uppercase tracking-widish text-ivory-50 hover:bg-cocoa-500"
        >
          + Add post
        </button>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-3xl border hairline bg-ivory-50 p-16 text-center">
          <p className="font-serif text-2xl text-cocoa-700">No Instagram posts yet.</p>
          <p className="mt-2 text-sm text-cocoa-500">
            Click &quot;+ Add post&quot; and paste the image URL + Instagram post URL. The
            @whiteandwick gallery on the home page hides until at least one is added.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <Card key={p.id} className="!p-0 overflow-hidden">
              <div className="relative aspect-square bg-ivory-100">
                <Image src={p.image} alt={p.caption ?? "Instagram post"} fill className="object-cover" sizes="(min-width: 1024px) 33vw, 100vw" />
                <span className="absolute left-2 top-2 rounded-full bg-cocoa-700/85 px-2 py-0.5 text-[10px] uppercase tracking-widish text-ivory-50">
                  #{p.order}
                </span>
              </div>
              <div className="p-4">
                <p className="text-xs text-cocoa-400 break-all">→ {p.link || "(no link set)"}</p>
                {p.caption && <p className="mt-2 text-sm text-cocoa-500">{p.caption}</p>}
                <div className="mt-3 flex items-center gap-3 text-xs uppercase tracking-widish">
                  <button onClick={() => setMode({ kind: "edit", post: p })} className="text-cocoa-700 hover:text-cocoa-500 link-underline">Edit</button>
                  <button
                    disabled={pending}
                    onClick={() => remove(p.id, p.image)}
                    className="text-rose-500 hover:text-cocoa-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {mode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-cocoa-700/40 p-4">
          <div className="w-full max-w-lg rounded-2xl border hairline bg-white p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-2xl text-cocoa-700">
                {mode.kind === "edit" ? "Edit Instagram post" : "New Instagram post"}
              </h3>
              <button onClick={() => setMode(null)} className="text-xs uppercase tracking-widish text-cocoa-500">Close</button>
            </div>
            <PostForm
              initial={mode.kind === "edit" ? mode.post : undefined}
              onSubmit={submit}
              onCancel={() => setMode(null)}
              pending={pending}
              nextOrder={posts.length + 1}
            />
          </div>
        </div>
      )}
    </>
  );
}

function PostForm({
  initial,
  onSubmit,
  onCancel,
  pending,
  nextOrder,
}: {
  initial?: InstagramPost;
  onSubmit: (fd: FormData) => void;
  onCancel: () => void;
  pending: boolean;
  nextOrder: number;
}) {
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit(new FormData(e.currentTarget)); }}
      className="mt-6 grid gap-4"
    >
      {initial && <input type="hidden" name="id" defaultValue={initial.id} />}
      <Field name="image" label="Image URL" required placeholder="https://res.cloudinary.com/..." defaultValue={initial?.image} />
      <Field name="link" label="Instagram post URL" required placeholder="https://www.instagram.com/p/..." defaultValue={initial?.link} />
      <Field name="caption" label="Caption (optional, shown as alt text)" defaultValue={initial?.caption} />
      <Field name="order" label="Order (lower = shown first)" type="number" defaultValue={initial?.order ?? nextOrder} />
      <div className="mt-2 flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="rounded-full border hairline px-4 py-2 text-xs uppercase tracking-widish text-cocoa-700">Cancel</button>
        <button disabled={pending} className="rounded-full bg-cocoa-700 px-5 py-2 text-xs uppercase tracking-widish text-ivory-50 hover:bg-cocoa-500 disabled:opacity-50">
          {pending ? "Saving…" : "Save post"}
        </button>
      </div>
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
