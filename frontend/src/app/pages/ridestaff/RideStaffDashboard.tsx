import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../../styles/RideStaffDashboard.css";

interface Ride {
  _id: string;
  ride_name: string;
  capacity: number;
  waiting_time: number;
  status: string;
}

export function RideStaffDashboard() {
  const [rides, setRides] = useState<Ride[]>([]);
  const navigate = useNavigate();

  /* Fetch rides */
  const fetchRides = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/rides");
      setRides(res.data);
    } catch (error) {
      console.error("Error fetching rides:", error);
    }
  };

  /* Change ride status */
  const changeStatus = async (id: string, status: string) => {
    try {
      await axios.put(`http://localhost:5000/api/rides/${id}`, { status });
      fetchRides();
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update status");
    }
  };

  /* Logout */
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    fetchRides();
  }, []);

  return (
    <div className="staff-layout">

      {/* Sidebar */}
      <div className="sidebar">
        <h2>Ride Staff</h2>

        <ul>
          <li onClick={() => navigate("/ride-staff")}>Dashboard</li>
          <li onClick={() => navigate("/profile")}>Profile</li>
          <li className="logout-btn" onClick={handleLogout}>Logout</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h1>Manage Rides</h1>

        <table className="ride-table">
          <thead>
            <tr>
              <th>Ride</th>
              <th>Capacity</th>
              <th>Waiting Time</th>
              <th>Status</th>
              <th>Change Status</th>
            </tr>
          </thead>

          <tbody>
            {rides.map((ride) => (
              <tr key={ride._id}>
                <td>{ride.ride_name}</td>
                <td>{ride.capacity}</td>
                <td>{ride.waiting_time} mins</td>
                <td>{ride.status}</td>

                <td>
                  <select
                    value={ride.status}
                    onChange={(e) =>
                      changeStatus(ride._id, e.target.value)
                    }
                  >
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}
