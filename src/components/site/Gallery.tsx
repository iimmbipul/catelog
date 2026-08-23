import Image from "next/image";
import { Instagram } from "@/components/ui/Icons";
import type { InstagramPost } from "@/lib/types";

export function Gallery({
  posts,
  handle = "whiteandwick",
  profileUrl = "https://instagram.com/whiteandwick",
}: {
  posts: InstagramPost[];
  handle?: string;
  profileUrl?: string;
}) {
  const shown = posts.slice(0, 6);
  if (shown.length === 0) return null;
  return (
    <section className="container-page mt-28">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="eyebrow">Follow along</p>
          <h2 className="mt-3 heading-serif text-editorial">@{handle}</h2>
        </div>
        <a
          href={profileUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm uppercase tracking-widish text-cocoa-700"
        >
          <Instagram /> Instagram
        </a>
      </div>
      <div className="grid grid-cols-3 gap-2 md:grid-cols-6">
        {shown.map((p) => (
          <a
            key={p.id}
            href={p.link}
            target="_blank"
            rel="noreferrer"
            className="group relative aspect-square overflow-hidden rounded-xl bg-ivory-100"
          >
            <Image
              src={p.image}
              alt={p.caption ?? "White & Wick on Instagram"}
              fill
              className="object-cover transition-transform duration-500 ease-expo group-hover:scale-105"
              sizes="(min-width: 768px) 15vw, 33vw"
            />
          </a>
        ))}
      </div>
    </section>
  );
}
