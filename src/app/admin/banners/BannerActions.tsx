"use client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Card } from "@/components/admin/ui";
import type { Banner } from "@/lib/types";
import { deleteBannerAction, saveBannerAction } from "./actions";

type Mode = { kind: "new" } | { kind: "edit"; banner: Banner } | null;

export function BannerActions({ banner }: { banner?: Banner } = {}) {
  // If a banner is passed, render inline Edit / Delete controls for that row.
  if (banner) return <RowActions banner={banner} />;
  // Otherwise render the top-of-page "+ New banner" button.
  return <NewBannerButton />;
}

function NewBannerButton() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>(null);
  const [pending, start] = useTransition();

  const submit = (fd: FormData) => {
    start(async () => {
      await saveBannerAction(fd);
      setMode(null);
      router.refresh();
    });
  };

  return (
    <>
      <div className="flex justify-end">
        <button
          onClick={() => setMode({ kind: "new" })}
          className="rounded-full bg-cocoa-700 px-5 py-2.5 text-xs uppercase tracking-widish text-ivory-50 hover:bg-cocoa-500"
        >
          + New banner
        </button>
      </div>
      {mode && (
        <BannerModal
          mode={mode}
          pending={pending}
          onSubmit={submit}
          onClose={() => setMode(null)}
        />
      )}
    </>
  );
}

function RowActions({ banner }: { banner: Banner }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>(null);
  const [pending, start] = useTransition();

  const submit = (fd: FormData) => {
    start(async () => {
      await saveBannerAction(fd);
      setMode(null);
      router.refresh();
    });
  };

  const remove = () => {
    if (!confirm(`Delete banner "${banner.title}"?`)) return;
    start(async () => {
      await deleteBannerAction(banner.id);
      router.refresh();
    });
  };

  return (
    <>
      <div className="flex items-center gap-2 text-xs uppercase tracking-widish">
        <button
          onClick={() => setMode({ kind: "edit", banner })}
          className="text-cocoa-700 hover:text-cocoa-500 link-underline"
        >
          Edit
        </button>
        <button
          onClick={remove}
          disabled={pending}
          className="text-rose-500 hover:text-cocoa-700"
        >
          Delete
        </button>
      </div>
      {mode && (
        <BannerModal
          mode={mode}
          pending={pending}
          onSubmit={submit}
          onClose={() => setMode(null)}
        />
      )}
    </>
  );
}

function BannerModal({
  mode,
  onSubmit,
  onClose,
  pending,
}: {
  mode: Exclude<Mode, null>;
  onSubmit: (fd: FormData) => void;
  onClose: () => void;
  pending: boolean;
}) {
  const initial = mode.kind === "edit" ? mode.banner : undefined;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cocoa-700/40 p-4">
      <Card className="w-full max-w-lg">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-2xl text-cocoa-700">
            {initial ? `Edit banner: ${initial.title}` : "New banner"}
          </h3>
          <button
            onClick={onClose}
            className="text-xs uppercase tracking-widish text-cocoa-500"
          >
            Cancel
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(new FormData(e.currentTarget));
          }}
          className="mt-6 grid gap-4"
        >
          {initial && <input type="hidden" name="id" defaultValue={initial.id} />}
          <Field name="title" label="Title" required defaultValue={initial?.title} />
          <Field name="subtitle" label="Subtitle" defaultValue={initial?.subtitle} />
          <Field
            name="image"
            label="Image URL"
            required
            placeholder="https://..."
            defaultValue={initial?.image}
          />
          <div className="grid grid-cols-2 gap-4">
            <Field name="link" label="Link" defaultValue={initial?.link ?? "/collections/best-sellers"} />
            <Field name="cta" label="CTA label" defaultValue={initial?.cta ?? "Shop now"} />
            <Field name="order" label="Order" type="number" defaultValue={initial?.order ?? 1} />
            <label className="mt-6 flex items-center gap-3 text-sm text-cocoa-700">
              <input
                type="checkbox"
                name="active"
                defaultChecked={initial ? initial.active : true}
              />{" "}
              Active
            </label>
          </div>
          <button
            disabled={pending}
            className="mt-2 rounded-full bg-cocoa-700 py-3 text-sm uppercase tracking-widish text-ivory-50 hover:bg-cocoa-500 disabled:opacity-50"
          >
            {pending ? "Saving…" : "Save banner"}
          </button>
        </form>
      </Card>
    </div>
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
