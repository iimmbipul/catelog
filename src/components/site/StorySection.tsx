import Image from "next/image";
import Link from "next/link";
import { Arrow } from "@/components/ui/Icons";

export function StorySection({ image }: { image: string }) {
  return (
    <section className="container-page mt-28">
      <div className="grid items-stretch gap-6 lg:grid-cols-[1fr_1fr_1fr]">
        <div className="lg:col-span-1">
          <p className="eyebrow">Our story</p>
          <h2 className="mt-4 heading-serif text-editorial">
            Made slowly,
            <br /> to be lived with.
          </h2>
        </div>
        <div className="relative overflow-hidden rounded-2xl bg-ivory-100 aspect-[4/5] lg:aspect-auto lg:min-h-[420px]">
          <Image src={image} alt="Studio" fill className="object-cover" sizes="(min-width: 1024px) 35vw, 100vw" />
        </div>
        <div className="lg:col-span-1 flex flex-col justify-between rounded-2xl border hairline bg-ivory-50 p-8">
          <p className="text-[15px] leading-relaxed text-cocoa-500">
            White & Wick began in a small Bombay flat, with three friends and a
            single copper pot. Everything we make is still poured by hand — in
            small batches, from a wax we blend ourselves. The fragrances are
            crafted with perfumers we love. The packaging is recycled and made
            near our studio.
          </p>
          <p className="mt-6 text-[15px] leading-relaxed text-cocoa-500">
            We&apos;re not trying to be the biggest candle in the room. Just the
            one you keep reaching for.
          </p>
          <Link
            href="/about"
            className="mt-8 inline-flex items-center gap-2 text-sm uppercase tracking-widish text-cocoa-700"
          >
            More about White & Wick <Arrow />
          </Link>
        </div>
      </div>
    </section>
  );
}
