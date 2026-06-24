// src/components/ContactForm.jsx
import React, { useState } from "react";
import { useAuth } from "../AuthContext";

const ORDER_TYPES = [
  { value: "",              label: "What can we help with?"      },
  { value: "custom-cake",   label: "🎂 Custom Cake Order"        },
  { value: "bulk-order",    label: "📦 Bulk / Corporate Order"   },
  { value: "daily-bread",   label: "🍞 Daily Bread Subscription" },
  { value: "event-catering",label: "🎉 Event Catering"           },
  { value: "feedback",      label: "💬 Feedback / Suggestion"    },
  { value: "other",         label: "❓ Other"                    },
];

const INFO_CARDS = [
  {
    icon: "📍",
    title: "Visit Us",
    lines: ["123 Baker Street", "Sweet Town, Mumbai 400001"],
  },
  {
    icon: "📞",
    title: "Call Us",
    lines: ["+91 98765 43210", "Mon – Sat, 8 am – 8 pm"],
  },
  {
    icon: "✉️",
    title: "Email Us",
    lines: ["hello@sweetcrumbs.com", "We reply within 24 hrs"],
  },
  {
    icon: "🕐",
    title: "Opening Hours",
    lines: ["Mon – Sat: 8 am – 9 pm", "Sunday: 9 am – 6 pm"],
  },
];

