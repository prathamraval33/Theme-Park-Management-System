const express = require("express");
const router = express.Router();
const Ride = require("../models/Rides");

/* Get all rides */
router.get("/", async (req, res) => {
  try {
    const rides = await Ride.find();
    res.json(rides);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* Update ride status */
router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;

    const updatedRide = await Ride.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(updatedRide);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
