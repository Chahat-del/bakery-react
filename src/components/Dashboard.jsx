// src/components/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate, Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function getInitials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Derive live status from order createdAt (same logic as OrderHistory)
function getLiveStatus(createdAt) {
  const elapsed = Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000);
  const window  = 45 * 60;
  const ratio   = elapsed / window;
  if (elapsed <= 0 || ratio < 0.25) return { label: "Order Placed",     color: "#9e9e9e" };
  if (ratio < 0.70)                  return { label: "In Progress",      color: "#2196f3" };
  if (ratio < 1.0)                   return { label: "Out for Delivery", color: "#ff9800" };
  return                                    { label: "Delivered",        color: "#4caf50" };
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [orders,  setOrders ] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!user) { navigate("/auth"); return; }
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res   = await fetch(`${API_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setOrders(data.orders || []);
    } catch (e) {
      console.error("Dashboard fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => { logout(); navigate("/"); };

  if (!user) return null;

  // ── Stats ──────────────────────────────────────────────────
  const totalSpent    = orders.reduce((s, o) => s + o.total, 0);
  const activeOrders  = orders.filter((o) => {
    const elapsed = (Date.now() - new Date(o.createdAt).getTime()) / 1000;
    return elapsed < 45 * 60;
  });
  const recentOrders  = orders.slice(0, 5);
  const memberSince   = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
    : "Recently";

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    });

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className="account-page">

      {/* ── Hero banner ── */}
      <div className="account-hero">
        <div className="container account-hero-inner">
          <div className="account-avatar">
            {getInitials(user.name)}
          </div>
          <div className="account-hero-info">
            <h1>Welcome back, {user.name.split(" ")[0]}! 👋</h1>
            <p>{user.email}</p>
            <span className="account-role-badge">
              {user.role === "admin" ? "🛠️ Admin" : "🧁 Customer"}
            </span>
          </div>
          <button className="btn secondary account-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="container account-body">

        {/* ── Stat cards ── */}
        <div className="account-stats">
          <div className="account-stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-info">
              <span className="stat-value">{loading ? "—" : orders.length}</span>
              <span className="stat-label">Total Orders</span>
            </div>
          </div>
          <div className="account-stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <span className="stat-value">{loading ? "—" : `₹${totalSpent}`}</span>
              <span className="stat-label">Total Spent</span>
            </div>
          </div>
          <div className="account-stat-card">
            <div className="stat-icon">🚀</div>
            <div className="stat-info">
              <span className="stat-value">{loading ? "—" : activeOrders.length}</span>
              <span className="stat-label">Active Orders</span>
            </div>
          </div>
          <div className="account-stat-card">
            <div className="stat-icon">🗓️</div>
            <div className="stat-info">
              <span className="stat-value">{memberSince}</span>
              <span className="stat-label">Member Since</span>
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="account-tabs">
          {["overview", "profile"].map((tab) => (
            <button
              key={tab}
              className={`account-tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "overview" ? "📊 Overview" : "👤 Profile"}
            </button>
          ))}
        </div>

        {/* ── Tab: Overview ── */}
        {activeTab === "overview" && (
          <div className="account-tab-content">

            {/* Quick actions */}
            <div className="account-quick-actions">
              <Link to="/menu" className="quick-action-card">
                <span className="qa-icon">🛍️</span>
                <span className="qa-label">Browse Menu</span>
              </Link>
              <Link to="/orders" className="quick-action-card">
                <span className="qa-icon">📋</span>
                <span className="qa-label">Order History</span>
              </Link>
              <Link to="/cart" className="quick-action-card">
                <span className="qa-icon">🛒</span>
                <span className="qa-label">View Cart</span>
              </Link>
              <Link to="/contact" className="quick-action-card">
                <span className="qa-icon">💬</span>
                <span className="qa-label">Contact Us</span>
              </Link>
            </div>

            {/* Recent orders */}
            <div className="account-section">
              <div className="account-section-header">
                <h3>Recent Orders</h3>
                <Link to="/orders" className="view-all-link">View all →</Link>
              </div>

              {loading ? (
                <p className="account-loading">Loading orders…</p>
              ) : recentOrders.length === 0 ? (
                <div className="account-empty">
                  <p>🧁 No orders yet — time to treat yourself!</p>
                  <Link to="/menu" className="btn primary" style={{ marginTop: "1rem", display: "inline-block" }}>
                    Browse Menu
                  </Link>
                </div>
              ) : (
                <div className="account-orders-list">
                  {recentOrders.map((order) => {
                    const status = getLiveStatus(order.createdAt);
                    return (
                      <div key={order._id} className="account-order-row">
                        <div className="aor-info">
                          <strong>#{order.orderNumber}</strong>
                          <span className="aor-date">{formatDate(order.createdAt)}</span>
                        </div>
                        <div className="aor-items">
                          {order.items.slice(0, 2).map((i, idx) => (
                            <span key={idx} className="aor-item-tag">
                              {i.name} ×{i.quantity}
                            </span>
                          ))}
                          {order.items.length > 2 && (
                            <span className="aor-item-tag">+{order.items.length - 2} more</span>
                          )}
                        </div>
                        <div className="aor-right">
                          <span
                            className="aor-status"
                            style={{ background: status.color }}
                          >
                            {status.label}
                          </span>
                          <strong className="aor-total">₹{order.total}</strong>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Favourite items (derived from order history) */}
            {orders.length > 0 && (() => {
              const freq = {};
              orders.forEach((o) => o.items.forEach((i) => {
                freq[i.name] = (freq[i.name] || 0) + i.quantity;
              }));
              const top = Object.entries(freq)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 4);
              return (
                <div className="account-section">
                  <div className="account-section-header">
                    <h3>Your Favourites</h3>
                  </div>
                  <div className="account-favourites">
                    {top.map(([name, qty]) => (
                      <div key={name} className="fav-card">
                        <span className="fav-icon">🧁</span>
                        <span className="fav-name">{name}</span>
                        <span className="fav-count">Ordered {qty}×</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ── Tab: Profile ── */}
        {activeTab === "profile" && (
          <div className="account-tab-content">
            <div className="account-section">
              <div className="account-section-header">
                <h3>Account Details</h3>
              </div>
              <div className="profile-card">
                <div className="profile-avatar-large">
                  {getInitials(user.name)}
                </div>
                <div className="profile-fields">
                  <div className="profile-field">
                    <span className="pf-label">Full Name</span>
                    <span className="pf-value">{user.name}</span>
                  </div>
                  <div className="profile-field">
                    <span className="pf-label">Email Address</span>
                    <span className="pf-value">{user.email}</span>
                  </div>
                  <div className="profile-field">
                    <span className="pf-label">Account Type</span>
                    <span className="pf-value">
                      {user.role === "admin" ? "🛠️ Admin" : "🧁 Customer"}
                    </span>
                  </div>
                  <div className="profile-field">
                    <span className="pf-label">Member Since</span>
                    <span className="pf-value">{memberSince}</span>
                  </div>
                  <div className="profile-field">
                    <span className="pf-label">Total Orders</span>
                    <span className="pf-value">{orders.length}</span>
                  </div>
                  <div className="profile-field">
                    <span className="pf-label">Total Spent</span>
                    <span className="pf-value">₹{totalSpent}</span>
                  </div>
                </div>
              </div>

              <div className="profile-actions">
                <button className="btn secondary" onClick={handleLogout}>
                  🚪 Logout
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
