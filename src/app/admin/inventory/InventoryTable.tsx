"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { Product } from "@/lib/types";
import { updateStockAction } from "@/app/admin/products/actions";
import { money } from "@/lib/format";
import { StatusPill } from "@/components/admin/ui";

export function InventoryTable({ products }: { products: Product[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [stocks, setStocks] = useState<Record<string, number>>(
    Object.fromEntries(products.map((p) => [p.id, p.stock])),
  );

  const dirty = products.filter((p) => stocks[p.id] !== p.stock);

  const saveAll = () => {
    start(async () => {
      for (const p of dirty) {
        await updateStockAction(p.id, stocks[p.id]);
      }
      router.refresh();
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between border-b hairline px-5 py-3">
        <p className="text-sm text-cocoa-500">
          {dirty.length > 0 ? `${dirty.length} pending change${dirty.length === 1 ? "" : "s"}` : "No pending changes"}
        </p>
        <button
          onClick={saveAll}
          disabled={dirty.length === 0 || pending}
          className="rounded-full bg-cocoa-700 px-5 py-2 text-xs uppercase tracking-widish text-ivory-50 hover:bg-cocoa-500 disabled:opacity-40"
        >
          {pending ? "Saving…" : "Save changes"}
        </button>
      </div>
      <div className="overflow-x-auto admin-scroll">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="border-b hairline bg-ivory-100/70 text-left text-[11px] uppercase tracking-widish text-cocoa-400">
            <tr>
              <th className="px-5 py-3">Product</th>
              <th className="px-5 py-3">SKU</th>
              <th className="px-5 py-3">Price</th>
              <th className="px-5 py-3">Threshold</th>
              <th className="px-5 py-3">Stock</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y hairline">
            {products.map((p) => {
              const s = stocks[p.id];
              const status =
                s === 0 ? "out_of_stock" : s <= p.lowStockThreshold ? "low_stock" : p.status;
              return (
                <tr key={p.id} className="hover:bg-ivory-100/40">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-11 w-9 overflow-hidden rounded-lg bg-ivory-100">
                        <Image src={p.images[0]?.url} alt={p.name} fill className="object-cover" sizes="36px" />
                      </div>
                      <Link href={`/admin/products/${p.id}`} className="font-serif text-base text-cocoa-700">{p.name}</Link>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-cocoa-500">{p.sku}</td>
                  <td className="px-5 py-3 text-cocoa-700">{money(p.price)}</td>
                  <td className="px-5 py-3 text-cocoa-500">{p.lowStockThreshold}</td>
                  <td className="px-5 py-3">
                    <input
                      type="number"
                      min={0}
                      value={s}
                      onChange={(e) => setStocks((prev) => ({ ...prev, [p.id]: Math.max(0, Number(e.target.value) || 0) }))}
                      className={`w-24 rounded-lg border hairline bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-cocoa-500 ${
                        s !== p.stock ? "border-cocoa-700 bg-ivory-100" : ""
                      }`}
                    />
                  </td>
                  <td className="px-5 py-3">
                    <StatusPill status={status === "low_stock" ? "out_of_stock" : status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
