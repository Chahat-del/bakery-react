import React, { useState } from "react";
import { useCart } from "../CartContext";

const menuItems = [
  // 🧁 CAKES
  {
    name: "Classic Chocolate Cake",
    price: "₹650",
    category: "cakes",
    description: "Rich, moist chocolate sponge with silky dark chocolate ganache.",
    tag: "Best Seller",
  },
  {
    name: "Red Velvet Cake",
    price: "₹720",
    category: "cakes",
    description: "Soft red velvet layers with smooth cream cheese frosting.",
    tag: "Premium",
  },
  {
    name: "Fresh Fruit Cake",
    price: "₹780",
    category: "cakes",
    description: "Vanilla sponge loaded with seasonal fruits and light whipped cream.",
    tag: "Eggless",
  },
  {
    name: "Black Forest Cake",
    price: "₹700",
    category: "cakes",
    description: "Chocolate sponge, cherries, whipped cream and chocolate shavings.",
    tag: "Classic",
  },

  // 🥐 PASTRIES & CUPCAKES
  {
    name: "Vanilla Cupcakes (6 pcs)",
    price: "₹280",
    category: "pastries",
    description: "Light vanilla cupcakes with buttercream frosting and sprinkles.",
    tag: "Party Pack",
  },
  {
    name: "Chocolate Truffle Pastry",
    price: "₹120",
    category: "pastries",
    description: "Single-serve pastry with rich chocolate truffle layers.",
    tag: "Trending",
  },
  {
    name: "Croissants (4 pcs)",
    price: "₹220",
    category: "pastries",
    description: "Flaky, buttery croissants baked fresh every morning.",
    tag: "New",
  },
  {
    name: "Blueberry Muffins (4 pcs)",
    price: "₹260",
    category: "pastries",
    description: "Soft muffins filled with juicy blueberries.",
    tag: "Tea-time",
  },

  // 🍞 BREADS
  {
    name: "Garlic Herb Bread",
    price: "₹120",
    category: "breads",
    description: "Soft pull-apart bread with garlic butter and mixed herbs.",
    tag: "Fresh Daily",
  },
  {
    name: "Multigrain Loaf",
    price: "₹90",
    category: "breads",
    description: "Healthy multigrain bread with seeds and grains.",
    tag: "Healthy",
  },
  {
    name: "Masala Pav (6 pcs)",
    price: "₹80",
    category: "breads",
    description: "Mumbai-style soft pav with a light masala flavour.",
    tag: "Best with Tea",
  },

  // 🍪 COOKIES
  {
    name: "Choco Chip Cookies (10 pcs)",
    price: "₹180",
    category: "cookies",
    description: "Crunchy cookies loaded with chocolate chips.",
    tag: "Kids' Favourite",
  },
  {
    name: "Butter Nankhatai (12 pcs)",
    price: "₹160",
    category: "cookies",
    description: "Traditional Indian shortbread cookies that melt in your mouth.",
    tag: "Traditional",
  },

  // 🥤 BEVERAGES
  {
    name: "Cold Coffee (500 ml)",
    price: "₹150",
    category: "beverages",
    description: "Thick, café-style cold coffee with ice and cream.",
    tag: "Best with Cake",
  },
  {
    name: "Hot Chocolate",
    price: "₹130",
    category: "beverages",
    description: "Warm, rich hot chocolate topped with mini marshmallows.",
    tag: "Winter Special",
  },
];

const categories = [
  { id: "all", label: "All" },
  { id: "cakes", label: "Cakes" },
  { id: "pastries", label: "Pastries" },
  { id: "breads", label: "Breads" },
  { id: "cookies", label: "Cookies" },
  { id: "beverages", label: "Beverages" },
];

export default function Menu() {
  const [filter, setFilter] = useState("all");
  const { addToCart } = useCart();

  const filtered =
    filter === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === filter);

  return (
    <section className="menu" id="menu">
      <div className="container">
        <h2 className="section-title">Our Signature Menu</h2>
        <p className="section-subtitle">
          From birthday cakes to evening chai-time snacks, we’ve got you covered.
        </p>

        {/* Category filter buttons */}
        <div className="menu-filters">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`filter-btn ${filter === cat.id ? "active" : ""}`}
              onClick={() => setFilter(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Menu cards */}
        <div className="menu-grid">
          {filtered.map((item, idx) => (
            <div className="menu-card" key={idx}>
              <div className="menu-card-header">
                <div>
                  <div className="menu-card-title">{item.name}</div>
                  <div className="menu-card-tag">{item.tag}</div>
                </div>
                <div className="menu-card-price">{item.price}</div>
              </div>

              <p className="menu-card-description">{item.description}</p>

              <div className="menu-card-meta">
                <span className="menu-card-category">
                  {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                </span>
              </div>

              <button
                className="btn small"
                onClick={() => addToCart(item)}
                style={{ marginTop: "0.5rem" }}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
