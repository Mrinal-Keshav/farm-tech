const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  quantity: { type: Number, default: 1 }
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  displayName: { type: String },
  avatar: { type: String },
  location: { type: String },
  bio: { type: String },
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  cart: [cartItemSchema]
});

module.exports = mongoose.model("User", userSchema);


