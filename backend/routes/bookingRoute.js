const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const QRCode = require("qrcode");

/* Save Booking */
router.post("/create", async (req, res) => {
  try {
    const {
      user_id,
      booking_date,
      ticket_quantity,
      total_amount,
      payment_status
    } = req.body;

    // Generate QR text
    const qrText = `User ID: ${user_id}
Date: ${booking_date}
Tickets: ${ticket_quantity}
Amount: ${total_amount}
Status: ${payment_status}`;

    // Generate QR image
    const qrImage = await QRCode.toDataURL(qrText);

    // Save booking INCLUDING user_id
    const booking = new Booking({
      user_id: user_id,   // IMPORTANT
      booking_date: booking_date,
      ticket_quantity: ticket_quantity,
      total_amount: total_amount,
      payment_status: payment_status,
      qr_code: qrImage
    });

    await booking.save();

    res.json({
      message: "Booking saved successfully",
      qr_code: qrImage
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error saving booking" });
  }
});

/* Get bookings by user */
router.get("/user/:id", async (req, res) => {
  try {
    const bookings = await Booking.find({ user_id: req.params.id });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings" });
  }
});

module.exports = router;
