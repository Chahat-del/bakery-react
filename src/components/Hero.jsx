import React from "react";

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="container hero-content">
        <div className="hero-text">
          <h1>Freshly Baked Happiness, Every Day.</h1>
          <p>
            Sweet Crumbs Bakery brings you hand-crafted breads, cakes, and
            pastries made with love.
          </p>
          <div className="hero-buttons">
            <a href="#menu" className="btn primary">
              View Our Menu
            </a>
            <a href="#contact" className="btn secondary">
              Place an Order
            </a>
          </div>
        </div>

        <div className="hero-image">
          <div className="hero-image-card">
            {/* later you can add /hero.jpg in public */}
            <img src="/hero.jpg" alt="Bakery cakes" />
          </div>
        </div>
      </div>
    </section>
  );
}
