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
      .map(i => `${i.name} x${i.quantity}`)
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



/* GET ALL */
router.get("/", async (req, res) => {
  try {
    const orders = await FoodOrder.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* CREATE ORDER */
router.post("/", async (req, res) => {
  try {
    const { email, items, total_amount, qr_code } = req.body;

    const order = new FoodOrder({
      email,
      items,
      total_amount,
      qr_code: qr_code || ""
    });

    await order.save();

    const io = req.app.get("io");
    io.emit("newFoodOrder");

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* UPDATE STATUS */
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Preparing", "Prepared", "Cancelled", "Delivered"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await FoodOrder.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    const io = req.app.get("io");
    io.emit("orderUpdated");

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



module.exports = router;