import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Arrow } from "@/components/ui/Icons";
import { getCollections, getProducts } from "@/lib/db";

export const metadata = { title: "Collections" };

export default async function CollectionsIndex() {
  const [allCollections, products] = await Promise.all([getCollections(), getProducts()]);
  // The index only shows top-level collections; sub-categories are shown
  // inside their parent's page.
  const collections = allCollections.filter((c) => !c.parentSlug);
  // Parent counts include products from any child category.
  const countFor = (slug: string) => {
    const kids = allCollections.filter((c) => c.parentSlug === slug).map((c) => c.slug);
    const set = new Set([slug, ...kids]);
    return products.filter(
      (p) => p.collections.some((s) => set.has(s)) && p.status !== "archived" && p.status !== "draft",
    ).length;
  };
  return (
    <div className="container-page pt-8 lg:pt-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Collections" }]} />
      <div className="mb-10 mt-6">
        <p className="eyebrow">All collections</p>
        <h1 className="mt-3 heading-serif text-hero">Browse by mood, occasion, or season.</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {collections.map((c) => (
          <Link
            key={c.id}
            href={`/collections/${c.slug}`}
            className="group relative block overflow-hidden rounded-2xl bg-ivory-100 aspect-[4/5]"
          >
            <Image
              src={c.image}
              alt={c.title}
              fill
              className="object-cover transition-transform duration-[900ms] ease-expo group-hover:scale-105"
              sizes="(min-width: 1024px) 33vw, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-cocoa-700/60 to-transparent" />
            <div className="absolute inset-x-5 bottom-5 flex items-end justify-between text-ivory-50">
              <div>
                <p className="eyebrow text-ivory-50/70">{c.subtitle}</p>
                <h3 className="mt-1 font-serif text-2xl">{c.title}</h3>
                <p className="mt-1 text-xs text-ivory-50/70">{countFor(c.slug)} candles</p>
              </div>
              <span className="grid h-10 w-10 place-items-center rounded-full border border-ivory-50/50 transition-transform group-hover:-rotate-45">
                <Arrow />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
