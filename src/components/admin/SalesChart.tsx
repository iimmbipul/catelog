"use client";
import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { money } from "@/lib/format";

type Range = "7d" | "30d" | "12m";

function makeData(range: Range) {
  const n = range === "7d" ? 7 : range === "30d" ? 30 : 12;
  const seed = 34;
  return Array.from({ length: n }).map((_, i) => {
    const base = range === "12m" ? 42000 : 4200;
    const noise = Math.sin((i + seed) * 1.7) * (range === "12m" ? 22000 : 2400);
    const trend = (i / n) * (range === "12m" ? 20000 : 2400);
    const value = Math.max(500, Math.round(base + noise + trend));
    return { i, value };
  });
}

export function SalesChart() {
  const [range, setRange] = useState<Range>("30d");
  const data = useMemo(() => makeData(range), [range]);
  const max = Math.max(...data.map((d) => d.value));
  const total = data.reduce((s, d) => s + d.value, 0);
  const yearAgo = Math.round(total * 0.82);
  const growth = Math.round(((total - yearAgo) / yearAgo) * 100);

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - (d.value / max) * 88 - 4;
    return `${x},${y}`;
  });
  const line = `M ${points.join(" L ")}`;
  const area = `${line} L 100,100 L 0,100 Z`;

  return (
    <div className="rounded-2xl border hairline bg-white p-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">Revenue</p>
          <p className="mt-2 font-serif text-3xl text-cocoa-700">{money(total)}</p>
          <p className="mt-1 text-xs text-sage-300">↗ {growth}% vs previous period</p>
        </div>
        <div className="inline-flex rounded-full border hairline p-0.5 text-[11px] uppercase tracking-widish">
          {(["7d", "30d", "12m"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={cn(
                "rounded-full px-3 py-1.5",
                range === r ? "bg-cocoa-700 text-ivory-50" : "text-cocoa-500 hover:text-cocoa-700",
              )}
            >
              {r === "7d" ? "7 days" : r === "30d" ? "30 days" : "12 months"}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 h-56 w-full">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
          <defs>
            <linearGradient id="wwLine" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="rgba(58,47,36,0.35)" />
              <stop offset="100%" stopColor="rgba(58,47,36,0)" />
            </linearGradient>
          </defs>
          <path d={area} fill="url(#wwLine)" />
          <path d={line} fill="none" stroke="#3a2f24" strokeWidth={0.6} vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
    </div>
  );
}
