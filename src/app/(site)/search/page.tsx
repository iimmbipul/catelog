import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { getProducts } from "@/lib/db";
import { money } from "@/lib/format";

type Props = { searchParams: Promise<{ q?: string }> };

export const metadata = { title: "Search" };

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = (q ?? "").toString();
  const products = await getProducts();
  const lc = query.toLowerCase();
  const results = query
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(lc) ||
          p.fragrance.toLowerCase().includes(lc) ||
          p.category.toLowerCase().includes(lc) ||
          p.tags.some((t) => t.toLowerCase().includes(lc)),
      )
    : [];

  return (
    <div className="container-page pt-8 lg:pt-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Search" }]} />
      <form action="/search" className="mt-8 flex overflow-hidden rounded-full border hairline bg-ivory-50">
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Search candles, fragrances, gifts…"
          className="flex-1 bg-transparent px-6 py-4 font-serif text-lg focus:outline-none"
        />
        <button className="bg-cocoa-700 px-6 text-xs uppercase tracking-widish text-ivory-50 hover:bg-cocoa-500">
          Search
        </button>
      </form>

      <div className="mt-10">
        {!query && <p className="text-sm text-cocoa-400">Try searching by fragrance — rose, sandalwood, amber.</p>}
        {query && (
          <p className="text-sm text-cocoa-500">
            <span className="font-serif text-xl text-cocoa-700">{results.length}</span> results for “{query}”
          </p>
        )}
        <ul className="mt-6 grid gap-4">
          {results.map((p) => (
            <li key={p.id}>
              <Link
                href={`/product/${p.slug}`}
                className="flex items-center gap-5 rounded-2xl border hairline bg-ivory-50 p-4 hover:shadow-soft"
              >
                <div className="relative h-24 w-20 flex-none overflow-hidden rounded-xl bg-ivory-100">
                  <Image src={p.images[0]?.url} alt={p.name} fill className="object-cover" sizes="80px" />
                </div>
                <div className="flex-1">
                  <p className="font-serif text-xl text-cocoa-700">{p.name}</p>
                  <p className="text-sm text-cocoa-500">{p.fragrance}</p>
                </div>
                <span className="font-serif text-lg text-cocoa-700">{money(p.price)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
