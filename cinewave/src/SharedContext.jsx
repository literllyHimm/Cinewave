import React, { createContext, useState, useEffect } from "react";
import { db, auth } from "../src/firebase";
import { onAuthStateChanged, signOut, setPersistence, browserSessionPersistence } from "firebase/auth";
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        console.log("User Logged In:", currentUser.email);
        setUser(currentUser);
        const userRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setSelectedGenres(userData.selectedGenres || []);

          if (!userData.selectedGenres || userData.selectedGenres.length === 0) {
            setShouldRedirect(true); // ✅ Flag to redirect later
          }
        } else {
          console.warn("No user data found. Redirecting to select genres.");
          setShouldRedirect(true); // ✅ Flag to redirect later
        }
      } else {
        console.log("User Logged Out");
        setUser(null);
        setSelectedGenres([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      console.log("Logging out...");
      await setPersistence(auth, browserSessionPersistence);
      await signOut(auth);
      localStorage.clear();
      sessionStorage.clear();
      setUser(null);
      setSelectedGenres([]);
      console.log("User Logged Out Successfully.");
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    } catch (error) {
      console.error("Logout Error:", error);
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
        ShowProfile,
        setShowProfile,
        processing,
        setProcessing,
        ThemeOptions,
        setThemeOptions,
        logout,
        loading,
        shouldRedirect, // ✅ Expose this for redirection
      }}
    >
      {!loading ? children : <div className="loading-screen">Loading...</div>}
    </SharedContext.Provider>
  );
};
