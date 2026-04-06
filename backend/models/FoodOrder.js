const mongoose = require("mongoose");

const foodOrderSchema = new mongoose.Schema({

  email:{
    type:String,
    required:true
  },

  items:[
    {
      food_name:String,
      price:Number,
      quantity:Number
    }
  ],

  total_amount:{
    type:Number,
    required:true
  },

  qr_code:{
    type:String
  }

},
{
  timestamps:true
});

module.exports = mongoose.models.FoodOrder || mongoose.model("FoodOrder", foodOrderSchema);