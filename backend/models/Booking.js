const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    booking_date: {
      type: Date,
      required: true
    },

    /* 🔥 NEW: MULTI-PLAN ITEMS */
    items: [
      {
        title: {
          type: String,
          required: true
        },
        qty: {
          type: Number,
          required: true,
          min: 1
        },
        price: {
          type: Number,
          required: true,
          min: 0
        }
      }
    ],

    /* 🔥 OPTIONAL (TOTAL TICKETS) */
    total_tickets: {
      type: Number,
      default: 0
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