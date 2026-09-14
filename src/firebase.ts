import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCTT-r_YEuWUjKK2Dm351OMuhV_Fsl_WHs",
  authDomain: "argi-concept-and-fact.firebaseapp.com",
  projectId: "argi-concept-and-fact",
  storageBucket: "argi-concept-and-fact.firebasestorage.app",
  messagingSenderId: "68806037716",
  appId: "1:68806037716:web:59c56814da45d4945bab41",
  measurementId: "G-JMTQCSDF39"
};

// Initialize Firebase safely
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
