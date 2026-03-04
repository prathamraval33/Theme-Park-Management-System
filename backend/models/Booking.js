const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
{
  email: {
    type: String,
    required: true,
    index: true
  },

  booking_date: {
    type: Date,
    required: true
  },

  items: [
    {
      title: String,
      qty: Number,
      price: Number
    }
  ],

  total_amount: {
    type: Number,
    required: true
  },

  payment_status: {
    type: String,
    enum: ["Pending", "Paid", "Failed"],
    default: "Paid"
  },

  qr_code: String
},
{
  timestamps: true
});

module.exports = mongoose.model("Booking", bookingSchema);