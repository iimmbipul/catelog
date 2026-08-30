"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Bag, ChevronDown, Truck, Leaf, Flame, Package } from "@/components/ui/Icons";
import { cn } from "@/lib/cn";
import { money, pct, computeDiscount } from "@/lib/format";
import type { Product, Review } from "@/lib/types";
import { useCart, useUI, useWishlist } from "@/lib/store";
import { FRAGRANCES } from "@/lib/fragrances";

const TABS = ["Description", "Candle Details", "How to Use", "Shipping & Returns"] as const;
type Tab = typeof TABS[number];

export function ProductDetail({ product, reviews }: { product: Product; reviews: Review[] }) {
  const hasColors = Array.isArray(product.colors) && product.colors.length > 0;
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<Tab>("Description");
  // Default the fragrance selector to the product's own listed fragrance
  // (or the first canonical option if the product's isn't in the list).
  const defaultFragrance =
    FRAGRANCES.find((f) => product.fragrance.toLowerCase().includes(f.toLowerCase())) ??
    FRAGRANCES[0];
  const [fragrance, setFragrance] = useState<string>(defaultFragrance);
  const [colorIdx, setColorIdx] = useState<number>(0);
  const selectedColor = hasColors ? product.colors![colorIdx] : undefined;

  // Compose the gallery: if the product has colours, the color's image is the
  // main image, followed by the product's own images. Otherwise fall back to
  // the product's images only.
  const gallery = hasColors
    ? [
        { url: selectedColor!.image, alt: `${product.name} — ${selectedColor!.name}` },
        ...product.images,
      ]
    : product.images;
  const activeImage = gallery[active] ?? gallery[0];
  const add = useCart((s) => s.add);
  const setCartOpen = useUI((s) => s.setCartOpen);
  const showToast = useUI((s) => s.showToast);
  const toggle = useWishlist((s) => s.toggle);
  const wished = useWishlist((s) => s.ids.includes(product.id));
  const router = useRouter();

  const discount = product.discountPercent ?? computeDiscount(product.mrp, product.price);
  const outOfStock = product.stock <= 0 || product.status === "out_of_stock";

  const cartItem = {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    image: hasColors ? selectedColor!.image : product.images[0]?.url,
    price: product.price,
    mrp: product.mrp,
    qty,
    fragrance,
    color: selectedColor?.name,
  };

  const addToCart = () => {
    add(cartItem);
    showToast({
      title: product.name,
      subtitle: [selectedColor?.name, fragrance, `Qty ${qty}`].filter(Boolean).join(" · "),
      image: cartItem.image,
    });
  };

  const buyNow = () => {
    add(cartItem);
    router.push("/checkout");
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
      <div className="grid gap-4 sm:grid-cols-[80px_1fr]">
        <div className="order-2 flex gap-3 overflow-x-auto sm:order-1 sm:flex-col">
          {gallery.map((img, i) => (
            <button
              key={`${img.url}-${i}`}
              onClick={() => setActive(i)}
              className={cn(
                "relative aspect-[4/5] w-20 flex-none overflow-hidden rounded-xl border",
                active === i ? "border-cocoa-700" : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              <Image src={img.url} alt={img.alt} fill className="object-cover" sizes="80px" />
            </button>
          ))}
        </div>
        <div className="relative order-1 aspect-[4/5] overflow-hidden rounded-3xl bg-ivory-100 sm:order-2">
          <Image
            key={activeImage?.url}
            src={activeImage?.url ?? product.images[0]?.url}
            alt={activeImage?.alt ?? product.name}
            fill
            className="object-cover transition-transform duration-700 ease-expo hover:scale-105 animate-fade-up"
            priority
            sizes="(min-width: 1024px) 55vw, 100vw"
          />
        </div>
      </div>

      <div className="lg:sticky lg:top-24 h-max">
        <p className="eyebrow">{product.category}</p>
        <h1 className="mt-4 heading-serif text-hero">{product.name}</h1>
        <p className="mt-3 text-sm text-cocoa-500">{product.shortDescription}</p>

        <div className="mt-6 flex items-baseline gap-4">
          <span className="font-serif text-3xl text-cocoa-700">{money(product.price)}</span>
          {product.mrp > product.price && (
            <>
              <span className="text-lg text-cocoa-400 line-through">{money(product.mrp)}</span>
              <span className="rounded-full bg-rose-100 px-2.5 py-1 text-[11px] uppercase tracking-widish text-rose-500">
                {pct(discount)} off
              </span>
            </>
          )}
        </div>

        <div className="mt-6 flex items-center gap-3 text-xs uppercase tracking-widish text-cocoa-500">
          <span className={cn("h-2 w-2 rounded-full", outOfStock ? "bg-rose-400" : "bg-sage-300")} />
          {outOfStock ? "Out of stock" : product.stock <= product.lowStockThreshold ? `Only ${product.stock} left` : "In stock"}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 text-xs text-cocoa-500 sm:grid-cols-4">
          <Meta label="Fragrance" value={fragrance} />
          <Meta label="Wax" value={product.waxType} />
          <Meta label="Weight" value={`${product.weightGrams} g`} />
          <Meta label="Burn" value={`${product.burnTimeHours} h`} />
        </div>

        {hasColors && (
          <div className="mt-8">
            <div className="flex items-baseline justify-between">
              <label className="eyebrow">Colour</label>
              <span className="text-sm text-cocoa-700 font-serif">{selectedColor?.name}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.colors!.map((c, i) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => { setColorIdx(i); setActive(0); }}
                  title={c.name}
                  aria-label={`Select ${c.name}`}
                  aria-pressed={colorIdx === i}
                  className={cn(
                    "relative grid h-10 w-10 place-items-center rounded-full border-2 transition",
                    colorIdx === i ? "border-cocoa-700" : "border-transparent hover:border-cocoa-500/40",
                  )}
                >
                  <span
                    className="h-7 w-7 rounded-full border hairline"
                    style={{ background: c.hex }}
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8">
          <label className="eyebrow">Choose fragrance</label>
          <div className="mt-3 flex flex-wrap gap-2">
            {FRAGRANCES.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFragrance(f)}
                className={cn(
                  "rounded-full border px-4 py-2 text-xs uppercase tracking-widish transition",
                  fragrance === f
                    ? "border-cocoa-700 bg-cocoa-700 text-ivory-50"
                    : "hairline text-cocoa-500 hover:border-cocoa-500 hover:text-cocoa-700",
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 flex items-center gap-3">
          <div className="inline-flex items-center rounded-full border hairline">
            <button onClick={() => setQty(Math.max(1, qty - 1))} className="h-11 w-11 text-cocoa-500 hover:text-cocoa-700">−</button>
            <span className="w-8 text-center text-sm">{qty}</span>
            <button onClick={() => setQty(qty + 1)} className="h-11 w-11 text-cocoa-500 hover:text-cocoa-700">+</button>
          </div>
          <button
            disabled={outOfStock}
            onClick={addToCart}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-cocoa-700 py-3.5 text-sm uppercase tracking-widish text-ivory-50 hover:bg-cocoa-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Bag className="h-4 w-4" /> Add to cart
          </button>
          <button
            onClick={() => toggle(product.id)}
            aria-label="Wishlist"
            className={cn(
              "grid h-12 w-12 place-items-center rounded-full border hairline",
              wished ? "text-rose-400" : "text-cocoa-500 hover:text-cocoa-700",
            )}
          >
            <Heart filled={wished} />
          </button>
        </div>

        <button
          disabled={outOfStock}
          onClick={buyNow}
          className="mt-3 w-full rounded-full border border-cocoa-700 py-3.5 text-sm uppercase tracking-widish text-cocoa-700 hover:bg-cocoa-700 hover:text-ivory-50 disabled:opacity-50"
        >
          Buy it now
        </button>

        <div className="mt-8 grid grid-cols-2 gap-3 text-xs text-cocoa-500">
          <ShipRow icon={Truck} title="Free shipping" body="On orders over ₹999" />
          <ShipRow icon={Leaf} title="Clean burn" body="Soy & coconut wax" />
          <ShipRow icon={Flame} title={`${product.burnTimeHours}-hr burn`} body="Trim wick before each use" />
          <ShipRow icon={Package} title="Gift-wrapped" body="Complimentary on hampers" />
        </div>

        <div className="mt-10 border-t hairline">
          {TABS.map((t) => (
            <div key={t} className="border-b hairline">
              <button
                onClick={() => setTab(tab === t ? ("" as Tab) : t)}
                className="flex w-full items-center justify-between py-4 text-left text-sm text-cocoa-700"
              >
                <span className="uppercase tracking-widish">{t}</span>
                <ChevronDown className={cn("transition-transform", tab === t && "rotate-180")} />
              </button>
              {tab === t && (
                <div className="pb-5 text-sm leading-relaxed text-cocoa-500">
                  {tabContent(product, t)}
                </div>
              )}
            </div>
          ))}
        </div>

        {reviews.length > 0 && (
          <div className="mt-10">
            <h3 className="font-serif text-2xl text-cocoa-700">Reviews</h3>
            <ul className="mt-4 space-y-4">
              {reviews.slice(0, 3).map((r) => (
                <li key={r.id} className="rounded-2xl border hairline p-5">
                  <p className="font-serif text-lg text-cocoa-700">{r.title}</p>
                  <p className="mt-1 text-sm text-cocoa-500">“{r.body}”</p>
                  <p className="mt-2 text-xs uppercase tracking-widish text-cocoa-400">— {r.customerName}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border hairline bg-ivory-50 p-4">
      <p className="eyebrow">{label}</p>
      <p className="mt-2 font-serif text-base text-cocoa-700">{value}</p>
    </div>
  );
}

function ShipRow({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border hairline bg-ivory-50 p-4">
      <div className="flex items-center gap-3">
        <span className="grid h-8 w-8 place-items-center rounded-full border hairline text-cocoa-700">
          <Icon />
        </span>
        <div>
          <p className="text-xs font-medium text-cocoa-700">{title}</p>
          <p className="text-[11px] text-cocoa-400">{body}</p>
        </div>
      </div>
    </div>
  );
}

function tabContent(p: Product, tab: Tab) {
  switch (tab) {
    case "Description":
      return <p>{p.description}</p>;
    case "Candle Details":
      return (
        <ul className="space-y-1.5">
          <li><b className="text-cocoa-700">SKU:</b> {p.sku}</li>
          <li><b className="text-cocoa-700">Weight:</b> {p.weightGrams} g</li>
          <li><b className="text-cocoa-700">Dimensions:</b> {p.dimensions}</li>
          <li><b className="text-cocoa-700">Wax:</b> {p.waxType}</li>
          <li><b className="text-cocoa-700">Burn time:</b> {p.burnTimeHours} h</li>
          <li><b className="text-cocoa-700">Ingredients:</b> {p.ingredients.join(", ")}</li>
        </ul>
      );
    case "How to Use":
      return (
        <ol className="list-decimal space-y-2 pl-4">
          <li>Trim the wick to 5 mm before every burn.</li>
          <li>Burn for 2–3 hours on the first light so the wax pool reaches the edge.</li>
          <li>Never burn for more than 4 hours at a stretch.</li>
        </ol>
      );
    case "Shipping & Returns":
      return (
        <p>
          Free shipping on orders over ₹999. Standard delivery 3–6 business
          days across India. Unopened, unused candles can be returned within 7
          days of delivery.
        </p>
      );
  }
}
