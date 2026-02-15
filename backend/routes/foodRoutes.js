const express = require("express");
const router = express.Router();
const Food = require("../models/Food");

/* Get All Food Items */
router.get("/", async (req, res) => {
  try {
    const foods = await Food.find().sort({ createdAt: -1 });

    if (!foods.length) {
      return res.status(404).json({ message: "No food items found" });
    }

    res.status(200).json(foods);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
