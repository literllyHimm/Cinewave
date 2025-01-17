import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { SharedProvider } from "./SharedContext";
import { router } from "./router";
import "./index.scss";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SharedProvider>
      <RouterProvider router={router} />
    </SharedProvider>
  </React.StrictMode>
);



