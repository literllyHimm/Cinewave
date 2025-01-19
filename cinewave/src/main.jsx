import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { SharedProvider } from "./SharedContext";
import { CartProvider } from "./context/CartContext"; // Import Cart Context
import { router } from "./router";
import "./index.scss";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SharedProvider>
      <CartProvider> {/* Wrap CartProvider inside SharedProvider */}
        <RouterProvider router={router} />
      </CartProvider>
    </SharedProvider>
  </React.StrictMode>
);
