import Link from "next/link";
import { Arrow, Star } from "@/components/ui/Icons";
import type { Settings } from "@/lib/types";
import { HangingVine, TulipCluster, TinySparkle, Bee, CandleHeroScene } from "./Illustrations";

export function Hero({ settings }: { settings: Settings }) {
  const { homepage } = settings;
  return (
    <section className="relative container-page pt-6 lg:pt-12">
      {/* Decorative hanging vines flanking the hero on desktop */}
      <HangingVine className="pointer-events-none absolute -top-2 left-2 hidden h-64 w-40 opacity-90 lg:block" />
      <HangingVine className="pointer-events-none absolute -top-2 right-2 hidden h-72 w-44 opacity-90 lg:block" style={{ transform: "scaleX(-1)" }} />

      <div className="grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-12 items-stretch">
        {/* Illustrated hero scene — replaces the previous photo */}
        <div className="relative overflow-hidden rounded-3xl bg-[color:#f7ecdc] aspect-[5/6] lg:aspect-auto lg:min-h-[560px]">
          <CandleHeroScene className="absolute inset-0 h-full w-full" />
          <div className="absolute inset-x-6 bottom-6 flex items-center justify-between text-xs">
            <div className="rounded-full bg-cocoa-700/85 px-3 py-1 text-ivory-50 backdrop-blur">
              Signature — Rose Bloom
            </div>
            <div className="hidden rounded-full bg-cocoa-700/85 px-3 py-1 text-ivory-50 backdrop-blur sm:block">
              Poured 08.26 · Batch №118
            </div>
          </div>
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

            <div className="flex items-center gap-4 text-sm text-cocoa-500">
              <div className="flex text-cocoa-700">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} filled />
                ))}
              </div>
              <span className="text-xs">Rated 4.9 on 1200+ reviews</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
