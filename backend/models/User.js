const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  user_id: {
    type: Number
  },

  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ["Customer", "TicketStaff", "RideStaff", "FoodStaff", "Admin"],
    default: "Customer"
  },

  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("User", userSchema);
