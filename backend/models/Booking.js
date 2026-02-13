const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user_id: String,   
  booking_date: String,
  ticket_quantity: Number,
  total_amount: Number,
  payment_status: String,
  qr_code: String
});

module.exports = mongoose.model("Booking", bookingSchema);
