import { Hero } from "@/components/site/Hero";
import { FeatureRow } from "@/components/site/FeatureRow";
import { CollectionsGrid } from "@/components/site/CollectionsGrid";
import { SectionHeader } from "@/components/site/SectionHeader";
import { ProductCarousel } from "@/components/site/ProductCarousel";
import { StorySection } from "@/components/site/StorySection";
import { GiftingBanner } from "@/components/site/GiftingBanner";
import { Reviews } from "@/components/site/Reviews";
import { Gallery } from "@/components/site/Gallery";
import { getCollections, getProducts, getReviews, getSettings } from "@/lib/db";
import { IMG } from "@/lib/images";
import { FloralSprig } from "@/components/site/Illustrations";

export default async function HomePage() {
  const [products, collections, reviews, settings] = await Promise.all([
    getProducts(),
    getCollections(),
    getReviews(),
    getSettings(),
  ]);

  const bestSellers = products.filter((p) => p.bestSeller).slice(0, 6);
  const newArrivals = products.filter((p) => p.newArrival).slice(0, 6);

  // Any collection admin has "Pinned to home" appears above Best Sellers.
  // Products roll up from the collection itself + any child categories.
  const pinned = collections.filter((c) => c.pinToHome);
  const pinnedSections = pinned
    .map((c) => {
      const kids = collections.filter((k) => k.parentSlug === c.slug).map((k) => k.slug);
      const scope = new Set([c.slug, ...kids]);
      const items = products
        .filter(
          (p) =>
            p.collections.some((s) => scope.has(s)) &&
            p.status !== "archived" &&
            p.status !== "draft",
        )
        .slice(0, 6);
      return { c, items };
    })
    .filter((s) => s.items.length > 0);

  return (
    <>
      <Hero settings={settings} />

      <SprigDivider />

      <section className="container-page mt-16">
        <SectionHeader
          eyebrow="Featured Collections"
          title="Browse by mood."
          description="A short library of edits — pick a feeling and start there."
          href="/collections"
          cta="All collections"
        />
        <CollectionsGrid collections={collections} />
      </section>

      {pinnedSections.map(({ c, items }) => (
        <section key={c.id} className="container-page mt-28">
          <SectionHeader
            eyebrow={c.subtitle || "Featured"}
            title={c.title}
            description={c.description}
            href={`/collections/${c.slug}`}
            cta={`Shop ${c.title}`}
          />
          <ProductCarousel products={items} />
        </section>
      ))}

      <section className="container-page mt-28">
        <SectionHeader
          eyebrow="Best Sellers"
          title="The candles most sent, gifted, repurchased."
          href="/collections/best-sellers"
          cta="Shop best sellers"
        />
        <ProductCarousel products={bestSellers} />
      </section>

      <section className="container-page mt-28">
        <SectionHeader
          eyebrow="New Arrivals"
          title="Freshly poured."
          href="/collections/new-arrivals"
          cta="Shop new arrivals"
        />
        <ProductCarousel products={newArrivals} />
      </section>

      <FeatureRow />

      <SprigDivider />

      <StorySection fallbackImage={IMG.handpour} story={settings.homepage.story} />

      <GiftingBanner fallbackImage={IMG.gifting} banner={settings.homepage.giftingBanner} />

      <SprigDivider />

      <Reviews reviews={reviews} />

      <Gallery />
    </>
  );
}

function SprigDivider() {
  return (
    <div className="container-page mt-24 flex items-center justify-center">
      <div className="flex items-center gap-4 text-cocoa-400">
        <span className="h-px w-16 bg-current opacity-40" />
        <FloralSprig className="h-10 w-24 opacity-90" />
        <span className="h-px w-16 bg-current opacity-40" />
      </div>
    </div>
  );
}
