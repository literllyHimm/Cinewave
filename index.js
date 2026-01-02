import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Paste your firebaseConfig from Firebase Console here
const firebaseConfig = {
    apiKey: "import.meta.env.VITE_FIREBASE_API_KEY",
    authDomain: "summative-8aef7.firebaseapp.com",
    projectId: "summative-8aef7",
    storageBucket: "summative-8aef7.firebasestorage.app",
    messagingSenderId: "612961193501",
    appId: "1:612961193501:web:aa95cf0147b02321ca40f4"
  };

const config = initializeApp(firebaseConfig)
const auth = getAuth(config);
const firestore = getFirestore(config);

export { auth, firestore };