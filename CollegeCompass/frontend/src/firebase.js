// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "@firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);
export const firestore = getFirestore(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth , db};