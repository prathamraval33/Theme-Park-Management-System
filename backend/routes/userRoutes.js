const express = require("express");
const router = express.Router();
const User = require("../models/User");

/* ============================== */
/* GET USER BY EMAIL */
/* ============================== */

router.get("/:email", async (req, res) => {

  try {

    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        message: "Email is required"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json(user);

  } catch (error) {

    console.error("Fetch User Error:", error);

    res.status(500).json({
      message: "Server error"
    });

  }

});


/* ============================== */
/* UPDATE PROFILE */
/* ============================== */

router.put("/update-profile", async (req, res) => {

  try {

    const { email, name, profilePic } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required"
      });
    }

    /* 🔥 UPDATE USER */
    const user = await User.findOneAndUpdate(
      { email },
      {
        ...(name && { name }),
        ...(profilePic && { profilePic })
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user
    });

  } catch (error) {

    console.error("Update Profile Error:", error);

    res.status(500).json({
      message: "Profile update failed"
    });

  }

});


/* ============================== */
/* OPTIONAL: DELETE PROFILE IMAGE */
/* ============================== */

router.put("/remove-photo", async (req, res) => {

  try {

    const { email } = req.body;

    const user = await User.findOneAndUpdate(
      { email },
      { profilePic: "" },
      { new: true }
    );

    res.json({
      message: "Profile photo removed",
      user
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to remove photo"
    });

  }

});


module.exports = router;