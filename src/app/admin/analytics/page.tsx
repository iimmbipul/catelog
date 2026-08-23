import Image from "next/image";
import { PageHeader, Card, StatCard } from "@/components/admin/ui";
import { SalesChart } from "@/components/admin/SalesChart";
import { getCollections, getCoupons, getCustomers, getOrders, getProducts } from "@/lib/db";
import { money } from "@/lib/format";

export const metadata = { title: "Admin — Analytics" };

export default async function AnalyticsPage() {
  const [orders, products, customers, collections, coupons] = await Promise.all([
    getOrders(),
    getProducts(),
    getCustomers(),
    getCollections(),
    getCoupons(),
  ]);

  const paid = orders.filter((o) => o.paymentStatus === "paid");
  const revenue = paid.reduce((s, o) => s + o.total, 0);
  const aov = paid.length ? Math.round(revenue / paid.length) : 0;
  const repeat = customers.filter((c) => c.ordersCount > 1).length;

  const perProduct = products.map((p) => {
    const sold = orders.flatMap((o) => o.items).filter((i) => i.productId === p.id).reduce((s, i) => s + i.qty, 0);
    const rev = orders.flatMap((o) => o.items).filter((i) => i.productId === p.id).reduce((s, i) => s + i.qty * i.price, 0);
    return { p, sold, rev };
  }).sort((a, b) => b.rev - a.rev).slice(0, 6);

  const perCollection = collections.map((c) => {
    const rev = orders.flatMap((o) => o.items)
      .filter((i) => products.find((p) => p.id === i.productId)?.collections.includes(c.slug))
      .reduce((s, i) => s + i.qty * i.price, 0);
    return { c, rev };
  }).sort((a, b) => b.rev - a.rev);

  const couponUsage = coupons.filter((c) => c.usedCount > 0);

  return (
    <>
      <PageHeader
        title="Analytics"
        subtitle="Sales, products, customers, and coupon usage at a glance."
        crumbs={[{ label: "Admin", href: "/admin" }, { label: "Analytics" }]}
      />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Revenue" value={money(revenue)} accent="sage" />
        <StatCard label="Orders" value={String(paid.length)} />
        <StatCard label="Avg. order value" value={money(aov)} />
        <StatCard label="Repeat customers" value={`${repeat} / ${customers.length}`} accent="sage" />
      </div>

      <div className="mt-6">
        <SalesChart orders={orders} />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <Card>
          <p className="eyebrow">Sales by product</p>
          <ul className="mt-4 divide-y hairline">
            {perProduct.map(({ p, sold, rev }) => (
              <li key={p.id} className="flex items-center gap-4 py-3">
                <div className="relative h-12 w-10 overflow-hidden rounded-lg bg-ivory-100">
                  <Image src={p.images[0]?.url} alt={p.name} fill className="object-cover" sizes="40px" />
                </div>
                <div className="flex-1">
                  <p className="font-serif text-lg text-cocoa-700">{p.name}</p>
                  <p className="text-xs text-cocoa-400">{p.category} · {sold} sold</p>
                </div>
                <p className="font-serif text-lg text-cocoa-700">{money(rev)}</p>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <p className="eyebrow">Sales by collection</p>
          <ul className="mt-4 divide-y hairline">
            {perCollection.map(({ c, rev }) => (
              <li key={c.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-serif text-lg text-cocoa-700">{c.title}</p>
                  <p className="text-xs text-cocoa-400">{c.productIds.length} products</p>
                </div>
                <p className="text-sm text-cocoa-700">{money(rev)}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <p className="eyebrow">Coupon usage</p>
          {couponUsage.length === 0 ? (
            <p className="mt-4 text-sm text-cocoa-500">No coupons used yet.</p>
          ) : (
            <ul className="mt-4 divide-y hairline">
              {couponUsage.map((c) => (
                <li key={c.id} className="flex items-center justify-between py-3 text-sm">
                  <div>
                    <p className="font-serif text-lg text-cocoa-700">{c.code}</p>
                    <p className="text-xs text-cocoa-400">
                      {c.type === "percent" ? `${c.value}%` : money(c.value)} off · min {c.minOrder ? money(c.minOrder) : "any"}
                    </p>
                  </div>
                  <p className="text-cocoa-500">{c.usedCount}{c.usageLimit ? ` / ${c.usageLimit}` : ""} uses</p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
