const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Ride = require("../models/Rides");
const Food = require("../models/food");
const Booking = require("../models/Booking");

const io = require("../server");

/* ===========================
        DASHBOARD STATS
=========================== */
router.get("/stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalRides = await Ride.countDocuments();
    const totalFoods = await Food.countDocuments();

    const revenueData = await Booking.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total_amount" }
        }
      }
    ]);

    const totalRevenue =
      revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    res.json({
      totalUsers,
      totalBookings,
      totalRides,
      totalFoods,
      totalRevenue
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

/* ===========================
        USERS
=========================== */

// GET ALL USERS
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch {
    res.status(500).json({ message: "Server Error" });
  }
});

// UPDATE ROLE
router.put("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true }
    );

    io.emit("adminUpdated");

    res.json(user);
  } catch {
    res.status(500).json({ message: "Server Error" });
  }
});

// DELETE USER
router.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    io.emit("adminUpdated");

    res.json({ message: "User deleted" });
  } catch {
    res.status(500).json({ message: "Server Error" });
  }
});

/* ===========================
        RIDES
=========================== */

// GET ALL RIDES
router.get("/rides", async (req, res) => {
  try {
    const rides = await Ride.find();
    res.json(rides);
  } catch {
    res.status(500).json({ message: "Server Error" });
  }
});

// ADD RIDE
router.post("/rides", async (req, res) => {
  try {
    const ride = new Ride({
      ride_name: req.body.ride_name,
      description: req.body.description,
      capacity: req.body.capacity,
      
      status: "Open"
    });

    await ride.save();

    io.emit("adminUpdated");

    res.json(ride);
  } catch {
    res.status(500).json({ message: "Server Error" });
  }
});

// UPDATE RIDE (ONLY ONE ✅)
router.put("/rides/:id", async (req, res) => {
  try {
    const ride = await Ride.findByIdAndUpdate(
      req.params.id,
      { $set: req.body }, // ✅ important
      {
        returnDocument: "after", // ✅ replaces deprecated "new"
        runValidators: false     // ✅ prevents required field crash
      }
    );

    io.emit("adminUpdated");

    res.json(ride);
  } catch (err) {
    console.error(err); // 🔥 ADD THIS
    res.status(500).json({ message: "Server Error" });
  }
});

// DELETE RIDE
router.delete("/rides/:id", async (req, res) => {
  try {
    await Ride.findByIdAndDelete(req.params.id);

    io.emit("adminUpdated");

    res.json({ message: "Ride deleted" });
  } catch {
    res.status(500).json({ message: "Server Error" });
  }
});


// TOGGLE STATUS
router.put("/rides/:id/toggle", async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) return res.status(404).json({ message: "Not found" });

    ride.status = ride.status === "Open" ? "Closed" : "Open";
    await ride.save();

    io.emit("adminUpdated");

    res.json(ride);
  } catch {
    res.status(500).json({ message: "Server Error" });
  }
});
router.put("/rides/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const ride = await Ride.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    io.emit("adminUpdated");

    res.json(ride);
  } catch (err) {
    res.status(500).json({ message: "Status update failed" });
  }
});

/* ===========================
        FOOD
=========================== */

// GET ALL FOOD
router.get("/foods", async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch {
    res.status(500).json({ message: "Server Error" });
  }
});

// ADD FOOD
router.post("/foods", async (req, res) => {
  try {
    const food = new Food(req.body);
    await food.save();

    io.emit("adminUpdated");

    res.json(food);
  } catch {
    res.status(500).json({ message: "Server Error" });
  }
});

// UPDATE FOOD
router.put("/foods/:id", async (req, res) => {
  try {
    const food = await Food.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    io.emit("adminUpdated");

    res.json(food);
  } catch {
    res.status(500).json({ message: "Server Error" });
  }
});

// DELETE FOOD
router.delete("/foods/:id", async (req, res) => {
  try {
    await Food.findByIdAndDelete(req.params.id);

    io.emit("adminUpdated");

    res.json({ message: "Food deleted" });
  } catch {
    res.status(500).json({ message: "Server Error" });
  }
});

/* ===========================
        BOOKINGS
=========================== */

// GET BOOKINGS
router.get("/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find()
  .sort({ createdAt: -1 });
    res.json(bookings);
  } catch {
    res.status(500).json({ message: "Server Error" });
  }
});

// UPDATE BOOKING STATUS
router.put("/bookings/:id", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    io.emit("adminUpdated");

    res.json(booking);
  } catch {
    res.status(500).json({ message: "Server Error" });
  }
});

/* ===========================
        REVENUE CHART
=========================== */

router.get("/revenue-chart", async (req, res) => {
  try {
    const data = await Booking.aggregate([
      {
        $group: {
          _id: "$booking_date",
          totalRevenue: { $sum: "$total_amount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(data);
  } catch {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;