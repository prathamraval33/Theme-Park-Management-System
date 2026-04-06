const mongoose = require("mongoose");

const queueSchema = new mongoose.Schema({

  ride_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ride",
    required: true,
    unique: true // 🔥 prevents duplicate queue docs per ride
  },

  current_count: {
    type: Number,
    default: 0
  },

  capacity: {
    type: Number,
    required: true
  },

  ride_duration: {
    type: Number,
    default: 5
  },

  waiting_time: {
    type: Number,
    default: 0
  },

  last_cycle_time: {
    type: Date,
    default: Date.now
  }

}, { timestamps: true });

module.exports = mongoose.models.Queue || mongoose.model("Queue", queueSchema);