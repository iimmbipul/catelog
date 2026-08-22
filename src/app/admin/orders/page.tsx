import Link from "next/link";
import { PageHeader, Card, StatusPill } from "@/components/admin/ui";
import { getOrders } from "@/lib/db";
import { money, shortDate } from "@/lib/format";

export const metadata = { title: "Admin — Orders" };

const STATUSES = ["all", "new", "confirmed", "processing", "packed", "shipped", "out_for_delivery", "delivered", "cancelled", "returned"] as const;

type Props = { searchParams: Promise<{ status?: string }> };

export default async function OrdersPage({ searchParams }: Props) {
  const { status } = await searchParams;
  const orders = await getOrders();
  const filtered = status && status !== "all" ? orders.filter((o) => o.orderStatus === status) : orders;

  return (
    <>
      <PageHeader
        title="Orders"
        subtitle={`${orders.length} orders total. Filter and drill in to update status.`}
        crumbs={[{ label: "Admin", href: "/admin" }, { label: "Orders" }]}
      />

      <div className="mb-4 flex flex-wrap gap-2 text-[11px] uppercase tracking-widish">
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={s === "all" ? "/admin/orders" : `/admin/orders?status=${s}`}
            className={`rounded-full border hairline px-3 py-1.5 ${((status ?? "all") === s) ? "bg-cocoa-700 text-ivory-50" : "text-cocoa-500 hover:text-cocoa-700"}`}
          >
            {s.replace(/_/g, " ")}
          </Link>
        ))}
      </div>

      <Card className="!p-0 overflow-hidden">
        <div className="overflow-x-auto admin-scroll">
          <table className="w-full min-w-[820px] text-sm">
            <thead className="border-b hairline bg-ivory-100/70 text-left text-[11px] uppercase tracking-widish text-cocoa-400">
              <tr>
                <th className="px-5 py-3">Order</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Items</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Payment</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y hairline">
              {filtered.map((o) => (
                <tr key={o.id} className="hover:bg-ivory-100/40">
                  <td className="px-5 py-3">
                    <Link href={`/admin/orders/${o.orderNumber}`} className="font-serif text-base text-cocoa-700">{o.orderNumber}</Link>
                  </td>
                  <td className="px-5 py-3 text-cocoa-500">{shortDate(o.createdAt)}</td>
                  <td className="px-5 py-3 text-cocoa-500">{o.customerName}</td>
                  <td className="px-5 py-3 text-cocoa-500">{o.items.reduce((s, i) => s + i.qty, 0)}</td>
                  <td className="px-5 py-3 text-cocoa-700">{money(o.total)}</td>
                  <td className="px-5 py-3"><StatusPill status={o.paymentStatus} /></td>
                  <td className="px-5 py-3"><StatusPill status={o.orderStatus} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
