const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Booking = require("../models/Booking");
const Ride = require("../models/Rides");

/* ===========================
        DASHBOARD STATS
=========================== */
router.get("/stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalRides = await Ride.countDocuments();

    const revenueData = await Booking.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total_amount" }
        }
      }
    ]);

    const totalRevenue = revenueData.length > 0
      ? revenueData[0].totalRevenue
      : 0;

    res.status(200).json({
      totalUsers,
      totalBookings,
      totalRides,
      totalRevenue
    });

  } catch (error) {
    console.error("Stats Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

/* ===========================
      RECENT BOOKINGS
=========================== */
router.get("/recent-bookings", async (req, res) => {
  try {
    const bookings = await Booking.find()
      .sort({ createdAt: -1 }) // newest first
      .limit(5);

    res.status(200).json(bookings);

  } catch (error) {
    console.error("Recent Bookings Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;