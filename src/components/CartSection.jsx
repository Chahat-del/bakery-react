// src/components/CartSection.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../CartContext";
import { useAuth } from "../AuthContext";
import { useOrder } from "../OrderContext";
import PaymentGateway from "./PaymentGateway";
import OrderTracker from "./OrderTracker";

// API Base URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function CartSection() {
  const { items, total, removeFromCart, clearCart, updateQuantity } = useCart();
  const { user } = useAuth();
  const { startOrder } = useOrder();
  const navigate = useNavigate();

  const [showCheckout, setShowCheckout] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showBill, setShowBill] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [trackerSeconds, setTrackerSeconds] = useState(null);

  const availableCoupons = {
    "CAKE10": { discount: 10, applicableTo: ["cake", "pastry"], description: "₹10 off on Cakes & Pastries" },
    "BREAD20": { discount: 20, applicableTo: ["bread", "bun"], description: "₹20 off on Breads" },
    "SWEET15": { discount: 15, applicableTo: ["cookie", "brownie", "donut"], description: "₹15 off on Sweet Items" },
    "BAKERY25": { discount: 25, applicableTo: "all", description: "₹25 off on all items" },
    "FIRST50": { discount: 50, applicableTo: "all", description: "₹50 off - First Order Special" }
  };

  const handleProceedToCheckout = () => {
    const token = localStorage.getItem("token");
    if (!token || !user) {
      alert("⚠️ Please login first to proceed with checkout!");
      navigate("/auth");
      return;
    }
    setShowCheckout(true);
  };

  const applyCoupon = () => {
    setCouponError("");
    const code = couponCode.toUpperCase();
    const coupon = availableCoupons[code];
    if (!coupon) {
      setCouponError("Invalid coupon code");
      return;
    }
    setAppliedCoupon({ code, ...coupon });
    setCouponCode("");
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError("");
  };

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.applicableTo === "all") return appliedCoupon.discount;
    let discount = 0;
    items.forEach(item => {
      const itemNameLower = item.name.toLowerCase();
      const isApplicable = appliedCoupon.applicableTo.some(category =>
        itemNameLower.includes(category)
      );
      if (isApplicable) discount += appliedCoupon.discount;
    });
    return discount;
  };

  const calculateAutomaticDiscount = () => {
    if (total > 1000) return Math.round(total * 0.10);
    return 0;
  };

  const couponDiscount = calculateDiscount();
  const automaticDiscount = calculateAutomaticDiscount();
  const totalDiscount = couponDiscount + automaticDiscount;
  const subtotalAfterDiscount = Math.max(0, total - totalDiscount);
  const gst = Math.round(subtotalAfterDiscount * 0.05);
  const grandTotal = subtotalAfterDiscount + gst;

  const handleProceedToPayment = () => setShowPayment(true);

  const handlePaymentSuccess = async (paymentDetails) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          items: items.map(item => ({
            name: item.name,
            quantity: item.qty,
            price: item.priceValue
          })),
          subtotal: total,
          discount: totalDiscount,
          gst,
          total: grandTotal,
          couponCode: appliedCoupon?.code || null,
          paymentDetails
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Random delivery time between 30–60 mins
        const deliveryMins = Math.floor(Math.random() * 31) + 30;
        const deliverySeconds = deliveryMins * 60;

        setOrderData({
          orderId: data.order._id,
          orderNumber: data.order.orderNumber,
          items,
          subtotal: total,
          couponDiscount,
          automaticDiscount,
          totalDiscount,
          gst,
          total: grandTotal,
          date: new Date().toLocaleString(),
          customerName: user.name || "Guest",
          customerEmail: user.email || "",
          paymentDetails,
          deliveryMins,
          deliverySeconds
        });

        setTrackerSeconds(deliverySeconds);
        setShowBill(true);
        setShowCheckout(false);
        setShowPayment(false);
        clearCart();
        setAppliedCoupon(null);

        // Register order in global context so tracker shows on all pages
        startOrder(data.order.orderNumber, deliverySeconds);

      } else {
        alert(data.message || "Order failed!");
      }
    } catch (error) {
      console.error("Order error:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentCancel = () => setShowPayment(false);

  const printBill = () => window.print();

  // ── Bill Page ──────────────────────────────────────────────
  if (showBill && orderData) {
    return (
      <section className="cart" id="cart">
        <div className="container">

          {/* Order Tracker on bill page */}
          {trackerSeconds && (
            <OrderTracker
              orderNumber={orderData.orderNumber}
              totalSeconds={trackerSeconds}
              onDismiss={() => setTrackerSeconds(null)}
            />
          )}

          <div className="bill-container">
            <div className="bill-header">
              <h1>🍰 SweetCrumbs Bakery</h1>
              <p>Fresh Daily | Award Winning | Made with Love</p>
              <p>📍 123 Baker Street, Sweet Town | ☎️ +91-9876543210</p>
            </div>

            <div className="bill-divider"></div>

            <div className="bill-info">
              <div className="bill-row"><span>Order #:</span><strong>{orderData.orderNumber}</strong></div>
              <div className="bill-row"><span>Date:</span><span>{orderData.date}</span></div>
              <div className="bill-row"><span>Customer:</span><span>{orderData.customerName}</span></div>
              <div className="bill-row"><span>Email:</span><span>{orderData.customerEmail}</span></div>
              <div className="bill-row">
                <span>Payment Method:</span>
                <span className="payment-badge">{orderData.paymentDetails.method.toUpperCase()}</span>
              </div>
              <div className="bill-row">
                <span>Transaction ID:</span>
                <span className="transaction-id">{orderData.paymentDetails.transactionId}</span>
              </div>
              <div className="bill-row">
                <span>Estimated Delivery:</span>
                <strong>~{orderData.deliveryMins} mins</strong>
              </div>
            </div>

            <div className="bill-divider"></div>

            <table className="bill-table">
              <thead>
                <tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr>
              </thead>
              <tbody>
                {orderData.items.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.name}</td>
                    <td>{item.qty}</td>
                    <td>₹{item.priceValue}</td>
                    <td>₹{item.priceValue * item.qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="bill-divider"></div>

            <div className="bill-summary">
              <div className="bill-row"><span>Subtotal:</span><span>₹{orderData.subtotal}</span></div>
              {orderData.couponDiscount > 0 && (
                <div className="bill-row discount">
                  <span>Coupon Discount:</span><span>- ₹{orderData.couponDiscount}</span>
                </div>
              )}
              {orderData.automaticDiscount > 0 && (
                <div className="bill-row discount">
                  <span>🎉 Special Discount (10% on orders &gt; ₹1000):</span>
                  <span>- ₹{orderData.automaticDiscount}</span>
                </div>
              )}
              {orderData.totalDiscount > 0 && (
                <div className="bill-row discount total-discount">
                  <strong>Total Discount:</strong><strong>- ₹{orderData.totalDiscount}</strong>
                </div>
              )}
              <div className="bill-row"><span>GST (5%):</span><span>₹{orderData.gst}</span></div>
              <div className="bill-divider"></div>
              <div className="bill-row total">
                <strong>Grand Total:</strong><strong>₹{orderData.total}</strong>
              </div>
              <div className="bill-row payment-status">
                <span>Payment Status:</span><span className="status-paid">✅ PAID</span>
              </div>
            </div>

            <div className="bill-footer">
              <p>✨ Thank you for your order! ✨</p>
              <p>Your payment was successful!</p>
              {orderData.automaticDiscount > 0 && (
                <p>🎊 You saved ₹{orderData.automaticDiscount} with our special discount!</p>
              )}
              <p>Please visit us again!</p>
            </div>

            <div className="bill-actions no-print">
              <button className="btn primary" onClick={printBill}>🖨️ Print Bill</button>
              <button className="btn secondary" onClick={() => { setShowBill(false); setOrderData(null); }}>
                ← Back to Shop
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ── Payment Page ───────────────────────────────────────────
  if (showPayment) {
    return (
      <section className="cart" id="cart">
        <div className="container">
          <PaymentGateway
            amount={grandTotal}
            onPaymentSuccess={handlePaymentSuccess}
            onCancel={handlePaymentCancel}
          />
        </div>
      </section>
    );
  }

  // ── Main Cart ──────────────────────────────────────────────
  return (
    <section className="cart" id="cart">
      <div className="container">
        <h2>Your Cart</h2>

        {items.length === 0 ? (
          <div className="empty-cart">
            <p>🛒 Your cart is empty</p>
            <p>Add something delicious from our menu!</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map((item) => (
                <div key={item.name} className="cart-item">
                  <div className="item-details">
                    <strong>{item.name}</strong>
                    <span className="item-price">₹{item.priceValue} each</span>
                  </div>
                  <div className="item-actions">
                    <div className="quantity-controls">
                      <button onClick={() => updateQuantity(item.name, item.qty - 1)}>-</button>
                      <span>{item.qty}</span>
                      <button onClick={() => updateQuantity(item.name, item.qty + 1)}>+</button>
                    </div>
                    <span className="item-total">₹{item.priceValue * item.qty}</span>
                    <button className="btn-remove" onClick={() => removeFromCart(item.name)}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>

            {total > 1000 && (
              <div className="discount-notification">
                <p>🎉 Congratulations! You've earned a 10% discount on orders over ₹1000!</p>
                <p>You're saving ₹{automaticDiscount} on this order!</p>
              </div>
            )}
            {total > 800 && total <= 1000 && (
              <div className="discount-alert">
                <p>💰 Add ₹{1000 - total} more to get 10% off your entire order!</p>
              </div>
            )}

            {!showCheckout ? (
              <div className="cart-summary">
                <div className="cart-total">
                  <span>Subtotal:</span>
                  <strong>₹{total}</strong>
                </div>
                <div className="cart-buttons">
                  <button className="btn primary" onClick={handleProceedToCheckout}>
                    Proceed to Checkout →
                  </button>
                  <button className="btn secondary" onClick={clearCart}>Clear Cart</button>
                </div>
              </div>
            ) : (
              <div className="checkout-section">
                <h3>Checkout</h3>

                <div className="coupons-info">
                  <h4>🎟️ Available Coupons:</h4>
                  <div className="coupon-list">
                    {Object.entries(availableCoupons).map(([code, coupon]) => (
                      <div key={code} className="coupon-card">
                        <strong>{code}</strong>
                        <span>{coupon.description}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="coupon-section">
                  <h4>Apply Coupon Code</h4>
                  <div className="coupon-input-group">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      disabled={appliedCoupon}
                    />
                    {!appliedCoupon ? (
                      <button className="btn primary" onClick={applyCoupon}>Apply</button>
                    ) : (
                      <button className="btn secondary" onClick={removeCoupon}>Remove</button>
                    )}
                  </div>
                  {couponError && <p className="error-message">{couponError}</p>}
                  {appliedCoupon && (
                    <p className="success-message">
                      ✅ Coupon "{appliedCoupon.code}" applied! Saved ₹{couponDiscount}
                    </p>
                  )}
                </div>

                <div className="bill-summary-preview">
                  <h4>Order Summary</h4>
                  <div className="summary-row"><span>Subtotal:</span><span>₹{total}</span></div>
                  {couponDiscount > 0 && (
                    <div className="summary-row discount">
                      <span>Coupon Discount:</span><span>- ₹{couponDiscount}</span>
                    </div>
                  )}
                  {automaticDiscount > 0 && (
                    <div className="summary-row discount special-discount">
                      <span>🎉 Special Discount (10%):</span><span>- ₹{automaticDiscount}</span>
                    </div>
                  )}
                  {totalDiscount > 0 && (
                    <div className="summary-row total-discount-row">
                      <strong>Total Savings:</strong><strong>- ₹{totalDiscount}</strong>
                    </div>
                  )}
                  <div className="summary-row"><span>GST (5%):</span><span>₹{gst}</span></div>
                  <div className="summary-divider"></div>
                  <div className="summary-row total">
                    <strong>Grand Total:</strong><strong>₹{grandTotal}</strong>
                  </div>
                </div>

                <div className="checkout-buttons">
                  <button className="btn primary" onClick={handleProceedToPayment} disabled={loading}>
                    Proceed to Payment - ₹{grandTotal} →
                  </button>
                  <button className="btn secondary" onClick={() => setShowCheckout(false)}>
                    ← Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}