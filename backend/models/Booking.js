const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user_id: String,
  ride_id: String,
  booking_date: Date,
  ticket_quantity: Number,
  total_amount: Number,
  qr_code: String,
  payment_status: String
});

module.exports = mongoose.model("Booking", bookingSchema);
