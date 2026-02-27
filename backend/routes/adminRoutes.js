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
/* ===========================
        RIDE MANAGEMENT
=========================== */

// 1️⃣ Get All Rides
router.get("/rides", async (req, res) => {
  try {
    const rides = await Ride.find();
    res.status(200).json(rides);
  } catch (error) {
    console.error("Fetch Rides Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// 2️⃣ Add New Ride
router.post("/rides", async (req, res) => {
  try {
    const { ride_name, description, capacity, price } = req.body;

    const newRide = new Ride({
      ride_name,
      description,
      capacity,
      price,
      status: "Open"
    });

    await newRide.save();
    res.status(201).json(newRide);

  } catch (error) {
    console.error("Add Ride Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// 3️⃣ Delete Ride
router.delete("/rides/:id", async (req, res) => {
  try {
    await Ride.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Ride Deleted Successfully" });

  } catch (error) {
    console.error("Delete Ride Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// 4️⃣ Toggle Ride Status (Open/Closed)
router.put("/rides/:id/toggle", async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    ride.status = ride.status === "Open" ? "Closed" : "Open";
    await ride.save();

    res.status(200).json(ride);

  } catch (error) {
    console.error("Toggle Ride Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});
// 5️⃣ Update Ride (Edit Ride)
router.put("/rides/:id", async (req, res) => {
  try {
    const { ride_name, description, capacity, price } = req.body;

    const updatedRide = await Ride.findByIdAndUpdate(
      req.params.id,
      {
        ride_name,
        description,
        capacity,
        price
      },
      { new: true }
    );

    if (!updatedRide) {
      return res.status(404).json({ message: "Ride not found" });
    }

    res.status(200).json(updatedRide);

  } catch (error) {
    console.error("Update Ride Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});
// 6️⃣ Revenue By Date (For Chart)
router.get("/revenue-chart", async (req, res) => {
  try {
    const revenueData = await Booking.aggregate([
      {
        $group: {
          _id: "$booking_date",
          totalRevenue: { $sum: "$total_amount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json(revenueData);

  } catch (error) {
    console.error("Revenue Chart Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});
module.exports = router;