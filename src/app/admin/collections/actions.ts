"use server";
import { revalidatePath } from "next/cache";
import { getCollections, saveCollections } from "@/lib/db";
import type { Collection } from "@/lib/types";

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function saveCollectionAction(fd: FormData) {
  const id = String(fd.get("id") ?? "") || `c_${Date.now()}`;
  const list = await getCollections();
  const existing = list.find((c) => c.id === id);

  const title = String(fd.get("title") ?? "").trim();
  const slug = String(fd.get("slug") ?? "").trim() || slugify(title);
  const parentSlugRaw = String(fd.get("parentSlug") ?? "").trim();

  const next: Collection = {
    id,
    slug,
    title,
    subtitle: String(fd.get("subtitle") ?? ""),
    description: String(fd.get("description") ?? ""),
    image: String(fd.get("image") ?? "") ||
      `https://picsum.photos/seed/ww-${slug}/1600/1200`,
    featured: fd.get("featured") === "on",
    productIds: existing?.productIds ?? [],
    parentSlug: parentSlugRaw && parentSlugRaw !== "__none" ? parentSlugRaw : undefined,
  };

  const idx = list.findIndex((c) => c.id === id);
  if (idx >= 0) list[idx] = next;
  else list.push(next);
  await saveCollections(list);
  revalidatePath("/admin/collections");
  revalidatePath("/collections");
  revalidatePath(`/collections/${slug}`);
  if (next.parentSlug) revalidatePath(`/collections/${next.parentSlug}`);
  return { ok: true };
}

export async function deleteCollectionAction(id: string) {
  const list = await getCollections();
  const target = list.find((c) => c.id === id);
  if (!target) return { ok: false };
  // Also detach any sub-collections that had this as parent
  const cleaned = list
    .filter((c) => c.id !== id)
    .map((c) => (c.parentSlug === target.slug ? { ...c, parentSlug: undefined } : c));
  await saveCollections(cleaned);
  revalidatePath("/admin/collections");
  revalidatePath("/collections");
  return { ok: true };
}
