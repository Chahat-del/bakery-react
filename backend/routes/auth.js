// backend/routes/auth.js
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");

const router = express.Router();
console.log("🔍 User model:", User);
console.log("🔍 User.findOne type:", typeof User.findOne);
console.log("🔍 User methods:", Object.getOwnPropertyNames(User));


function createToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    console.log("📝 Signup request received:", req.body);
    
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      console.log("❌ Missing fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    console.log("🔍 Checking for existing user...");
    const existing = await User.findOne({ email });
    if (existing) {
      console.log("❌ User already exists");
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    console.log("🔐 Hashing password...");
    const passwordHash = await bcrypt.hash(password, 10);

    console.log("💾 Creating user...");
    const user = await User.create({
      name,
      email,
      passwordHash,
    });

    console.log("✅ User created:", user._id);
    const token = createToken(user);

    res.status(201).json({
      message: "Account created successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("💥 Signup error DETAILS:", err);
    console.error("Error name:", err.name);
    console.error("Error message:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    console.log("🔑 Login request received:", req.body.email);
    
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found");
      return res
        .status(400)
        .json({ message: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      console.log("❌ Password mismatch");
      return res
        .status(400)
        .json({ message: "Invalid email or password" });
    }

    console.log("✅ Login successful:", user._id);
    const token = createToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("💥 Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/auth/me
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-passwordHash");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Me error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;