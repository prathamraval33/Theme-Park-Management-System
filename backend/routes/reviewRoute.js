const express = require("express");
const router = express.Router();
const Review = require("../models/Review");


/* ======================= */
/* CREATE REVIEW */
/* ======================= */

router.post("/create", async(req,res)=>{

try{

const { email, review_text, experience_score } = req.body;

if(!email || !review_text){
return res.status(400).json({
message:"Missing review data"
});
}

const review = new Review({

email,
review_text,
experience_score

});

await review.save();

res.status(201).json({
message:"Review saved",
review
});

}

catch(err){

console.error(err);

res.status(500).json({
message:"Review failed"
});

}

});


/* ======================= */
/* GET ALL REVIEWS */
/* ======================= */

router.get("/", async(req,res)=>{

try{

const reviews = await Review.find()
.sort({createdAt:-1})
.limit(20);

res.json(reviews);

}

catch(err){

res.status(500).json({
message:"Failed to load reviews"
});

}

});

module.exports = router;