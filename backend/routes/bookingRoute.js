const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Booking = require("../models/Booking");
const QRCode = require("qrcode");

/* Create Booking */
router.post("/create", async (req, res) => {
  try {
    const {
      user_id,
      booking_date,
      ticket_quantity,
      total_amount,
      payment_status
    } = req.body;

    // Basic validation
    if (!user_id || !booking_date || !ticket_quantity || !total_amount || !payment_status) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    // Generate QR text
    const qrText = `
User ID: ${user_id}
Date: ${booking_date}
Tickets: ${ticket_quantity}
Amount: ${total_amount}
Status: ${payment_status}
`;

    const qrImage = await QRCode.toDataURL(qrText);

    const booking = new Booking({
      user_id,
      booking_date,
      ticket_quantity,
      total_amount,
      payment_status,
      qr_code: qrImage
    });

    await booking.save();

    res.status(201).json({
      message: "Booking saved successfully",
      qr_code: qrImage
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* Get Bookings by User */
router.get("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    const bookings = await Booking.find({ user_id: id });

    res.status(200).json(bookings);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
