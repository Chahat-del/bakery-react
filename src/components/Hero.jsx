// src/components/Hero.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="container hero-content">
        <div className="hero-text">
          <h1>
            Freshly Baked <span className="highlight">Happiness</span>, Every Day.
          </h1>
          <p>
            Sweet Crumbs Bakery brings you hand-crafted breads, cakes, and
            pastries made with love and the finest ingredients. Perfect for
            your daily treats and special occasions.
          </p>
          <div className="hero-buttons">
            <Link to="/menu" className="btn primary">
              View Our Menu
            </Link>
            <Link to="/contact" className="btn secondary">
              Place an Order
            </Link>
          </div>
        </div>

        <div className="hero-image">
          <div className="hero-image-card">
            <img 
              src="https://sweetcrumbs.net/assets/img/Asset%206@2x.png" 
              alt="Delicious bakery cakes and pastries" 
            />
            <div className="floating-badge badge-1">🏆 Award Winning</div>
            <div className="floating-badge badge-2">✨ Fresh Daily</div>
          </div>
        </div>
      </div>
    </section>
  );
}