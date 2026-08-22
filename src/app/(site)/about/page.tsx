import Image from "next/image";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { FeatureRow } from "@/components/site/FeatureRow";
import { IMG } from "@/lib/images";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <>
      <section className="container-page pt-8 lg:pt-14">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />
      </section>

      <section className="container-page mt-8">
        <div className="grid gap-10 lg:grid-cols-2 items-end">
          <div>
            <p className="eyebrow">About White & Wick</p>
            <h1 className="mt-4 heading-serif text-display">Made slowly, to be lived with.</h1>
          </div>
          <p className="text-[15px] leading-relaxed text-cocoa-500 max-w-md">
            We began in 2022 with a copper pot, three friends, and a stubborn
            idea — that candles should be more than perfume. That they should
            hold a room, gently.
          </p>
        </div>
      </section>

      <section className="container-page mt-12">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-ivory-100 lg:col-span-2">
            <Image src={IMG.studio} alt="Studio" fill className="object-cover" sizes="(min-width: 1024px) 66vw, 100vw" />
          </div>
          <div className="rounded-2xl border hairline bg-ivory-50 p-8">
            <p className="eyebrow">Our craft</p>
            <p className="mt-4 text-[15px] leading-relaxed text-cocoa-500">
              Everything we make is hand-poured, in small batches, from a soy
              and coconut wax we blend ourselves. We work with three
              independent perfumers whose noses we trust — for the notes, and
              for the restraint. We prefer under-perfumed to over-perfumed. A
              candle should suggest, not shout.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-cocoa-500">
              Our labels are printed on recycled paper near the studio. Our
              boxes are hand-tied. And every hamper leaves the door with a
              card written by one of us.
            </p>
          </div>
        </div>
      </section>

      <FeatureRow />

      <section className="container-page mt-24">
        <div className="rounded-3xl border hairline bg-ivory-50 p-10 lg:p-16 text-center">
          <p className="eyebrow">The house</p>
          <h2 className="mt-4 heading-serif text-editorial max-w-2xl mx-auto">
            Not the biggest candle in the room. The one you keep reaching for.
          </h2>
        </div>
      </section>
    </>
  );
}
