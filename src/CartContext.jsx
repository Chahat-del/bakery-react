import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const addToCart = (item) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.name === item.name);

      const priceValue =
        typeof item.price === "number"
          ? item.price
          : Number(String(item.price).replace(/[^0-9.]/g, ""));

      if (existing) {
        return prev.map((p) =>
          p.name === item.name ? { ...p, qty: p.qty + 1 } : p
        );
      }

      return [...prev, { ...item, qty: 1, priceValue }];
    });
  };

  const removeFromCart = (name) => {
    setItems((prev) => prev.filter((p) => p.name !== name));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce(
    (sum, item) => sum + (item.priceValue || 0) * item.qty,
    0
  );

  const value = { items, addToCart, removeFromCart, clearCart, total };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

