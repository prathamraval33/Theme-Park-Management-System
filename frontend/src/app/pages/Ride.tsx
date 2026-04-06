import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";
import "../../styles/ride.css";

interface Ride {
  _id: string;
  ride_name: string;
  description: string;
  capacity: number;
  avgDuration: number;
  currentQueue: number;
  waiting_time: number; // ✅ from backend (Queue)
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

  /* ================= FETCH ================= */

  const fetchRides = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/rides");
      setRides(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRides();
  }, []);

  /* ================= SOCKET ================= */

  useEffect(() => {
    const socket = io("http://localhost:5000", {
      transports: ["websocket"]
    });

    socket.on("rideUpdated", () => {
      fetchRides(); // ✅ live update
    });

    return () => socket.disconnect();
  }, []);

  /* ================= HELPERS ================= */

  const waitTime = (ride: Ride) => ride.waiting_time || 0;

  const waitColor = (time: number) => {
    if (time <= 5) return "green";
    if (time <= 15) return "yellow";
    return "red";
  };

  const filteredRides =
    filter === "All"
      ? rides
      : rides.filter((ride) => ride.category === filter);

  /* ================= UI ================= */

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

                {/* IMAGE */}
                <div className="ride-image">

                  <img
                    src={ride.image}
                    alt={ride.ride_name}
                    className="ride-main-img"
                  />

                  {/* ✅ CATEGORY BADGE */}
                  <div className="category-badge">
                    {ride.category}
                  </div>

                  {ride.gif && (
                    <img
                      src={ride.gif}
                      alt="preview"
                      className="ride-gif"
                    />
                  )}

                  {/* WAIT BADGE */}
                  <div className={`queue-badge ${waitColor(wait)}`}>
                    {wait} min wait
                  </div>

                </div>

                {/* CONTENT */}
                <div className="ride-content">

                  <h3>{ride.ride_name}</h3>

                  <p>{ride.description}</p>

                  {/* ✅ GLASS BOX */}
                  <div className="ride-meta-glass">

                    <div className="meta-box">
                      <span className="meta-label">🎡 Capacity</span>
                      <span className="meta-value">{ride.capacity}</span>
                    </div>

                    <div className="meta-box">
                      <span className="meta-label">⏱ Duration</span>
                      <span className="meta-value">
                        {ride.avgDuration} min
                      </span>
                    </div>

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