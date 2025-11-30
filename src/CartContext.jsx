import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  // Load from localStorage on first render
  const [items, setItems] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("sweetcrumbs-cart");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to parse cart from storage", e);
      return [];
    }
  });

  // Save to localStorage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem("sweetcrumbs-cart", JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save cart", e);
    }
  }, [items]);

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


