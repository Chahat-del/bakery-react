// backend/server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// Allow ALL origins for debugging
app.use(cors({
  origin: true,
  credentials: true,
}));

// Add request logging
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  next();
});

app.use(express.json());

// routes
app.get("/", (req, res) => {
  res.send("SweetCrumbs API is running 🍰");
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/orders", require("./routes/orders"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});