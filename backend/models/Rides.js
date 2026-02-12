const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema({
  ride_id: {
    type: Number,
    unique: true
  },

  ride_name: {
    type: String,
    required: true
  },

  description: {
    type: String
  },

  capacity: {
    type: Number
  },

  waiting_time: {
    type: Number
  },

  status: {
    type: String,
    enum: ["Open", "Closed", "Maintenance"],
    default: "Open"
  },

  image: {
    type: String
  }
});

module.exports = mongoose.model("Ride", rideSchema);
