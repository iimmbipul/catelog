"use server";
import { revalidatePath } from "next/cache";
import { deleteProduct, getProducts, saveProducts, upsertProduct } from "@/lib/db";
import type { Product, ProductColor } from "@/lib/types";

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function parseCSV(v: FormDataEntryValue | null) {
  return String(v ?? "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

function pf(input: FormData, name: string, fallback = 0) {
  const v = input.get(name);
  if (v === null || v === "") return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}
function ps(input: FormData, name: string, fallback = "") {
  return String(input.get(name) ?? fallback);
}

export async function saveProductAction(input: FormData) {
  const id = ps(input, "id") || `p_${Date.now()}`;
  const name = ps(input, "name");
  const slug = ps(input, "slug") || slugify(name);
  const mrp = pf(input, "mrp");
  const price = pf(input, "price");
  const discountPercent = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
  const status = ps(input, "status") as Product["status"];
  const stock = pf(input, "stock");
  const finalStatus: Product["status"] = stock === 0 && status === "active" ? "out_of_stock" : status;

  const existing = (await getProducts()).find((p) => p.id === id);

  const imagesRaw = ps(input, "images");
  const images = imagesRaw
    .split(/\s*,\s*|\s*\n\s*/)
    .filter(Boolean)
    .map((url) => ({ url, alt: name }));

  const product: Product = {
    id,
    slug,
    name,
    sku: ps(input, "sku"),
    shortDescription: ps(input, "shortDescription"),
    description: ps(input, "description"),
    category: ps(input, "category"),
    collections: parseCSV(input.get("collections")),
    images: images.length ? images : existing?.images ?? [],
    mrp,
    price,
    discountPercent,
    stock,
    lowStockThreshold: pf(input, "lowStockThreshold", 5),
    weightGrams: pf(input, "weightGrams", 220),
    dimensions: ps(input, "dimensions", "8 × 8 × 9 cm"),
    fragrance: ps(input, "fragrance"),
    fragranceNotes: {
      top: parseCSV(input.get("notesTop")),
      heart: parseCSV(input.get("notesHeart")),
      base: parseCSV(input.get("notesBase")),
    },
    waxType: ps(input, "waxType", "Soy wax blend"),
    burnTimeHours: pf(input, "burnTimeHours", 45),
    ingredients: parseCSV(input.get("ingredients")),
    careInstructions: ps(input, "careInstructions")
      .split(/\r?\n/)
      .map((x) => x.trim())
      .filter(Boolean),
    tags: parseCSV(input.get("tags")),
    status: finalStatus,
    seoTitle: ps(input, "seoTitle") || undefined,
    seoDescription: ps(input, "seoDescription") || undefined,
    createdAt: existing?.createdAt ?? new Date().toISOString(),
    bestSeller: input.get("bestSeller") === "on",
    newArrival: input.get("newArrival") === "on",
    rating: existing?.rating ?? 4.7,
    reviewCount: existing?.reviewCount ?? 0,
    colors: (() => {
      const raw = ps(input, "colors");
      if (!raw) return existing?.colors;
      try {
        const parsed = JSON.parse(raw) as ProductColor[];
        return Array.isArray(parsed) && parsed.length
          ? parsed.filter((c) => c && c.name && c.hex && c.image)
          : undefined;
      } catch {
        return existing?.colors;
      }
    })(),
  };

  await upsertProduct(product);
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");
  return { ok: true, id: product.id, slug: product.slug };
}

export async function deleteProductAction(id: string) {
  await deleteProduct(id);
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { ok: true };
}

export async function duplicateProductAction(id: string) {
  const products = await getProducts();
  const p = products.find((x) => x.id === id);
  if (!p) return { ok: false };
  const clone: Product = {
    ...p,
    id: `p_${Date.now()}`,
    slug: `${p.slug}-copy`,
    name: `${p.name} (copy)`,
    status: "draft",
    createdAt: new Date().toISOString(),
  };
  await upsertProduct(clone);
  revalidatePath("/admin/products");
  return { ok: true, id: clone.id };
}

export async function updateStockAction(id: string, stock: number) {
  const products = await getProducts();
  const idx = products.findIndex((p) => p.id === id);
  if (idx < 0) return { ok: false };
  products[idx].stock = Math.max(0, stock);
  if (products[idx].stock === 0 && products[idx].status === "active")
    products[idx].status = "out_of_stock";
  else if (products[idx].stock > 0 && products[idx].status === "out_of_stock")
    products[idx].status = "active";
  await saveProducts(products);
  revalidatePath("/admin/inventory");
  revalidatePath("/admin/products");
  return { ok: true };
}
