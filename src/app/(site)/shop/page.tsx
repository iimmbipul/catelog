import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ShopClient } from "@/components/site/ShopClient";
import { getCollections, getProducts } from "@/lib/db";

export const metadata = { title: "Shop candles" };

export default async function ShopPage() {
  const [products, collections] = await Promise.all([getProducts(), getCollections()]);
  return (
    <div className="container-page pt-8 lg:pt-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shop" }]} />
      <div className="mb-10 mt-6 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">All candles</p>
          <h1 className="mt-3 heading-serif text-hero">The library of White & Wick.</h1>
        </div>
        <p className="max-w-md text-sm text-cocoa-500">
          Every candle here is hand-poured in small batches. Filter by mood, category or price — or start with a
          collection.
        </p>
      </div>
      <ShopClient products={products} collections={collections} />
    </div>
  );
}
