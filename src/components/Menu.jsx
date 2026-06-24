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
    image: "https://www.labonelfinebaking.shop/wp-content/uploads/2021/02/CLASSIC-CHOCOLATE-CAKE.jpg",
  },
  {
    name: "Red Velvet Cake",
    price: "₹720",
    category: "cakes",
    description: "Soft red velvet layers with cream cheese frosting.",
    tag: "Premium",
    image: "https://sugargeekshow.com/wp-content/uploads/2018/01/classic-red-velvet-cake-recipe-11.jpg",
  },
  {
    name: "Fresh Fruit Cake",
    price: "₹780",
    category: "cakes",
    description: "Vanilla sponge loaded with fresh fruits and cream.",
    tag: "Eggless",
    image: "https://tse3.mm.bing.net/th/id/OIP.AIUm5KJ_ymkRC92B68XsVQHaHa?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3",
  },
  {
    name: "Black Forest Cake",
    price: "₹700",
    category: "cakes",
    description: "Chocolate sponge, cherries and whipped cream.",
    tag: "Classic",
    image: "https://thesuburbansoapbox.com/wp-content/uploads/2023/04/Black-Forest-Cake-16-of-29-1365x2048.jpg",
  },

  // 🧁 PASTRIES
  {
    name: "Vanilla Cupcakes (6 pcs)",
    price: "₹280",
    category: "pastries",
    description: "Soft vanilla cupcakes with buttercream.",
    tag: "Party Pack",
    image: "https://tse1.mm.bing.net/th/id/OIP.6J8ycEupZQnO9mIiTYy5UAHaLH?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3",
  },
  {
    name: "Chocolate Truffle Pastry",
    price: "₹120",
    category: "pastries",
    description: "Rich chocolate truffle pastry.",
    tag: "Trending",
    image: "data:image/webp;base64,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"
  },
  {
    name: "Croissants (4 pcs)",
    price: "₹220",
    category: "pastries",
    description: "Flaky, buttery croissants.",
    tag: "Fresh",
    image: "https://tse1.mm.bing.net/th/id/OIP.HZOu-ELIVeLAwVkpuLxCAQHaGK?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3",
  },
  {
    name: "Blueberry Muffins (4 pcs)",
    price: "₹260",
    category: "pastries",
    description: "Soft muffins filled with blueberries.",
    tag: "Tea-Time",
    image: "https://www.inspiredtaste.net/wp-content/uploads/2016/10/Easy-Blueberry-Muffin-Recipe-1-1200.jpg",
  },

  // 🍞 BREADS
  {
    name: "Garlic Herb Bread",
    price: "₹120",
    category: "breads",
    description: "Fresh garlic and herb flavoured bread.",
    tag: "Fresh Daily",
    image: "https://vignette4.wikia.nocookie.net/laurainthekitchen/images/4/4c/GB5.jpg/revision/latest?cb=20140608054550",
  },
  {
    name: "Multigrain Loaf",
    price: "₹90",
    category: "breads",
    description: "Healthy multigrain bread.",
    tag: "Healthy",
    image: "https://www.ihearteating.com/wp-content/uploads/2014/05/Multigrain-bread-5-800-1.jpg",
  },
  {
    name: "Masala Pav (6 pcs)",
    price: "₹80",
    category: "breads",
    description: "Soft pav with light masala flavour.",
    tag: "Street Style",
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhWAL3g6FLBUmWxrHFO4UmfN-oy0sE_La9VjPtG5WJh3B33MAic6VznFc0Hy38drQZkhmAGEn56oc6XzGCyrzQj3kmvsBSuxzGIPLgGyxp-NQXfYLU7fj0rjsFarhZoU8jqBrKExiZ3wzU/s1600/1353.jpg",
  },

  // 🍪 COOKIES
  {
    name: "Choco Chip Cookies (10 pcs)",
    price: "₹180",
    category: "cookies",
    description: "Cookies loaded with chocolate chips.",
    tag: "Kids' Favourite",
    image: "https://www.shugarysweets.com/wp-content/uploads/2020/05/chocolate-chip-cookies-recipe.jpg",
  },
  {
    name: "Butter Nankhatai (12 pcs)",
    price: "₹160",
    category: "cookies",
    description: "Traditional Indian butter shortbread cookies.",
    tag: "Traditional",
    image: "https://www.ruchiskitchen.com/wp-content/uploads/2015/08/Nankhatai-recipe-7-2-681x1024.jpg",
  },

  // ☕ BEVERAGES
  {
    name: "Cold Coffee (500 ml)",
    price: "₹150",
    category: "beverages",
    description: "Cafe-style cold coffee.",
    tag: "Best with Cake",
    image: "https://rachnas-kitchen.com/wp-content/uploads/2017/07/cold-coffee-2.jpg",
  },
  {
    name: "Hot Chocolate",
    price: "₹130",
    category: "beverages",
    description: "Warm hot chocolate topped with cream.",
    tag: "Winter Special",
    image: "https://feelgoodfoodie.net/wp-content/uploads/2021/11/how-to-make-hot-chocolate-7-1024x1536.jpg",
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
