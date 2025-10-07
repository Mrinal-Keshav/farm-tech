const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const cartRoutes = require("./routes/cartRoutes");
const User = require("./models/User");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json({ limit: "5mb" }));
app.use("/api/cart", cartRoutes);
app.use(cors());

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/farm", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    const activeDb = mongoose.connection?.db?.databaseName;
    const uriFromEnv = !!process.env.MONGODB_URI;
    console.log(
      `✅ MongoDB Connected${activeDb ? ` (db: ${activeDb})` : ""}${uriFromEnv ? " via MONGODB_URI" : " via default URI"}`
    );
  })
  .catch((err) => console.error("❌ MongoDB Error:", err));

/* ---------------------- USER LOGIN SYSTEM ---------------------- */

// Register
app.post("/api/register", async (req, res) => {
  try {
    const { email, password, displayName, location, bio } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "❌ Email already exists. Please login." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ 
      email, 
      password: hashedPassword,
      displayName: displayName || email.split('@')[0],
      location,
      bio
    });
    await newUser.save();
    res.status(201).json({ 
      message: "✅ User registered successfully!", 
      user: {
        email: newUser.email,
        displayName: newUser.displayName,
        avatar: newUser.avatar,
        location: newUser.location,
        bio: newUser.bio,
        verified: newUser.verified
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to register user" });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "❌ User not found" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "❌ Invalid password" });
    res.json({ 
      message: "✅ Login successful!", 
      user: {
        email: user.email,
        displayName: user.displayName,
        avatar: user.avatar,
        location: user.location,
        bio: user.bio,
        verified: user.verified
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to login" });
  }
});

/* ---------------------- FARM COMMUNITY FEED ---------------------- */
const commentSchema = new mongoose.Schema({
  user: String,
  avatar: String,
  text: String,
  time: String,
  likes: { type: Number, default: 0 },
  likedBy: [String],
  replies: [{
    user: String,
    avatar: String,
    text: String,
    time: String
  }]
});

const postSchema = new mongoose.Schema({
  user: String,
  avatar: String,
  content: String,
  image: String,
  time: String,
  likes: { type: Number, default: 0 },
  likedBy: [String],
  comments: [commentSchema],
  category: { type: String, default: "General" },
  tags: [String]
});

const Post = mongoose.model("Post", postSchema);

// Get all posts
app.get("/api/posts", async (req, res) => {
  try {
    const posts = await Post.find().sort({ _id: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// Create post
app.post("/api/posts", async (req, res) => {
  try {
    const { user, avatar, content, image, category, tags } = req.body;
    if (!content && !image) {
      return res.status(400).json({ error: "Post cannot be empty" });
    }
    const newPost = new Post({
      user,
      avatar,
      content,
      image,
      time: new Date().toLocaleString(),
      comments: [],
      category: category || "General",
      tags: tags || []
    });
    await newPost.save();
    res.json(newPost);
  } catch (err) {
    res.status(500).json({ error: "Failed to create post" });
  }
});

// Add comment
app.post("/api/posts/:id/comment", async (req, res) => {
  try {
    const { user, avatar, text } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    
    const newComment = {
      user,
      avatar,
      text,
      time: "Just now",
      likes: 0,
      likedBy: [],
      replies: []
    };
    
    post.comments.push(newComment);
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: "Failed to add comment" });
  }
});

// Add reply to comment
app.post("/api/posts/:id/comments/:commentIndex/reply", async (req, res) => {
  try {
    const { user, avatar, text } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    
    const commentIndex = parseInt(req.params.commentIndex);
    if (commentIndex >= post.comments.length) {
      return res.status(404).json({ error: "Comment not found" });
    }
    
    const newReply = {
      user,
      avatar,
      text,
      time: "Just now"
    };
    
    post.comments[commentIndex].replies.push(newReply);
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: "Failed to add reply" });
  }
});

// Like/Unlike post
app.post("/api/posts/:id/like", async (req, res) => {
  try {
    const { userEmail } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    
    const userIndex = post.likedBy.indexOf(userEmail);
    if (userIndex > -1) {
      // Unlike
      post.likedBy.splice(userIndex, 1);
      post.likes = Math.max(0, post.likes - 1);
    } else {
      // Like
      post.likedBy.push(userEmail);
      post.likes += 1;
    }
    
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: "Failed to update like" });
  }
});

// Like/Unlike comment
app.post("/api/posts/:id/comments/:commentIndex/like", async (req, res) => {
  try {
    const { userEmail } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    
    const commentIndex = parseInt(req.params.commentIndex);
    if (commentIndex >= post.comments.length) {
      return res.status(404).json({ error: "Comment not found" });
    }
    
    const comment = post.comments[commentIndex];
    const userIndex = comment.likedBy.indexOf(userEmail);
    if (userIndex > -1) {
      // Unlike
      comment.likedBy.splice(userIndex, 1);
      comment.likes = Math.max(0, comment.likes - 1);
    } else {
      // Like
      comment.likedBy.push(userEmail);
      comment.likes += 1;
    }
    
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: "Failed to update comment like" });
  }
});

// Delete post
app.delete("/api/posts/:id", async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete post" });
  }
});

// Get user profile
app.get("/api/users/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ error: "User not found" });
    
    res.json({
      email: user.email,
      displayName: user.displayName,
      avatar: user.avatar,
      location: user.location,
      bio: user.bio,
      verified: user.verified,
      createdAt: user.createdAt
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

/* ---------------------- CART ROUTES ---------------------- */
const cartRouter = express.Router();

// Add item to cart
cartRouter.post("/add", async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const existingItem = user.cart.find(
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
cartRouter.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("cart.productId");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user.cart || []);
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to fetch cart" });
  }
});

// Remove item from cart
cartRouter.post("/remove", async (req, res) => {
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
cartRouter.post("/clear", async (req, res) => {
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

app.use("/api/cart", cartRouter);

// Update user profile
app.put("/api/users/:email", async (req, res) => {
  try {
    const { displayName, avatar, location, bio } = req.body;
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ error: "User not found" });
    
    if (displayName) user.displayName = displayName;
    if (avatar) user.avatar = avatar;
    if (location) user.location = location;
    if (bio) user.bio = bio;
    
    await user.save();
    res.json({
      email: user.email,
      displayName: user.displayName,
      avatar: user.avatar,
      location: user.location,
      bio: user.bio,
      verified: user.verified
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to update user" });
  }
});

/* ---------------------- START SERVER ---------------------- */
app.listen(PORT, () => console.log(`🚀 Farm Community Server running on http://localhost:${PORT}`));

// Optional: Health endpoint for quick checks
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection?.readyState === 1 ? 'connected' : 'disconnected';
  return res.json({
    status: 'ok',
    dbStatus,
    dbName: mongoose.connection?.db?.databaseName || null
  });
});

