const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  food_id: {
    type: Number,
    unique: true
  },

  food_name: {
    type: String,
    required: true
  },

  description: {
    type: String
  },

  price: {
    type: Number,
    required: true
  },

  category: {
    type: String
  },

  image: {
    type: String   // store image path or URL
  },

  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Food", foodSchema);
