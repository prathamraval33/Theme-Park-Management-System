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
      trim: true,
      default: ""
    },

    price: {
      type: Number,
      required: true,
      min: 1
    },

    category: {
      type: String,
      enum: ["Snacks", "Drinks", "Meals", "Dessert"],
      required: true
    },

    image: {
      type: String,
      required: true
    },

    available: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Food", foodSchema);