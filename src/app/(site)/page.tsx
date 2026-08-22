import { Hero } from "@/components/site/Hero";
import { FeatureRow } from "@/components/site/FeatureRow";
import { CollectionsGrid } from "@/components/site/CollectionsGrid";
import { SectionHeader } from "@/components/site/SectionHeader";
import { ProductCarousel } from "@/components/site/ProductCarousel";
import { StorySection } from "@/components/site/StorySection";
import { GiftingBanner } from "@/components/site/GiftingBanner";
import { Reviews } from "@/components/site/Reviews";
import { Gallery } from "@/components/site/Gallery";
import { Newsletter } from "@/components/site/Newsletter";
import { getCollections, getProducts, getReviews, getSettings } from "@/lib/db";
import { IMG } from "@/lib/seed";
import { FloralSprig, LeafBranch } from "@/components/site/Illustrations";

export default async function HomePage() {
  const [products, collections, reviews, settings] = await Promise.all([
    getProducts(),
    getCollections(),
    getReviews(),
    getSettings(),
  ]);

  const bestSellers = products.filter((p) => p.bestSeller).slice(0, 6);
  const newArrivals = products.filter((p) => p.newArrival).slice(0, 6);

  return (
    <div className="home-canvas relative overflow-hidden">
      {/* Ambient background flourishes — subtle, positioned, non-interactive */}
      <LeafBranch className="pointer-events-none absolute -left-16 top-[42vh] hidden h-24 w-72 opacity-40 lg:block" />
      <LeafBranch className="pointer-events-none absolute -right-20 top-[80vh] hidden h-24 w-72 opacity-40 lg:block" style={{ transform: "scaleX(-1)" }} />

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

      <section className="container-page mt-28">
        <SectionHeader
          eyebrow="Best Sellers"
          title="The candles most sent, gifted, repurchased."
          href="/collections/best-sellers"
          cta="Shop best sellers"
        />
        <ProductCarousel products={bestSellers} />
      </section>

      <FeatureRow />

      <SprigDivider />

      <StorySection image={IMG.handpour} />

      <section className="container-page mt-28">
        <SectionHeader
          eyebrow="New Arrivals"
          title="Freshly poured."
          href="/collections/new-arrivals"
          cta="Shop new arrivals"
        />
        <ProductCarousel products={newArrivals} />
      </section>

      <GiftingBanner image={IMG.gifting} />

      <SprigDivider />

      <Reviews reviews={reviews} />

      <Gallery />

      <Newsletter />
    </div>
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
