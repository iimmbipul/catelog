import Image from "next/image";
import Link from "next/link";
import { Arrow } from "@/components/ui/Icons";
import type { Collection } from "@/lib/types";

export function CollectionsGrid({ collections }: { collections: Collection[] }) {
  const featured = collections.filter((c) => c.featured).slice(0, 4);
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {featured.map((c, i) => (
        <Link
          key={c.id}
          href={`/collections/${c.slug}`}
          className={`group relative block overflow-hidden rounded-2xl bg-ivory-100 ${i === 0 ? "sm:col-span-2 sm:row-span-2 aspect-square sm:aspect-[4/5]" : "aspect-[4/5]"}`}
        >
          <Image
            src={c.image}
            alt={c.title}
            fill
            className="object-cover transition-transform duration-[900ms] ease-expo group-hover:scale-105"
            sizes={i === 0 ? "(min-width: 640px) 50vw, 100vw" : "(min-width: 640px) 25vw, 100vw"}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cocoa-700/50 via-transparent to-transparent" />
          <div className="absolute inset-x-5 bottom-5 flex items-end justify-between text-ivory-50">
            <div>
              <p className="eyebrow text-ivory-50/70">{c.subtitle}</p>
              <h3 className="mt-1 font-serif text-2xl lg:text-3xl">{c.title}</h3>
            </div>
            <span className="grid h-10 w-10 place-items-center rounded-full border border-ivory-50/50 transition-transform group-hover:-rotate-45">
              <Arrow />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
