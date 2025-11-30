import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./style.css";

import { AuthProvider } from "./AuthContext";
import { CartProvider } from "./CartContext";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
