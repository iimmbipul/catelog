"use client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { setEnquiryStatusAction } from "./actions";
import type { GiftEnquiry } from "@/lib/types";

const STATUSES: GiftEnquiry["status"][] = ["new", "in_progress", "closed"];

export function EnquiryActions({ id, current }: { id: string; current: GiftEnquiry["status"] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <div className="flex flex-wrap gap-2">
      {STATUSES.map((s) => (
        <button
          key={s}
          disabled={pending || current === s}
          onClick={() =>
            start(async () => {
              await setEnquiryStatusAction(id, s);
              router.refresh();
            })
          }
          className={`rounded-full border hairline px-3 py-1.5 text-[11px] uppercase tracking-widish ${
            current === s ? "bg-cocoa-700 text-ivory-50" : "text-cocoa-700 hover:bg-cocoa-500/5"
          }`}
        >
          {s.replace(/_/g, " ")}
        </button>
      ))}
    </div>
  );
}
