import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "../../styles/ride.css";

interface Ride {
  _id: string;
  ride_name: string;
  description: string;
  capacity: number;
  avgDuration: number;
  currentQueue: number;
  price: number;
  status: string;
  image: string;
  gif?: string;
  category: string;
}

export function Rides() {

  const [rides, setRides] = useState<Ride[]>([]);
  const [filter, setFilter] = useState("All");

  const navigate = useNavigate();

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/rides");
      setRides(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const waitTime = (ride: Ride) => ride.currentQueue * ride.avgDuration;

  const waitColor = (time: number) => {
    if (time <= 5) return "green";
    if (time <= 15) return "yellow";
    return "red";
  };

  const filteredRides =
    filter === "All"
      ? rides
      : rides.filter((ride) => ride.category === filter);

  return (
    <div className="rides-page">

      <div className="rides-header">

        <h1>🎢 Park Rides</h1>

        <div className="ride-filters">

          {["All", "Thrill", "Water", "Kids", "Family"].map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${filter === cat ? "active" : ""}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}

        </div>

      </div>

      <div className="rides-grid">

        <AnimatePresence>

          {filteredRides.map((ride) => {

            const wait = waitTime(ride);

            return (

              <motion.div
                key={ride._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.35 }}
                whileHover={{ scale: 1.04 }}
                className="ride-card"
              >

                <div className="ride-image">

                  <img
                    src={ride.image}
                    alt={ride.ride_name}
                    className="ride-main-img"
                  />

                  {ride.gif && (
                    <img
                      src={ride.gif}
                      alt="preview"
                      className="ride-gif"
                    />
                  )}

                  <div className={`queue-badge ${waitColor(wait)}`}>
                    {wait} min wait
                  </div>

                </div>

                <div className="ride-content">

                  <h3>{ride.ride_name}</h3>

                  <p>{ride.description}</p>

                  <div className="ride-meta">

                    <span>Capacity: {ride.capacity}</span>

                    

                  </div>

                  <button
                    className="ride-book-btn"
                    onClick={() => navigate(`/tickets/${ride._id}`)}
                  >
                    🎟 Book Ride
                  </button>

                </div>

              </motion.div>

            );

          })}

        </AnimatePresence>

      </div>

    </div>
  );
}