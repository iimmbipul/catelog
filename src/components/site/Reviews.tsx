import { Star } from "@/components/ui/Icons";
import type { Review } from "@/lib/types";

export function Reviews({ reviews }: { reviews: Review[] }) {
  return (
    <section className="container-page mt-28">
      <div className="mb-10 text-center">
        <p className="eyebrow">What people say</p>
        <h2 className="mt-3 heading-serif text-editorial">Lit with love, in homes across India.</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {reviews.slice(0, 3).map((r) => (
          <blockquote key={r.id} className="rounded-2xl border hairline bg-ivory-50 p-8">
            <div className="flex text-cocoa-700">
              {Array.from({ length: r.rating }).map((_, i) => (
                <Star key={i} filled />
              ))}
            </div>
            <h4 className="mt-4 font-serif text-xl text-cocoa-700">{r.title}</h4>
            <p className="mt-3 text-sm leading-relaxed text-cocoa-500">“{r.body}”</p>
            <footer className="mt-6 text-xs uppercase tracking-widish text-cocoa-400">
              — {r.customerName}
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
