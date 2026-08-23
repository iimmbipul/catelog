/* One-shot script — sets every non-Christmas collection to a known-working
 * candle photo URL. Christmas keeps its own themed image. Admin can customise
 * any of these via /admin/collections → Edit → paste new URL. */

import { initializeApp } from "firebase/app";
import { collection as fsCollection, doc, getDocs, getFirestore, updateDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDoKZY53XOpQReRrBrf51VWoqoAlQ30hH8",
  authDomain: "whiteandwick-b5a7e.firebaseapp.com",
  projectId: "whiteandwick-b5a7e",
  storageBucket: "whiteandwick-b5a7e.firebasestorage.app",
  messagingSenderId: "144101508713",
  appId: "1:144101508713:web:31dfca8b8390f8974604f8",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* Small set of verified Unsplash candle photo IDs to rotate through so
 * collections look visually varied but every image renders. */
const CANDLE_PHOTOS = [
  "1512389142860-9c449e58a543", // festive candle/tree (christmas)
  "1602874801006-e26c4a5cb6b8", // hand-pour candle
  "1608501078713-8e445a709b39", // studio candles
  "1601295621523-b7906c67005e", // vanilla candle
  "1607344645852-fb69934bfa27", // amber jar
  "1616486338812-3dadae4b4ace", // interior candle scene
];

const pic = (id) =>
  `https://images.unsplash.com/photo-${id}?w=1600&q=80&auto=format&fit=crop`;

/* Deterministic pick per slug so each collection always renders the same image. */
function candleImageFor(slug) {
  let hash = 0;
  for (const ch of slug) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return pic(CANDLE_PHOTOS[hash % CANDLE_PHOTOS.length]);
}

const CHRISTMAS_IMAGE =
  "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=1600&q=80&auto=format&fit=crop";

const snap = await getDocs(fsCollection(db, "collections"));
const updates = [];

for (const d of snap.docs) {
  const data = d.data();
  const isChristmas = data.slug === "christmas";
  const nextImage = isChristmas ? CHRISTMAS_IMAGE : candleImageFor(data.slug);
  if (data.image === nextImage) {
    console.log(`ok    ${data.slug}`);
    continue;
  }
  updates.push(updateDoc(doc(db, "collections", d.id), { image: nextImage }));
  console.log(`▶ set ${data.slug}`);
}

await Promise.all(updates);
console.log(`\n✔ Updated ${updates.length} collection(s).`);
process.exit(0);
