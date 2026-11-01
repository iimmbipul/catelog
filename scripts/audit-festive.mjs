/* One-shot — print which products are tagged under the slugs that
 * /collections/festive-gifts aggregates (festive-gifts, rakhi, diwali, christmas). */

import { initializeApp } from "firebase/app";
import { collection as fsCol, getDocs, getFirestore } from "firebase/firestore";

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

const SLUGS = ["festive-gifts", "rakhi", "diwali", "christmas"];

const snap = await getDocs(fsCol(db, "products"));
const products = snap.docs.map((d) => d.data());

console.log(`Total products in Firestore: ${products.length}\n`);

for (const slug of SLUGS) {
  const tagged = products.filter((p) => (p.collections ?? []).includes(slug));
  const active = tagged.filter((p) => p.status !== "archived" && p.status !== "draft");
  console.log(`[${slug}]  ${active.length} active product(s)` + (tagged.length > active.length ? ` (${tagged.length - active.length} hidden/archived)` : ""));
  for (const p of active) console.log(`    - ${p.name}  (${p.status})`);
  if (active.length === 0) console.log("    (none)");
  console.log();
}

process.exit(0);
