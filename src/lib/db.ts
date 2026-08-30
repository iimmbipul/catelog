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
import { unstable_noStore as noStore } from "next/cache";
import { COL, SETTINGS_DOC, getFirestoreDb } from "./firebase";
import type {
  Banner,
  Collection,
  Coupon,
  Customer,
  FAQ,
  GiftEnquiry,
  InstagramPost,
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
  // Opt every calling page out of the Next.js Data Cache — Firestore is the
  // source of truth and must be re-read on each request.
  noStore();
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
    address: "Studio, Bengaluru, India",
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
    story: {
      eyebrow: "Our story",
      heading: "Made slowly,\n to be lived with.",
      body1:
        "White & Wick was born from a love of small, everyday rituals. Every candle we make is hand-poured in small batches, from a wax we blend ourselves, with fragrances crafted by perfumers we love and packaging made with care.",
      body2:
        "We're not trying to be the biggest candle in the room. Just the one you keep reaching for.",
      image: "",
      ctaLabel: "More about White & Wick",
      ctaHref: "/about",
    },
    giftingBanner: {
      eyebrow: "Gifting",
      heading: "Small gifts that\n feel considered.",
      body:
        "Hampers for weddings, corporate favours, and thoughtful thank-yous — with free gift-wrap and hand-written cards.",
      image: "",
      ctaLabel: "Explore gifting",
      ctaHref: "/gifting",
    },
  },
  about: {
    eyebrow: "About White & Wick",
    heading: "Made slowly, to be lived with.",
    intro:
      "We began in 2022 with a copper pot, three friends, and a stubborn idea — that candles should be more than perfume. That they should hold a room, gently.",
    image: "",
    craftEyebrow: "Our craft",
    craftBody:
      "Everything we make is hand-poured, in small batches, from a soy and coconut wax we blend ourselves. We work with three independent perfumers whose noses we trust — for the notes, and for the restraint. We prefer under-perfumed to over-perfumed. A candle should suggest, not shout.\n\nOur labels are printed on recycled paper near the studio. Our boxes are hand-tied. And every hamper leaves the door with a card written by one of us.",
    quoteEyebrow: "The house",
    quote: "Not the biggest candle in the room. The one you keep reaching for.",
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
  noStore();
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
  noStore();
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
export async function getInstagramPosts() {
  const all = await listAll<InstagramPost>(COL.instagramPosts);
  return all.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
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
export async function markOrderPaid(orderNumber: string, paymentId: string) {
  const orders = await getOrders();
  const idx = orders.findIndex((o) => o.orderNumber === orderNumber);
  if (idx === -1) return null;
  const updated: Order = {
    ...orders[idx],
    paymentStatus: "paid",
    orderStatus: orders[idx].orderStatus === "new" ? "confirmed" : orders[idx].orderStatus,
    notes: [orders[idx].notes, `Razorpay payment: ${paymentId}`].filter(Boolean).join(" · "),
  };
  await setDoc(
    doc(getFirestoreDb(), COL.orders, updated.id),
    stripUndefined(updated) as object,
  );
  return updated;
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
export async function saveInstagramPosts(list: InstagramPost[]) {
  await replaceCollection(COL.instagramPosts, list);
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
