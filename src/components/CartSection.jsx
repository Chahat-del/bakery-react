import React from "react";
import { useCart } from "../CartContext";

export default function CartSection() {
  const { items, total, removeFromCart, clearCart } = useCart();

  return (
    <section className="cart" id="cart">
      <div className="container">
        <h2>Your Cart</h2>

        {items.length === 0 ? (
          <p>Your cart is empty. Add something from the menu!</p>
        ) : (
          <>
            <ul className="cart-list">
              {items.map((item) => (
                <li key={item.name} className="cart-item">
                  <div>
                    <strong>{item.name}</strong> × {item.qty}
                  </div>
                  <div>
                    ₹{item.priceValue * item.qty}
                    <button
                      className="btn link"
                      onClick={() => removeFromCart(item.name)}
                    >
                      remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <p className="cart-total">
              Total: <strong>₹{total}</strong>
            </p>

            <button className="btn primary">
              Proceed to Payment (coming soon)
            </button>
            <button className="btn secondary" onClick={clearCart}>
              Clear Cart
            </button>
          </>
        )}
      </div>
    </section>
  );
}
