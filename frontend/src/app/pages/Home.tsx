import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import "../../styles/Home.css";

interface Ride {
  ride_id: number;
  ride_name: string;
  waiting_time: number;
  status: string;
  image: string;
}

export function Home() {
  const [rides, setRides] = useState<Ride[]>([]);

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/rides");
      setRides(res.data.slice(0, 4));
    } catch (error) {
      console.error(error);
    }
  };

  const getStatusClass = (status: string) => {
    if (status === "Open") return "status-open";
    if (status === "Maintenance") return "status-maintenance";
    return "status-closed";
  };

  return (
    <div className="page-container">

      <div className="header">
        <h1 className="header-title">FunFusion</h1>
      </div>

      <Navigation />

      <div className="content-container">

        {/* Banner */}
        <div className="banner">
          <img
            src="https://images.unsplash.com/photo-1761242606389-0a45db29fdee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
            alt="Theme Park"
          />
        </div>

        {/* Rides Section */}
        <div className="section-header">
          <h3>Popular Rides</h3>
          <Link to="/rides" className="more-btn">
            More Rides →
          </Link>
        </div>

        <div className="rides-grid">
          {rides.map((ride) => (
            <div key={ride.ride_id} className="ride-card">
              <img src={ride.image} alt={ride.ride_name} />


              <div className="ride-content">
                <h4>{ride.ride_name}</h4>

                <p>
                  <strong>Status:</strong>{" "}
                  <span className={getStatusClass(ride.status)}>
                    {ride.status}
                  </span>
                </p>

                <p>
                  <strong>Wait Time:</strong> {ride.waiting_time} mins
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>

      <Footer />
    </div>
  );
}
