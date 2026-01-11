// src/components/Gallery.jsx
import React from "react";

const galleryImages = [
  {
    url: "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?cs=srgb&dl=bakery-baking-blueberries-291528.jpg&fm=jpg",
    alt: "Assorted fresh pastries"
  },
  {
    url: "https://bakerynouveau.com/wp-content/uploads/2021/11/chocolate-cake.jpg",
    alt: "Delicious chocolate cake"
  },
  {
    url: "https://tse1.explicit.bing.net/th/id/OIP.q7RvjtZOLsCQbVhsI7maFgHaHa?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3",
    alt: "Freshly baked bread"
  },
  {
    url: "https://tse4.mm.bing.net/th/id/OIP.SNO-xDmHkzwCMz8ISzkn6QHaEK?rs=1&pid=ImgDetMain&o=7&rm=3",
    alt: "Colorful cupcakes"
  },
  {
    url: "https://capital-brands-llc.imgix.net/recipe-r2595-cheesecake-fullsize-060317.jpg",
    alt: "Flaky croissants"
  },
  {
    url: "https://sweetandsavorymeals.com/wp-content/uploads/2022/08/strawberry-crunch-cheesecake-cake-recipe-368x463.jpg",
    alt: "Red velvet cake "
  }
];

export default function Gallery() {
  return (
    <section className="gallery" id="gallery">
      <div className="container">
        <h2 className="section-title">Our Gallery</h2>
        <p className="section-subtitle">
          A glimpse of our freshly baked delights
        </p>
        
        <div className="gallery-grid">
          {galleryImages.map((image, idx) => (
            <div className="gallery-item" key={idx}>
              <img src={image.url} alt={image.alt} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}