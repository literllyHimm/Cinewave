import React, { createContext, useState, useEffect } from "react";
import { db, auth } from "../src/firebase";
import { 
  onAuthStateChanged, 
  signOut, 
  setPersistence, 
  browserSessionPersistence 
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const SharedContext = createContext();

export const SharedProvider = ({ children }) => {
  const [NavActive, setNavActive] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [cart, setCart] = useState([]);
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
  
        if (!userDoc.exists()) {
          console.warn("⚠️ User exists in Firebase Auth but missing in Firestore. Fixing...");
          await setDoc(userRef, {
            firstName: currentUser.displayName?.split(" ")[0] || "Unknown",
            lastName: currentUser.displayName?.split(" ")[1] || "",
            email: currentUser.email,
            selectedGenres: [],
          }, { merge: true });
  
          console.log("✅ Firestore user entry created.");
        }
      } else {
        console.log("User Logged Out");
        setUser(null);
      }
      setLoading(false);
    });
  
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Load cart from localStorage
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  // 🔹 Fetch user data from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      try {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
  
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setSelectedGenres(userData.selectedGenres || []); // ✅ Fetch genres immediately
        }
      } catch (error) {
        console.error("🔥 Error fetching user data:", error);
      }
    };
  
    if (user) {
      fetchUserData();
    }
  }, [user]); // ✅ Runs every time user changes
  

  // 🔹 Update user preferences in Firestore
  const updateUserPreferences = async (updatedData) => {
    if (!user) return;
    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, updatedData, { merge: true });
      console.log("✅ User preferences updated in Firestore.");
      setSelectedGenres(updatedData.selectedGenres || []);
    } catch (error) {
      console.error("🔥 Error updating user preferences:", error);
    }
  };

  // 🔹 Add item to cart
  const addToCart = (movie) => {
    setCart((prevCart) => {
      const updatedCart = [...prevCart, movie];
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  // 🔹 Remove item from cart
  const removeFromCart = (movieId) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((movie) => movie.id !== movieId);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  // 🔹 Logout function
  const logout = async () => {
    try {
      console.log("Logging out...");
      await setPersistence(auth, browserSessionPersistence);
      await signOut(auth);
      localStorage.clear();
      sessionStorage.clear();
      setUser(null);
      setSelectedGenres([]);
      setCart([]);
      console.log("User Logged Out Successfully.");
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
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
        cart,
        setCart,
        addToCart,
        removeFromCart,
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
