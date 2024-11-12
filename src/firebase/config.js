import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDR8JfgZZ8kzzFTfDfyEZU5GoWWqQrClJY",
  authDomain: "gastos-couple.firebaseapp.com",
  projectId: "gastos-couple",
  storageBucket: "gastos-couple.firebasestorage.app",
  messagingSenderId: "1061484487529",
  appId: "1:1061484487529:web:17b4b759eb59c376add3f8",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
