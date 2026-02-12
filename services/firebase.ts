
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBoZMHL2LMYoJjmhORmU8NprUMPc3_WhtA",
  authDomain: "lovexybd.firebaseapp.com",
  projectId: "lovexybd",
  storageBucket: "lovexybd.firebasestorage.app",
  messagingSenderId: "677193563063",
  appId: "1:677193563063:web:6e36615d83fe835e2a8632"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
