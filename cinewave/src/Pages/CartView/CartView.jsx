import React, { useContext, useEffect, useState } from "react";
import { SharedContext } from "../../SharedContext";
import { db } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import "./CartView.scss";

const CartView = () => {
  const { user, cart, setCart, removeFromCart } = useContext(SharedContext);
  const [purchasedMovies, setPurchasedMovies] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (user) {
      fetchPurchaseHistory();
    }
  }, [user]);

  // 🔹 Fetch user's past purchases
  const fetchPurchaseHistory = async () => {
    try {
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setPurchasedMovies(userData.purchases || []);
      } else {
        setPurchasedMovies([]);
      }
    } catch (error) {
      console.error("🔥 Error fetching purchase history:", error);
      setError("Error fetching purchase history.");
    }
  };

  // 🔹 Remove already purchased movies
  const filterAlreadyPurchased = (cartItems) => {
    return cartItems?.filter(
      (movie) => !purchasedMovies.some((purchased) => purchased.id === movie.id)
    ) || [];
  };

  // 🔹 Checkout
  const handleCheckout = async () => {
    if (!user) {
      setError("⚠️ You must be logged in to complete a purchase.");
      return;
    }

    if (!cart || cart.length === 0) {
      setError("⚠️ Your cart is empty!");
      return;
    }

    const filteredCart = filterAlreadyPurchased(cart);
    if (filteredCart.length === 0) {
      setError("⚠️ All selected movies have already been purchased.");
      return;
    }

    try {
      const purchaseData = filteredCart.map((movie) => ({
        id: movie.id,
        title: movie.title || movie.name,
        poster: movie.poster_path,
        purchasedAt: new Date(),
      }));

      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);
      let previousPurchases = [];

      if (userDoc.exists()) {
        previousPurchases = userDoc.data().purchases || [];
      }

      await setDoc(userRef, { purchases: [...previousPurchases, ...purchaseData] }, { merge: true });

      setPurchasedMovies([...previousPurchases, ...purchaseData]);
      setCart([]);
      localStorage.removeItem("cart");

      setSuccess("✅ Purchase successful! Thank you for your order.");
    } catch (error) {
      console.error("🔥 Error completing purchase:", error);
      setError("🔥 An error occurred during checkout. Please try again.");
    }
  };

  return (
    <div className="cart-container">
      <h1>Shopping Cart</h1>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="cart-items">
            {filterAlreadyPurchased(cart).map((movie) => (
              <li key={movie.id}>
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title || movie.name}
                />
                <span>{movie.title || movie.name}</span>
                <button onClick={() => removeFromCart(movie.id)}>Remove</button>
              </li>
            ))}
          </ul>
          <button className="checkout-button" onClick={handleCheckout}>
            Checkout
          </button>
        </>
      )}
    </div>
  );
};

export default CartView;
