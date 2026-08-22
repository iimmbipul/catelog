import { PageHeader, Card, StatCard } from "@/components/admin/ui";
import { getCustomers, getOrders } from "@/lib/db";
import { money, shortDate } from "@/lib/format";

export const metadata = { title: "Admin — Customers" };

export default async function CustomersPage() {
  const [customers, orders] = await Promise.all([getCustomers(), getOrders()]);
  const totalSpend = customers.reduce((s, c) => s + c.totalSpend, 0);
  const repeat = customers.filter((c) => c.ordersCount > 1).length;
  const avg = customers.length ? Math.round(totalSpend / customers.length) : 0;

  return (
    <>
      <PageHeader
        title="Customers"
        subtitle={`${customers.length} customers with orders.`}
        crumbs={[{ label: "Admin", href: "/admin" }, { label: "Customers" }]}
      />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Customers" value={String(customers.length)} />
        <StatCard label="Repeat" value={String(repeat)} accent="sage" hint={`${customers.length ? Math.round((repeat / customers.length) * 100) : 0}% of base`} />
        <StatCard label="Avg. spend" value={money(avg)} />
        <StatCard label="Lifetime value" value={money(totalSpend)} accent="sage" />
      </div>

      <div className="mt-6">
        <Card className="!p-0 overflow-hidden">
          <div className="overflow-x-auto admin-scroll">
            <table className="w-full min-w-[820px] text-sm">
              <thead className="border-b hairline bg-ivory-100/70 text-left text-[11px] uppercase tracking-widish text-cocoa-400">
                <tr>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Phone</th>
                  <th className="px-5 py-3">Orders</th>
                  <th className="px-5 py-3">Total spend</th>
                  <th className="px-5 py-3">Last order</th>
                </tr>
              </thead>
              <tbody className="divide-y hairline">
                {customers.map((c) => {
                  const custOrders = orders.filter((o) => o.customerId === c.id);
                  const last = custOrders[0]?.createdAt ?? c.lastOrderAt;
                  return (
                    <tr key={c.id} className="hover:bg-ivory-100/40">
                      <td className="px-5 py-3">
                        <p className="font-serif text-base text-cocoa-700">{c.name}</p>
                        <p className="text-xs text-cocoa-400">Since {shortDate(c.createdAt)}</p>
                      </td>
                      <td className="px-5 py-3 text-cocoa-500">{c.email}</td>
                      <td className="px-5 py-3 text-cocoa-500">{c.phone}</td>
                      <td className="px-5 py-3 text-cocoa-500">{c.ordersCount}</td>
                      <td className="px-5 py-3 text-cocoa-700">{money(c.totalSpend)}</td>
                      <td className="px-5 py-3 text-cocoa-500">{last ? shortDate(last) : "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  );
}
