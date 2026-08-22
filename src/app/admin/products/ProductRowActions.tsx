"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deleteProductAction, duplicateProductAction } from "./actions";

export function ProductRowActions({ id }: { id: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();

  return (
    <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widish">
      <Link href={`/admin/products/${id}`} className="text-cocoa-700 hover:text-cocoa-500 link-underline">Edit</Link>
      <button
        onClick={() =>
          start(async () => {
            const r = await duplicateProductAction(id);
            if (r.ok) router.refresh();
          })
        }
        disabled={pending}
        className="text-cocoa-500 hover:text-cocoa-700"
      >
        Duplicate
      </button>
      <button
        onClick={() => {
          if (!confirm("Delete this product?")) return;
          start(async () => {
            await deleteProductAction(id);
            router.refresh();
          });
        }}
        disabled={pending}
        className="text-rose-500 hover:text-cocoa-700"
      >
        Delete
      </button>
    </div>
  );
}
