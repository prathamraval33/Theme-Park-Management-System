const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    booking_id: {
      type: String,
      unique: true,
      required: true
    },

    customer_name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },

    phone: {
      type: String,
      required: true,
      trim: true
    },

    ticket_type: {
      type: String,
      enum: ["VIP", "Normal"],
      default: "Normal"
    },

    quantity: {
      type: Number,
      required: true,
      min: 1
    },

    visit_date: {
      type: Date,
      required: true
    },

    payment_method: {
      type: String,
      enum: ["Cash", "UPI", "Card"],
      default: "Cash"
    },

    total_amount: {
      type: Number,
      required: true,
      min: 0
    },

    qr_code: {
      type: String,
      default: ""
    },

    bookedBy: {
      type: String,
      enum: ["Customer", "TicketStaff"],
      default: "Customer"
    },

    status: {
      type: String,
      enum: ["Confirmed", "Cancelled", "Refunded", "Validated"],
      default: "Confirmed"
    },

    checkedIn: {
      type: Boolean,
      default: false
    },

    validatedAt: {
      type: Date,
      default: null
    },

    notes: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Booking ||
  mongoose.model("Booking", bookingSchema);