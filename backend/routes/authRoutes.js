const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../models/User");
const nodemailer = require("nodemailer");
const sendOTPEmail = require("../utils/mailer");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/* ================= OTP STORE ================= */

const otpStore = new Map();

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/* ================= ROLE REDIRECT ================= */

const getRedirectPath = (role) => {
  switch (role) {
    case "Admin": return "/admin";
    case "RideStaff": return "/ride-staff";
    default: return "/";
  }
};



/* ================= SIGNUP ================= */

router.post("/signup", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const emailLower = email.toLowerCase();

    const existingUser = await User.findOne({ email: emailLower });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const otp = generateOTP();

    // ✅ STORE OTP + USER DATA
    otpStore.set(emailLower, {
      otp,
      data: { name, email: emailLower, phone, password },
      expiry: Date.now() + 5 * 60 * 1000
    });

    // ✅ SEND EMAIL (ONLY ONCE)
    await sendOTPEmail(emailLower, otp);

    console.log("Stored OTP:", otpStore);

    res.json({ message: "OTP sent to email" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Signup failed" });
  }
});

/* ================= VERIFY OTP ================= */

router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const emailLower = email.toLowerCase();

    const record = otpStore.get(emailLower);

    if (!record) {
      return res.status(400).json({ message: "No OTP found" });
    }

    if (record.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (record.expiry < Date.now()) {
      otpStore.delete(emailLower);
      return res.status(400).json({ message: "OTP expired" });
    }

    const { name, phone, password } = record.data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email: emailLower,
      phone,
      password: hashedPassword,
      role: "Customer"
    });

    await user.save();

    otpStore.delete(emailLower);

    res.json({ message: "Account created successfully" });

  } catch (err) {
    res.status(500).json({ message: "Verification failed" });
  }
});

/* ================= RESEND OTP ================= */

router.post("/resend-otp", async (req, res) => {
  const { email } = req.body;

  const emailLower = email.toLowerCase();

  const record = otpStore.get(emailLower);

  if (!record) {
    return res.status(400).json({ message: "No signup found" });
  }

  const otp = generateOTP();

  otpStore.set(emailLower, {
    ...record,
    otp,
    expiry: Date.now() + 5 * 60 * 1000
  });

  // ✅ SEND EMAIL AGAIN
  await sendOTPEmail(emailLower, otp);

  console.log("Resent OTP:", otp);

  res.json({ message: "OTP resent" });
});

/* ================= LOGIN ================= */

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const emailLower = email.toLowerCase();

    const user = await User.findOne({ email: emailLower });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.password === "google_auth") {
      return res.status(400).json({
        message: "Use Google login"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.json({
      message: "Login successful",
      user,
      redirect: getRedirectPath(user.role)
    });

  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= GOOGLE ================= */

router.post("/google", async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name,
        email,
        password: "google_auth",
        role: "Customer",
        profilePic: picture
      });

      await user.save();
    }

    res.json({
      message: "Google login success",
      user,
      redirect: getRedirectPath(user.role)
    });

  } catch (err) {
    res.status(500).json({ message: "Google auth failed" });
  }
});

module.exports = router;