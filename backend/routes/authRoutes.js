const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../models/User");

/* ===========================
            SIGNUP
=========================== */
router.post("/signup", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // 1️⃣ Validate required fields
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const lowerEmail = email.toLowerCase();

    // 2️⃣ Check existing user
    const existingUser = await User.findOne({ email: lowerEmail });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Auto increment user_id (college-level simple logic)
    const count = await User.countDocuments();

    const newUser = new User({
      user_id: count + 1,
      name,
      email: lowerEmail,
      phone,
      password: hashedPassword,
      role: "Customer"   // ✅ Always customer from signup
    });

    await newUser.save();

    res.status(201).json({
      message: "Signup successful"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

/* ===========================
            LOGIN
=========================== */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const lowerEmail = email.toLowerCase();

    const user = await User.findOne({ email: lowerEmail });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // ✅ IMPORTANT CHANGE HERE
    res.json({
      message: "Login successful",
      user: {
        _id: user._id,          // ⭐ Mongo ObjectId
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// TEMP ROUTE - REMOVE BEFORE SUBMISSION
router.get("/all-users", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

module.exports = router;
