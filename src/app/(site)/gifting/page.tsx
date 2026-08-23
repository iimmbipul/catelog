import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { GiftingForm } from "@/components/site/GiftingForm";
import { ProductCarousel } from "@/components/site/ProductCarousel";
import { SectionHeader } from "@/components/site/SectionHeader";
import { Arrow, Gift, Package, Sparkle } from "@/components/ui/Icons";
import { getCollectionBySlug, getProducts } from "@/lib/db";
import { IMG } from "@/lib/images";

export const metadata = { title: "Gifting" };

const OCCASIONS = [
  { title: "Weddings", body: "Curated hampers with custom cards and personalised labels." },
  { title: "Anniversaries", body: "Something quiet, warm, and beautifully wrapped." },
  { title: "Birthdays", body: "Trio sets and personalised candles with hand-written notes." },
  { title: "Corporate", body: "Bulk hampers with logo cards, boxed and delivered on time." },
  { title: "Rakhi", body: "Small, thoughtful hampers ready to send anywhere in India." },
  { title: "Housewarming", body: "A candle for the new door, wrapped in linen and tied with cotton." },
];

export default async function GiftingPage() {
  const [products, gifts] = await Promise.all([getProducts(), getCollectionBySlug("gift-sets")]);
  const giftProducts = products.filter((p) => gifts?.productIds.includes(p.id));

  return (
    <>
      <section className="container-page pt-8 lg:pt-14">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Gifting" }]} />
      </section>

      <section className="container-page mt-8">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-ivory-100 lg:aspect-auto">
            <Image src={IMG.gifting} alt="Gifting" fill className="object-contain" priority sizes="(min-width: 1024px) 55vw, 100vw" />
          </div>
          <div className="flex flex-col justify-center rounded-3xl border hairline bg-ivory-50 p-8 lg:p-12">
            <p className="eyebrow">Gifting</p>
            <h1 className="mt-5 heading-serif text-hero">Small gifts, thoughtfully made.</h1>
            <p className="mt-4 text-sm text-cocoa-500 max-w-md">
              Whether you&apos;re gifting one candle or two hundred, we&apos;ll
              hand-pack, label, and hand-write for you. Free gift-wrap on every
              hamper.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#enquire" className="inline-flex items-center gap-2 rounded-full bg-cocoa-700 px-6 py-3 text-sm uppercase tracking-widish text-ivory-50">
                Start a custom hamper <Arrow />
              </a>
              <Link href="/collections/gift-sets" className="inline-flex items-center gap-2 rounded-full border hairline px-6 py-3 text-sm uppercase tracking-widish text-cocoa-700">
                Shop ready sets
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page mt-24">
        <SectionHeader eyebrow="Occasions" title="A hamper for every moment." align="center" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {OCCASIONS.map((o) => (
            <div key={o.title} className="rounded-2xl border hairline bg-ivory-50 p-6">
              <span className="grid h-10 w-10 place-items-center rounded-full border hairline text-cocoa-700">
                <Gift />
              </span>
              <h3 className="mt-5 font-serif text-2xl text-cocoa-700">{o.title}</h3>
              <p className="mt-2 text-sm text-cocoa-500">{o.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page mt-24">
        <SectionHeader eyebrow="Ready-to-gift" title="Ready sets." href="/collections/gift-sets" cta="Shop all sets" />
        <ProductCarousel products={giftProducts} />
      </section>

      <section className="container-page mt-24">
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            { icon: Sparkle, title: "Custom labels", body: "Add names, dates, or brand marks." },
            { icon: Gift, title: "Hand-written cards", body: "In the message you choose, in our house cursive." },
            { icon: Package, title: "Delivered pan-India", body: "Timed to reach the door on the day you need." },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border hairline bg-ivory-50 p-6">
              <span className="grid h-10 w-10 place-items-center rounded-full border hairline text-cocoa-700">
                <f.icon />
              </span>
              <h3 className="mt-5 font-serif text-xl text-cocoa-700">{f.title}</h3>
              <p className="mt-2 text-sm text-cocoa-500">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="enquire" className="container-page mt-24">
        <SectionHeader eyebrow="Custom hamper enquiry" title="Tell us what you&apos;re gifting." description="We&apos;ll come back within a working day with a proposal, photos, and a quote." align="center" />
        <GiftingForm />
      </section>
    </>
  );
}
