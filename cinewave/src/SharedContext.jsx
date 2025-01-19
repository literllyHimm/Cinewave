import React, { createContext, useState, useEffect } from "react";
import { db, auth } from "../src/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const SharedContext = createContext();

export const SharedProvider = ({ children }) => {
  const [NavActive, setNavActive] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [ShowProfile, setShowProfile] = useState(false);
  const [processing, setProcessing] = useState({ started: null, success: null });
  const [ThemeOptions, setThemeOptions] = useState(false);
  const [loading, setLoading] = useState(true); // Prevent rendering before Firebase loads

  // 🔹 Listen for Firebase Authentication State Changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        console.log("User Logged In:", currentUser.email);
        setUser(currentUser);
        await fetchUserData(currentUser.uid); // ✅ Fetch user preferences
      } else {
        console.log("User Logged Out");
        setUser(null);
        setSelectedGenres([]);
        localStorage.removeItem("cart"); // ✅ Clear local storage on logout
      }
      setLoading(false);
    });
  
    return () => unsubscribe();
  }, []);
  

  // 🔹 Fetch User Data from Firestore (Genres, Name, etc.)
  const fetchUserData = async (uid) => {
    if (!uid) {
      console.warn("⚠️ No user ID provided, skipping fetch.");
      return;
    }

    try {
      const userRef = doc(db, "users", uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log("✅ Fetched user data:", userData);
        setSelectedGenres(userData.selectedGenres || []);
      } else {
        console.warn("⚠️ No user data found in Firestore. Creating default profile.");
        await setDoc(userRef, { selectedGenres: [] });
      }
    } catch (error) {
      console.error("🔥 Error fetching user data:", error);
    }
  };

  // 🔹 Update User Preferences in Firestore
  const updateUserPreferences = async (updatedData) => {
    if (!user) {
      console.warn("⚠️ Cannot update preferences: User not logged in.");
      return;
    }

    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, updatedData, { merge: true });
      console.log("✅ User preferences updated in Firestore.");
      setSelectedGenres(updatedData.selectedGenres || []);
    } catch (error) {
      console.error("🔥 Error updating user preferences:", error);
    }
  };

  // 🔹 Logout Function
 // 🔹 Logout Function
const logout = async () => {
  try {
    await signOut(auth); // ✅ Sign out from Firebase
    localStorage.removeItem("cart"); // ✅ Clear local storage
    localStorage.removeItem("user"); // ✅ Clear user session storage (if stored)
    setUser(null); // ✅ Reset user state in Context
    setSelectedGenres([]); // ✅ Clear selected genres
    console.log("✅ User Logged Out Successfully.");
  } catch (error) {
    console.error("⚠️ Logout Error:", error);
  }
};


  return (
    <SharedContext.Provider
      value={{
        NavActive,
        setNavActive,
        user,
        setUser,
        selectedGenres,
        setSelectedGenres,
        updateUserPreferences, // Function to update Firestore
        ShowProfile,
        setShowProfile,
        processing,
        setProcessing,
        ThemeOptions,
        setThemeOptions,
        logout, // Logout function
        loading,
      }}
    >
      {!loading ? children : <div className="loading-screen">Loading...</div>}
      {/* Prevent rendering until Firebase loads */}
    </SharedContext.Provider>
  );
};
