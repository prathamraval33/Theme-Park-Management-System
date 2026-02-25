const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    ride_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ride",
      required: true
    },

    booking_date: {
      type: Date,
      required: true
    },

    ticket_quantity: {
      type: Number,
      required: true,
      min: 1
    },

    total_amount: {
      type: Number,
      required: true,
      min: 0
    },

    payment_status: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending"
    },

    qr_code: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Booking", bookingSchema);