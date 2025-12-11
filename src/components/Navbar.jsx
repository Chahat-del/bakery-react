// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useCart } from "../CartContext";

export default function Navbar() {
  const [showMenu, setShowMenu] = useState(false);
  const { user, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="container nav-content">
        <Link to="/" className="logo">
          Sweet<span>Crumbs</span>
        </Link>

        <button
          className="nav-toggle"
          onClick={() => setShowMenu(!showMenu)}
          aria-label="Toggle menu"
        >
          ☰
        </button>

        <div className={`nav-links ${showMenu ? "show" : ""}`}>
          <Link to="/">Home</Link>
          <Link to="/menu">Menu</Link>
          <Link to="/cart">
            Cart
            {items.length > 0 && (
              <span className="cart-badge">{items.length}</span>
            )}
          </Link>
          <Link to="/contact">Contact</Link>
          {user && <Link to="/dashboard">Account</Link>}
        </div>

        <div className="nav-right">
          {user ? (
            <>
              <span className="nav-user">👋 {user.name}</span>
              <button onClick={handleLogout} className="btn secondary nav-btn">
                Logout
              </button>
            </>
          ) : (
            <Link to="/auth" className="btn secondary nav-btn">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}