import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, setPersistence, browserSessionPersistence } from "firebase/auth";

// 🔹 Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAXskJDJWn1OcTX87Q6m2Kwd6PAhh5NsVY",
  authDomain: "summative-8aef7.firebaseapp.com",
  projectId: "summative-8aef7",
  storageBucket: "summative-8aef7.appspot.com", 
  messagingSenderId: "612961193501",
  appId: "1:612961193501:web:aa95cf0147b02321ca40f4"
};

// 🔹 Initialize Firebase App
const app = initializeApp(firebaseConfig);

// 🔹 Initialize Services
export const db = getFirestore(app);  // Firestore Database
export const auth = getAuth(app);      // Authentication
export const googleProvider = new GoogleAuthProvider(); // ✅ Google Sign-In Provider

// 🔹 Set Authentication Persistence (Clears session on browser close)
setPersistence(auth, browserSessionPersistence)
  .then(() => console.log("✅ Firebase Auth set to session persistence"))
  .catch((error) => console.error("⚠️ Error setting persistence:", error));

export default app; // 🔹 Export Firebase App (if needed elsewhere)
