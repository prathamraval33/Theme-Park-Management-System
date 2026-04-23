const mongoose = require("mongoose");

const foodOrderSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },

    items: [
      {
        name:     { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 }
      }
    ],

    total_amount: {
      type: Number,
      required: true,
      min: 0
    },

    qr_code: {
      type: String,
      default: ""
    },

    status: {
  type: String,
  enum: ["Preparing", "Prepared", "Cancelled", "Delivered"],
  default: "Preparing"
}
    
  },
  { timestamps: true }
);

module.exports = mongoose.models.FoodOrder || mongoose.model("FoodOrder", foodOrderSchema);