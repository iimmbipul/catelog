import Image from "next/image";
import { Instagram } from "@/components/ui/Icons";
import { IMG } from "@/lib/seed";

const shots = [IMG.social1, IMG.social2, IMG.social3, IMG.social4, IMG.social5, IMG.social6];

export function Gallery() {
  return (
    <section className="container-page mt-28">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="eyebrow">Follow along</p>
          <h2 className="mt-3 heading-serif text-editorial">@whiteandwick</h2>
        </div>
        <a
          href="https://instagram.com/whiteandwick"
          className="inline-flex items-center gap-2 text-sm uppercase tracking-widish text-cocoa-700"
        >
          <Instagram /> Instagram
        </a>
      </div>
      <div className="grid grid-cols-3 gap-2 md:grid-cols-6">
        {shots.map((s, i) => (
          <a
            key={i}
            href="https://instagram.com/whiteandwick"
            className="group relative aspect-square overflow-hidden rounded-xl bg-ivory-100"
          >
            <Image
              src={s}
              alt="White & Wick on Instagram"
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
