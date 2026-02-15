const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema(
  {
    ride_id: {
      type: Number,
      required: true,
      unique: true
    },

    ride_name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      trim: true
    },

    capacity: {
      type: Number,
      required: true,
      min: 1
    },

    avgDuration: {
      type: Number,
      default: 2,
      min: 1
    },

    currentQueue: {
      type: Number,
      default: 0,
      min: 0
    },

    status: {
      type: String,
      enum: ["Open", "Closed", "Maintenance"],
      default: "Open"
    },

    image: {
      type: String,
      default: "default.jpg"
    }
  },
  {
    timestamps: true   // ⭐ Professional feature
  }
);

module.exports = mongoose.model("Ride", rideSchema);
