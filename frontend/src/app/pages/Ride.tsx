import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
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

      <Link to="/">
        <button className="back-btn">← Back to Home</button>
      </Link>

      <h2 className="rides-title">Available Rides</h2>

      <div className="rides-grid">
        {rides.map((ride) => (
          <div key={ride._id} className="ride-card">

            <div className="ride-image-wrapper">
              <img
                src={ride.image}
                alt={ride.ride_name}
                className="ride-image"
              />

              <button
                className="book-btn"
                onClick={() => navigate(`/tickets/${ride._id}`)}
              >
                Book Ride
              </button>
            </div>

            <div className="ride-info">
              <h3>{ride.ride_name}</h3>
              <p>{ride.description}</p>
              <p>Capacity: {ride.capacity}</p>
              <p>
                Waiting Time: {ride.avgDuration * ride.currentQueue} mins
              </p>
              <p className="ride-price">
                Price: ₹{ride.price}
              </p>

              <span
                className={`status-badge ${getStatusClass(ride.status)}`}
              >
                {ride.status}
              </span>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}