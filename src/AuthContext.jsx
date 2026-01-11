// src/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

// API Base URL - uses environment variable or defaults to localhost for development
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (token && savedUser) {
        try {
          // Verify token is still valid by calling /api/auth/me
          const response = await fetch(`${API_URL}/api/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            // Token expired or invalid
            localStorage.removeItem("token");
            localStorage.removeItem("user");
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = (name, email, userId) => {
    const userData = { name, email, id: userId };
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("sweetcrumbs-cart"); // Clear cart on logout
  };

  const value = { user, login, logout, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}