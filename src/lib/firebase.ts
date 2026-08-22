import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

/* Firebase Web SDK config for the White & Wick project.
 * Values can be overridden with NEXT_PUBLIC_FIREBASE_* env vars, otherwise
 * the fallbacks (safe-to-publish API keys) are used. */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "AIzaSyDoKZY53XOpQReRrBrf51VWoqoAlQ30hH8",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "whiteandwick-b5a7e.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "whiteandwick-b5a7e",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "whiteandwick-b5a7e.firebasestorage.app",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "144101508713",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "1:144101508713:web:31dfca8b8390f8974604f8",
};

let cachedApp: FirebaseApp | null = null;
let cachedDb: Firestore | null = null;

export function getFirebaseApp() {
  if (cachedApp) return cachedApp;
  cachedApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return cachedApp;
}

export function getFirestoreDb() {
  if (cachedDb) return cachedDb;
  cachedDb = getFirestore(getFirebaseApp());
  return cachedDb;
}

/* Firestore collection names, kept in one place so refactors stay safe. */
export const COL = {
  products: "products",
  collections: "collections",
  customers: "customers",
  orders: "orders",
  coupons: "coupons",
  banners: "banners",
  reviews: "reviews",
  faqs: "faqs",
  giftEnquiries: "giftEnquiries",
  settings: "settings",
} as const;

/* Doc id used for the single settings document. */
export const SETTINGS_DOC = "main";
