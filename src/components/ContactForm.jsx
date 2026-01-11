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

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (form.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    const phoneRegex = /^[0-9]{10}$/;
    if (form.phone && !phoneRegex.test(form.phone)) {
      newErrors.phone = 'Phone must be 10 digits';
    }
    
    if (!form.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setErrors({});

    try {
      const response = await fetch('http://localhost:5000/api/feedback/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (data.success) {
        setStatus("✅ Message sent successfully!");
        setForm({ name: "", email: "", phone: "", orderType: "", message: "" });
        setErrors({});
        
        setTimeout(() => {
          setStatus("");
        }, 3000);
      } else if (data.errors) {
        setErrors(data.errors);
        setStatus("❌ Please fix the errors below");
      } else {
        setStatus("❌ " + (data.error || "Error sending message"));
      }
    } catch (err) {
      setStatus("❌ Error: Could not connect to server");
      console.error(err);
    }
  };

  const handleClear = () => {
    setForm({ name: "", email: "", phone: "", orderType: "", message: "" });
    setErrors({});
    setStatus("✅ Thank you! The form has been cleared.");
    
    setTimeout(() => {
      setStatus("");
    }, 3000);
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
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className={errors.name ? 'input-error' : ''}
                placeholder="Enter your name"
              />
              {errors.name && <span className="error-text">❌ {errors.name}</span>}
            </div>

            <div className="form-group">
              <label>Email*</label>
              <input
                type="text"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={errors.email ? 'input-error' : ''}
                placeholder="example@email.com"
              />
              {errors.email && <span className="error-text">❌ {errors.email}</span>}
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="10 digits (e.g., 9876543210)"
                className={errors.phone ? 'input-error' : ''}
                maxLength="10"
              />
              {errors.phone && <span className="error-text">❌ {errors.phone}</span>}
            </div>

            <div className="form-group">
              <label>Order Type*</label>
              <select
                name="orderType"
                value={form.orderType}
                onChange={handleChange}
                className={errors.orderType ? 'input-error' : ''}
              >
                <option value="">Select an order type</option>
                <option value="custom-cake">Custom Cake</option>
                <option value="bulk-order">Bulk Order</option>
                <option value="daily-bread">Daily Bread</option>
              </select>
              {errors.orderType && <span className="error-text">❌ {errors.orderType}</span>}
            </div>

            <div className="form-group">
              <label>Message*</label>
              <textarea
                name="message"
                rows="4"
                value={form.message}
                onChange={handleChange}
                placeholder="Minimum 10 characters"
                className={errors.message ? 'input-error' : ''}
              />
              {errors.message && <span className="error-text">❌ {errors.message}</span>}
            </div>

            <button className="btn primary full-width" type="submit">
              Submit
            </button>

            <button 
              className="btn secondary full-width" 
              type="button"
              onClick={handleClear}
              style={{ marginTop: '10px' }}
            >
              Clear Form
            </button>

            {status && <p className="form-status">{status}</p>}
          </form>
        </div>
      </div>
    </section>
  );
}