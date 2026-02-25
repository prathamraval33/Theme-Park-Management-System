const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Booking = require("../models/Booking");
const Ride = require("../models/Rides");
const QRCode = require("qrcode");

/* ========================= */
/* Create Booking */
/* ========================= */
router.post("/create", async (req, res) => {
  try {
    let {
      user_id,
      ride_id,
      booking_date,
      ticket_quantity,
      total_amount,
      payment_status
    } = req.body;

    // Validate raw fields first
    if (
      !user_id ||
      !ride_id ||
      !booking_date ||
      !ticket_quantity ||
      !total_amount ||
      !payment_status
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Convert properly
    ticket_quantity = Number(ticket_quantity);
    total_amount = Number(total_amount);
    const parsedDate = new Date(booking_date);

    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: "Invalid booking date" });
    }

    if (!mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(ride_id)) {
      return res.status(400).json({ message: "Invalid Ride ID" });
    }

    const ride = await Ride.findById(ride_id);

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    if (ride.status !== "Open") {
      return res.status(400).json({ message: "Ride is not open" });
    }

    if (ride.currentQueue + ticket_quantity > ride.capacity) {
      return res.status(400).json({ message: "Ride is full" });
    }

    ride.currentQueue += ticket_quantity;
    await ride.save();

    const qrText = `
User ID: ${user_id}
Ride: ${ride.ride_name}
Date: ${parsedDate.toDateString()}
Tickets: ${ticket_quantity}
Amount: ${total_amount}
Status: ${payment_status}
`;

    const qrImage = await QRCode.toDataURL(qrText);

    const booking = new Booking({
      user_id,
      ride_id,
      booking_date: parsedDate,
      ticket_quantity,
      total_amount,
      payment_status,
      qr_code: qrImage
    });

    await booking.save();

    return res.status(201).json({
      message: "Booking saved successfully",
      qr_code: qrImage
    });

  } catch (error) {
    console.error("Booking Error:", error);
    return res.status(500).json({ message: error.message });
  }
});

/* ========================= */
/* Get Bookings by User */
/* ========================= */
router.get("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    const bookings = await Booking.find({ user_id: id }).populate("ride_id");

    return res.status(200).json(bookings);

  } catch (error) {
    console.error("Fetch Booking Error:", error);
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;