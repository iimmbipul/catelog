import { PageHeader, Card, StatusPill } from "@/components/admin/ui";
import { getCoupons } from "@/lib/db";
import { money } from "@/lib/format";
import { CouponsClient } from "./CouponsClient";

export const metadata = { title: "Admin — Coupons & Discounts" };

export default async function CouponsPage() {
  const coupons = await getCoupons();
  return (
    <>
      <PageHeader
        title="Coupons & Discounts"
        subtitle="Create percent or fixed-amount codes with usage limits."
        crumbs={[{ label: "Admin", href: "/admin" }, { label: "Coupons" }]}
      />

      <div className="mb-6">
        <CouponsClient />
      </div>

      <Card className="!p-0 overflow-hidden">
        <div className="overflow-x-auto admin-scroll">
          <table className="w-full min-w-[820px] text-sm">
            <thead className="border-b hairline bg-ivory-100/70 text-left text-[11px] uppercase tracking-widish text-cocoa-400">
              <tr>
                <th className="px-5 py-3">Code</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Value</th>
                <th className="px-5 py-3">Min order</th>
                <th className="px-5 py-3">Used</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y hairline">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-ivory-100/40">
                  <td className="px-5 py-3">
                    <p className="font-serif text-base text-cocoa-700">{c.code}</p>
                    {c.maxDiscount ? <p className="text-xs text-cocoa-400">Max discount {money(c.maxDiscount)}</p> : null}
                  </td>
                  <td className="px-5 py-3 text-cocoa-500 capitalize">{c.type}</td>
                  <td className="px-5 py-3 text-cocoa-700">
                    {c.type === "percent" ? `${c.value}%` : money(c.value)}
                  </td>
                  <td className="px-5 py-3 text-cocoa-500">{c.minOrder ? money(c.minOrder) : "—"}</td>
                  <td className="px-5 py-3 text-cocoa-500">
                    {c.usedCount} {c.usageLimit ? `/ ${c.usageLimit}` : ""}
                  </td>
                  <td className="px-5 py-3">
                    <StatusPill status={c.active ? "active" : "draft"} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
