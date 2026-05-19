import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, limit } from 'firebase/firestore';
import fs from 'fs';
const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
async function test() {
  try {
    const q = query(collection(db, "scores"), limit(20));
    const snap = await getDocs(q);
    console.log("Success!", snap.docs.length);
    process.exit(0);
  } catch (e) {
    if (e.code === 'permission-denied') console.error("Permission denied!");
    else console.error(e);
    process.exit(1);
  }
}
test();
