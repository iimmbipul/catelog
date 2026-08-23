import Link from "next/link";
import Image from "next/image";
import { PageHeader, Card, StatCard, StatusPill } from "@/components/admin/ui";
import { SalesChart } from "@/components/admin/SalesChart";
import { getCustomers, getGiftEnquiries, getOrders, getProducts } from "@/lib/db";
import { money, shortDate } from "@/lib/format";
import { Arrow } from "@/components/ui/Icons";

export const metadata = { title: "Admin — Dashboard" };

export default async function AdminDashboard() {
  const [products, orders, customers, enquiries] = await Promise.all([
    getProducts(),
    getOrders(),
    getCustomers(),
    getGiftEnquiries(),
  ]);

  const totalSales = orders.filter((o) => o.paymentStatus === "paid").reduce((s, o) => s + o.total, 0);
  const todayISO = new Date().toISOString().slice(0, 10);
  const todaySales = orders
    .filter((o) => o.paymentStatus === "paid" && o.createdAt.slice(0, 10) === todayISO)
    .reduce((s, o) => s + o.total, 0);
  const pending = orders.filter((o) => ["new", "confirmed", "processing", "packed"].includes(o.orderStatus)).length;
  const completed = orders.filter((o) => o.orderStatus === "delivered").length;
  const cancelled = orders.filter((o) => o.orderStatus === "cancelled").length;
  const low = products.filter((p) => p.stock > 0 && p.stock <= p.lowStockThreshold);
  const oos = products.filter((p) => p.stock === 0);

  const bestSelling = [...products]
    .map((p) => {
      const sold = orders
        .flatMap((o) => o.items)
        .filter((i) => i.productId === p.id)
        .reduce((s, i) => s + i.qty, 0);
      return { p, sold };
    })
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5);

  return (
    <>
      <PageHeader
        title="Welcome back."
        subtitle="Here&apos;s what&apos;s happening in the White & Wick store today."
        crumbs={[{ label: "Admin", href: "/admin" }, { label: "Dashboard" }]}
        action={
          <Link href="/admin/products/new" className="inline-flex items-center gap-2 rounded-full bg-cocoa-700 px-5 py-3 text-xs uppercase tracking-widish text-ivory-50 hover:bg-cocoa-500">
            + New product
          </Link>
        }
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total sales" value={money(totalSales)} hint="all-time paid revenue" />
        <StatCard label="Today" value={money(todaySales)} hint={`${orders.filter(o => o.createdAt.slice(0,10) === todayISO).length} orders today`} accent="sage" />
        <StatCard label="Pending orders" value={String(pending)} hint="ready to pack & ship" accent="rose" />
        <StatCard label="Delivered" value={String(completed)} hint={`${cancelled} cancelled`} accent="sage" />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.55fr_1fr]">
        <SalesChart orders={orders} />

        <Card>
          <div className="flex items-center justify-between">
            <p className="eyebrow">Recent orders</p>
            <Link href="/admin/orders" className="text-xs uppercase tracking-widish text-cocoa-700 link-underline">All</Link>
          </div>
          <ul className="mt-4 divide-y hairline">
            {orders.slice(0, 5).map((o) => (
              <li key={o.id} className="py-3">
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <Link href={`/admin/orders/${o.orderNumber}`} className="font-serif text-lg text-cocoa-700">{o.orderNumber}</Link>
                    <p className="text-xs text-cocoa-400">{o.customerName} · {shortDate(o.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-serif text-lg text-cocoa-700">{money(o.total)}</p>
                    <StatusPill status={o.orderStatus} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Products" value={String(products.length)} hint={`${products.filter((p) => p.status === "active").length} active`} />
        <StatCard label="Low stock" value={String(low.length)} hint="near threshold" accent="rose" />
        <StatCard label="Out of stock" value={String(oos.length)} hint="hidden from storefront" accent="rose" />
        <StatCard label="Customers" value={String(customers.length)} hint="verified" accent="sage" />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <Card>
          <div className="flex items-center justify-between">
            <p className="eyebrow">Top selling (by units)</p>
            <Link href="/admin/products" className="text-xs uppercase tracking-widish text-cocoa-700 link-underline">All products</Link>
          </div>
          <ul className="mt-4 divide-y hairline">
            {bestSelling.map(({ p, sold }) => (
              <li key={p.id} className="flex items-center gap-4 py-3">
                <div className="relative h-12 w-10 overflow-hidden rounded-lg bg-ivory-100">
                  <Image src={p.images[0]?.url} alt={p.name} fill className="object-cover" sizes="40px" />
                </div>
                <div className="flex-1">
                  <Link href={`/admin/products/${p.id}`} className="font-serif text-lg text-cocoa-700">{p.name}</Link>
                  <p className="text-xs text-cocoa-400">{p.category} · Stock {p.stock}</p>
                </div>
                <div className="text-right text-sm">
                  <p className="font-serif text-lg text-cocoa-700">{sold} sold</p>
                  <p className="text-xs text-cocoa-400">{money(p.price)}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <p className="eyebrow">Gift enquiries</p>
            <Link href="/admin/enquiries" className="text-xs uppercase tracking-widish text-cocoa-700 link-underline">All</Link>
          </div>
          <ul className="mt-4 space-y-3">
            {enquiries.slice(0, 4).map((g) => (
              <li key={g.id} className="rounded-xl border hairline p-4">
                <div className="flex items-center justify-between">
                  <p className="font-serif text-lg text-cocoa-700">{g.name}</p>
                  <StatusPill status={g.status} />
                </div>
                <p className="mt-1 text-xs text-cocoa-500">{g.occasion} · {g.quantity} hampers · {g.budget}</p>
              </li>
            ))}
          </ul>
          <Link href="/admin/enquiries" className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-widish text-cocoa-700">
            Open all <Arrow className="h-3 w-3" />
          </Link>
        </Card>
      </div>
    </>
  );
}
