import Image from "next/image";
import Link from "next/link";
import { Arrow } from "@/components/ui/Icons";
import type { Settings } from "@/lib/types";
import { HangingVine, TulipCluster, TinySparkle, Bee, CandleHeroScene } from "./Illustrations";

/* True when the admin has explicitly set a hero image (not left blank and not
 * the bundled picsum placeholder we ship as a safety default in db.ts). */
function hasCustomHeroImage(url: string | undefined): url is string {
  if (!url) return false;
  if (url.includes("picsum.photos")) return false;
  return /^https?:\/\//i.test(url);
}

export function Hero({ settings }: { settings: Settings }) {
  const { homepage } = settings;
  return (
    <section className="relative container-page pt-6 lg:pt-12">
      {/* Decorative hanging vines flanking the hero on desktop */}
      <HangingVine className="pointer-events-none absolute -top-2 left-2 hidden h-64 w-40 opacity-90 lg:block" />
      <HangingVine className="pointer-events-none absolute -top-2 right-2 hidden h-72 w-44 opacity-90 lg:block" style={{ transform: "scaleX(-1)" }} />

      <div className="grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-12 items-stretch">
        {/* If the admin has set a Hero Image URL in /admin/homepage, render
         * that photo. Otherwise fall back to the illustrated scene. */}
        <div className="relative overflow-hidden rounded-3xl bg-[color:#f7ecdc] aspect-[5/6] lg:aspect-auto lg:min-h-[560px]">
          {hasCustomHeroImage(homepage.heroImage) ? (
            <Image
              src={homepage.heroImage}
              alt="White & Wick hero"
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1024px) 55vw, 100vw"
            />
          ) : (
            <CandleHeroScene className="absolute inset-0 h-full w-full" />
          )}
        </div>

        <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl border hairline bg-ivory-50/80 p-8 lg:p-12">
          {/* Illustrated tulip cluster at the bottom of the hero card */}
          <TulipCluster className="pointer-events-none absolute -bottom-2 -right-4 h-36 w-56 opacity-90 lg:h-44 lg:w-72" />
          <TinySparkle className="pointer-events-none absolute right-14 top-8 h-4 w-4 animate-pulse" />
          <TinySparkle className="pointer-events-none absolute left-8 top-24 h-3 w-3 animate-pulse" style={{ animationDelay: "800ms" }} />
          <Bee className="pointer-events-none absolute right-4 top-16 hidden h-8 w-8 lg:block" />

          <div className="relative">
            <p className="eyebrow">A House of Candles</p>
            <h1 className="mt-6 heading-serif text-display whitespace-pre-line">
              {homepage.heroHeading}
            </h1>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-cocoa-500">
              {homepage.heroSubheading}
            </p>
          </div>

          <div className="relative mt-10 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={homepage.heroCtaHref}
                className="group inline-flex items-center gap-3 rounded-full bg-cocoa-700 px-7 py-4 text-sm uppercase tracking-widish text-ivory-50 hover:bg-cocoa-500"
              >
                {homepage.heroCtaLabel}
                <Arrow className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href={homepage.secondaryCtaHref}
                className="inline-flex items-center gap-2 rounded-full border hairline px-6 py-4 text-sm uppercase tracking-widish text-cocoa-700 hover:bg-cocoa-500/5"
              >
                {homepage.secondaryCtaLabel}
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
