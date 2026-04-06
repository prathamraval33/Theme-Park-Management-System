const express = require("express");
const router = express.Router();
const Queue = require("../models/Queue");
const Ride = require("../models/Rides");

/* ================= HELPER ================= */

const calculateWaitTime = (current_count, capacity, ride_duration) => {
  if (current_count <= 1) return 0;

  const cycles = Math.ceil((current_count - 1) / capacity);

  return cycles * ride_duration;
};

/* ================= GET QUEUE ================= */

const getQueue = async (rideId) => {
  let queue = await Queue.findOne({ ride_id: rideId });

  if (!queue) {
    const ride = await Ride.findById(rideId);
    if (!ride) return null;

    queue = await Queue.create({
      ride_id: ride._id,
      capacity: ride.capacity,
      ride_duration: ride.avgDuration,
      current_count: 0,
      waiting_time: 0
    });
  }

  return queue;
};

/* ================= UPDATE QUEUE ================= */

router.put("/update/:rideId", async (req, res) => {
  try {

    const { change } = req.body;

    const queue = await getQueue(req.params.rideId);

    if (!queue) {
      return res.status(404).json({ message: "Queue not found" });
    }

    // 🔥 DEBUG + FIX
    console.log("Before:", queue.current_count);

    queue.current_count = Math.max(0, queue.current_count + change);

    console.log("After:", queue.current_count);

    queue.waiting_time = calculateWaitTime(
      queue.current_count,
      queue.capacity,
      queue.ride_duration
    );

    await queue.save();

    console.log("Saved to DB");

    const io = req.app.get("io");
    io.emit("rideUpdated");

    res.json(queue);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

/* ================= SET ================= */

router.put("/set/:rideId", async (req, res) => {
  try {

    const queue = await getQueue(req.params.rideId);

    if (!queue) {
      return res.status(404).json({ message: "Queue not found" });
    }

    const value = Math.max(0, Number(req.body.value) || 0);

    queue.current_count = value;

    queue.waiting_time = calculateWaitTime(
      queue.current_count,
      queue.capacity,
      queue.ride_duration
    );

    await queue.save();

    const io = req.app.get("io");
    io.emit("rideUpdated");

    res.json(queue);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

/* ================= CLEAR ================= */

router.put("/clear/:rideId", async (req, res) => {
  try {

    const queue = await getQueue(req.params.rideId);

    queue.current_count = 0;
    queue.waiting_time = 0;

    await queue.save();

    const io = req.app.get("io");
    io.emit("rideUpdated");

    res.json(queue);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= CYCLE ================= */

router.put("/cycle/:rideId", async (req, res) => {
  try {

    const queue = await getQueue(req.params.rideId);

    queue.current_count = Math.max(
      0,
      queue.current_count - queue.capacity
    );

    queue.waiting_time = calculateWaitTime(
      queue.current_count,
      queue.capacity,
      queue.ride_duration
    );

    await queue.save();

    const io = req.app.get("io");
    io.emit("rideUpdated");

    res.json(queue);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;