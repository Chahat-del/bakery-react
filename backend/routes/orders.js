// backend/routes/orders.js
const express = require("express");
const Order = require("../models/Order");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// POST /api/orders - Create new order (Protected)
router.post("/", auth, async (req, res) => {
  try {
    const { items, subtotal, discount, gst, total, couponCode } = req.body;

    // Validate required fields
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Generate order number
    const orderCount = await Order.countDocuments();
    const orderNumber = `ORD-${Date.now()}-${orderCount + 1}`;

    const order = await Order.create({
      userId: req.userId,
      orderNumber,
      items,
      subtotal,
      discount: discount || 0,
      gst,
      total,
      couponCode: couponCode || null,
      status: "pending"
    });

    console.log("✅ Order created:", order._id);

    res.status(201).json({
      message: "Order placed successfully",
      order: {
        _id: order._id,
        orderNumber: order.orderNumber,
        total: order.total,
        createdAt: order.createdAt
      }
    });
  } catch (error) {
    console.error("💥 Order creation error:", error);
    res.status(500).json({ message: "Failed to place order" });
  }
});

// GET /api/orders - Get user's orders (Protected)
router.get("/", auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId })
      .sort({ createdAt: -1 });

    res.json({ orders });
  } catch (error) {
    console.error("💥 Fetch orders error:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// GET /api/orders/:id - Get single order (Protected)
router.get("/:id", auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ order });
  } catch (error) {
    console.error("💥 Fetch order error:", error);
    res.status(500).json({ message: "Failed to fetch order" });
  }
});

module.exports = router;