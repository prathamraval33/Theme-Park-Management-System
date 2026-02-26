import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/Home.css";
import { Banner } from "../components/Banner";

interface Ride {
  _id: string;
  ride_name: string;
  avgDuration: number;
  currentQueue: number;
  status: string;
  image: string;
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
    const rideRes = await axios.get("http://localhost:5000/api/rides");
    const foodRes = await axios.get("http://localhost:5000/api/food");

    setRides(rideRes.data.slice(0, 4));
    setFood(foodRes.data.slice(0, 4));
  };

  /* 3D EFFECT */
  const handleMouseMove = (e: any) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = -(y - rect.height / 2) / 12;
    const rotateY = (x - rect.width / 2) / 12;

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = (e: any) => {
    e.currentTarget.style.transform = "rotateX(0) rotateY(0)";
  };

  return (
    <div className="home">

      {/* ✅ Banner Back */}
      <Banner />

      {/* RIDES */}
      <section>
        <div className="section-header">
          <h2>Popular Rides</h2>
          <button onClick={() => navigate("/rides")}>More →</button>
        </div>

        <div className="grid">
          {rides.map((ride) => (
            <div
              key={ride._id}
              className="card"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <img src={`/assets/${ride.image}`} />

              <div className="card-content">
                <h3>{ride.ride_name}</h3>

                <span className={`status ${ride.status.toLowerCase()}`}>
                  {ride.status}
                </span>

                <p>Queue: {ride.currentQueue}</p>
                <p>Wait: {ride.currentQueue * ride.avgDuration} mins</p>

                <button onClick={() => navigate("/tickets")}>
                  Book Ride
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOD */}
      <section>
        <h2>Food & Drinks</h2>

        <div className="grid">
          {food.map((item) => (
            <div
              key={item._id}
              className="card"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <img src={`/assets/${item.image}`} />

              <div className="card-content">
                <h3>{item.food_name}</h3>
                <p>₹{item.price}</p>

                <button onClick={() => navigate("/food")}>
                  Order Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}