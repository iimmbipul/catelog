/* One-shot cleanup — deletes the demo/seeded fixtures that were pushed to
 * Firestore during the early auto-seed phase. Only touches documents whose
 * IDs match the known seed IDs, so any real customer / order / review a real
 * shopper creates via the storefront stays untouched.
 *
 * After this runs, /admin/dashboard, /admin/analytics, /admin/orders,
 * /admin/customers, /admin/reviews, /admin/enquiries all reflect live data
 * only. */

import { initializeApp } from "firebase/app";
import { deleteDoc, doc, getFirestore } from "firebase/firestore";

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

const seededIds = {
  orders: ["o_1", "o_2", "o_3", "o_4", "o_5", "o_6"],
  customers: ["cus_ananya", "cus_meera", "cus_rhea", "cus_ishaan", "cus_priyanka"],
  reviews: ["r_1", "r_2", "r_3", "r_4", "r_5"],
  giftEnquiries: ["g_1", "g_2"],
};

let total = 0;
for (const [col, ids] of Object.entries(seededIds)) {
  for (const id of ids) {
    try {
      await deleteDoc(doc(db, col, id));
      console.log(`✔ deleted ${col}/${id}`);
      total++;
    } catch (err) {
      console.log(`  skipped ${col}/${id} (${err.message})`);
    }
  }
}
console.log(`\nRemoved ${total} seeded fixture(s).`);
process.exit(0);
