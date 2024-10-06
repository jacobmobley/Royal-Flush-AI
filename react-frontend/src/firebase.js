import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAB17cAEAazgHGbj8QBG8SJ0yE-gyPNnuo",
  authDomain: "royalflushai-database.firebaseapp.com",
  projectId: "royalflushai-database",
  storageBucket: "royalflushai-database.appspot.com",
  messagingSenderId: "1013082457124",
  appId: "1:1013082457124:web:a413a98845e23f3b1dc4b1",
  measurementId: "G-J0V98K5DRD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);