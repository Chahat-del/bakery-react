// src/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  // Helper function to extract numeric price value
  const extractPriceValue = (item) => {
    // If priceValue already exists and is a number, use it
    if (typeof item.priceValue === 'number') {
      return item.priceValue;
    }
    
    // If price is a string like "₹150" or "150", extract the number
    if (typeof item.price === 'string') {
      const numericValue = parseFloat(item.price.replace(/[^0-9.]/g, ''));
      return isNaN(numericValue) ? 0 : numericValue;
    }
    
    // If price is already a number
    if (typeof item.price === 'number') {
      return item.price;
    }
    
    // Fallback
    return 0;
  };

  const addToCart = (item) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.name === item.name);
      
      // Ensure priceValue is set correctly
      const priceValue = extractPriceValue(item);
      const itemWithPrice = { ...item, priceValue };
      
      if (existing) {
        return prev.map((i) =>
          i.name === item.name ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...itemWithPrice, qty: 1 }];
    });
  };

  const removeFromCart = (name) => {
    setItems((prev) => prev.filter((i) => i.name !== name));
  };

  const updateQuantity = (name, newQty) => {
    if (newQty <= 0) {
      removeFromCart(name);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.name === name ? { ...i, qty: newQty } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  // Calculate total safely with fallback to 0
  const total = items.reduce((sum, i) => {
    const priceValue = extractPriceValue(i);
    const quantity = i.qty || 0;
    return sum + (priceValue * quantity);
  }, 0);

  return (
    <CartContext.Provider
      value={{ items, total, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}