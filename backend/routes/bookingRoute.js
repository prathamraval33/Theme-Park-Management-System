const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const QRCode = require("qrcode");

/* ============================== */
/* CREATE BOOKING */
/* ============================== */

router.post("/create", async (req, res) => {

  try {

    const {
      email,
      booking_date,
      items,
      total_amount,
      payment_status
    } = req.body;

    /* ============================== */
    /* VALIDATION */
    /* ============================== */

    if (!email || !booking_date || !items || items.length === 0) {
      return res.status(400).json({
        message: "Missing booking information"
      });
    }

    const parsedDate = new Date(booking_date);

    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        message: "Invalid booking date"
      });
    }

    /* ============================== */
    /* GENERATE QR TEXT */
    /* ============================== */

    const ticketDetails = items
      .map((item) => `${item.title} x${item.qty}`)
      .join("\n");

    const qrText = `
🎢 Theme Park Ticket

Email: ${email}

Visit Date: ${parsedDate.toDateString()}

Tickets:
${ticketDetails}

Total Amount: ₹${total_amount}

Status: ${payment_status}
`;

    /* ============================== */
    /* GENERATE QR CODE */
    /* ============================== */

    const qrImage = await QRCode.toDataURL(qrText);

    /* ============================== */
    /* SAVE BOOKING */
    /* ============================== */

    const booking = new Booking({

      email,
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
      message: "Booking failed"
    });

  }

});


/* ============================== */
/* GET BOOKINGS BY EMAIL */
/* ============================== */

router.get("/user/:email", async (req, res) => {

  try {

    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        message: "Email is required"
      });
    }

    const bookings = await Booking.find({ email }).sort({ createdAt: -1 });

    return res.status(200).json(bookings);

  } catch (error) {

    console.error("Fetch Booking Error:", error);

    return res.status(500).json({
      message: error.message
    });

  }

});


module.exports = router;