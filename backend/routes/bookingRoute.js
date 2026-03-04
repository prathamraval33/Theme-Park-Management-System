const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Booking = require("../models/Booking");
const QRCode = require("qrcode");

/* ========================= */
/* CREATE BOOKING (MULTI-PLAN) */
/* ========================= */
router.post("/create", async (req, res) => {
  try {
    const {
      user_id,
      booking_date,
      items,
      total_amount,
      payment_status
    } = req.body;

    console.log("Incoming booking:", req.body); // 🔍 DEBUG

    /* ===== VALIDATION ===== */
    if (
      !user_id ||
      !booking_date ||
      !items ||
      items.length === 0 ||
      !total_amount ||
      !payment_status
    ) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(400).json({
        message: "Invalid User ID"
      });
    }

    const parsedDate = new Date(booking_date);

    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        message: "Invalid booking date"
      });
    }

    /* ===== VALIDATE ITEMS ===== */
    let totalTickets = 0;

    for (let item of items) {
      if (!item.title || !item.qty || !item.price) {
        return res.status(400).json({
          message: "Invalid item format"
        });
      }

      const qty = Number(item.qty);
      const price = Number(item.price);

      if (qty <= 0 || price <= 0) {
        return res.status(400).json({
          message: "Invalid quantity or price"
        });
      }

      totalTickets += qty;
    }

    /* ===== GENERATE QR ===== */
    const qrText = `
🎢 Theme Park Ticket

User ID: ${user_id}
Date: ${parsedDate.toDateString()}

Tickets:
${items.map(i => `- ${i.title} x${i.qty}`).join("\n")}

Total Tickets: ${totalTickets}
Total Amount: ₹${total_amount}
Status: ${payment_status}
`;

    const qrImage = await QRCode.toDataURL(qrText);

    /* ===== SAVE BOOKING ===== */
    const booking = new Booking({
      user_id,
      booking_date: parsedDate,
      items,
      total_amount,
      payment_status,
      qr_code: qrImage
    });

    await booking.save();

    return res.status(201).json({
      message: "Booking successful",
      qr_code: qrImage,
      booking
    });

  } catch (error) {
    console.error("Booking Error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});

/* ========================= */
/* GET BOOKINGS BY USER */
/* ========================= */
router.get("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid User ID"
      });
    }

    const bookings = await Booking.find({ user_id: id });

    return res.status(200).json(bookings);

  } catch (error) {
    console.error("Fetch Booking Error:", error);
    return res.status(500).json({
      message: error.message
    });
  }
});

module.exports = router;