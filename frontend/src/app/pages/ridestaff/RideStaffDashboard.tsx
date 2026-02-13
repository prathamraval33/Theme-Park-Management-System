import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../../styles/RideStaffDashboard.css";

import {
  LayoutDashboard,
  User,
  LogOut,
  FerrisWheel,
  CheckCircle,
  XCircle,
  Wrench
} from "lucide-react";

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

  const fetchRides = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/rides");
      setRides(res.data);
    } catch (error) {
      console.error("Error fetching rides:", error);
    }
  };

  const changeStatus = async (id: string, status: string) => {
    try {
      await axios.put(`http://localhost:5000/api/rides/${id}`, { status });
      fetchRides();
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    fetchRides();
  }, []);

  const total = rides.length;
  const open = rides.filter(r => r.status === "Open").length;
  const closed = rides.filter(r => r.status === "Closed").length;
  const maintenance = rides.filter(r => r.status === "Maintenance").length;

  return (
    <div className="staff-layout">

      {/* Sidebar */}
      <div className="sidebar">
        <h2>Ride Staff</h2>

        <ul>
          <li onClick={() => navigate("/ride-staff")}>
            <LayoutDashboard size={18} /> Dashboard
          </li>

          <li onClick={() => navigate("/profile")}>
            <User size={18} /> Profile
          </li>

          <li className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} /> Logout
          </li>
        </ul>
      </div>

      {/* Main */}
      <div className="main-content">

        <h1>Ride Dashboard</h1>

        {/* Statistics Cards */}
        <div className="stats-grid">

          <div className="stat-card">
            <FerrisWheel size={28} />
            <h3>{total}</h3>
            <p>Total Rides</p>
          </div>

          <div className="stat-card open">
            <CheckCircle size={28} />
            <h3>{open}</h3>
            <p>Open</p>
          </div>

          <div className="stat-card closed">
            <XCircle size={28} />
            <h3>{closed}</h3>
            <p>Closed</p>
          </div>

          <div className="stat-card maintenance">
            <Wrench size={28} />
            <h3>{maintenance}</h3>
            <p>Maintenance</p>
          </div>

        </div>

        {/* Table */}
        <div className="table-card">
          <table className="ride-table">
            <thead>
              <tr>
                <th>Ride</th>
                <th>Capacity</th>
                <th>Waiting Time</th>
                <th>Status</th>
                <th>Update</th>
              </tr>
            </thead>

            <tbody>
              {rides.map((ride) => (
                <tr key={ride._id}>
                  <td>{ride.ride_name}</td>
                  <td>{ride.capacity}</td>
                  <td>{ride.waiting_time} mins</td>
                  <td>
                    <span className={`badge ${ride.status.toLowerCase()}`}>
                      {ride.status}
                    </span>
                  </td>

                  <td>
                    <select
                      className="status-select"
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
    </div>
  );
}
