"use client";
import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { money } from "@/lib/format";
import type { Order } from "@/lib/types";

type Range = "7d" | "30d" | "12m";

interface Point {
  label: string;
  value: number;
}

function bucket(orders: Order[], range: Range): Point[] {
  const paid = orders.filter((o) => o.paymentStatus === "paid");
  const now = new Date();
  if (range === "12m") {
    // 12 monthly buckets (this month back 11)
    const buckets: Point[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const label = d.toLocaleString("en-IN", { month: "short" });
      buckets.push({ label, value: 0 });
      for (const o of paid) {
        const od = new Date(o.createdAt);
        if (`${od.getFullYear()}-${od.getMonth()}` === key) {
          buckets[buckets.length - 1].value += o.total;
        }
      }
    }
    return buckets;
  }
  const days = range === "7d" ? 7 : 30;
  const buckets: Point[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    d.setHours(0, 0, 0, 0);
    const key = d.toISOString().slice(0, 10);
    const label = d.toLocaleString("en-IN", { day: "2-digit", month: "short" });
    let value = 0;
    for (const o of paid) {
      if (o.createdAt.slice(0, 10) === key) value += o.total;
    }
    buckets.push({ label, value });
  }
  return buckets;
}

export function SalesChart({ orders }: { orders: Order[] }) {
  const [range, setRange] = useState<Range>("30d");
  const data = useMemo(() => bucket(orders, range), [orders, range]);
  const total = data.reduce((s, d) => s + d.value, 0);
  const max = Math.max(1, ...data.map((d) => d.value));

  // Compare vs the previous same-length period for the delta pill.
  const prevPeriod = useMemo(() => {
    const paid = orders.filter((o) => o.paymentStatus === "paid");
    const now = new Date();
    const spanDays = range === "12m" ? 365 : range === "30d" ? 30 : 7;
    const start = new Date(now);
    start.setDate(now.getDate() - spanDays * 2);
    const mid = new Date(now);
    mid.setDate(now.getDate() - spanDays);
    let sum = 0;
    for (const o of paid) {
      const d = new Date(o.createdAt);
      if (d >= start && d < mid) sum += o.total;
    }
    return sum;
  }, [orders, range]);

  const delta = prevPeriod === 0 ? null : Math.round(((total - prevPeriod) / prevPeriod) * 100);

  const line = data
    .map((d, i) => {
      const x = (i / Math.max(1, data.length - 1)) * 100;
      const y = 100 - (d.value / max) * 88 - 4;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" L ");
  const path = `M ${line}`;
  const area = `${path} L 100,100 L 0,100 Z`;

  return (
    <div className="rounded-2xl border hairline bg-white p-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">Revenue</p>
          <p className="mt-2 font-serif text-3xl text-cocoa-700">{money(total)}</p>
          {delta !== null ? (
            <p className={cn("mt-1 text-xs", delta >= 0 ? "text-sage-300" : "text-rose-500")}>
              {delta >= 0 ? "↗" : "↘"} {Math.abs(delta)}% vs previous period
            </p>
          ) : (
            <p className="mt-1 text-xs text-cocoa-400">No prior-period revenue to compare</p>
          )}
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
        {total === 0 ? (
          <div className="flex h-full items-center justify-center rounded-xl bg-ivory-100 text-sm text-cocoa-400">
            No paid orders in this range yet.
          </div>
        ) : (
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
            <defs>
              <linearGradient id="wwLine" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="rgba(58,47,36,0.35)" />
                <stop offset="100%" stopColor="rgba(58,47,36,0)" />
              </linearGradient>
            </defs>
            <path d={area} fill="url(#wwLine)" />
            <path d={path} fill="none" stroke="#3a2f24" strokeWidth={0.6} vectorEffect="non-scaling-stroke" />
          </svg>
        )}
      </div>
    </div>
  );
}
