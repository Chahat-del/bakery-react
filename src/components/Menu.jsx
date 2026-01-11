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
    image: "https://punjabbakers.com/wp-content/uploads/2024/05/PUNJABS-CAKE-n-BAKE-CHOCOLATE-TRUFFLE-PASTRY-2-1.jpg",
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
   {
    name: "sample",
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
