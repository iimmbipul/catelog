import { PageHeader, Card, StatusPill, StatCard } from "@/components/admin/ui";
import { getProducts } from "@/lib/db";
import { money } from "@/lib/format";
import { InventoryTable } from "./InventoryTable";

export const metadata = { title: "Admin — Inventory" };

export default async function InventoryPage() {
  const products = await getProducts();
  const low = products.filter((p) => p.stock > 0 && p.stock <= p.lowStockThreshold);
  const oos = products.filter((p) => p.stock === 0);
  const inStock = products.filter((p) => p.stock > p.lowStockThreshold);
  const totalUnits = products.reduce((s, p) => s + p.stock, 0);
  const stockValue = products.reduce((s, p) => s + p.stock * p.price, 0);
  return (
    <>
      <PageHeader
        title="Inventory"
        subtitle="Update stock levels. Products with 0 stock hide automatically from the storefront."
        crumbs={[{ label: "Admin", href: "/admin" }, { label: "Inventory" }]}
      />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Products" value={String(products.length)} />
        <StatCard label="In stock" value={String(inStock.length)} accent="sage" hint={`${totalUnits} total units`} />
        <StatCard label="Low stock" value={String(low.length)} accent="rose" hint="at or below threshold" />
        <StatCard label="Out of stock" value={String(oos.length)} accent="rose" hint={`Stock value ${money(stockValue)}`} />
      </div>
      <div className="mt-6">
        <Card className="!p-0 overflow-hidden">
          <InventoryTable products={products} />
        </Card>
      </div>
      {oos.length > 0 && (
        <Card className="mt-6">
          <p className="eyebrow">Out of stock — hidden from storefront</p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {oos.map((p) => (
              <li key={p.id} className="flex items-center justify-between rounded-xl border hairline p-3 text-sm">
                <span>{p.name}</span>
                <StatusPill status={p.status} />
              </li>
            ))}
          </ul>
        </Card>
      )}
    </>
  );
}
