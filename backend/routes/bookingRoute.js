const express = require("express");
const router  = express.Router();
const Booking = require("../models/Booking");
const QRCode  = require("qrcode");
const { v4: uuidv4 } = require("uuid");

/* ===== HELPERS ===== */
const generateBookingId = () =>
  "BK-" + Date.now().toString().slice(-6) + "-" + uuidv4().slice(0, 4).toUpperCase();

const generateQR = async (booking) => {
  const payload = JSON.stringify({
    booking_id:   booking.booking_id,
    email:        booking.email,
    visit_date:   booking.visit_date,
    total_amount: booking.total_amount
  });
  return await QRCode.toDataURL(payload);
};

/* ===== POST /api/booking/create ===== */
router.post("/create", async (req, res) => {
  try {
    const { email, booking_date, items, total_amount } = req.body;

    // validation
    if (!email || !booking_date || !items || items.length === 0) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const booking_id = generateBookingId();

    // derive fields from customer cart
    // items from frontend: [{ title, qty, price }]
    const hasVIP     = items.some(i => i.title?.toLowerCase().includes("vip"));
    const totalQty   = items.reduce((s, i) => s + (i.qty || 1), 0);
    const totalAmt   = total_amount ||
      items.reduce((s, i) => s + (i.price * (i.qty || 1)), 0);
    const notesStr   = items.map(i => `${i.title} x${i.qty}`).join(", ");

    const booking = new Booking({
      booking_id,
      customer_name: email.split("@")[0],
      email:         email.toLowerCase().trim(),
      phone:         "—",
      ticket_type:   hasVIP ? "VIP" : "Normal",
      quantity:      totalQty,
      visit_date:    new Date(booking_date),
      payment_method: "UPI",
      total_amount:  totalAmt,
      bookedBy:      "Customer",
      status:        "Confirmed",
      notes:         notesStr
    });

    booking.qr_code = await generateQR(booking);
    await booking.save();

    // emit socket if io is set up
    const io = req.app.get("io");
    if (io) io.emit("bookingUpdated");

    res.status(201).json({
      message:  "Booking created",
      qr_code:  booking.qr_code,
      booking
    });

  } catch (err) {
    console.error("Booking create error:", err);
    res.status(500).json({ message: "Booking failed" });
  }
});

/* ===== GET /api/booking/user/:email ===== */
router.get("/user/:email", async (req, res) => {
  try {
    const email = decodeURIComponent(req.params.email).toLowerCase().trim();

    const bookings = await Booking.find({ email }).sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    console.error("Fetch bookings error:", err);
    res.status(500).json({ message: err.message });
  }
});

/* ===== CUSTOMER REFUND REQUEST ===== */
const { sendRefundEmail } = require("../utils/mailer");

router.put("/refund/:id", async (req, res) => {
  try {

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    if (booking.status === "Refunded") {
      return res.status(400).json({
        message: "Booking already refunded"
      });
    }

    if (booking.status === "Cancelled") {
      return res.status(400).json({
        message: "Cancelled booking cannot be refunded"
      });
    }

    if (booking.checkedIn) {
      return res.status(400).json({
        message: "Used ticket cannot be refunded"
      });
    }

    /* ===== 2 DAY RULE ===== */
    const today = new Date();
    const visitDate = new Date(booking.visit_date);

    const diffDays =
      (visitDate.getTime() - today.getTime()) /
      (1000 * 60 * 60 * 24);

    if (diffDays < 2) {
      return res.status(400).json({
        message:
          "Refund allowed only at least 2 days before visit date"
      });
    }

    /* ===== UPDATE STATUS ===== */
    booking.status = "Refunded";

    await booking.save();

    /* ===== SEND EMAIL ===== */
    try {
      await sendRefundEmail(booking);
    } catch (mailErr) {
      console.error("Refund email failed:", mailErr);
    }

    /* ===== REALTIME SOCKET ===== */
    const io = req.app.get("io");
    if (io) {
      io.emit("bookingUpdated");
    }

    res.json({
      message: "Refund processed successfully",
      booking
    });

  } catch (err) {

    console.error("Refund Error:", err);

    res.status(500).json({
      message: "Refund failed"
    });

  }
});
module.exports = router;