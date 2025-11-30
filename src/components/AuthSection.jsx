import React, { useState } from "react";
import { useAuth } from "../AuthContext";

export default function AuthSection() {
  const { user, login, logout } = useAuth();
  const [form, setForm] = useState({ name: "", email: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = (e) => {
    e.preventDefault();
    login(form.name || "Guest User", form.email || "guest@example.com");
    setForm({ name: "", email: "" });
  };

  return (
    <section className="auth-section" id="auth">
      <div className="container">
        <h2>Account</h2>

        {user ? (
          <>
            <p>
              You are logged in as <strong>{user.name}</strong>.
            </p>
            <button className="btn secondary" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <form onSubmit={handleLogin} className="auth-form">
            <p>Demo login (no real backend yet):</p>

            <div className="form-group">
              <label>Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />
            </div>

            <button className="btn primary" type="submit">
              Login
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
