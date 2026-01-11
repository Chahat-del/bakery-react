// src/components/AuthSection.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

// API Base URL
const API_URL = process.env.REACT_APP_API_URL || "https://bakery-react-production.up.railway.app";

export default function AuthSection() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const navigate = useNavigate();
  const { login } = useAuth();

  // Form states
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
        // Save token and user data
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        // Update auth context
        login(data.user.name, data.user.email);
        
        setSuccess("Login successful! Redirecting...");
        setTimeout(() => navigate("/"), 1500);
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (signupData.password !== signupData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (signupData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signupData.name,
          email: signupData.email,
          password: signupData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Account created! Please login.");
        setTimeout(() => setIsLogin(true), 2000);
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Signup error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-section">
      <div className="auth-container">
        <div className="auth-card">
          {/* Left Side - Branding */}
          <div className="auth-branding">
            <div className="brand-content">
              <h1>🍰 SweetCrumbs</h1>
              <p>Your daily dose of freshly baked happiness</p>
              <div className="brand-features">
                <div className="feature-item">
                  <span className="feature-icon">✨</span>
                  <span>Fresh Daily</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🏆</span>
                  <span>Award Winning</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">❤️</span>
                  <span>Made with Love</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Forms */}
          <div className="auth-form-container">
            {/* Toggle Buttons */}
            <div className="auth-toggle">
              <button
                className={`toggle-btn ${isLogin ? "active" : ""}`}
                onClick={() => {
                  setIsLogin(true);
                  setError("");
                  setSuccess("");
                }}
              >
                Login
              </button>
              <button
                className={`toggle-btn ${!isLogin ? "active" : ""}`}
                onClick={() => {
                  setIsLogin(false);
                  setError("");
                  setSuccess("");
                }}
              >
                Sign Up
              </button>
            </div>

            {/* Status Messages */}
            {error && <div className="auth-message error">{error}</div>}
            {success && <div className="auth-message success">{success}</div>}

            {/* Login Form */}
            {isLogin ? (
              <form onSubmit={handleLoginSubmit} className="auth-form">
                <h2>Welcome Back!</h2>
                <p className="form-subtitle">Login to access your account</p>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={loginData.email}
                    onChange={(e) =>
                      setLoginData({ ...loginData, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                    required
                  />
                </div>

                <button type="submit" className="btn primary full-width" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </button>

                <p className="form-footer">
                  Don't have an account?{" "}
                  <span className="link" onClick={() => setIsLogin(false)}>
                    Sign up
                  </span>
                </p>
              </form>
            ) : (
              /* Signup Form */
              <form onSubmit={handleSignupSubmit} className="auth-form">
                <h2>Create Account</h2>
                <p className="form-subtitle">Join SweetCrumbs family today</p>

                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={signupData.name}
                    onChange={(e) =>
                      setSignupData({ ...signupData, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={signupData.email}
                    onChange={(e) =>
                      setSignupData({ ...signupData, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    placeholder="At least 6 characters"
                    value={signupData.password}
                    onChange={(e) =>
                      setSignupData({ ...signupData, password: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    placeholder="Re-enter password"
                    value={signupData.confirmPassword}
                    onChange={(e) =>
                      setSignupData({
                        ...signupData,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <button type="submit" className="btn primary full-width" disabled={loading}>
                  {loading ? "Creating Account..." : "Sign Up"}
                </button>

                <p className="form-footer">
                  Already have an account?{" "}
                  <span className="link" onClick={() => setIsLogin(true)}>
                    Login
                  </span>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}