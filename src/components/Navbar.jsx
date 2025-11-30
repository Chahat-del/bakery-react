import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useCart } from "../CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { items } = useCart();

  const cartCount = items.reduce((sum, item) => sum + item.qty, 0);

  const handleToggle = () => {
    const links = document.querySelector(".nav-links");
    if (links) links.classList.toggle("show");
  };

  return (
    <header className="navbar">
      <div className="container nav-content">

        <div className="logo">
          <Link to="/">
            Sweet<span>Crumbs</span>
          </Link>
        </div>

        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/menu">Menu</Link>
          <Link to="/cart">
            Cart{" "}
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
          <Link to="/contact">Contact</Link>
          <Link to="/auth">Account</Link>
        </nav>

        <div className="nav-right">
          {user ? (
            <>
              <span className="nav-user">
                Hi, {user.name ? user.name.split(" ")[0] : "Guest"}
              </span>

              <button className="btn secondary nav-btn" onClick={logout}>
                Logout
              </button>

              <Link to="/dashboard" className="btn primary nav-btn">
                Dashboard
              </Link>
            </>
          ) : (
            <Link to="/auth" className="btn secondary nav-btn">
              Login
            </Link>
          )}

          <button className="nav-toggle" onClick={handleToggle}>
            ☰
          </button>
        </div>

      </div>
    </header>
  );
}

