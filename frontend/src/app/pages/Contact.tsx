import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "../../styles/contact.css";

export function Contact() {

const [review,setReview] = useState("");
const [experience,setExperience] = useState(50);
const [reviews,setReviews] = useState<any[]>([]);
const [openFAQ,setOpenFAQ] = useState<number | null>(null);

/* =========================
   LOAD REVIEWS FROM DB
========================= */

useEffect(()=>{

const loadReviews = async()=>{

try{

const res = await axios.get(
"http://localhost:5000/api/reviews"
);

setReviews(res.data);

}
catch(err){
console.log("Failed loading reviews");
}

};

loadReviews();

},[]);


/* =========================
   EXPERIENCE LABEL
========================= */

const getLabel = (value:number)=>{

if(value <= 25) return "Not Enjoyed";
if(value <= 50) return "Average";
if(value <= 75) return "Good";
return "Excellent";

};


/* =========================
   MOUSE GLOW EFFECT
========================= */

const handleGlowMove = (e: React.MouseEvent<HTMLDivElement>) => {

const target = e.currentTarget;
const rect = target.getBoundingClientRect();

const x = ((e.clientX - rect.left) / rect.width) * 100;
const y = ((e.clientY - rect.top) / rect.height) * 100;

target.style.setProperty("--x", `${x}%`);
target.style.setProperty("--y", `${y}%`);

};


/* =========================
   SUBMIT REVIEW
========================= */

const submitReview = async ()=>{

if(!review){
alert("Please write review");
return;
}

const userData = localStorage.getItem("user");
const user = userData ? JSON.parse(userData) : null;

if(!user){
alert("Please login first");
return;
}

try{

await axios.post(
"http://localhost:5000/api/reviews/create",
{
email:user.email,
review_text:review,
experience_score:experience
}
);

alert("Review submitted");

setReviews([
{
email:user.email,
review_text:review,
experience_score:experience
},
...reviews
]);

setReview("");
setExperience(50);

}
catch(err){

alert("Review failed");

}

};


/* =========================
   FAQ DATA
========================= */

const faqs = [

{
q:"What are park opening hours?",
a:"FunFusion Theme Park operates daily from 10 AM to 10 PM."
},

{
q:"Can tickets be booked online?",
a:"Yes, visitors can book tickets online using our smart booking system."
},

{
q:"Is the park safe for children?",
a:"Yes, rides undergo strict safety checks every day."
}

];


return(

<div className="contact-page">

<div className="contact-layout">

{/* LEFT SIDE */}

<div className="contact-left">

<div
className="left-overlay glass-card glow-card"
onMouseMove={handleGlowMove}
>

<h1>FunFusion Theme Park</h1>

<p>
Welcome to FunFusion Theme Park — where adventure,
thrill and unforgettable memories come together.
</p>

<p>
Our park features exciting rides, family attractions
and delicious food experiences designed for visitors
of all ages.
</p>

<p>
Whether you seek adrenaline-pumping roller coasters
or relaxing family rides, FunFusion delivers the
perfect entertainment destination.
</p>

</div>

</div>


{/* RIGHT SIDE */}

<div className="contact-right">


{/* REVIEW SECTION */}

<motion.div
className="review-section glass-card glow-card"
onMouseMove={handleGlowMove}
whileHover={{scale:1.02}}
transition={{type:"spring", stiffness:200}}
>

<h2>Visitor Experience</h2>

<textarea
placeholder="Share your experience..."
value={review}
onChange={(e)=>setReview(e.target.value)}
></textarea>


{/* EXPERIENCE SLIDER */}

<div className="experience-meter">

<label>
Your Experience: <span>{getLabel(experience)}</span>
</label>

<div className="emoji-row">

<span>😡</span>
<span>😐</span>
<span>🙂</span>
<span>🤩</span>

</div>

<input
type="range"
min="0"
max="100"
value={experience}
onChange={(e)=>setExperience(Number(e.target.value))}
className="experience-slider"
/>

</div>


<button
className="review-btn"
onClick={submitReview}
>
Post Review
</button>


{/* REVIEW LIST */}

<div className="review-list">

{reviews.map((r,index)=>(

<motion.div
key={index}
className="review-card glass-card glow-card"
onMouseMove={handleGlowMove}
whileHover={{scale:1.03}}
>

<p>{r.review_text}</p>

<span>
{getLabel(r.experience_score)}
</span>

</motion.div>

))}

</div>

</motion.div>



{/* CONTACT DETAILS */}

<motion.div
className="contact-details glass-card glow-card"
onMouseMove={handleGlowMove}
whileHover={{scale:1.02}}
>

<h3>Contact Us</h3>

<p>📍 FunFusion Theme Park, Vadodara</p>
<p>📞 +91 9876543210</p>
<p>📧 support@funfusion.com</p>
<p>🕒 Open: 10 AM – 10 PM</p>

</motion.div>

</div>

</div>



{/* FAQ SECTION */}

<div className="faq-section">

<h2>Frequently Asked Questions</h2>

{faqs.map((faq,index)=>(

<div key={index} className="faq-wrapper">

<motion.div
className={`faq-item glass-card glow-card ${
openFAQ===index ? "faq-active": ""
}`}
onMouseMove={handleGlowMove}
whileHover={{scale:1.01}}
>

<div
className="faq-question"
onClick={()=>
setOpenFAQ(
openFAQ===index ? null : index
)
}
>

<span>{faq.q}</span>

<span className="faq-toggle">
{openFAQ===index ? "−":"+"}
</span>

</div>

</motion.div>


{openFAQ===index && (

<motion.div
className="faq-answer-box"
initial={{opacity:0,y:-8}}
animate={{opacity:1,y:0}}
>

{faq.a}

</motion.div>

)}

</div>

))}

</div>



{/* GOOGLE MAP */}

<div className="map-section">

<h2>Find Us</h2>

<div
className="map-card glass-card glow-card"
onMouseMove={handleGlowMove}
>

<iframe
src="https://www.google.com/maps?q=Birla%20Vishvakarma%20Mahavidyalaya%20VV%20Nagar&output=embed"
title="BVM Location"
loading="lazy"
></iframe>

</div>

</div>

</div>

);

}