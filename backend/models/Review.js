const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
{
  email:{
    type:String,
    required:true
  },

  review_text:{
    type:String,
    required:true
  },

  experience_score:{
    type:Number,
    required:true
  }

},
{
  timestamps:true
}
);

module.exports = mongoose.models.Review || mongoose.model("Review", reviewSchema);