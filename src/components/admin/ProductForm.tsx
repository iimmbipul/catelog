"use client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { Collection, Product, ProductColor } from "@/lib/types";
import { saveProductAction } from "@/app/admin/products/actions";
import { Card } from "./ui";
import { FRAGRANCES } from "@/lib/fragrances";

export function ProductForm({
  product,
  collections,
}: {
  product?: Product;
  collections: Collection[];
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    start(async () => {
      try {
        await saveProductAction(fd);
        router.push("/admin/products");
        router.refresh();
      } catch (err) {
        setError((err as Error).message);
      }
    });
  }

  return (
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      {product && <input type="hidden" name="id" value={product.id} />}

      <div className="space-y-6">
        <Card>
          <p className="eyebrow">Basics</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Field name="name" label="Product name" required defaultValue={product?.name} />
            <Field name="sku" label="SKU" required defaultValue={product?.sku} />
            <Field name="slug" label="URL slug" placeholder="auto-generated" defaultValue={product?.slug} />
            <Field name="category" label="Category" defaultValue={product?.category} />
          </div>
          <Textarea
            name="shortDescription"
            label="Short description"
            rows={2}
            className="mt-4"
            defaultValue={product?.shortDescription}
          />
          <Textarea
            name="description"
            label="Full description"
            rows={5}
            className="mt-4"
            defaultValue={product?.description}
          />
        </Card>

        <Card>
          <p className="eyebrow">Media</p>
          <Textarea
            name="images"
            label="Image URLs (one per line, or comma-separated)"
            rows={4}
            className="mt-4"
            defaultValue={product?.images.map((i) => i.url).join("\n")}
            placeholder="https://…\nhttps://…"
          />
          <p className="mt-2 text-xs text-cocoa-400">
            Upload UI hooks into your storage provider (Supabase / S3). For the demo,
            paste image URLs — the first is the main image.
          </p>
        </Card>

        <Card>
          <p className="eyebrow">Colours</p>
          <p className="mt-2 text-xs text-cocoa-400">
            Optional. Add one row per colour with a name, a swatch colour, and the image
            shown when that swatch is selected on the product page.
          </p>
          <ColorEditor defaultColors={product?.colors} />
        </Card>

        <Card>
          <p className="eyebrow">Fragrance & details</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <FragranceSelect defaultValue={product?.fragrance} />
            <Field name="waxType" label="Wax type" defaultValue={product?.waxType} />
            <Field name="weightGrams" label="Weight (grams)" type="number" defaultValue={product?.weightGrams} />
            <Field name="burnTimeHours" label="Burn time (hours)" type="number" defaultValue={product?.burnTimeHours} />
            <Field name="dimensions" label="Dimensions" defaultValue={product?.dimensions} />
            <Field name="ingredients" label="Ingredients (comma-separated)" defaultValue={product?.ingredients.join(", ")} />
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <Field name="notesTop" label="Top notes (comma)" defaultValue={product?.fragranceNotes.top.join(", ")} />
            <Field name="notesHeart" label="Heart notes (comma)" defaultValue={product?.fragranceNotes.heart.join(", ")} />
            <Field name="notesBase" label="Base notes (comma)" defaultValue={product?.fragranceNotes.base.join(", ")} />
          </div>
          <Textarea
            name="careInstructions"
            label="Candle care (one per line)"
            rows={3}
            className="mt-4"
            defaultValue={product?.careInstructions.join("\n")}
          />
        </Card>

        <Card>
          <p className="eyebrow">SEO</p>
          <div className="mt-4 grid gap-4">
            <Field name="seoTitle" label="SEO title" defaultValue={product?.seoTitle} />
            <Textarea name="seoDescription" label="Meta description" rows={3} defaultValue={product?.seoDescription} />
            <Field name="tags" label="Keywords / tags (comma)" defaultValue={product?.tags.join(", ")} />
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <p className="eyebrow">Status</p>
          <select
            name="status"
            defaultValue={product?.status ?? "active"}
            className="mt-4 w-full rounded-xl border hairline bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-cocoa-500"
          >
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="out_of_stock">Out of stock</option>
            <option value="archived">Archived</option>
          </select>
          <label className="mt-5 flex items-center gap-3 text-sm text-cocoa-700">
            <input type="checkbox" name="bestSeller" defaultChecked={product?.bestSeller} />
            Best seller
          </label>
          <label className="mt-2 flex items-center gap-3 text-sm text-cocoa-700">
            <input type="checkbox" name="newArrival" defaultChecked={product?.newArrival} />
            New arrival
          </label>
        </Card>

        <Card>
          <p className="eyebrow">Pricing</p>
          <div className="mt-4 grid gap-4">
            <Field name="mrp" label="MRP (₹)" type="number" required defaultValue={product?.mrp} />
            <Field name="price" label="Selling price (₹)" type="number" required defaultValue={product?.price} />
            <p className="rounded-xl bg-cocoa-700/5 p-3 text-xs text-cocoa-500">
              Discount % is calculated automatically from MRP → selling price.
              Coupons apply on top and are managed under Coupons.
            </p>
          </div>
        </Card>

        <Card>
          <p className="eyebrow">Inventory</p>
          <div className="mt-4 grid gap-4">
            <Field name="stock" label="Stock quantity" type="number" required defaultValue={product?.stock} />
            <Field name="lowStockThreshold" label="Low stock threshold" type="number" defaultValue={product?.lowStockThreshold} />
          </div>
        </Card>

        <Card>
          <p className="eyebrow">Collections & categories</p>
          <p className="mt-2 text-xs text-cocoa-400">
            Choose the collection(s) this product belongs to, plus any specific categories underneath.
          </p>

          {(() => {
            const parents = collections.filter((c) => !c.parentSlug);
            const childrenOf = (slug: string) => collections.filter((c) => c.parentSlug === slug);
            const onToggle = (slug: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
              const box = e.currentTarget.form?.elements.namedItem("collections") as HTMLInputElement | null;
              if (!box) return;
              const cur = new Set(box.value.split(",").map((x) => x.trim()).filter(Boolean));
              if (e.currentTarget.checked) cur.add(slug);
              else cur.delete(slug);
              box.value = Array.from(cur).join(",");
            };
            return (
              <>
                <p className="mt-4 eyebrow">Collections</p>
                <div className="mt-2 grid gap-1.5">
                  {parents.map((c) => (
                    <label key={c.id} className="flex items-center gap-2 text-sm text-cocoa-700">
                      <input
                        type="checkbox"
                        defaultChecked={product?.collections.includes(c.slug)}
                        onChange={onToggle(c.slug)}
                      />
                      {c.title}
                    </label>
                  ))}
                </div>

                {parents
                  .filter((p) => childrenOf(p.slug).length > 0)
                  .map((p) => (
                    <div key={p.id} className="mt-5">
                      <p className="eyebrow">Categories in {p.title}</p>
                      <div className="mt-2 grid gap-1.5">
                        {childrenOf(p.slug).map((child) => (
                          <label key={child.id} className="flex items-center gap-2 text-sm text-cocoa-500">
                            <input
                              type="checkbox"
                              defaultChecked={product?.collections.includes(child.slug)}
                              onChange={onToggle(child.slug)}
                            />
                            {child.title}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
              </>
            );
          })()}

          <input
            type="hidden"
            name="collections"
            defaultValue={(product?.collections ?? []).join(",")}
          />
        </Card>

        <div className="sticky bottom-6 rounded-2xl border hairline bg-white p-4 shadow-soft">
          {error && <p className="mb-2 text-sm text-rose-500">{error}</p>}
          <button
            disabled={pending}
            className="w-full rounded-full bg-cocoa-700 py-3 text-sm uppercase tracking-widish text-ivory-50 hover:bg-cocoa-500 disabled:opacity-50"
          >
            {pending ? "Saving…" : product ? "Save changes" : "Create product"}
          </button>
        </div>
      </div>
    </form>
  );
}

function ColorEditor({ defaultColors }: { defaultColors?: ProductColor[] }) {
  const [rows, setRows] = useState<ProductColor[]>(defaultColors ?? []);
  const update = (i: number, patch: Partial<ProductColor>) =>
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));
  const add = () => setRows((r) => [...r, { name: "", hex: "#c9a86e", image: "" }]);
  const remove = (i: number) => setRows((r) => r.filter((_, idx) => idx !== i));

  return (
    <div className="mt-4">
      <input type="hidden" name="colors" value={JSON.stringify(rows.filter((r) => r.name && r.image))} />
      {rows.length === 0 && (
        <p className="text-xs text-cocoa-400">No colours yet — this product will show without a colour selector.</p>
      )}
      <ul className="space-y-3">
        {rows.map((row, i) => (
          <li key={i} className="grid gap-2 rounded-xl border hairline bg-ivory-50 p-3 md:grid-cols-[130px_88px_1fr_auto] md:items-center">
            <div>
              <label className="eyebrow">Name</label>
              <input
                value={row.name}
                onChange={(e) => update(i, { name: e.target.value })}
                placeholder="e.g. Sage"
                className="mt-1.5 w-full rounded-lg border hairline bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-cocoa-500"
              />
            </div>
            <div>
              <label className="eyebrow">Swatch</label>
              <div className="mt-1.5 flex items-center gap-2">
                <input
                  type="color"
                  value={row.hex}
                  onChange={(e) => update(i, { hex: e.target.value })}
                  className="h-9 w-10 cursor-pointer rounded-lg border hairline bg-transparent"
                />
                <input
                  value={row.hex}
                  onChange={(e) => update(i, { hex: e.target.value })}
                  className="w-full rounded-lg border hairline bg-transparent px-2 py-1.5 text-xs font-mono focus:outline-none focus:border-cocoa-500"
                />
              </div>
            </div>
            <div>
              <label className="eyebrow">Image URL</label>
              <input
                value={row.image}
                onChange={(e) => update(i, { image: e.target.value })}
                placeholder="https://…"
                className="mt-1.5 w-full rounded-lg border hairline bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-cocoa-500"
              />
            </div>
            <button
              type="button"
              onClick={() => remove(i)}
              className="justify-self-start rounded-full border hairline px-3 py-1.5 text-[11px] uppercase tracking-widish text-rose-500 hover:text-cocoa-700 md:justify-self-end"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={add}
        className="mt-3 rounded-full border hairline px-4 py-2 text-xs uppercase tracking-widish text-cocoa-700 hover:bg-cocoa-500/5"
      >
        + Add colour
      </button>
    </div>
  );
}

function FragranceSelect({ defaultValue }: { defaultValue?: string }) {
  const current = defaultValue?.trim() ?? "";
  // Preserve any legacy compound description that isn't in the canonical list.
  const inList = FRAGRANCES.some((f) => f.toLowerCase() === current.toLowerCase());
  const showLegacy = current && !inList;
  return (
    <div>
      <label className="eyebrow">Fragrance</label>
      <select
        name="fragrance"
        defaultValue={current}
        className="mt-2 w-full rounded-xl border hairline bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-cocoa-500"
      >
        {!current && <option value="">Select a fragrance…</option>}
        {showLegacy && <option value={current}>{current} (current — legacy)</option>}
        {FRAGRANCES.map((f) => (
          <option key={f} value={f}>{f}</option>
        ))}
      </select>
    </div>
  );
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, ...rest } = props;
  return (
    <div>
      <label className="eyebrow">{label}</label>
      <input
        {...rest}
        className="mt-2 w-full rounded-xl border hairline bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-cocoa-500"
      />
    </div>
  );
}

function Textarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; className?: string },
) {
  const { label, className, ...rest } = props;
  return (
    <div className={className}>
      <label className="eyebrow">{label}</label>
      <textarea
        {...rest}
        className="mt-2 w-full rounded-xl border hairline bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-cocoa-500"
      />
    </div>
  );
}
