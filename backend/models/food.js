const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    food_name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      trim: true
    },

    price: {
      type: Number,
      required: true,
      min: 1
    },

    category: {
      type: String,
      enum: ["Snacks", "Drinks", "Meals", "Dessert"]
    },

    image: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Food", foodSchema);
