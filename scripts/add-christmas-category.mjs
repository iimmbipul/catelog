/* One-shot script — adds the "Christmas" category under "The Occasion Edit"
 * directly to Firestore. Run once with `node scripts/add-christmas-category.mjs`. */

import { initializeApp } from "firebase/app";
import { doc, getFirestore, setDoc } from "firebase/firestore";

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

/* A Christmas-themed hero image (jingle bells / festive candles / tree). */
const christmasImage =
  "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=1600&q=80&auto=format&fit=crop";

const christmas = {
  id: "c_occ_christmas",
  slug: "christmas",
  title: "Christmas",
  subtitle: "Jingle bells, warm rooms, giftable candles",
  description:
    "Festive candles and hampers for Christmas — jingle-bell gift bows, warm mulled-wine scents, and everything that makes the season feel like Christmas.",
  image: christmasImage,
  featured: false,
  productIds: [],
  parentSlug: "the-occasion-edit",
};

await setDoc(doc(db, "collections", christmas.id), christmas);
console.log("✔ Added Christmas category under The Occasion Edit");
process.exit(0);
