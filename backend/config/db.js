// backend/config/db.js
const mongoose = require("mongoose");

async function connectDB() {
  try {
    // Use MONGO_URI or MONGODB_URI (Railway often uses MONGODB_URI)
    const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI;
    
    if (!mongoURI) {
      throw new Error("MongoDB URI is not defined in environment variables");
    }

    await mongoose.connect(mongoURI);
    
    console.log("✅ MongoDB connected successfully");
    console.log(`📍 Database: ${mongoose.connection.name}`);
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;