import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ProductDetail } from "@/components/site/ProductDetail";
import { ProductCarousel } from "@/components/site/ProductCarousel";
import { SectionHeader } from "@/components/site/SectionHeader";
import { getProductBySlug, getProducts, getReviews } from "@/lib/db";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.seoTitle ?? product.name,
    description: product.seoDescription ?? product.shortDescription,
    openGraph: { images: product.images[0]?.url ? [product.images[0].url] : undefined },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return notFound();

  const [all, reviews] = await Promise.all([getProducts(), getReviews(product.id)]);
  const related = all
    .filter((p) => p.id !== product.id && p.collections.some((c) => product.collections.includes(c)))
    .slice(0, 4);
  const alsoLike = all.filter((p) => p.id !== product.id && !related.includes(p)).slice(0, 4);

  return (
    <>
      <div className="container-page pt-8 lg:pt-14">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Shop", href: "/shop" },
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
          <ProductCarousel products={related} />
        </section>
      )}

      {alsoLike.length > 0 && (
        <section className="container-page mt-24">
          <SectionHeader eyebrow="Also loved" title="You may also like." href="/shop" cta="Explore" />
          <ProductCarousel products={alsoLike} />
        </section>
      )}
    </>
  );
}
