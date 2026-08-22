import Image from "next/image";
import Link from "next/link";
import { Arrow } from "@/components/ui/Icons";

export function GiftingBanner({ image }: { image: string }) {
  return (
    <section className="container-page mt-28">
      <div className="relative overflow-hidden rounded-3xl bg-cocoa-700 text-ivory-50">
        <Image
          src={image}
          alt="Gifting"
          fill
          className="object-cover opacity-60"
          sizes="100vw"
        />
        <div className="relative grid gap-10 p-10 lg:grid-cols-[1.2fr_1fr] lg:p-16">
          <div>
            <p className="eyebrow text-ivory-50/70">Gifting</p>
            <h2 className="mt-4 heading-serif text-editorial text-ivory-50">
              Small gifts that
              <br /> feel considered.
            </h2>
            <p className="mt-4 max-w-md text-sm text-ivory-50/80">
              Hampers for weddings, corporate favours, and thoughtful
              thank-yous — with free gift-wrap and hand-written cards.
            </p>
          </div>
          <div className="flex items-end justify-start lg:justify-end">
            <Link
              href="/gifting"
              className="group inline-flex items-center gap-3 rounded-full bg-ivory-50 px-6 py-3 text-sm uppercase tracking-widish text-cocoa-700"
            >
              Explore gifting <Arrow className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
