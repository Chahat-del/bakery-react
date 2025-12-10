// backend/models/Order.js
const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    name: String,
    price: Number, // store numeric price (e.g. 650)
    qty: Number,
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // allow guest orders for now
    },
    items: [orderItemSchema],
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed"],
      default: "pending",
    },
    contactName: String,
    contactEmail: String,
    contactPhone: String,
    message: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
