// src/components/OrderHistory.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { useOrder } from "../OrderContext";
import { useNavigate } from "react-router-dom";
import OrderTracker from "./OrderTracker";

// Derive a live delivery status from order age.
// Orders are given a 30–60 min delivery window; we use 45 min as the
// fallback estimate when we don't have the exact window stored.
function getLiveStatus(createdAt, totalSeconds) {
  const elapsed = Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000);
  const window  = totalSeconds || 45 * 60; // default 45 min if unknown
  const ratio   = elapsed / window;

  if (elapsed <= 0)   return { label: "Order Placed",    color: "#9e9e9e", stage: "placed"   };
  if (ratio < 0.25)   return { label: "Order Placed",    color: "#9e9e9e", stage: "placed"   };
  if (ratio < 0.70)   return { label: "In Progress",     color: "#2196f3", stage: "progress" };
  if (ratio < 1.0)    return { label: "Out for Delivery", color: "#ff9800", stage: "delivery" };
  return               { label: "Delivered",             color: "#4caf50", stage: "done"     };
}

export default function OrderHistory() {
  const [orders,          setOrders         ] = useState([]);
  const [loading,         setLoading        ] = useState(true);
  const [selectedOrder,   setSelectedOrder  ] = useState(null);
  const [showOrderDetails,setShowOrderDetails] = useState(false);

  const { user }                    = useAuth();
  const { activeOrder, clearOrder } = useOrder();
  const navigate                    = useNavigate();

  useEffect(() => {
    if (!user) { navigate("/auth"); return; }
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res   = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setOrders(data.orders);
      else console.error("Failed to fetch orders:", data.message);
    } catch (e) {
      console.error("Error fetching orders:", e);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

  const printBill = () => window.print();

  // ── Order Details / Bill view ──────────────────────────────
  if (showOrderDetails && selectedOrder) {
    // Check if this is the active (in-flight) order
    const isActive     = activeOrder?.orderNumber === selectedOrder.orderNumber;
    const totalSeconds = isActive ? activeOrder.totalSeconds : 45 * 60;
    const remaining    = isActive
      ? Math.max(0, totalSeconds - Math.floor((Date.now() - activeOrder.savedAt) / 1000))
      : 0;
    const liveStatus   = getLiveStatus(selectedOrder.createdAt, totalSeconds);

    return (
      <section className="cart" id="order-details">
        <div className="container">

          {/* Live tracker inside detail view if order is still in flight */}
          {isActive && remaining > 0 && (
            <OrderTracker
              orderNumber={selectedOrder.orderNumber}
              totalSeconds={totalSeconds}
              remainingSeconds={remaining}
              onDismiss={clearOrder}
            />
          )}

          <div className="bill-container">
            <button
              className="btn secondary no-print"
              onClick={() => setShowOrderDetails(false)}
              style={{ marginBottom: "1rem" }}
            >
              ← Back to Order History
            </button>

            <div className="bill-header">
              <h1>🍰 SweetCrumbs Bakery</h1>
              <p>Fresh Daily | Award Winning | Made with Love</p>
              <p>📍 123 Baker Street, Sweet Town | ☎️ +91-9876543210</p>
            </div>

            <div className="bill-divider" />

            <div className="bill-info">
              <div className="bill-row">
                <span>Order #:</span>
                <strong>{selectedOrder.orderNumber}</strong>
              </div>
              <div className="bill-row">
                <span>Date:</span>
                <span>{formatDate(selectedOrder.createdAt)}</span>
              </div>
              <div className="bill-row">
                <span>Customer:</span>
                <span>{user?.name || "Guest"}</span>
              </div>
              <div className="bill-row">
                <span>Status:</span>
                <span
                  style={{
                    background: liveStatus.color,
                    color: "white",
                    padding: "0.3rem 0.8rem",
                    borderRadius: "20px",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                  }}
                >
                  {liveStatus.label}
                </span>
              </div>
            </div>

            <div className="bill-divider" />

            <table className="bill-table">
              <thead>
                <tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr>
              </thead>
              <tbody>
                {selectedOrder.items.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>₹{item.price}</td>
                    <td>₹{item.price * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="bill-divider" />

            <div className="bill-summary">
              <div className="bill-row">
                <span>Subtotal:</span><span>₹{selectedOrder.subtotal}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="bill-row discount">
                  <span>Discount Applied:</span>
                  <span>- ₹{selectedOrder.discount}</span>
                </div>
              )}
              {selectedOrder.couponCode && (
                <div className="bill-row">
                  <span>Coupon Used:</span>
                  <span className="coupon-badge">{selectedOrder.couponCode}</span>
                </div>
              )}
              <div className="bill-row">
                <span>GST (5%):</span><span>₹{selectedOrder.gst}</span>
              </div>
              <div className="bill-divider" />
              <div className="bill-row total">
                <strong>Grand Total:</strong>
                <strong>₹{selectedOrder.total}</strong>
              </div>
              <div className="bill-row payment-status">
                <span>Payment Status:</span>
                <span className="status-paid">✅ PAID</span>
              </div>
            </div>

            <div className="bill-footer">
              <p>✨ Thank you for your order! ✨</p>
              <p>Please visit us again!</p>
            </div>

            <div className="bill-actions no-print">
              <button className="btn primary" onClick={printBill}>🖨️ Print Bill</button>
              <button className="btn secondary" onClick={() => setShowOrderDetails(false)}>
                ← Back to Orders
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ── Order History list ─────────────────────────────────────
  return (
    <section className="cart" id="order-history">
      <div className="container">
        <h2>📦 My Order History</h2>

        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <p>Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-cart">
            <p>📦 No orders yet</p>
            <p>Start ordering from our delicious menu!</p>
            <button className="btn primary" onClick={() => navigate("/menu")}>
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => {
              const isActive = activeOrder?.orderNumber === order.orderNumber;
              const totalSec = isActive ? activeOrder.totalSeconds : 45 * 60;
              const remaining = isActive
                ? Math.max(0, totalSec - Math.floor((Date.now() - activeOrder.savedAt) / 1000))
                : 0;
              const liveStatus = getLiveStatus(order.createdAt, totalSec);

              return (
                <div key={order._id} className="order-card">
                  <div className="order-header">
                    <div className="order-info">
                      <h3>Order #{order.orderNumber}</h3>
                      <p className="order-date">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="order-status">
                      <span
                        style={{
                          background: liveStatus.color,
                          color: "white",
                          padding: "0.3rem 0.8rem",
                          borderRadius: "20px",
                          fontSize: "0.85rem",
                          fontWeight: "600",
                        }}
                      >
                        {liveStatus.label}
                      </span>
                    </div>
                  </div>

                  {/* Inline compact tracker for the active order */}
                  {isActive && remaining > 0 && (
                    <div className="order-tracker-inline">
                      <OrderTracker
                        orderNumber={order.orderNumber}
                        totalSeconds={totalSec}
                        remainingSeconds={remaining}
                        onDismiss={clearOrder}
                      />
                    </div>
                  )}

                  <div className="order-items">
                    <h4>Items:</h4>
                    <ul>
                      {order.items.map((item, idx) => (
                        <li key={idx}>{item.name} × {item.quantity}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="order-footer">
                    <div className="order-total">
                      <span>Total:</span>
                      <strong>₹{order.total}</strong>
                    </div>
                    <button
                      className="btn primary small"
                      onClick={() => { setSelectedOrder(order); setShowOrderDetails(true); }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
