"use client";
import { useMemo, useState } from "react";
import { ProductCard } from "./ProductCard";
import type { Collection, Product } from "@/lib/types";
import { cn } from "@/lib/cn";
import { ChevronDown, Close } from "@/components/ui/Icons";
import { FRAGRANCES } from "@/lib/fragrances";

type Sort = "featured" | "newest" | "price-asc" | "price-desc" | "best";

const SORTS: { value: Sort; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "best", label: "Best selling" },
];

export function ShopClient({
  products,
  collections,
  initialCollection,
}: {
  products: Product[];
  collections: Collection[];
  initialCollection?: string;
}) {
  const [sort, setSort] = useState<Sort>("featured");
  const [collection, setCollection] = useState<string | "all">(initialCollection ?? "all");
  const [subCategories, setSubCategories] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [fragrances, setFragrances] = useState<string[]>([]);
  const [availability, setAvailability] = useState<"all" | "in-stock">("all");
  const [showFilters, setShowFilters] = useState(false);
  const [priceMax, setPriceMax] = useState<number>(2500);

  // Product types come from the free-text Product.category field.
  const allTypes = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
  // Categories are sub-collections (collections with a parentSlug), grouped by parent.
  const parents = collections.filter((c) => !c.parentSlug);
  const childrenByParent = parents
    .map((p) => ({ parent: p, kids: collections.filter((c) => c.parentSlug === p.slug) }))
    .filter((g) => g.kids.length > 0);
  // Use the canonical fragrance list so the filter is stable regardless of what's in stock.
  const allFragrances = FRAGRANCES as readonly string[];

  const filtered = useMemo(() => {
    const items = products.filter((p) => {
      if (collection !== "all" && !p.collections.includes(collection)) return false;
      if (subCategories.length && !p.collections.some((s) => subCategories.includes(s))) return false;
      if (types.length && !types.includes(p.category)) return false;
      if (fragrances.length && !p.fragrance.split(",").some((f) => fragrances.includes(f.trim()))) return false;
      if (availability === "in-stock" && (p.stock <= 0 || p.status === "out_of_stock")) return false;
      if (p.price > priceMax) return false;
      return p.status !== "archived" && p.status !== "draft";
    });

    switch (sort) {
      case "newest":
        items.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
        break;
      case "price-asc":
        items.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        items.sort((a, b) => b.price - a.price);
        break;
      case "best":
        items.sort((a, b) => (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0));
        break;
    }
    return items;
  }, [products, collection, subCategories, types, fragrances, availability, priceMax, sort]);

  const toggleIn = (set: string[], v: string) =>
    set.includes(v) ? set.filter((x) => x !== v) : [...set, v];

  const activeFilterCount =
    (collection !== "all" ? 1 : 0) +
    subCategories.length +
    types.length +
    fragrances.length +
    (availability === "in-stock" ? 1 : 0) +
    (priceMax < 2500 ? 1 : 0);

  return (
    <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
      {/* Sidebar */}
      <aside className={cn(
        "lg:sticky lg:top-24 h-max rounded-2xl border hairline bg-ivory-50 p-5",
        "lg:block",
        showFilters ? "block" : "hidden lg:block"
      )}>
        <div className="flex items-center justify-between lg:hidden">
          <h3 className="font-serif text-xl">Filters</h3>
          <button onClick={() => setShowFilters(false)}><Close /></button>
        </div>
        <FilterGroup title="Collection" defaultOpen>
          <RadioRow name="collection" value="all" label="All" checked={collection === "all"} onChange={() => setCollection("all")} />
          {collections
            .filter((c) => !c.parentSlug)
            .map((c) => (
              <RadioRow key={c.id} name="collection" value={c.slug} label={c.title} checked={collection === c.slug} onChange={() => setCollection(c.slug)} />
            ))}
        </FilterGroup>

        {childrenByParent.map(({ parent, kids }) => (
          <FilterGroup key={parent.id} title={`${parent.title} — Category`}>
            {kids.map((k) => (
              <CheckRow
                key={k.id}
                label={k.title}
                checked={subCategories.includes(k.slug)}
                onChange={() => setSubCategories((s) => toggleIn(s, k.slug))}
              />
            ))}
          </FilterGroup>
        ))}

        {allTypes.length > 0 && (
          <FilterGroup title="Type">
            {allTypes.map((c) => (
              <CheckRow key={c} label={c} checked={types.includes(c)} onChange={() => setTypes((s) => toggleIn(s, c))} />
            ))}
          </FilterGroup>
        )}

        <FilterGroup title="Fragrance">
          {allFragrances.map((f) => (
            <CheckRow key={f} label={f} checked={fragrances.includes(f)} onChange={() => setFragrances((s) => toggleIn(s, f))} />
          ))}
        </FilterGroup>

        <FilterGroup title="Price">
          <div className="pt-2">
            <input
              type="range"
              min={299}
              max={2500}
              step={50}
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              className="w-full accent-cocoa-700"
            />
            <div className="mt-2 flex justify-between text-xs text-cocoa-400">
              <span>₹299</span>
              <span className="text-cocoa-700">Up to ₹{priceMax}</span>
            </div>
          </div>
        </FilterGroup>

        <FilterGroup title="Availability">
          <RadioRow name="avail" value="all" label="All" checked={availability === "all"} onChange={() => setAvailability("all")} />
          <RadioRow name="avail" value="in-stock" label="In stock" checked={availability === "in-stock"} onChange={() => setAvailability("in-stock")} />
        </FilterGroup>

        {activeFilterCount > 0 && (
          <button
            onClick={() => {
              setCollection("all");
              setSubCategories([]);
              setTypes([]);
              setFragrances([]);
              setAvailability("all");
              setPriceMax(2500);
            }}
            className="mt-2 text-xs uppercase tracking-widish text-rose-500 hover:text-cocoa-700"
          >
            Clear all filters
          </button>
        )}
      </aside>

      <div>
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-cocoa-400">
            <span className="font-serif text-lg text-cocoa-700">{filtered.length}</span>{" "}
            {filtered.length === 1 ? "candle" : "candles"}
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(true)}
              className="lg:hidden inline-flex items-center gap-2 rounded-full border hairline px-4 py-2 text-xs uppercase tracking-widish text-cocoa-700"
            >
              Filters {activeFilterCount > 0 && <span className="rounded-full bg-cocoa-700 px-1.5 text-[10px] text-ivory-50">{activeFilterCount}</span>}
            </button>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="appearance-none rounded-full border hairline bg-transparent py-2 pl-4 pr-9 text-xs uppercase tracking-widish text-cocoa-700 focus:outline-none"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-cocoa-500" />
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border hairline bg-ivory-50 p-12 text-center">
            <p className="font-serif text-2xl text-cocoa-700">No candles match those filters.</p>
            <p className="mt-2 text-sm text-cocoa-500">Try widening the collection or price range.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterGroup({ title, defaultOpen, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className="border-b hairline py-4 last:border-b-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-left text-sm text-cocoa-700"
      >
        <span className="font-medium">{title}</span>
        <ChevronDown className={cn("transition-transform", open && "rotate-180")} />
      </button>
      {open && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  );
}

function CheckRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-2.5 text-sm text-cocoa-500 hover:text-cocoa-700">
      <input type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 rounded border-cocoa-500/40 text-cocoa-700 focus:ring-cocoa-500" />
      {label}
    </label>
  );
}

function RadioRow({ name, value, label, checked, onChange }: { name: string; value: string; label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-2.5 text-sm text-cocoa-500 hover:text-cocoa-700">
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="h-4 w-4 border-cocoa-500/40 text-cocoa-700 focus:ring-cocoa-500" />
      {label}
    </label>
  );
}
