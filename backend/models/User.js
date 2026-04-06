const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      minlength: 6
    },

    phone: {
      type: String,
      required: true,
      trim: true
    },

    role: {
      type: String,
      enum: ["Customer", "TicketStaff", "RideStaff", "FoodStaff", "Admin"],
      default: "Customer"
    },
     profilePic: {
    type: String,
    default: ""
  },
    
  },
  {
    timestamps: true
  }
);

// 🔒 Remove password when sending user data
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.models.User || mongoose.model("User", userSchema);