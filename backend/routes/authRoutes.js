const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../models/User");

/* SIGNUP */
router.post("/signup", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const count = await User.countDocuments();

    const newUser = new User({
      user_id: count + 1,
      name,
      email,
      phone,
      password: hashedPassword,
      role: "Customer"
    });

    await newUser.save();

    res.json({ message: "Signup successful" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* LOGIN */
router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findOne({ email, role });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const bcrypt = require("bcrypt");
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.json({
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
