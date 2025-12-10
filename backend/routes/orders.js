// backend/routes/orders.js
const express = require("express");
const Order = require("../models/Order");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// POST /api/orders/create
router.post("/create", auth, async (req, res) => {
  try {
    const { items, total, contactName, contactEmail, contactPhone, message } =
      req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Order must have items" });
    }

    const order = await Order.create({
      user: req.userId || null,
      items,
      total,
      contactName,
      contactEmail,
      contactPhone,
      message,
    });

    res.status(201).json(order);
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/orders/mine
router.get("/mine", auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId }).sort("-createdAt");
    res.json(orders);
  } catch (err) {
    console.error("Get my orders error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/orders/all (admin)
router.get("/all", auth, async (req, res) => {
  try {
    if (req.userRole !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    const orders = await Order.find().populate("user", "name email");
    res.json(orders);
  } catch (err) {
    console.error("Get all orders error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

