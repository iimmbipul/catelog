import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ProductDetail } from "@/components/site/ProductDetail";
import { ProductCarousel } from "@/components/site/ProductCarousel";
import { SectionHeader } from "@/components/site/SectionHeader";
import { JsonLd } from "@/components/site/JsonLd";
import { getCollections, getProductBySlug, getProducts, getReviews, toProductSummary } from "@/lib/catalog";
import { productSchema } from "@/lib/schema";
import { productMetadata } from "@/lib/seo";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

/* Prerenders known products. Ones added later render on first visit, then cache. */
export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return product ? productMetadata(product) : { title: "Product not found" };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return notFound();

  const [all, allReviews, collections] = await Promise.all([getProducts(), getReviews(product.id), getCollections()]);
  const reviews = allReviews.filter((r) => r.approved);
  // Links the product back to its collection. Best sellers and new arrivals are
  // lists rather than a category, so they don't count as its home.
  const home = collections.find(
    (c) => c.slug === product.collections.find((s) => s !== "best-sellers" && s !== "new-arrivals"),
  );
  const related = all
    .filter((p) => p.id !== product.id && p.collections.some((c) => product.collections.includes(c)))
    .slice(0, 4);
  const alsoLike = all.filter((p) => p.id !== product.id && !related.includes(p)).slice(0, 4);

  return (
    <>
      <JsonLd data={productSchema(product, reviews)} />
      <div className="container-page pt-8 lg:pt-14">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Shop", href: "/shop" },
            ...(home ? [{ label: home.title, href: `/collections/${home.slug}` }] : []),
            { label: product.name },
          ]}
        />
        <div className="mt-8">
          <ProductDetail product={product} reviews={reviews} />
        </div>
      </div>

      {related.length > 0 && (
        <section className="container-page mt-24">
          <SectionHeader eyebrow="Related" title="Fragrances that pair well." href="/shop" cta="Shop all" />
          <ProductCarousel products={related.map(toProductSummary)} />
        </section>
      )}

      {alsoLike.length > 0 && (
        <section className="container-page mt-24">
          <SectionHeader eyebrow="Also loved" title="You may also like." href="/shop" cta="Explore" />
          <ProductCarousel products={alsoLike.map(toProductSummary)} />
        </section>
      )}
    </>
  );
}
