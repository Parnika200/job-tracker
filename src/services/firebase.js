import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyACqWhJ1ZPenmXjVA8LZnftTAoy6MZE1go",
  authDomain: "job-tracker-dashboard-73922.firebaseapp.com",
  projectId: "job-tracker-dashboard-73922",
  storageBucket: "job-tracker-dashboard-73922.firebasestorage.app",
  messagingSenderId: "841007472101",
  appId: "1:841007472101:web:0226d5540390615821630c"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);