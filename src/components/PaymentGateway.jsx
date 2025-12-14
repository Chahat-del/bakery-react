// src/components/PaymentGateway.jsx
import React, { useState } from "react";

export default function PaymentGateway({ amount, onPaymentSuccess, onCancel }) {
  const [selectedMethod, setSelectedMethod] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Form states for different payment methods
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvv, setCvv] = useState("");

  const paymentMethods = [
    {
      id: "upi",
      name: "UPI",
      icon: "📱",
      description: "Google Pay, PhonePe, Paytm, etc.",
      popular: true
    },
    {
      id: "card",
      name: "Credit/Debit Card",
      icon: "💳",
      description: "Visa, Mastercard, RuPay",
      popular: true
    },
    {
      id: "netbanking",
      name: "Net Banking",
      icon: "🏦",
      description: "All major banks supported",
      popular: false
    },
    {
      id: "wallet",
      name: "Wallet",
      icon: "👛",
      description: "Paytm, PhonePe, Amazon Pay",
      popular: false
    }
  ];

  const handleMethodSelect = (methodId) => {
    setSelectedMethod(methodId);
    setShowForm(true);
  };

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, "");
    const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
    return formatted.substring(0, 19); // Max 16 digits + 3 spaces
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value.replace(/\D/g, ""));
    setCardNumber(formatted);
  };

  const validateUPI = (upi) => {
    const upiRegex = /^[\w.-]+@[\w.-]+$/;
    return upiRegex.test(upi);
  };

  const validateCard = () => {
    const cardDigits = cardNumber.replace(/\s/g, "");
    if (cardDigits.length !== 16) return false;
    if (!cardName.trim()) return false;
    if (!expiryMonth || !expiryYear) return false;
    if (cvv.length !== 3) return false;

    // Check expiry date is not in the past
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
    if (parseInt(expiryYear) < currentYear) return false;
    if (parseInt(expiryYear) === currentYear && parseInt(expiryMonth) < currentMonth) return false;

    return true;
  };

  const processPayment = async () => {
    setLoading(true);

    // Validate based on payment method
    if (selectedMethod === "upi") {
      if (!validateUPI(upiId)) {
        alert("Please enter a valid UPI ID (e.g., user@bank)");
        setLoading(false);
        return;
      }
    } else if (selectedMethod === "card") {
      if (!validateCard()) {
        alert("Please fill all card details correctly");
        setLoading(false);
        return;
      }
    }

    // Simulate payment processing (2-3 seconds)
    setTimeout(() => {
      const transactionId = "TXN" + Date.now() + Math.floor(Math.random() * 1000);
      
      setLoading(false);
      onPaymentSuccess({
        transactionId,
        method: selectedMethod,
        amount: amount,
        timestamp: new Date().toISOString()
      });
    }, 2500);
  };

  const renderPaymentForm = () => {
    switch (selectedMethod) {
      case "upi":
        return (
          <div className="payment-form">
            <h4>Enter UPI ID</h4>
            <div className="form-group">
              <label>UPI ID</label>
              <input
                type="text"
                placeholder="yourname@bank"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="payment-input"
              />
              <small>Example: 9876543210@paytm, user@ybl, name@oksbi</small>
            </div>
            
            <div className="upi-apps">
              <p>Popular UPI Apps:</p>
              <div className="upi-icons">
                <span>Google Pay</span>
                <span>PhonePe</span>
                <span>Paytm</span>
                <span>BHIM</span>
              </div>
            </div>
          </div>
        );

      case "card":
        return (
          <div className="payment-form">
            <h4>Card Details</h4>
            <div className="form-group">
              <label>Card Number</label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={handleCardNumberChange}
                maxLength="19"
                className="payment-input"
              />
            </div>

            <div className="form-group">
              <label>Cardholder Name</label>
              <input
                type="text"
                placeholder="Name on card"
                value={cardName}
                onChange={(e) => setCardName(e.target.value.toUpperCase())}
                className="payment-input"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Expiry Month</label>
                <select
                  value={expiryMonth}
                  onChange={(e) => setExpiryMonth(e.target.value)}
                  className="payment-input"
                >
                  <option value="">MM</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m.toString().padStart(2, "0")}>
                      {m.toString().padStart(2, "0")}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Expiry Year</label>
                <select
                  value={expiryYear}
                  onChange={(e) => setExpiryYear(e.target.value)}
                  className="payment-input"
                >
                  <option value="">YY</option>
                  {Array.from({ length: 10 }, (_, i) => {
                    const year = (new Date().getFullYear() % 100) + i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="form-group">
                <label>CVV</label>
                <input
                  type="password"
                  placeholder="123"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").substring(0, 3))}
                  maxLength="3"
                  className="payment-input"
                />
              </div>
            </div>

            <div className="card-icons">
              <span>💳 Visa</span>
              <span>💳 Mastercard</span>
              <span>💳 RuPay</span>
              <span>💳 Maestro</span>
            </div>
          </div>
        );

      case "netbanking":
        return (
          <div className="payment-form">
            <h4>Select Your Bank</h4>
            <div className="bank-list">
              <select className="payment-input" defaultValue="">
                <option value="" disabled>Choose your bank</option>
                <option value="sbi">State Bank of India</option>
                <option value="hdfc">HDFC Bank</option>
                <option value="icici">ICICI Bank</option>
                <option value="axis">Axis Bank</option>
                <option value="kotak">Kotak Mahindra Bank</option>
                <option value="pnb">Punjab National Bank</option>
                <option value="bob">Bank of Baroda</option>
                <option value="other">Other Banks</option>
              </select>
            </div>
            <p className="info-text">You will be redirected to your bank's website for secure payment</p>
          </div>
        );

      case "wallet":
        return (
          <div className="payment-form">
            <h4>Select Wallet</h4>
            <div className="wallet-options">
              <button className="wallet-btn">
                <span>📱</span>
                <span>Paytm</span>
              </button>
              <button className="wallet-btn">
                <span>💜</span>
                <span>PhonePe</span>
              </button>
              <button className="wallet-btn">
                <span>🟠</span>
                <span>Amazon Pay</span>
              </button>
              <button className="wallet-btn">
                <span>🔵</span>
                <span>MobiKwik</span>
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="payment-gateway">
      <div className="payment-header">
        <h3>Complete Payment</h3>
        <div className="payment-amount">
          <span>Amount to Pay:</span>
          <strong>₹{amount}</strong>
        </div>
      </div>

      {!showForm ? (
        <div className="payment-methods">
          <p className="payment-subtitle">Select Payment Method</p>
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              className={`payment-method-card ${method.popular ? "popular" : ""}`}
              onClick={() => handleMethodSelect(method.id)}
            >
              <div className="method-icon">{method.icon}</div>
              <div className="method-details">
                <strong>{method.name}</strong>
                <small>{method.description}</small>
              </div>
              {method.popular && <span className="popular-badge">Popular</span>}
            </button>
          ))}
        </div>
      ) : (
        <>
          <div className="selected-method">
            <button
              className="back-btn"
              onClick={() => {
                setShowForm(false);
                setSelectedMethod("");
              }}
            >
              ← Back to payment methods
            </button>
            <div className="method-header">
              <span className="method-icon-large">
                {paymentMethods.find((m) => m.id === selectedMethod)?.icon}
              </span>
              <span>{paymentMethods.find((m) => m.id === selectedMethod)?.name}</span>
            </div>
          </div>

          {renderPaymentForm()}

          <div className="payment-actions">
            <button
              className="btn primary pay-btn"
              onClick={processPayment}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner">⏳</span>
                  Processing...
                </>
              ) : (
                `Pay ₹${amount}`
              )}
            </button>
            <button className="btn secondary" onClick={onCancel} disabled={loading}>
              Cancel
            </button>
          </div>

          <div className="payment-security">
            <p>🔒 Your payment is 100% secure and encrypted</p>
          </div>
        </>
      )}
    </div>
  );
}