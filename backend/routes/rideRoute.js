const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Ride = require("../models/Rides");
const Queue = require("../models/Queue");

/* ================= HELPER ================= */

const calculateWaitTime = (queue) => {
  if (queue.current_count === 0) return 0; // 🔥 fixed
  return Math.ceil(queue.current_count / queue.capacity) * queue.ride_duration;
};

/* ================= GET ALL ================= */

router.get("/", async (req, res) => {
  try {

    const rides = await Ride.find();
    const queues = await Queue.find();

    const result = rides.map(ride => {

      const queue = queues.find(
        q => q.ride_id.toString() === ride._id.toString()
      );

      return {
        ...ride._doc,
        currentQueue: queue?.current_count || 0,
        waiting_time: queue?.waiting_time || 0
      };

    });

    res.json(result);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= GET ONE ================= */

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

/* ================= JOIN QUEUE ================= */

router.put("/join/:id", async (req, res) => {
  try {

    const ride = await Ride.findById(req.params.id);

    if (!ride) return res.status(404).json({ message: "Ride not found" });

    if (ride.status !== "Open") {
      return res.status(400).json({ message: "Ride not open" });
    }

    let queue = await Queue.findOne({ ride_id: ride._id });

    if (!queue) {
      queue = new Queue({
        ride_id: ride._id,
        capacity: ride.capacity,
        ride_duration: ride.avgDuration
      });
    }

    queue.current_count += 1;
    queue.waiting_time = calculateWaitTime(queue); // 🔥 fixed formula

    await queue.save();

    const io = req.app.get("io");
    io.emit("rideUpdated");

    res.json({ message: "Joined queue", queue });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= LEAVE QUEUE ================= */

router.put("/leave/:id", async (req, res) => {
  try {

    const ride = await Ride.findById(req.params.id);

    if (!ride) return res.status(404).json({ message: "Ride not found" });

    let queue = await Queue.findOne({ ride_id: ride._id });

    if (!queue) return res.status(404).json({ message: "Queue not found" });

    queue.current_count = Math.max(0, queue.current_count - 1);
    queue.waiting_time = calculateWaitTime(queue); // 🔥 fixed formula

    await queue.save();

    const io = req.app.get("io");
    io.emit("rideUpdated");

    res.json({ message: "Left queue", queue });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= STATUS UPDATE ================= */

router.get("/", async (req, res) => {
  try {

    // 🔥 DISABLE CACHE
    res.set("Cache-Control", "no-store");

    const rides = await Ride.find();

    const result = await Promise.all(
      rides.map(async (ride) => {
        const queue = await Queue.findOne({ ride_id: ride._id });

        return {
          ...ride._doc,
          currentQueue: queue?.current_count ?? 0,
          waiting_time: queue?.waiting_time ?? 0
        };
      })
    );

    res.json(result);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;