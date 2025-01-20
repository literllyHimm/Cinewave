import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom"; // ✅ Use only RouterProvider
import { SharedProvider } from "./SharedContext";
import { CartProvider } from "./context/CartContext";
import { router } from "./router"; // ✅ Your defined routes
import "./index.scss";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SharedProvider>
      <CartProvider>
        <RouterProvider router={router} /> {/* ✅ Ensure only one RouterProvider */}
      </CartProvider>
    </SharedProvider>
  </React.StrictMode>
);
