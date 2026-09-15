import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCTT-r_YEuWjKX2DM35iQMuhV_FsI_Whs",
  authDomain: "argi-concept-and-fact.firebaseapp.com",
  projectId: "argi-concept-and-fact",
  storageBucket: "argi-concept-and-fact.firebasestorage.app",
  messagingSenderId: "68806037716",
  appId: "1:68806037716:web:59c56814da45e945bab41",
  measurementId: "G-JMTQC3DF39"
};

// Initialize Firebase safely
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
