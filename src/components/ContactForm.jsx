import React, { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    orderType: "",
    message: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // later this will be sent to backend; for now just demo
    setStatus("Message sent! (Demo only, not stored yet.)");
    setForm({ name: "", email: "", phone: "", orderType: "", message: "" });
  };

  return (
    <section className="contact" id="contact">
      <div className="container contact-content">
        <div className="contact-info">
          <h2>Contact & Orders</h2>
          <p>
            Have a custom cake idea? Want to place an order? Send us a message.
          </p>
          <ul>
            <li>
              <strong>Address:</strong> 123 Sweet Street, Bakery Town
            </li>
            <li>
              <strong>Phone:</strong> +91-98765-43210
            </li>
            <li>
              <strong>Email:</strong> hello@sweetcrumbs.com
            </li>
          </ul>
        </div>

        <div className="contact-form-card">
          <form onSubmit={handleSubmit}>
            <h3>Send us a Message</h3>

            <div className="form-group">
              <label>Name*</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email*</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Order Type</label>
              <select
                name="orderType"
                value={form.orderType}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="custom-cake">Custom Cake</option>
                <option value="bulk-order">Bulk Order</option>
                <option value="daily-bread">Daily Bread</option>
              </select>
            </div>

            <div className="form-group">
              <label>Message*</label>
              <textarea
                name="message"
                rows="4"
                value={form.message}
                onChange={handleChange}
                required
              />
            </div>

            <button className="btn primary full-width" type="submit">
              Submit
            </button>
            <p className="form-status">{status}</p>
          </form>
        </div>
      </div>
    </section>
  );
}
