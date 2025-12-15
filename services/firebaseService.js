// services/firebaseService.js
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import fbConfig from "../firebaseConfig";

if (!getApps().length) initializeApp(fbConfig);
const db = getFirestore();

export async function createTicket(name, email, message) {
  return await addDoc(collection(db, "tickets"), {
    name,
    email,
    message,
    status: "open",
    createdAt: serverTimestamp()
  });
}
