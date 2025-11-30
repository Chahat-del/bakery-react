import React from "react";
import { useAuth } from "../AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return (
      <section className="dashboard">
        <div className="container">
          <h2>Order Dashboard</h2>
          <p>You must be logged in to view personalized details.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="dashboard">
      <div className="container">
        <h2>Welcome, {user.name} 👋</h2>
        <p>This is your bakery dashboard. In future you can see:</p>
        <ul>
          <li>Your previous inquiries</li>
          <li>Special bulk orders</li>
          <li>Admin tools for the bakery owner</li>
        </ul>
      </div>
    </section>
  );
}
