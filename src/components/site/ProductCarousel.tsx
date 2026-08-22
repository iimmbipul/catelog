"use client";
import { useRef } from "react";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/lib/types";
import { Arrow } from "@/components/ui/Icons";

export function ProductCarousel({ products }: { products: Product[] }) {
  const scroller = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    if (!scroller.current) return;
    scroller.current.scrollBy({ left: dir * scroller.current.clientWidth * 0.9, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div className="pointer-events-none absolute -top-14 right-0 hidden gap-2 sm:flex">
        <button
          onClick={() => scroll(-1)}
          className="pointer-events-auto grid h-10 w-10 place-items-center rounded-full border hairline text-cocoa-700 hover:bg-cocoa-500/5"
          aria-label="Previous"
        >
          <Arrow className="rotate-180" />
        </button>
        <button
          onClick={() => scroll(1)}
          className="pointer-events-auto grid h-10 w-10 place-items-center rounded-full border hairline text-cocoa-700 hover:bg-cocoa-500/5"
          aria-label="Next"
        >
          <Arrow />
        </button>
      </div>
      <div
        ref={scroller}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 sm:mx-0 sm:px-0"
      >
        {products.map((p) => (
          <div key={p.id} className="w-[70%] snap-start sm:w-[45%] lg:w-[24%] flex-none">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
}
