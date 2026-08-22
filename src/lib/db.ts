/* Firestore-only data layer. No seeding, no filesystem fallback, no
 * bundled starter data. Every read goes straight to Firestore; every
 * write does the same. If a collection is empty, callers see empty. */

import {
  collection as fsCollection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { COL, SETTINGS_DOC, getFirestoreDb } from "./firebase";
import type {
  Banner,
  Collection,
  Coupon,
  Customer,
  FAQ,
  GiftEnquiry,
  Order,
  Product,
  Review,
  Settings,
} from "./types";

/* -------- helpers -------- */

/* Firestore rejects any field whose value is exactly `undefined`. Strip
 * them recursively (arrays keep their items, objects lose the undefined keys). */
function stripUndefined<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((v) => stripUndefined(v)) as unknown as T;
  }
  if (value !== null && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (v === undefined) continue;
      out[k] = stripUndefined(v);
    }
    return out as T;
  }
  return value;
}

async function listAll<T extends { id: string }>(colName: string): Promise<T[]> {
  const snap = await getDocs(fsCollection(getFirestoreDb(), colName));
  return snap.docs.map((d) => d.data() as T);
}

/* Fallback Settings — only used to render the site chrome (announcement bar,
 * hero heading, contact block) when the settings/main doc has not yet been
 * created in Firestore. Admins can override every field in /admin/settings. */
const DEFAULT_SETTINGS: Settings = {
  freeShippingAbove: 999,
  currency: "INR",
  announcementBar:
    "Hand-poured with love • Free shipping above ₹999 • Complimentary gift-wrap on hampers",
  socials: {
    instagram: "https://instagram.com/whiteandwick",
    whatsapp: "https://wa.me/919999999999",
  },
  contact: {
    email: "hello@whiteandwick.co",
    phone: "+91 99999 99999",
    address: "Studio, Mumbai, India",
  },
  homepage: {
    heroHeading: "Light something\nbeautiful.",
    heroSubheading:
      "Hand-poured scented candles for slow mornings, warm evenings, and everything in between.",
    heroImage: "https://picsum.photos/seed/ww-hero-candle/1600/1900",
    heroCtaLabel: "Shop Candles",
    heroCtaHref: "/shop",
    secondaryCtaLabel: "Explore Gifting",
    secondaryCtaHref: "/gifting",
  },
};

/* -------- Public read API -------- */

export async function initData() {
  // Kept as a no-op for backwards-compat with any callers.
}

export async function getProducts() {
  return listAll<Product>(COL.products);
}
export async function getProductBySlug(slug: string) {
  return (await getProducts()).find((p) => p.slug === slug) ?? null;
}
export async function getProductById(id: string) {
  const snap = await getDoc(doc(getFirestoreDb(), COL.products, id));
  return snap.exists() ? (snap.data() as Product) : null;
}
export async function getCollections() {
  return listAll<Collection>(COL.collections);
}
export async function getCollectionBySlug(slug: string) {
  return (await getCollections()).find((c) => c.slug === slug) ?? null;
}
export async function getSettings(): Promise<Settings> {
  const snap = await getDoc(doc(getFirestoreDb(), COL.settings, SETTINGS_DOC));
  return snap.exists() ? (snap.data() as Settings) : DEFAULT_SETTINGS;
}
export async function getOrders() {
  return listAll<Order>(COL.orders);
}
export async function getOrderByNumber(num: string) {
  return (await getOrders()).find((o) => o.orderNumber === num) ?? null;
}
export async function getCustomers() {
  return listAll<Customer>(COL.customers);
}
export async function getCoupons() {
  return listAll<Coupon>(COL.coupons);
}
export async function getCouponByCode(code: string) {
  return (await getCoupons()).find((c) => c.code.toLowerCase() === code.toLowerCase()) ?? null;
}
export async function getBanners() {
  return listAll<Banner>(COL.banners);
}
export async function getReviews(productId?: string) {
  const all = await listAll<Review>(COL.reviews);
  return productId ? all.filter((r) => r.productId === productId) : all;
}
export async function getFaqs() {
  return listAll<FAQ>(COL.faqs);
}
export async function getGiftEnquiries() {
  return listAll<GiftEnquiry>(COL.giftEnquiries);
}

/* -------- Public write API -------- */

/* Replace an entire collection with the given items (diff-and-apply).
 * NOTE: deletes any Firestore doc whose id is not in `items`. Callers must
 * pass the full, current list to avoid data loss. */
async function replaceCollection<T extends { id: string }>(colName: string, items: T[]) {
  const db = getFirestoreDb();
  const current = await getDocs(fsCollection(db, colName));
  const currentIds = new Set(current.docs.map((d) => d.id));
  const batch = writeBatch(db);
  for (const item of items) {
    batch.set(doc(db, colName, item.id), stripUndefined(item) as object);
    currentIds.delete(item.id);
  }
  for (const id of currentIds) {
    batch.delete(doc(db, colName, id));
  }
  await batch.commit();
}

export async function saveProducts(products: Product[]) {
  await replaceCollection(COL.products, products);
}
export async function saveOrders(orders: Order[]) {
  await replaceCollection(COL.orders, orders);
}
export async function saveCoupons(coupons: Coupon[]) {
  await replaceCollection(COL.coupons, coupons);
}
export async function saveBanners(banners: Banner[]) {
  await replaceCollection(COL.banners, banners);
}
export async function saveReviews(reviews: Review[]) {
  await replaceCollection(COL.reviews, reviews);
}
export async function saveFaqs(faqs: FAQ[]) {
  await replaceCollection(COL.faqs, faqs);
}
export async function saveSettings(settings: Settings) {
  await setDoc(
    doc(getFirestoreDb(), COL.settings, SETTINGS_DOC),
    stripUndefined(settings) as object,
  );
}
export async function saveGiftEnquiries(list: GiftEnquiry[]) {
  await replaceCollection(COL.giftEnquiries, list);
}
export async function saveCustomers(list: Customer[]) {
  await replaceCollection(COL.customers, list);
}
export async function saveCollections(list: Collection[]) {
  await replaceCollection(COL.collections, list);
}

/* -------- Single-doc helpers -------- */

export async function upsertProduct(product: Product) {
  await setDoc(
    doc(getFirestoreDb(), COL.products, product.id),
    stripUndefined(product) as object,
  );
}

export async function deleteProduct(id: string) {
  await deleteDoc(doc(getFirestoreDb(), COL.products, id));
}
