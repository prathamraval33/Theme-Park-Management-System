const express = require("express");
const router = express.Router();
const FoodOrder = require("../models/FoodOrder");
const QRCode = require("qrcode");

router.post("/create", async(req,res)=>{

  try{

    const { email, items, total_amount } = req.body;

    if(!email || !items || items.length===0){
      return res.status(400).json({message:"Missing order data"});
    }

    const itemText = items
      .map(i => `${i.food_name} x${i.quantity}`)
      .join("\n");

    const qrText = `
Theme Park Food Order

Customer: ${email}

Items:
${itemText}

Total: ₹${total_amount}
`;

    const qrImage = await QRCode.toDataURL(qrText);

    const order = new FoodOrder({

      email,
      items,
      total_amount,
      qr_code:qrImage

    });

    await order.save();

    res.status(201).json({
      message:"Order placed",
      qr_code:qrImage,
      order
    });

  }
  catch(err){

    console.error(err);
    res.status(500).json({message:"Order failed"});

  }

});

router.get("/user/:email", async(req,res)=>{

  const orders = await FoodOrder.find({
    email:req.params.email
  }).sort({createdAt:-1});

  res.json(orders);

});

module.exports = router;