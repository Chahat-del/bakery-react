// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import OrderTracker from "./components/OrderTracker";
import { OrderProvider, useOrder } from "./OrderContext";

import HomePage from "./pages/HomePage";
import MenuPage from "./pages/MenuPage";
import CartPage from "./pages/CartPage";
import ContactPage from "./pages/ContactPage";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";

// Inner component so it can consume OrderContext
function AppShell() {
  const { activeOrder, clearOrder } = useOrder();

  return (
    <>
      <Navbar />

      {/* Floating order tracker — shown on every page when an order is active */}
      {activeOrder && (
        <OrderTracker
          orderNumber={activeOrder.orderNumber}
          totalSeconds={activeOrder.totalSeconds}
          remainingSeconds={activeOrder.remainingSeconds}
          onDismiss={clearOrder}
          compact
        />
      )}

      <Routes>
        <Route path="/"        element={<HomePage />} />
        <Route path="/menu"    element={<MenuPage />} />
        <Route path="/cart"    element={<CartPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/auth"    element={<AuthPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/orders"  element={<OrderHistoryPage />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <OrderProvider>
      <AppShell />
    </OrderProvider>
  );
}
