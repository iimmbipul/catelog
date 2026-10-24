/* One-shot — update the studio address shown on /contact. Run with:
 *   node scripts/update-studio-address.mjs */

import { initializeApp } from "firebase/app";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";

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

const ref = doc(db, "settings", "main");
const snap = await getDoc(ref);
const current = snap.exists() ? snap.data() : {};

const next = {
  ...current,
  contact: {
    ...(current.contact ?? {}),
    address: "Handcrafted in Bengaluru",
  },
};

function clean(o) {
  if (Array.isArray(o)) return o.map(clean);
  if (o && typeof o === "object") {
    const r = {};
    for (const [k, v] of Object.entries(o)) if (v !== undefined) r[k] = clean(v);
    return r;
  }
  return o;
}

await setDoc(ref, clean(next));
console.log("✔ Studio address set to \"Handcrafted in Bengaluru\"");
process.exit(0);