export default function ContactForm() {
  const { user } = useAuth();

  const [form, setForm] = useState({
    name:      user?.name  || "",
    email:     user?.email || "",
    phone:     "",
    orderType: "",
    message:   "",
  });

  const [status,    setStatus   ] = useState(null); // null | "success" | "error"
  const [submitted, setSubmitted] = useState(false);
  const [focused,   setFocused  ] = useState("");

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus(null);
    // Simulate API call
    setTimeout(() => {
      setStatus("success");
      setSubmitted(true);
    }, 600);
  };

  const handleReset = () => {
    setForm({ name: user?.name || "", email: user?.email || "", phone: "", orderType: "", message: "" });
    setStatus(null);
    setSubmitted(false);
  };

  return (
    <div className="contact-page">

      {/* ── Hero ── */}
      <div className="contact-hero">
        <div className="container contact-hero-inner">
          <div className="contact-hero-text">
            <span className="contact-hero-pill">Get in touch</span>
            <h1>We'd love to hear from you 🍰</h1>
            <p>
              Custom cakes, bulk orders, event catering — just drop us a message
              and we'll get back to you faster than our croissants bake.
            </p>
          </div>
          <div className="contact-hero-img" aria-hidden="true">
            <div className="contact-hero-blob">
              <span className="contact-blob-emoji">🎂</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container contact-body">

        {/* ── Info cards row ── */}
        <div className="contact-info-grid">
          {INFO_CARDS.map((card) => (
            <div key={card.title} className="contact-info-card">
              <span className="cic-icon">{card.icon}</span>
              <div className="cic-text">
                <strong>{card.title}</strong>
                {card.lines.map((l, i) => <span key={i}>{l}</span>)}
              </div>
            </div>
          ))}
        </div>

        {/* ── Main two-col section ── */}
        <div className="contact-main">

          {/* Left — extra info */}
          <div className="contact-left">
            <h2>Let's bake something special together</h2>
            <p>
              Whether it's a birthday cake, a wedding dessert table or a
              standing order for your café — our team is ready to make it
              happen.
            </p>

            <div className="contact-features">
              {[
                { icon: "⚡", title: "Fast Response",    desc: "We reply within a few hours on working days." },
                { icon: "🎨", title: "Custom Designs",   desc: "Fully personalised cakes for any occasion."    },
                { icon: "🚚", title: "Free Delivery",    desc: "On orders above ₹800 within city limits."       },
                { icon: "💯", title: "100% Fresh",       desc: "Every item baked fresh on the day of delivery." },
              ].map((f) => (
                <div key={f.title} className="contact-feature-row">
                  <span className="cfr-icon">{f.icon}</span>
                  <div>
                    <strong>{f.title}</strong>
                    <p>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div className="contact-form-wrap">
            {submitted ? (
              <div className="contact-success">
                <div className="contact-success-icon">🎉</div>
                <h3>Message Received!</h3>
                <p>
                  Thanks, <strong>{form.name || "friend"}</strong>! We'll reach
                  out to <strong>{form.email}</strong> shortly.
                </p>
                <button className="btn primary" onClick={handleReset}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit} noValidate>
                <h3>Send us a Message</h3>
                <p className="contact-form-subtitle">
                  Fill in the details below and we'll be in touch.
                </p>

                {/* Name + Email row */}
                <div className="cf-row">
                  <div className={`cf-group ${focused === "name" ? "cf-focused" : ""}`}>
                    <label htmlFor="cf-name">Your Name *</label>
                    <div className="cf-input-wrap">
                      <span className="cf-icon">👤</span>
                      <input
                        id="cf-name"
                        name="name"
                        placeholder="Riya Sharma"
                        value={form.name}
                        onChange={handleChange}
                        onFocus={() => setFocused("name")}
                        onBlur={() => setFocused("")}
                        required
                      />
                    </div>
                  </div>

                  <div className={`cf-group ${focused === "email" ? "cf-focused" : ""}`}>
                    <label htmlFor="cf-email">Email Address *</label>
                    <div className="cf-input-wrap">
                      <span className="cf-icon">✉️</span>
                      <input
                        id="cf-email"
                        type="email"
                        name="email"
                        placeholder="riya@email.com"
                        value={form.email}
                        onChange={handleChange}
                        onFocus={() => setFocused("email")}
                        onBlur={() => setFocused("")}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Phone + Order type row */}
                <div className="cf-row">
                  <div className={`cf-group ${focused === "phone" ? "cf-focused" : ""}`}>
                    <label htmlFor="cf-phone">Phone Number</label>
                    <div className="cf-input-wrap">
                      <span className="cf-icon">📞</span>
                      <input
                        id="cf-phone"
                        name="phone"
                        placeholder="+91 98765 43210"
                        value={form.phone}
                        onChange={handleChange}
                        onFocus={() => setFocused("phone")}
                        onBlur={() => setFocused("")}
                      />
                    </div>
                  </div>

                  <div className={`cf-group ${focused === "orderType" ? "cf-focused" : ""}`}>
                    <label htmlFor="cf-orderType">I'm enquiring about</label>
                    <div className="cf-input-wrap">
                      <span className="cf-icon">🎯</span>
                      <select
                        id="cf-orderType"
                        name="orderType"
                        value={form.orderType}
                        onChange={handleChange}
                        onFocus={() => setFocused("orderType")}
                        onBlur={() => setFocused("")}
                      >
                        {ORDER_TYPES.map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className={`cf-group ${focused === "message" ? "cf-focused" : ""}`}>
                  <label htmlFor="cf-message">Your Message *</label>
                  <div className="cf-input-wrap cf-textarea-wrap">
                    <span className="cf-icon cf-icon-top">💬</span>
                    <textarea
                      id="cf-message"
                      name="message"
                      rows={5}
                      placeholder="Tell us what you need — cake flavour, delivery date, quantity, special requirements…"
                      value={form.message}
                      onChange={handleChange}
                      onFocus={() => setFocused("message")}
                      onBlur={() => setFocused("")}
                      required
                    />
                  </div>
                  <span className="cf-char-count">{form.message.length} / 500</span>
                </div>

                {status === "error" && (
                  <p className="cf-status-error">
                    ⚠️ Something went wrong. Please try again.
                  </p>
                )}

                <button className="btn primary cf-submit" type="submit">
                  Send Message 🚀
                </button>
              </form>
            )}
          </div>
        </div>

        {/* ── Map placeholder ── */}
        <div className="contact-map">
          <iframe
            title="SweetCrumbs location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.11609823164!2d72.74110195701289!3d19.08219783952436!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1718000000000!5m2!1sen!2sin"
            width="100%"
            height="320"
            style={{ border: 0, borderRadius: "18px" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

      </div>
    </div>
  );
}
