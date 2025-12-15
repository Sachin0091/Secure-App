// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCHROAZD75C6EM3kh-XM0R91p-rOzqNx-s",
  authDomain: "app-aa4c1.firebaseapp.com",
  projectId: "app-aa4c1",
  storageBucket: "app-aa4c1.firebasestorage.app",
  messagingSenderId: "227166492080",
  appId: "1:227166492080:web:4f82d601fe86daa957f275"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

export default app;
