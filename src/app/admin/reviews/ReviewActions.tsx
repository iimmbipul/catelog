"use client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deleteReviewAction, toggleReviewApprovalAction } from "./actions";

export function ReviewActions({ id, approved }: { id: string; approved: boolean }) {
  const router = useRouter();
  const [pending, start] = useTransition();

  return (
    <div className="flex gap-2 text-xs uppercase tracking-widish">
      <button
        disabled={pending}
        onClick={() => start(async () => { await toggleReviewApprovalAction(id); router.refresh(); })}
        className="rounded-full bg-cocoa-700 px-4 py-2 text-ivory-50 hover:bg-cocoa-500"
      >
        {approved ? "Unapprove" : "Approve"}
      </button>
      <button
        disabled={pending}
        onClick={() => { if (!confirm("Delete this review?")) return; start(async () => { await deleteReviewAction(id); router.refresh(); }); }}
        className="rounded-full border hairline px-4 py-2 text-rose-500 hover:text-cocoa-700"
      >
        Delete
      </button>
    </div>
  );
}
