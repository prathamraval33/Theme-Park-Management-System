import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import "../../styles/Home.css";
import { Banner } from "../components/Banner";

interface Ride {
  _id: string;
  ride_id: number;
  ride_name: string;
  avgDuration: number;
  currentQueue: number;
  status: string;
  image: string;
}

export function Home() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/rides");
      setRides(res.data.slice(0, 4));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const joinQueue = async (id: string) => {
    try {
      await axios.put(`http://localhost:5000/api/rides/join/${id}`);
      fetchRides(); // refresh updated queue
    } catch (error) {
      console.error(error);
    }
  };
  const leaveQueue = async (id: string) => {
    try {
      await axios.put(`http://localhost:5000/api/rides/leave/${id}`);
      fetchRides(); // refresh updated queue
    } catch (error) {
      console.error(error);
    }
  };

  const getStatusClass = (status: string) => {
    if (status === "Open") return "status-open";
    if (status === "Maintenance") return "status-maintenance";
    return "status-closed";
  };

  const getWaitColor = (wait: number) => {
    if (wait < 10) return "green";
    if (wait < 20) return "orange";
    return "red";
  };

  return (
    <div className="page-container">

      <div className="content-container">
        {/* Banner */}
        <Banner />

        {/* Rides Section */}
        <div className="section-header">
          <h3>Popular Rides</h3>
          <Link to="/rides" className="more-btn">
            More Rides →
          </Link>
        </div>

        {loading ? (
          <p>Loading rides...</p>
        ) : (
          <div className="rides-grid">
            {rides.map((ride) => {
              const waitTime = ride.currentQueue * ride.avgDuration;

              return (
                <div key={ride._id} className="ride-card">
                  <img
                    src={`/assets/${ride.image}`}
                    alt={ride.ride_name}
                  />

                  <div className="ride-content">
                    <h4>{ride.ride_name}</h4>

                    <p>
                      <strong>Status:</strong>{" "}
                      <span className={getStatusClass(ride.status)}>
                        {ride.status}
                      </span>
                    </p>

                    <p>
                      <strong>People in Queue:</strong> {ride.currentQueue}
                    </p>

                    <p>
                      <strong>Wait Time:</strong>{" "}
                      <span style={{ color: getWaitColor(waitTime), fontWeight: "bold" }}>
                        {waitTime} mins
                      </span>
                    </p>


                    <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                      <button
                        className="join-btn"
                        onClick={() => joinQueue(ride._id)}
                        disabled={ride.status !== "Open"}
                      >
                        Join
                      </button>

                      <button
                        className="leave-btn"
                        onClick={() => leaveQueue(ride._id)}
                        disabled={ride.status !== "Open" || ride.currentQueue === 0}
                      >
                        Leave
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
