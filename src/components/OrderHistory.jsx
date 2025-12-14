// src/components/OrderHistory.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/orders", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        setOrders(data.orders);
      } else {
        console.error("Failed to fetch orders:", data.message);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const printBill = () => {
    window.print();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { text: "Pending", color: "#ff9800" },
      processing: { text: "Processing", color: "#2196f3" },
      completed: { text: "Completed", color: "#4caf50" },
      cancelled: { text: "Cancelled", color: "#f44336" }
    };
    
    const badge = badges[status] || badges.pending;
    return (
      <span
        style={{
          background: badge.color,
          color: "white",
          padding: "0.3rem 0.8rem",
          borderRadius: "20px",
          fontSize: "0.85rem",
          fontWeight: "600"
        }}
      >
        {badge.text}
      </span>
    );
  };

  // Order Details Modal/View
  if (showOrderDetails && selectedOrder) {
    return (
      <section className="cart" id="order-details">
        <div className="container">
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

            <div className="bill-divider"></div>

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
                {getStatusBadge(selectedOrder.status)}
              </div>
            </div>

            <div className="bill-divider"></div>

            <table className="bill-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
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

            <div className="bill-divider"></div>

            <div className="bill-summary">
              <div className="bill-row">
                <span>Subtotal:</span>
                <span>₹{selectedOrder.subtotal}</span>
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
                <span>GST (5%):</span>
                <span>₹{selectedOrder.gst}</span>
              </div>
              <div className="bill-divider"></div>
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
              <button className="btn primary" onClick={printBill}>
                🖨️ Print Bill
              </button>
              <button
                className="btn secondary"
                onClick={() => setShowOrderDetails(false)}
              >
                ← Back to Orders
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Order History List
  return (
    <section className="cart" id="order-history">
      <div className="container">
        <h2>📦 My Order History</h2>

        {loading ? (
          <div className="loading-container" style={{ textAlign: "center", padding: "3rem" }}>
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
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Order #{order.orderNumber}</h3>
                    <p className="order-date">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="order-status">
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                <div className="order-items">
                  <h4>Items:</h4>
                  <ul>
                    {order.items.map((item, idx) => (
                      <li key={idx}>
                        {item.name} × {item.quantity}
                      </li>
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
                    onClick={() => viewOrderDetails(order)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}