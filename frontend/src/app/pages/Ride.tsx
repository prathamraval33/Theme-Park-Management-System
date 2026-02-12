import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

interface Ride {
  ride_id: number;
  ride_name: string;
  description: string;
  capacity: number;
  waiting_time: number;
  status: string;
  image: string;
}

export function Rides() {
  const [rides, setRides] = useState<Ride[]>([]);

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

  /* Status color function */
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "green";
      case "Closed":
        return "red";
      case "Maintenance":
        return "orange";
      default:
        return "black";
    }
  };

  return (
    <div style={{ padding: "20px" }}>

      {/* Back Button */}
      <Link to="/">
        <button
          style={{
            marginBottom: "15px",
            padding: "8px 15px",
            backgroundColor: "#007bff",
            border: "none",
            color: "white",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          ← Back to Home
        </button>
      </Link>

      <h2>Available Rides</h2>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {rides.map((ride) => (
          <div
            key={ride.ride_id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              width: "250px",
              borderRadius: "10px",
              backgroundColor: "#fff"
            }}
          >
            <img
              src={ride.image}
              alt={ride.ride_name}
              style={{ width: "100%", height: "150px", objectFit: "cover" }}
            />

            <h3>{ride.ride_name}</h3>
            <p>{ride.description}</p>
            <p>Capacity: {ride.capacity}</p>
            <p>Waiting Time: {ride.waiting_time} mins</p>

            <p>
              Status:{" "}
              <span
                style={{
                  color: getStatusColor(ride.status),
                  fontWeight: "bold"
                }}
              >
                {ride.status}
              </span>
            </p>

          </div>
        ))}
      </div>
    </div>
  );
}
