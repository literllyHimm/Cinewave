import React, { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import { db, auth } from "../../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import "./CartView.scss";

const CartView = () => {
  const { cart, removeFromCart, clearCart } = useCart() || {};
  const [purchasedMovies, setPurchasedMovies] = useState(() => {
    const savedPurchases = localStorage.getItem("purchases");
    return savedPurchases ? JSON.parse(savedPurchases) : [];
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchPurchases = async () => {
      if (auth.currentUser) {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const purchases = userDoc.data().purchases || [];
          setPurchasedMovies(purchases);
          localStorage.setItem("purchases", JSON.stringify(purchases));
        }
      }
    };
    fetchPurchases();
  }, [cart]);

  const handleCheckout = async () => {
    if (!auth.currentUser) {
      setMessage("You must be logged in to complete your purchase.");
      return;
    }

    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      const updatedPurchases = [...new Set([...purchasedMovies, ...cart])]; // Avoid duplicates
      await setDoc(userRef, { purchases: updatedPurchases }, { merge: true });

      setPurchasedMovies(updatedPurchases);
      localStorage.setItem("purchases", JSON.stringify(updatedPurchases));
      localStorage.removeItem("cart");
      if (clearCart) {
        clearCart();
      } else {
        console.warn("clearCart is not available in useCart context.");
      }
      setMessage("Thank you for your purchase! Your movies are now available.");
    } catch (error) {
      console.error("Error during checkout:", error);
      setMessage("An error occurred during checkout. Please try again.");
    }
  };

  return (
    <div className="cart-view-container">
      <h1>Your Cart</h1>
      {message && <p className="success-message">{message}</p>}
      {cart?.length > 0 ? (
        <div className="cart-items">
          {cart.map((movie) => (
            <div key={movie.id} className="cart-item">
              <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} />
              <div className="movie-details">
                <h3>{movie.title}</h3>
                {purchasedMovies.includes(movie.id) ? (
                  <span className="already-purchased">Already Purchased</span>
                ) : (
                  <button onClick={() => removeFromCart(movie.id)}>Remove</button>
                )}
              </div>
            </div>
          ))}
          <button className="checkout-button" onClick={handleCheckout}>Checkout</button>
        </div>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

export default CartView;
