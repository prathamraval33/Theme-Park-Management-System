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
    booking_id: booking.booking_id,
    email:      booking.email
  });
  return await QRCode.toDataURL(payload);
};

const isToday = (date) => {
  if (!date) return false;
  const d = new Date(date), n = new Date();
  return d.getDate() === n.getDate() &&
    d.getMonth() === n.getMonth() &&
    d.getFullYear() === n.getFullYear();
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ===== GET ALL ===== */
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ===== STATS ===== */
router.get("/stats", async (req, res) => {
  try {
    const all      = await Booking.find();
    const todayAll = all.filter(b => isToday(b.visit_date));

    const stats = {
      bookingsToday:    todayAll.length,
      revenueToday:     todayAll.reduce((s, b) => s + b.total_amount, 0),
      bookingsAllTime:  all.length,
      revenueAllTime:   all.reduce((s, b) => s + b.total_amount, 0),
      visitorsToday:    all.filter(b => b.checkedIn && isToday(b.validatedAt)).length,
      visitorsAllTime:  all.filter(b => b.checkedIn).length,
      vipToday:         todayAll.filter(b => b.ticket_type === "VIP").length,
      normalToday:      todayAll.filter(b => b.ticket_type === "Normal").length,
      staffCreated:     all.filter(b => b.bookedBy === "TicketStaff").length,
      customerCreated:  all.filter(b => b.bookedBy === "Customer").length,
      vipAllTime:       all.filter(b => b.ticket_type === "VIP").length,
      normalAllTime:    all.filter(b => b.ticket_type === "Normal").length,
    };

    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ===== SEARCH ===== */
router.get("/search", async (req, res) => {
  try {
    const q = String(req.query.q || "").trim().slice(0, 50);
    if (!q) return res.json([]);

    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const bookings = await Booking.find({
      $or: [
        { booking_id:    { $regex: escaped, $options: "i" } },
        { email:         { $regex: escaped, $options: "i" } },
        { customer_name: { $regex: escaped, $options: "i" } },
      ]
    }).sort({ createdAt: -1 }).limit(20);

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ===== FIND BY BOOKING_ID (scanner) ===== */
router.get("/find/:booking_id", async (req, res) => {
  try {
    const { booking_id } = req.params;

    let booking = await Booking.findOne({ booking_id });

    if (!booking && booking_id.match(/^[a-f\d]{24}$/i)) {
      booking = await Booking.findById(booking_id);
    }

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ===== GET SINGLE ===== */
router.get("/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Not found" });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ===== STAFF CREATE ===== */
router.post("/staff-create", async (req, res) => {
  try {
    const {
      customer_name, email,
      ticket_type, quantity, visit_date,
      payment_method, total_amount, notes
    } = req.body;

    // phone removed from required fields
    if (!customer_name || !email || !visit_date || !quantity || !total_amount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (quantity < 1 || quantity > 100) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const booking_id = generateBookingId();

    const booking = new Booking({
      booking_id,
      customer_name: customer_name.trim(),
      email:         email.toLowerCase().trim(),
      phone:         "—",
      ticket_type:   ticket_type   || "Normal",
      quantity:      Number(quantity),
      visit_date:    new Date(visit_date),
      payment_method: payment_method || "Cash",
      total_amount:  Number(total_amount),
      notes:         notes || "",
      bookedBy:      "TicketStaff",
      status:        "Confirmed"
    });

    booking.qr_code = await generateQR(booking);
    await booking.save();

    const io = req.app.get("io");
    io.emit("bookingUpdated");

    res.status(201).json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

/* ===== EDIT ===== */
router.put("/:id/edit", async (req, res) => {
  try {
    const { checkedIn, validatedAt, status, bookedBy, qr_code, phone, ...updates } = req.body;

    if (updates.email && !emailRegex.test(updates.email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { ...updates },
      { new: true }
    );

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.qr_code = await generateQR(booking);
    await booking.save();

    const io = req.app.get("io");
    io.emit("bookingUpdated");

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ===== VALIDATE ===== */
router.put("/:id/validate", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.checkedIn) return res.status(400).json({ message: "already_used" });
    if (booking.status === "Cancelled" || booking.status === "Refunded")
      return res.status(400).json({ message: "invalid_ticket" });

    const visitDate = new Date(booking.visit_date);
    visitDate.setHours(23, 59, 59, 999);
    if (visitDate < new Date()) return res.status(400).json({ message: "expired" });

    booking.checkedIn   = true;
    booking.validatedAt = new Date();
    booking.status      = "Validated";
    await booking.save();

    const io = req.app.get("io");
    io.emit("bookingUpdated");

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ===== CANCEL ===== */
router.put("/:id/cancel", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.checkedIn) return res.status(400).json({ message: "Validated booking cannot be cancelled" });
    if (booking.status === "Cancelled") return res.status(400).json({ message: "Already cancelled" });

    booking.status = "Cancelled";
    await booking.save();

    const io = req.app.get("io");
    io.emit("bookingUpdated");

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// add this at the top of bookingRoutes.js
const { sendRefundEmail } = require("../utils/mailer");

/* ===== REFUND ===== */
router.put("/:id/refund", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking)
      return res.status(404).json({ message: "Booking not found" });
    if (booking.checkedIn)
      return res.status(400).json({ message: "Used ticket cannot be refunded" });
    if (booking.status === "Refunded")
      return res.status(400).json({ message: "Already refunded" });
    if (booking.status === "Cancelled")
      return res.status(400).json({ message: "Cancelled booking cannot be refunded" });

    booking.status = "Refunded";
    await booking.save();

    // send refund email — don't block response if mail fails
    sendRefundEmail(booking).catch(err =>
      console.error("Refund email failed:", err.message)
    );

    const io = req.app.get("io");
    io.emit("bookingUpdated");

    res.json({ ...booking.toObject(), emailSent: true });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;