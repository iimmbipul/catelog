import Link from "next/link";
import Image from "next/image";
import { PageHeader, Card, StatusPill } from "@/components/admin/ui";
import { getProducts } from "@/lib/db";
import { money } from "@/lib/format";
import { ProductRowActions } from "./ProductRowActions";

export const metadata = { title: "Admin — Products" };

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <>
      <PageHeader
        title="Products"
        subtitle={`${products.length} products in the catalogue.`}
        crumbs={[{ label: "Admin", href: "/admin" }, { label: "Products" }]}
        action={
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 rounded-full bg-cocoa-700 px-5 py-3 text-xs uppercase tracking-widish text-ivory-50 hover:bg-cocoa-500"
          >
            + New product
          </Link>
        }
      />

      <Card className="!p-0 overflow-hidden">
        <div className="overflow-x-auto admin-scroll">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="border-b hairline bg-ivory-100/70 text-left text-[11px] uppercase tracking-widish text-cocoa-400">
              <tr>
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">SKU</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Stock</th>
                <th className="px-5 py-3">Price</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y hairline">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-ivory-100/40">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-10 overflow-hidden rounded-lg bg-ivory-100">
                        <Image src={p.images[0]?.url} alt={p.name} fill className="object-cover" sizes="40px" />
                      </div>
                      <div>
                        <Link href={`/admin/products/${p.id}`} className="font-serif text-base text-cocoa-700">{p.name}</Link>
                        <p className="text-xs text-cocoa-400">{p.category} · {p.fragrance.split(",")[0]}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-cocoa-500">{p.sku}</td>
                  <td className="px-5 py-3"><StatusPill status={p.status} /></td>
                  <td className="px-5 py-3">
                    <span className={p.stock === 0 ? "text-rose-500" : p.stock <= p.lowStockThreshold ? "text-rose-500" : "text-cocoa-700"}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-cocoa-700">
                    {money(p.price)}
                    {p.mrp > p.price && <span className="ml-2 text-xs text-cocoa-400 line-through">{money(p.mrp)}</span>}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <ProductRowActions id={p.id} />
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
