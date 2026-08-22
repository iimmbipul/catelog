"use client";
import { useState } from "react";
import { ChevronDown } from "@/components/ui/Icons";
import { cn } from "@/lib/cn";
import type { FAQ } from "@/lib/types";

export function FaqAccordion({ faqs }: { faqs: FAQ[] }) {
  const [open, setOpen] = useState<string | null>(faqs[0]?.id ?? null);
  return (
    <ul className="divide-y hairline rounded-3xl border hairline bg-ivory-50">
      {faqs.map((f) => (
        <li key={f.id}>
          <button
            onClick={() => setOpen(open === f.id ? null : f.id)}
            className="flex w-full items-center justify-between px-6 py-5 text-left"
          >
            <span className="font-serif text-lg text-cocoa-700">{f.question}</span>
            <ChevronDown className={cn("transition-transform", open === f.id && "rotate-180")} />
          </button>
          {open === f.id && (
            <div className="px-6 pb-6 text-sm text-cocoa-500 max-w-2xl">{f.answer}</div>
          )}
        </li>
      ))}
    </ul>
  );
}
