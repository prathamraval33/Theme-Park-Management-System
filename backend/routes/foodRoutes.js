const express = require("express");
const router = express.Router();
const Food = require("../models/food");

/* ============================= */
/* GET ALL FOODS */
/* ============================= */
router.get("/", async (req, res) => {
  try {
    const foods = await Food.find(); // 🔥 no filter
    res.status(200).json(foods);
  } catch (error) {
    console.error("Fetch Food Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/* ============================= */
/* ADD NEW FOOD */
/* ============================= */
router.post("/add", async (req, res) => {
  try {
    const { food_name, description, price, category, image } = req.body;

    if (!food_name || !price || !category || !image) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const newFood = new Food({
      food_name,
      description,
      price,
      category,
      image
    });

    await newFood.save();

    res.status(201).json({
      message: "Food added successfully",
      food: newFood
    });

  } catch (error) {
    console.error("Add Food Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/* ============================= */
/* DELETE FOOD */
/* ============================= */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await Food.findByIdAndDelete(id);

    res.status(200).json({ message: "Food deleted successfully" });

  } catch (error) {
    console.error("Delete Food Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;