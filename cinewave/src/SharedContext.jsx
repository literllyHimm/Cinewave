import React, { createContext, useState, useEffect } from "react";
import { db, auth } from "../src/firebase";
import {
  onAuthStateChanged,
  signOut,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const SharedContext = createContext();

export const SharedProvider = ({ children }) => {
  const [NavActive, setNavActive] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [ShowProfile, setShowProfile] = useState(false);
  const [processing, setProcessing] = useState({ started: null, success: null });
  const [ThemeOptions, setThemeOptions] = useState(false);
  const [loading, setLoading] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  // ✅ Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          console.log("User Logged In:", currentUser.email);
          setUser(currentUser);

          // Ensure Firestore user doc exists
          const userRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userRef);

          if (!userDoc.exists()) {
            console.warn(
              "⚠️ User exists in Firebase Auth but missing in Firestore. Creating doc..."
            );

            await setDoc(
              userRef,
              {
                firstName: currentUser.displayName?.split(" ")[0] || "Unknown",
                lastName: currentUser.displayName?.split(" ")[1] || "",
                email: currentUser.email,
                selectedGenres: [],
              },
              { merge: true }
            );

            console.log("✅ Firestore user entry created.");
          }
        } else {
          console.log("User Logged Out");
          setUser(null);
          setSelectedGenres([]);
        }
      } catch (err) {
        console.error("🔥 Auth listener error:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // ✅ Fetch user data from Firestore when user changes
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setSelectedGenres(userData.selectedGenres || []);
        }
      } catch (error) {
        console.error("🔥 Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [user]);

  // ✅ Update user preferences in Firestore
  const updateUserPreferences = async (updatedData) => {
    if (!user) return;

    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, updatedData, { merge: true });
      console.log("✅ User preferences updated in Firestore.");

      if (updatedData.selectedGenres) {
        setSelectedGenres(updatedData.selectedGenres);
      }
    } catch (error) {
      console.error("🔥 Error updating user preferences:", error);
    }
  };

  // ✅ Logout function (no cart cleanup now)
  const logout = async () => {
    try {
      console.log("Logging out...");
      await setPersistence(auth, browserSessionPersistence);
      await signOut(auth);

      localStorage.clear();
      sessionStorage.clear();

      setUser(null);
      setSelectedGenres([]);
      setShowProfile(false);

      console.log("User Logged Out Successfully.");
      setTimeout(() => {
        window.location.href = "/";
      }, 300);
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
        updateUserPreferences,

        ShowProfile,
        setShowProfile,

        processing,
        setProcessing,

        ThemeOptions,
        setThemeOptions,

        logout,
        loading,

        shouldRedirect,
        setShouldRedirect, // (you had state but weren’t exposing setter)
      }}
    >
      {!loading ? children : <div className="loading-screen">Loading...</div>}
    </SharedContext.Provider>
  );
};
