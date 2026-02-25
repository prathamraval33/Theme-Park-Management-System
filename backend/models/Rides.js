const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema(
  {
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

    price: {
      type: Number,
      required: true,
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
    timestamps: true
  }
);

module.exports = mongoose.model("Ride", rideSchema);