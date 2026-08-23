import Image from "next/image";
import Link from "next/link";
import { Arrow } from "@/components/ui/Icons";
import type { Settings } from "@/lib/types";

type Props = {
  fallbackImage: string;
  banner?: Settings["homepage"]["giftingBanner"];
};

export function GiftingBanner({ fallbackImage, banner }: Props) {
  const image = banner?.image?.trim() ? banner.image : fallbackImage;
  return (
    <section className="container-page mt-28">
      <div className="relative overflow-hidden rounded-3xl bg-cocoa-700 text-ivory-50">
        <Image src={image} alt="Gifting" fill className="object-cover opacity-60" sizes="100vw" />
        <div className="relative grid gap-10 p-10 lg:grid-cols-[1.2fr_1fr] lg:p-16">
          <div>
            <p className="eyebrow text-ivory-50/70">{banner?.eyebrow || "Gifting"}</p>
            <h2 className="mt-4 heading-serif text-editorial text-ivory-50 whitespace-pre-line">
              {banner?.heading || "Small gifts that\n feel considered."}
            </h2>
            {banner?.body && (
              <p className="mt-4 max-w-md text-sm text-ivory-50/80 whitespace-pre-line">{banner.body}</p>
            )}
          </div>
          <div className="flex items-end justify-start lg:justify-end">
            <Link
              href={banner?.ctaHref || "/gifting"}
              className="group inline-flex items-center gap-3 rounded-full bg-ivory-50 px-6 py-3 text-sm uppercase tracking-widish text-cocoa-700"
            >
              {banner?.ctaLabel || "Explore gifting"}{" "}
              <Arrow className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
