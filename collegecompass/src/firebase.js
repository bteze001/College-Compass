import { initializeApp } from "firebase/app";
import {getFirestore} from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyClHJJBe-j_Xfdk9HU6IJVgSGkF4IREeCY",
  authDomain: "collegecompass-887ba.firebaseapp.com",
  projectId: "collegecompass-887ba",
  storageBucket: "collegecompass-887ba.firebasestorage.app",
  messagingSenderId: "556719180121",
  appId: "1:556719180121:web:2c700c214a4157ea8ae448",
  measurementId: "G-WDJ7SMG164"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);