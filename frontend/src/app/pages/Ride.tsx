import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/ride.css";
import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";

interface Ride {
  ride_id: number;
  ride_name: string;
  description: string;
  capacity: number;
  waiting_time: number;
  status: string;
  image: string;
  gif?: string;
}

export function Rides() {
  const [rides, setRides] = useState<Ride[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/rides");
      setRides(res.data);
    } catch (error) {
      console.error("Error fetching rides:", error);
    }
  };

  const getStatusClass = (status: string) => {
    if (status === "Open") return "status-open";
    if (status === "Closed") return "status-closed";
    if (status === "Maintenance") return "status-maintenance";
    return "";
  };

  return (
    <div className="rides-container">

      {/* Back Button */}
      <Link to="/">
        <button className="back-btn">← Back to Home</button>
      </Link>

      <h2 className="rides-title">Available Rides</h2>

      <div className="rides-grid">
        {rides.map((ride) => (
          <div key={ride.ride_id} className="ride-card">

            {/* Image + GIF + Book */}
            <div className="ride-image-wrapper">
              <img src={ride.image} alt={ride.ride_name} className="ride-image" />

              {ride.gif && (
                <img src={ride.gif} alt="gif" className="ride-gif" />
              )}

              <button
                className="book-btn"
                onClick={() => navigate("/tickets")}
              >
                Book Ride
              </button>
            </div>

            {/* Info */}
            <div className="ride-info">
              <h3>{ride.ride_name}</h3>
              <p>{ride.description}</p>
              <p>Capacity: {ride.capacity}</p>
              <p>Waiting Time: {ride.waiting_time} mins</p>

              <span className={`status-badge ${getStatusClass(ride.status)}`}>
                {ride.status}
              </span>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
