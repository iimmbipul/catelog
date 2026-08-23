"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Card } from "@/components/admin/ui";
import type { Collection } from "@/lib/types";
import { deleteCollectionAction, saveCollectionAction, toggleCollectionPinAction } from "./actions";

type Mode = { kind: "new-collection" } | { kind: "new-category"; parentSlug?: string } | { kind: "edit"; c: Collection } | null;

export function CollectionsClient({ collections }: { collections: Collection[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [mode, setMode] = useState<Mode>(null);

  const parents = collections.filter((c) => !c.parentSlug);
  const childrenOf = (slug: string) => collections.filter((c) => c.parentSlug === slug);

  const submit = (fd: FormData) => {
    start(async () => {
      await saveCollectionAction(fd);
      setMode(null);
      router.refresh();
    });
  };

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow">Structure</p>
          <p className="mt-1 text-sm text-cocoa-500">
            Top-level <span className="text-cocoa-700">collections</span> (like Gift Sets, Best Sellers) group products.
            Each can have its own <span className="text-cocoa-700">categories</span> (like Birthdays, Weddings) that live underneath it.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setMode({ kind: "new-collection" })}
            className="rounded-full border hairline px-5 py-2.5 text-xs uppercase tracking-widish text-cocoa-700 hover:bg-cocoa-500/5"
          >
            + New collection
          </button>
          <button
            onClick={() => setMode({ kind: "new-category" })}
            className="rounded-full bg-cocoa-700 px-5 py-2.5 text-xs uppercase tracking-widish text-ivory-50 hover:bg-cocoa-500"
          >
            + New category
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {parents.map((p) => (
          <div key={p.id} className="space-y-4">
            <CollectionRow
              c={p}
              onEdit={() => setMode({ kind: "edit", c: p })}
              onDelete={() => {
                if (!confirm(`Delete collection "${p.title}"? Its categories will be detached.`)) return;
                start(async () => { await deleteCollectionAction(p.id); router.refresh(); });
              }}
              pending={pending}
            />
            <div className="ml-6 border-l-2 border-dashed hairline pl-6">
              <div className="mb-3 flex items-center justify-between">
                <p className="eyebrow">Categories in {p.title}</p>
                <button
                  onClick={() => setMode({ kind: "new-category", parentSlug: p.slug })}
                  className="text-xs uppercase tracking-widish text-cocoa-700 link-underline"
                >
                  + Add category
                </button>
              </div>
              {childrenOf(p.slug).length === 0 ? (
                <p className="text-sm text-cocoa-400">No categories yet.</p>
              ) : (
                <div className="grid gap-3">
                  {childrenOf(p.slug).map((child) => (
                    <CollectionRow
                      key={child.id}
                      c={child}
                      compact
                      onEdit={() => setMode({ kind: "edit", c: child })}
                      onDelete={() => {
                        if (!confirm(`Delete category "${child.title}"?`)) return;
                        start(async () => { await deleteCollectionAction(child.id); router.refresh(); });
                      }}
                      pending={pending}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {mode && (
        <Modal onClose={() => setMode(null)}>
          <h3 className="font-serif text-2xl text-cocoa-700">
            {mode.kind === "edit"
              ? `Edit ${mode.c.parentSlug ? "category" : "collection"}: ${mode.c.title}`
              : mode.kind === "new-collection"
              ? "New collection"
              : "New category"}
          </h3>
          <p className="mt-1 text-sm text-cocoa-500">
            {mode.kind === "new-collection" && "A top-level grouping. You can add categories under it after saving."}
            {mode.kind === "new-category" && "A sub-grouping inside a collection (e.g. Birthdays under Gift Sets)."}
          </p>
          <CollectionForm
            mode={mode}
            parents={parents}
            onCancel={() => setMode(null)}
            onSubmit={submit}
            pending={pending}
          />
        </Modal>
      )}
    </>
  );
}

function CollectionRow({
  c,
  compact,
  onEdit,
  onDelete,
  pending,
}: {
  c: Collection;
  compact?: boolean;
  onEdit: () => void;
  onDelete: () => void;
  pending: boolean;
}) {
  const router = useRouter();
  const [pinPending, startPin] = useTransition();
  const isPinned = !!c.pinToHome;
  return (
    <Card className="!p-0 overflow-hidden">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className={`relative flex-none overflow-hidden bg-ivory-100 ${compact ? "h-20 w-32" : "h-28 w-40"}`}>
          <Image src={c.image} alt={c.title} fill className="object-cover" sizes="160px" />
        </div>
        <div className="flex-1 px-4 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <p className={`font-serif text-cocoa-700 ${compact ? "text-lg" : "text-xl"}`}>{c.title}</p>
            {c.featured && (
              <span className="rounded-full bg-cocoa-700 px-2.5 py-0.5 text-[10px] uppercase tracking-widish text-ivory-50">Featured</span>
            )}
            {isPinned && (
              <span className="rounded-full bg-rose-400 px-2.5 py-0.5 text-[10px] uppercase tracking-widish text-ivory-50">Pinned to home</span>
            )}
            <span className={`rounded-full border hairline px-2.5 py-0.5 text-[10px] uppercase tracking-widish ${c.parentSlug ? "text-cocoa-500" : "text-cocoa-700"}`}>
              {c.parentSlug ? "Category" : "Collection"}
            </span>
          </div>
          <p className="mt-1 text-sm text-cocoa-500">{c.subtitle}</p>
          <p className="mt-1 text-xs text-cocoa-400">/{c.slug} · {c.productIds.length} products</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 px-4 py-3 text-xs uppercase tracking-widish">
          <button
            disabled={pinPending}
            onClick={() =>
              startPin(async () => {
                await toggleCollectionPinAction(c.id);
                router.refresh();
              })
            }
            className={`rounded-full px-3 py-1.5 ${
              isPinned
                ? "bg-cocoa-700 text-ivory-50 hover:bg-cocoa-500"
                : "border hairline text-cocoa-700 hover:bg-cocoa-500/5"
            }`}
            title={isPinned ? "Currently featured above Best Sellers on the home page" : "Feature this collection above Best Sellers"}
          >
            {pinPending ? "…" : isPinned ? "Unpin from home" : "Pin to home"}
          </button>
          <Link href={`/collections/${c.slug}`} className="text-cocoa-500 link-underline">View</Link>
          <button onClick={onEdit} className="text-cocoa-700 link-underline">Edit</button>
          <button disabled={pending} onClick={onDelete} className="text-rose-500 hover:text-cocoa-700">Delete</button>
        </div>
      </div>
    </Card>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cocoa-700/40 p-4">
      <div className="relative w-full max-w-lg rounded-2xl border hairline bg-white p-6">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-xs uppercase tracking-widish text-cocoa-500 hover:text-cocoa-700"
        >
          Close
        </button>
        {children}
      </div>
    </div>
  );
}

function CollectionForm({
  mode,
  parents,
  onSubmit,
  onCancel,
  pending,
}: {
  mode: Exclude<Mode, null>;
  parents: Collection[];
  onSubmit: (fd: FormData) => void;
  onCancel: () => void;
  pending: boolean;
}) {
  const initial = mode.kind === "edit" ? mode.c : undefined;
  const isCategory = mode.kind === "new-category" || (mode.kind === "edit" && !!initial?.parentSlug);
  const defaultParent =
    mode.kind === "new-category"
      ? mode.parentSlug ?? parents[0]?.slug ?? "__none"
      : initial?.parentSlug ?? "__none";
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit(new FormData(e.currentTarget)); }}
      className="mt-6 grid gap-3"
    >
      {initial && <input type="hidden" name="id" defaultValue={initial.id} />}
      <Field name="title" label="Title" required defaultValue={initial?.title} />
      <div className="grid grid-cols-2 gap-3">
        <Field name="slug" label="URL slug (auto if blank)" defaultValue={initial?.slug} />
        <div>
          <label className="eyebrow">Parent collection {isCategory && <span className="text-rose-500">*</span>}</label>
          <select
            name="parentSlug"
            defaultValue={defaultParent}
            required={isCategory}
            className="mt-2 w-full rounded-xl border hairline bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-cocoa-500"
          >
            {!isCategory && <option value="__none">— None (top-level collection) —</option>}
            {parents
              .filter((p) => !(initial && p.id === initial.id))
              .map((p) => (
                <option key={p.id} value={p.slug}>{p.title}</option>
              ))}
          </select>
        </div>
      </div>
      <Field name="subtitle" label="Subtitle" defaultValue={initial?.subtitle} />
      <div>
        <label className="eyebrow">Description</label>
        <textarea
          name="description"
          rows={3}
          defaultValue={initial?.description}
          className="mt-2 w-full rounded-xl border hairline bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-cocoa-500"
        />
      </div>
      <Field name="image" label="Image URL (auto if blank)" defaultValue={initial?.image} placeholder="https://..." />
      <label className="mt-2 flex items-center gap-3 text-sm text-cocoa-700">
        <input type="checkbox" name="featured" defaultChecked={initial?.featured} /> Featured (shows in the home &quot;Browse by mood&quot; grid)
      </label>
      <label className="flex items-center gap-3 text-sm text-cocoa-700">
        <input type="checkbox" name="pinToHome" defaultChecked={initial?.pinToHome} /> Pin to home (adds a product carousel above Best Sellers)
      </label>
      <div className="mt-3 flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="rounded-full border hairline px-4 py-2 text-xs uppercase tracking-widish text-cocoa-700">
          Cancel
        </button>
        <button disabled={pending} className="rounded-full bg-cocoa-700 px-5 py-2 text-xs uppercase tracking-widish text-ivory-50 hover:bg-cocoa-500 disabled:opacity-50">
          {pending ? "Saving…" : "Save"}
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
      <input
        {...rest}
        className="mt-2 w-full rounded-xl border hairline bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-cocoa-500"
      />
    </div>
  );
}
