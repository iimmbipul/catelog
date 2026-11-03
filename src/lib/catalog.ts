/* Cached, read-only view of Firestore for storefront pages.
 *
 * Only pages may read from here. Admin pages, server actions and API writes
 * must keep using db.ts: its save* helpers replace whole collections and delete
 * any doc missing from the list they are given, so feeding them a cached list
 * could overwrite newer edits or delete products.
 *
 * Admin writes in db.ts expire these tags straight away, so the TTL only matters
 * for changes made outside the app (Firebase console, scripts/*.mjs). */

import { cache } from "react";
import { unstable_cache } from "next/cache";
import * as db from "./db";
import { CATALOG_TAGS } from "./db";
import type { Product, ProductSummary } from "./types";

const TTL_SECONDS = 300;

/* unstable_cache shares a result across requests; React's cache() stops the
 * layout, footer and page from each going to it during a single render. */
function cached<T>(read: () => Promise<T>, tag: string) {
  return cache(unstable_cache(read, [tag], { tags: [tag], revalidate: TTL_SECONDS }));
}

export const getProducts = cached(db.getProducts, CATALOG_TAGS.products);
export const getCollections = cached(db.getCollections, CATALOG_TAGS.collections);
export const getSettings = cached(db.getSettings, CATALOG_TAGS.settings);
export const getCoupons = cached(db.getCoupons, CATALOG_TAGS.coupons);
export const getFaqs = cached(db.getFaqs, CATALOG_TAGS.faqs);
export const getInstagramPosts = cached(db.getInstagramPosts, CATALOG_TAGS.instagramPosts);
const getAllReviews = cached(() => db.getReviews(), CATALOG_TAGS.reviews);

export async function getProductBySlug(slug: string) {
  return (await getProducts()).find((p) => p.slug === slug) ?? null;
}
export async function getCollectionBySlug(slug: string) {
  return (await getCollections()).find((c) => c.slug === slug) ?? null;
}
export async function getReviews(productId?: string) {
  const all = await getAllReviews();
  return productId ? all.filter((r) => r.productId === productId) : all;
}

export function toProductSummary(p: Product): ProductSummary {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: p.category,
    collections: p.collections,
    images: p.images.slice(0, 1),
    mrp: p.mrp,
    price: p.price,
    discountPercent: p.discountPercent,
    stock: p.stock,
    fragrance: p.fragrance,
    status: p.status,
    createdAt: p.createdAt,
    bestSeller: p.bestSeller,
    newArrival: p.newArrival,
  };
}
