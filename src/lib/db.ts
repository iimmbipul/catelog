/* Firestore-backed data layer for White & Wick.
 *
 * Every read/write in the app funnels through this file. If a Firestore
 * collection is empty on first read, it's seeded from the JSON files in
 * /data (or from the fallback seed module). This gives you a one-shot
 * migration from the previous file-based store on first load. */

import {
  collection as fsCollection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { promises as fs } from "node:fs";
import path from "node:path";
import { COL, SETTINGS_DOC, getFirestoreDb } from "./firebase";
import { seed } from "./seed";
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

const DATA_DIR = path.join(process.cwd(), "data");

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

async function readJsonFallback<T>(fileName: string, defaults: T): Promise<T> {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, fileName), "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return defaults;
  }
}

/* Get all docs of a collection. If Firestore has none, seed the collection
 * from the local JSON file (or the bundled seed) and return the seeded list. */
async function listOrSeed<T extends { id: string }>(
  colName: string,
  fileName: string,
  fallback: T[],
): Promise<T[]> {
  const db = getFirestoreDb();
  const snap = await getDocs(fsCollection(db, colName));
  if (!snap.empty) {
    return snap.docs.map((d) => d.data() as T);
  }
  const seedData = await readJsonFallback<T[]>(fileName, fallback);
  if (seedData.length === 0) return [];
  const batch = writeBatch(db);
  for (const item of seedData) batch.set(doc(db, colName, item.id), stripUndefined(item) as object);
  await batch.commit();
  return seedData;
}

async function getOrSeedSingleton<T>(
  colName: string,
  docId: string,
  fileName: string,
  fallback: T,
): Promise<T> {
  const db = getFirestoreDb();
  const ref = doc(db, colName, docId);
  const snap = await getDoc(ref);
  if (snap.exists()) return snap.data() as T;
  const seedData = await readJsonFallback<T>(fileName, fallback);
  await setDoc(ref, stripUndefined(seedData) as object);
  return seedData;
}

/* Replace an entire collection with the given items (diff-and-apply). */
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

/* -------- Public read API (unchanged signatures) -------- */

export async function initData() {
  // Kept for backwards compatibility with any caller. Reads warm the cache
  // and trigger the first-time seed automatically.
  await Promise.all([
    getProducts(),
    getCollections(),
    getCustomers(),
    getOrders(),
    getCoupons(),
    getBanners(),
    getReviews(),
    getFaqs(),
    getGiftEnquiries(),
    getSettings(),
  ]);
}

export async function getProducts() {
  return listOrSeed<Product>(COL.products, "products.json", seed.products);
}
export async function getProductBySlug(slug: string) {
  return (await getProducts()).find((p) => p.slug === slug) ?? null;
}
export async function getProductById(id: string) {
  const db = getFirestoreDb();
  const snap = await getDoc(doc(db, COL.products, id));
  return snap.exists() ? (snap.data() as Product) : null;
}
export async function getCollections() {
  return listOrSeed<Collection>(COL.collections, "collections.json", seed.collections);
}
export async function getCollectionBySlug(slug: string) {
  return (await getCollections()).find((c) => c.slug === slug) ?? null;
}
export async function getSettings() {
  return getOrSeedSingleton<Settings>(COL.settings, SETTINGS_DOC, "settings.json", seed.settings);
}
export async function getOrders() {
  return listOrSeed<Order>(COL.orders, "orders.json", seed.orders);
}
export async function getOrderByNumber(num: string) {
  return (await getOrders()).find((o) => o.orderNumber === num) ?? null;
}
export async function getCustomers() {
  return listOrSeed<Customer>(COL.customers, "customers.json", seed.customers);
}
export async function getCoupons() {
  return listOrSeed<Coupon>(COL.coupons, "coupons.json", seed.coupons);
}
export async function getCouponByCode(code: string) {
  return (await getCoupons()).find((c) => c.code.toLowerCase() === code.toLowerCase()) ?? null;
}
export async function getBanners() {
  return listOrSeed<Banner>(COL.banners, "banners.json", seed.banners);
}
export async function getReviews(productId?: string) {
  const all = await listOrSeed<Review>(COL.reviews, "reviews.json", seed.reviews);
  return productId ? all.filter((r) => r.productId === productId) : all;
}
export async function getFaqs() {
  return listOrSeed<FAQ>(COL.faqs, "faqs.json", seed.faqs);
}
export async function getGiftEnquiries() {
  return listOrSeed<GiftEnquiry>(COL.giftEnquiries, "giftEnquiries.json", seed.giftEnquiries);
}

/* -------- Public write API (unchanged signatures) -------- */

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
  await setDoc(doc(getFirestoreDb(), COL.settings, SETTINGS_DOC), stripUndefined(settings) as object);
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

/* -------- Convenience helpers -------- */

export async function upsertProduct(product: Product) {
  await setDoc(doc(getFirestoreDb(), COL.products, product.id), stripUndefined(product) as object);
}

export async function deleteProduct(id: string) {
  await deleteDoc(doc(getFirestoreDb(), COL.products, id));
}
