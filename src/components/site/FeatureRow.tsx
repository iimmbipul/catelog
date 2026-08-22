import { Flame, Leaf, Sparkle, Gift, Package } from "@/components/ui/Icons";

const items = [
  { icon: Flame, title: "Hand-poured", body: "Small batches from our Mumbai studio, wick by wick." },
  { icon: Leaf, title: "Premium wax", body: "Soy and coconut blend for a clean, quiet burn." },
  { icon: Sparkle, title: "Beautiful fragrance", body: "Perfumer-crafted notes made to fill a room, softly." },
  { icon: Package, title: "Thoughtful packaging", body: "Recycled papers, cotton ribbons, tissue-wrapped." },
  { icon: Gift, title: "Made for gifting", body: "Free gift-wrap, hand-written cards, custom hampers." },
];

export function FeatureRow() {
  return (
    <section className="container-page mt-24">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {items.map((f) => (
          <div key={f.title} className="rounded-2xl border hairline bg-ivory-50 p-6">
            <div className="grid h-10 w-10 place-items-center rounded-full border hairline text-cocoa-700">
              <f.icon />
            </div>
            <h3 className="mt-5 font-serif text-xl text-cocoa-700">{f.title}</h3>
            <p className="mt-2 text-sm text-cocoa-500">{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
