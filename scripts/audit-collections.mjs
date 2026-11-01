import { initializeApp } from "firebase/app";
import { collection as fsCol, getDocs, getFirestore } from "firebase/firestore";
const app = initializeApp({ apiKey: "AIzaSyDoKZY53XOpQReRrBrf51VWoqoAlQ30hH8", authDomain: "whiteandwick-b5a7e.firebaseapp.com", projectId: "whiteandwick-b5a7e", storageBucket: "whiteandwick-b5a7e.firebasestorage.app", messagingSenderId: "144101508713", appId: "1:144101508713:web:31dfca8b8390f8974604f8" });
const db = getFirestore(app);
const snap = await getDocs(fsCol(db, "collections"));
const list = snap.docs.map(d => d.data());
console.log("All collections:");
for (const c of list) console.log(`  ${c.slug.padEnd(22)} parent=${c.parentSlug ?? '-'}   title=${c.title}`);
process.exit(0);
