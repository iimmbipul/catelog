import Image from "next/image";
import Link from "next/link";
import { Arrow } from "@/components/ui/Icons";
import type { Settings } from "@/lib/types";

type Props = {
  fallbackImage: string;
  story?: Settings["homepage"]["story"];
};

export function StorySection({ fallbackImage, story }: Props) {
  const image = story?.image?.trim() ? story.image : fallbackImage;
  return (
    <section className="container-page mt-28">
      <div className="grid items-stretch gap-6 lg:grid-cols-[1fr_1fr_1fr]">
        <div className="lg:col-span-1">
          <p className="eyebrow">{story?.eyebrow || "Our story"}</p>
          <h2 className="mt-4 heading-serif text-editorial whitespace-pre-line">
            {story?.heading || "Made slowly, to be lived with."}
          </h2>
        </div>
        <div className="relative overflow-hidden rounded-2xl bg-ivory-100 aspect-[4/5] lg:aspect-auto lg:min-h-[420px]">
          <Image src={image} alt="Studio" fill className="object-contain" sizes="(min-width: 1024px) 35vw, 100vw" />
        </div>
        <div className="lg:col-span-1 flex flex-col justify-between rounded-2xl border hairline bg-ivory-50 p-8">
          {story?.body1 && (
            <p className="text-[15px] leading-relaxed text-cocoa-500 whitespace-pre-line">{story.body1}</p>
          )}
          {story?.body2 && (
            <p className="mt-6 text-[15px] leading-relaxed text-cocoa-500 whitespace-pre-line">{story.body2}</p>
          )}
          <Link
            href={story?.ctaHref || "/about"}
            className="mt-8 inline-flex items-center gap-2 text-sm uppercase tracking-widish text-cocoa-700"
          >
            {story?.ctaLabel || "More about White & Wick"} <Arrow />
          </Link>
        </div>
      </div>
    </section>
  );
}
