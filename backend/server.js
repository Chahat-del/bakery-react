// backend/server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "http://localhost:5173", // if using Vite
].filter(Boolean); // Remove undefined values

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      console.log(`✅ CORS allowed: ${origin}`);
      callback(null, true);
    } else {
      console.log(`❌ Blocked by CORS: ${origin}`);
      console.log(`🔍 Allowed origins are:`, allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path} from ${req.get('origin') || 'no-origin'}`);
  next();
});

app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.json({ 
    message: "SweetCrumbs API is running 🍰",
    allowedOrigins: allowedOrigins,
    timestamp: new Date().toISOString()
  });
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/feedback", require("./routes/feedback"));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    message: "Route not found",
    path: req.path 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 Allowed origins:`, allowedOrigins);
  console.log(`📅 Started at: ${new Date().toLocaleString()}`);
});