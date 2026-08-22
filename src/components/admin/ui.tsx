import Link from "next/link";
import { cn } from "@/lib/cn";
import { ChevronRight } from "@/components/ui/Icons";

export function PageHeader({
  title,
  subtitle,
  action,
  crumbs,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  crumbs?: { label: string; href?: string }[];
}) {
  return (
    <header className="mb-8">
      {crumbs && (
        <nav className="mb-4 flex flex-wrap items-center gap-2 text-xs text-cocoa-400">
          {crumbs.map((c, i) => (
            <span key={i} className="inline-flex items-center gap-2">
              {c.href ? <Link href={c.href} className="hover:text-cocoa-700">{c.label}</Link> : <span className="text-cocoa-700">{c.label}</span>}
              {i < crumbs.length - 1 && <ChevronRight className="h-3 w-3" />}
            </span>
          ))}
        </nav>
      )}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="heading-serif text-hero">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-cocoa-500 max-w-xl">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
    </header>
  );
}

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("rounded-2xl border hairline bg-white p-5", className)}>{children}</div>;
}

export function StatCard({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint?: string;
  accent?: "cocoa" | "rose" | "sage";
}) {
  const dot =
    accent === "rose"
      ? "bg-rose-300"
      : accent === "sage"
      ? "bg-sage-300"
      : "bg-cocoa-500";
  return (
    <Card className="min-h-[130px]">
      <div className="flex items-center gap-2">
        <span className={cn("h-2 w-2 rounded-full", dot)} />
        <p className="eyebrow">{label}</p>
      </div>
      <p className="mt-3 font-serif text-3xl text-cocoa-700">{value}</p>
      {hint && <p className="mt-1 text-xs text-cocoa-400">{hint}</p>}
    </Card>
  );
}

export function StatusPill({ status }: { status: string }) {
  const color: Record<string, string> = {
    new: "bg-sage-100 text-sage-300 border-sage-200",
    confirmed: "bg-ivory-100 text-cocoa-500",
    processing: "bg-ivory-100 text-cocoa-500",
    packed: "bg-ivory-100 text-cocoa-500",
    shipped: "bg-cocoa-700/10 text-cocoa-700",
    out_for_delivery: "bg-cocoa-700/10 text-cocoa-700",
    delivered: "bg-sage-100 text-sage-300",
    cancelled: "bg-rose-100 text-rose-500",
    returned: "bg-rose-100 text-rose-500",
    paid: "bg-sage-100 text-sage-300",
    pending: "bg-ivory-100 text-cocoa-500",
    failed: "bg-rose-100 text-rose-500",
    refunded: "bg-rose-100 text-rose-500",
    active: "bg-sage-100 text-sage-300",
    draft: "bg-ivory-100 text-cocoa-500",
    out_of_stock: "bg-rose-100 text-rose-500",
    archived: "bg-cocoa-500/10 text-cocoa-500",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[10px] uppercase tracking-widish",
        color[status] ?? "bg-ivory-100 text-cocoa-500",
      )}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}
