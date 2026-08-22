import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ShopClient } from "@/components/site/ShopClient";
import { Arrow } from "@/components/ui/Icons";
import { getCollectionBySlug, getCollections, getProducts } from "@/lib/db";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = await getCollectionBySlug(slug);
  return { title: c?.title ?? "Collection" };
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  if (!collection) return notFound();
  const [all, allCollections] = await Promise.all([getProducts(), getCollections()]);
  const children = allCollections.filter((c) => c.parentSlug === collection.slug);
  // Products tagged in a category automatically bubble up to the parent
  // collection view so admins don't have to double-tag.
  const scopedSlugs = new Set<string>([collection.slug, ...children.map((c) => c.slug)]);
  const products = all.filter((p) => p.collections.some((s) => scopedSlugs.has(s)));

  return (
    <>
      <section className="container-page pt-8 lg:pt-14">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Collections", href: "/collections" },
            ...(collection.parentSlug
              ? (() => {
                  const parent = allCollections.find((c) => c.slug === collection.parentSlug);
                  return parent ? [{ label: parent.title, href: `/collections/${parent.slug}` }] : [];
                })()
              : []),
            { label: collection.title },
          ]}
        />
      </section>

      <section className="container-page mt-8">
        <div className="relative overflow-hidden rounded-3xl bg-ivory-100 aspect-[16/7]">
          <Image src={collection.image} alt={collection.title} fill className="object-cover" priority sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-cocoa-700/70 via-cocoa-700/25 to-transparent" />
          <div className="absolute inset-y-0 left-0 flex max-w-2xl flex-col justify-end p-8 text-ivory-50 lg:p-14">
            <p className="eyebrow text-ivory-50/70">{collection.subtitle}</p>
            <h1 className="mt-3 heading-serif text-hero text-ivory-50">{collection.title}</h1>
            <p className="mt-3 max-w-md text-sm text-ivory-50/80">{collection.description}</p>
          </div>
        </div>
      </section>

      {children.length > 0 && (
        <section className="container-page mt-12">
          <div className="mb-6">
            <p className="eyebrow">Shop by category</p>
            <h2 className="mt-2 heading-serif text-editorial">Pick a {collection.title.replace(/^The /, "").toLowerCase().replace(/s$/, "")}.</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {children.map((child) => (
              <Link
                key={child.id}
                href={`/collections/${child.slug}`}
                className="group relative block overflow-hidden rounded-2xl bg-ivory-100 aspect-[4/5]"
              >
                <Image
                  src={child.image}
                  alt={child.title}
                  fill
                  className="object-cover transition-transform duration-[900ms] ease-expo group-hover:scale-105"
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cocoa-700/60 to-transparent" />
                <div className="absolute inset-x-5 bottom-5 flex items-end justify-between text-ivory-50">
                  <div>
                    <p className="eyebrow text-ivory-50/70">{child.subtitle}</p>
                    <h3 className="mt-1 font-serif text-2xl">{child.title}</h3>
                    <p className="mt-1 text-xs text-ivory-50/70">
                      {all.filter((p) => p.collections.includes(child.slug) && p.status !== "archived" && p.status !== "draft").length} candles
                    </p>
                  </div>
                  <span className="grid h-10 w-10 place-items-center rounded-full border border-ivory-50/50 transition-transform group-hover:-rotate-45">
                    <Arrow />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="container-page mt-12">
        {products.length === 0 && children.length > 0 ? (
          <div className="rounded-3xl border hairline bg-ivory-50 p-10 text-center">
            <p className="font-serif text-xl text-cocoa-700">Choose an occasion above to see the edit.</p>
            <p className="mt-2 text-sm text-cocoa-500">
              Or <Link href="/shop" className="link-underline text-cocoa-700">browse all candles</Link>.
            </p>
          </div>
        ) : (
          <ShopClient products={products} collections={allCollections} initialCollection={collection.slug} />
        )}
      </section>
    </>
  );
}
