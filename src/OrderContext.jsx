// src/OrderContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const OrderContext = createContext();

export function useOrder() {
  return useContext(OrderContext);
}

export function OrderProvider({ children }) {
  const [activeOrder, setActiveOrder] = useState(() => {
    try {
      const saved = localStorage.getItem("activeOrder");
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      // Calculate how many seconds have elapsed since the order was saved
      const elapsed = Math.floor((Date.now() - parsed.savedAt) / 1000);
      const remaining = parsed.totalSeconds - elapsed;
      if (remaining <= 0) {
        localStorage.removeItem("activeOrder");
        return null;
      }
      // Return with the corrected remaining seconds
      // Keep the original savedAt so elapsed time stays accurate
      return {
        orderNumber: parsed.orderNumber,
        totalSeconds: parsed.totalSeconds,
        savedAt: parsed.savedAt,
        remainingSeconds: remaining,
      };
    } catch {
      return null;
    }
  });

  const startOrder = (orderNumber, totalSeconds) => {
    const savedAt = Date.now();
    const order = { orderNumber, totalSeconds, savedAt, remainingSeconds: totalSeconds };
    // Persist immediately with a fixed savedAt — never overwrite savedAt after this
    localStorage.setItem("activeOrder", JSON.stringify(order));
    setActiveOrder(order);
  };

  const clearOrder = () => {
    localStorage.removeItem("activeOrder");
    setActiveOrder(null);
  };

  return (
    <OrderContext.Provider value={{ activeOrder, startOrder, clearOrder }}>
      {children}
    </OrderContext.Provider>
  );
}
