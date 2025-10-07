const express = require("express");
const User = require("../models/User");

const router = express.Router();

// Add item to cart
router.post("/add", async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const existingItem = (user.cart || []).find(
      (item) => item.productId?.toString() === String(productId)
    );

    if (existingItem) {
      existingItem.quantity += Number(quantity || 1);
    } else {
      user.cart.push({ productId, quantity: Number(quantity || 1) });
    }

    await user.save();
    res.status(200).json({ success: true, cart: user.cart });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to add to cart" });
  }
});

// Get user cart
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("cart.productId");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user.cart || []);
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to fetch cart" });
  }
});

// Remove item from cart
router.post("/remove", async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.cart = (user.cart || []).filter(
      (item) => item.productId?.toString() !== String(productId)
    );

    await user.save();
    res.status(200).json({ success: true, cart: user.cart });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to remove item" });
  }
});

// Clear entire cart
router.post("/clear", async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    user.cart = [];
    await user.save();
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to clear cart" });
  }
});

module.exports = router;


