import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../../styles/Home.css";
import { Banner } from "../components/Banner";

interface Ride {
  _id: string;
  ride_name?: string;
  name?: string;
  avgDuration: number;
  currentQueue: number;
  status: string;
  image: string;
}

interface Food {
  _id: string;
  food_name?: string;
  name?: string;
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
      const foodRes = await axios.get("http://localhost:5000/api/food");

      setRides(rideRes.data.slice(0, 4));
      setFood(foodRes.data.slice(0, 4));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="home">

      {/* Banner */}
      <Banner />

      {/* RIDES */}
      <section className="section">
        <div className="section-header">
          <h2>Popular Rides</h2>
          <button onClick={() => navigate("/rides")}>More →</button>
        </div>

        <div className="grid">
          {rides.map((ride) => {
            const waitTime = ride.currentQueue * ride.avgDuration;

            return (
              <motion.div
                key={ride._id}
                className="card"
                whileHover={{ scale: 1.05, rotateX: 5, rotateY: 5 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                {/*  IMAGE */}
                <img src={ride.image} alt={ride.ride_name} />

                <div className="card-content">
                  <h3 className="card-title" >
                    {ride.ride_name || ride.name || "Ride"}
                  </h3>

                  <span className={`status ${ride.status?.toLowerCase()}`}>
                    {ride.status}
                  </span>

                  <p>Queue: {ride.currentQueue}</p>
                  <p>Wait: {waitTime} mins</p>

                  <button
                    className="primary-btn"
                    onClick={() => navigate(`/tickets/${ride._id}`)}
                  >
                    Book Ride →
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* FOOD */}
      <section className="section">
        <div className="section-header">
          <h2>Food & Drinks</h2>
          <button onClick={() => navigate("/food")}>More →</button>
        </div>

        <div className="grid">
          {food.map((item) => (
            <motion.div
              key={item._id}
              className="card"
              whileHover={{ scale: 1.05, rotateX: 5, rotateY: 5 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              {/*  IMAGE  */}
              <img src={item.image} alt={item.food_name} />

              <div className="card-content">
                <h3 className="card-title">
                  {item.food_name || item.name || "Food"}
                </h3>

                <p className="price">₹{item.price}</p>

                <button
                  className="primary-btn"
                  onClick={() => navigate("/food")}
                >
                  Order Now →
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}