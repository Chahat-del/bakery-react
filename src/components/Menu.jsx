import React, { useState } from "react";
import { useCart } from "../CartContext";

const menuItems = [
  // 🍰 CAKES
  {
    name: "Classic Chocolate Cake",
    price: "₹650",
    category: "cakes",
    description: "Rich chocolate sponge with silky ganache.",
    tag: "Best Seller",
    image: "https://cdn.pixabay.com/photo/2020/03/14/18/55/cake-4937780_1280.jpg",
  },
  {
    name: "Red Velvet Cake",
    price: "₹720",
    category: "cakes",
    description: "Soft red velvet layers with cream cheese frosting.",
    tag: "Premium",
    image: "https://cdn.pixabay.com/photo/2020/01/16/16/32/red-velvet-4769511_1280.jpg",
  },
  {
    name: "Fresh Fruit Cake",
    price: "₹780",
    category: "cakes",
    description: "Vanilla sponge loaded with fresh fruits and cream.",
    tag: "Eggless",
    image: "https://cdn.pixabay.com/photo/2017/04/01/19/06/cake-2195951_1280.jpg",
  },
  {
    name: "Black Forest Cake",
    price: "₹700",
    category: "cakes",
    description: "Chocolate sponge, cherries and whipped cream.",
    tag: "Classic",
    image: "https://cdn.pixabay.com/photo/2015/05/05/15/05/black-forest-cake-754437_1280.jpg",
  },

  // 🧁 PASTRIES
  {
    name: "Vanilla Cupcakes (6 pcs)",
    price: "₹280",
    category: "pastries",
    description: "Soft vanilla cupcakes with buttercream.",
    tag: "Party Pack",
    image: "https://cdn.pixabay.com/photo/2017/03/17/18/13/cupcakes-2153813_1280.jpg",
  },
  {
    name: "Chocolate Truffle Pastry",
    price: "₹120",
    category: "pastries",
    description: "Rich chocolate truffle pastry.",
    tag: "Trending",
    image: "https://cdn.pixabay.com/photo/2017/08/07/21/13/chocolate-cake-2602082_1280.jpg",
  },
  {
    name: "Croissants (4 pcs)",
    price: "₹220",
    category: "pastries",
    description: "Flaky, buttery croissants.",
    tag: "Fresh",
    image: "https://cdn.pixabay.com/photo/2016/12/10/14/57/croissant-1898198_1280.jpg",
  },
  {
    name: "Blueberry Muffins (4 pcs)",
    price: "₹260",
    category: "pastries",
    description: "Soft muffins filled with blueberries.",
    tag: "Tea-Time",
    image: "https://cdn.pixabay.com/photo/2017/05/07/08/56/muffins-2292733_1280.jpg",
  },

  // 🍞 BREADS
  {
    name: "Garlic Herb Bread",
    price: "₹120",
    category: "breads",
    description: "Fresh garlic and herb flavoured bread.",
    tag: "Fresh Daily",
    image: "https://cdn.pixabay.com/photo/2015/03/26/09/54/bread-690039_1280.jpg",
  },
  {
    name: "Multigrain Loaf",
    price: "₹90",
    category: "breads",
    description: "Healthy multigrain bread.",
    tag: "Healthy",
    image: "https://cdn.pixabay.com/photo/2016/03/05/19/02/bread-1238987_1280.jpg",
  },
  {
    name: "Masala Pav (6 pcs)",
    price: "₹80",
    category: "breads",
    description: "Soft pav with light masala flavour.",
    tag: "Street Style",
    image: "https://cdn.pixabay.com/photo/2015/04/08/13/13/buns-712661_1280.jpg",
  },

  // 🍪 COOKIES
  {
    name: "Choco Chip Cookies (10 pcs)",
    price: "₹180",
    category: "cookies",
    description: "Cookies loaded with chocolate chips.",
    tag: "Kids' Favourite",
    image: "https://cdn.pixabay.com/photo/2017/05/07/08/56/cookies-2292732_1280.jpg",
  },
  {
    name: "Butter Nankhatai (12 pcs)",
    price: "₹160",
    category: "cookies",
    description: "Traditional Indian butter shortbread cookies.",
    tag: "Traditional",
    image: "https://cdn.pixabay.com/photo/2019/07/28/10/17/cookies-4366525_1280.jpg",
  },

  // ☕ BEVERAGES
  {
    name: "Cold Coffee (500 ml)",
    price: "₹150",
    category: "beverages",
    description: "Cafe-style cold coffee.",
    tag: "Best with Cake",
    image: "https://cdn.pixabay.com/photo/2014/12/15/13/40/coffee-569363_1280.jpg",
  },
  {
    name: "Hot Chocolate",
    price: "₹130",
    category: "beverages",
    description: "Warm hot chocolate topped with cream.",
    tag: "Winter Special",
    image: "https://cdn.pixabay.com/photo/2017/01/06/19/15/hot-chocolate-1958657_1280.jpg",
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
  const [feedback, setFeedback] = useState("");
  const { addToCart } = useCart();

  const filtered =
    filter === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === filter);

  const handleAdd = (item) => {
    addToCart(item);
    setFeedback(`${item.name} added to cart`);
    setTimeout(() => setFeedback(""), 2000);
  };

  return (
    <section className="menu">
      <div className="container">
        <h2 className="section-title">Our Signature Menu</h2>
        <p className="section-subtitle">
          Choose from our freshly baked cakes, pastries, breads and more.
        </p>

        {feedback && <p className="cart-feedback">{feedback}</p>}

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

        <div className="menu-grid">
          {filtered.map((item, idx) => (
            <div className="menu-card" key={idx}>
              <div className="menu-card-image">
                <img src={item.image} alt={item.name} />
              </div>

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
                  {item.category.charAt(0).toUpperCase() +
                    item.category.slice(1)}
                </span>
              </div>

              <button className="btn small" onClick={() => handleAdd(item)}>
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
