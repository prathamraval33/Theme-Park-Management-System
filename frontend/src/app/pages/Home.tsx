import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../../styles/Home.css";
import { Banner } from "../components/Banner";

import { FaTicketAlt, FaHamburger, FaUsers, FaBolt, FaShieldAlt, FaUserShield, FaFirstAid } from "react-icons/fa";

interface Ride {
  _id: string;
  ride_name: string;
  avgDuration: number;
  currentQueue: number;
  status: string;
  image: string;
  gif?: string;
  category: string;
}

interface Food {
  _id: string;
  food_name: string;
  price: number;
  image: string;
}

export function Home() {

  const [rides, setRides] = useState<Ride[]>([]);
  const [food, setFood] = useState<Food[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {

    try {

      const rideRes = await axios.get("http://localhost:5000/api/rides");
      const foodRes = await axios.get("http://localhost:5000/api/foods");

      setRides(rideRes.data.slice(0,4));
      setFood(foodRes.data.slice(0,4));

    } catch(err) {

      console.error(err);

    }

  };

  const waitTime = (ride:Ride) =>
    ride.currentQueue * ride.avgDuration;

  const waitColor = (time:number) => {

    if(time <= 5) return "green";
    if(time <= 15) return "yellow";

    return "red";

  };

  return (

    <div className="home">

      <Banner/>

      {/* RIDES */}

      <section className="section">

        <div className="section-header">

          <h2>Popular Rides</h2>

          <button onClick={()=>navigate("/rides")}>
            More →
          </button>

        </div>

        <div className="grid">

          {rides.map((ride)=>{

            const wait = waitTime(ride);

            return(

              <motion.div
                key={ride._id}
                className="card"
                whileHover={{scale:1.05}}
                transition={{type:"spring",stiffness:200}}
              >

                {/* IMAGE */}

                <div className="ride-image">

                  <img
                    src={ride.image}
                    alt={ride.ride_name}
                    className="ride-main-img"
                  />

                  {ride.gif && (

                    <img
                      src={ride.gif}
                      className="ride-gif"
                      alt="preview"
                    />

                  )}

                  <div className={`queue-badge ${waitColor(wait)}`}>
                    {wait} min wait
                  </div>

                </div>

                <div className="card-content">

                  <h3 className="card-title">
                    {ride.ride_name}
                  </h3>

                  <span className="ride-category">
                    {ride.category}
                  </span>

                  <p>
                    Queue: {ride.currentQueue}
                  </p>

                  <button
                    className="primary-btn"
                    onClick={()=>navigate(`/tickets/${ride._id}`)}
                  >
                    Book Ride →
                  </button>

                </div>

              </motion.div>

            )

          })}

        </div>

      </section>


      {/* FOOD */}

      <section className="section">

        <div className="section-header">

          <h2>Food & Drinks</h2>

          <button onClick={()=>navigate("/food")}>
            More →
          </button>

        </div>

        <div className="grid">

          {food.map((item)=>(
          
            <motion.div
              key={item._id}
              className="card"
              whileHover={{scale:1.05}}
            >

              <img
                src={item.image}
                alt={item.food_name}
              />

              <div className="card-content">

                <h3 className="card-title">
                  {item.food_name}
                </h3>

                <p className="price">
                  ₹{item.price}
                </p>

                <button
                  className="primary-btn"
                  onClick={()=>navigate("/food")}
                >
                  Order Now →
                </button>

              </div>

            </motion.div>

          ))}

        </div>

      </section>

      {/* SAFETY */}



<section className="park-info">

  {/* PARK HIGHLIGHTS */}

  <div className="info-section">

    <h2 className="info-title">Park Highlights</h2>

    <div className="info-grid">

      <motion.div whileHover={{scale:1.05}} className="info-card">
        <FaBolt className="info-icon"/>
        <h3>20+ Rides</h3>
        <p>Thrill, water and family rides available for all ages.</p>
      </motion.div>

      <motion.div whileHover={{scale:1.05}} className="info-card">
        <FaHamburger className="info-icon"/>
        <h3>15 Food Stalls</h3>
        <p>Enjoy delicious meals, snacks and refreshing beverages.</p>
      </motion.div>

      <motion.div whileHover={{scale:1.05}} className="info-card">
        <FaUsers className="info-icon"/>
        <h3>Family Friendly</h3>
        <p>Perfect entertainment for kids, adults and families.</p>
      </motion.div>

      <motion.div whileHover={{scale:1.05}} className="info-card">
        <FaTicketAlt className="info-icon"/>
        <h3>Fast Queue System</h3>
        <p>Smart booking and queue tracking for minimal wait time.</p>
      </motion.div>

    </div>

  </div>


  {/* SAFETY & SECURITY */}

  <div className="info-section">

    <h2 className="info-title">Safety & Security</h2>

    <div className="info-grid">

      <motion.div whileHover={{scale:1.05}} className="info-card">
        <FaShieldAlt className="info-icon"/>
        <h3>24/7 Security</h3>
        <p>Professional security staff ensuring visitor safety.</p>
      </motion.div>

      <motion.div whileHover={{scale:1.05}} className="info-card">
        <FaUserShield className="info-icon"/>
        <h3>Ride Safety Checks</h3>
        <p>All rides are inspected daily for maximum safety.</p>
      </motion.div>

      <motion.div whileHover={{scale:1.05}} className="info-card">
        <FaFirstAid className="info-icon"/>
        <h3>Medical Support</h3>
        <p>Emergency medical team available inside the park.</p>
      </motion.div>

    </div>

  </div>

</section>

    </div>

  );

}