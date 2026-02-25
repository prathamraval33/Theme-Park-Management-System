const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Ride = require("../models/Rides");

/* Get ALL rides */
router.get("/", async (req, res) => {
  try {
    const rides = await Ride.find();
    res.status(200).json(rides);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* Get SINGLE ride by ID */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Ride ID" });
    }

    const ride = await Ride.findById(id);

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    res.status(200).json(ride);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* Join Queue */
router.put("/join/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Ride ID" });
    }

    const ride = await Ride.findById(id);

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    if (ride.status !== "Open") {
      return res.status(400).json({ message: "Ride is not open" });
    }

    if (ride.currentQueue >= ride.capacity) {
      return res.status(400).json({ message: "Ride queue is full" });
    }

    ride.currentQueue += 1;
    await ride.save();

    res.status(200).json({
      message: "Joined queue successfully",
      currentQueue: ride.currentQueue,
      waitingTime: ride.currentQueue * ride.avgDuration
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* Leave Queue */
router.put("/leave/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Ride ID" });
    }

    const ride = await Ride.findById(id);

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    if (ride.currentQueue <= 0) {
      return res.status(400).json({ message: "Queue is already empty" });
    }

    ride.currentQueue -= 1;
    await ride.save();

    res.status(200).json({
      message: "Left queue successfully",
      currentQueue: ride.currentQueue,
      waitingTime: ride.currentQueue * ride.avgDuration
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;