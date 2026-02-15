import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/admin.css";

export function AdminDashboard() {

  const [stats, setStats] = useState({
    totalVisitors: 0,
    totalRevenue: 0,
    activeRides: 0,
    totalRides: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const ridesRes = await axios.get("http://localhost:5000/api/rides");
      const bookingsRes = await axios.get("http://localhost:5000/api/booking/user/all"); 
      // If you don't have this route, we can simplify

      const rides = ridesRes.data;

      const activeRides = rides.filter((r: any) => r.status === "Open").length;

      setStats({
        totalVisitors: 1247, // you can replace later with real user count
        totalRevenue: 1496400,
        activeRides: activeRides,
        totalRides: rides.length
      });

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-container">

        <h2 className="admin-title">Admin Dashboard</h2>

        <div className="admin-grid">

          <div className="admin-card blue">
            <h3>Total Visitors</h3>
            <p>{stats.totalVisitors}</p>
          </div>

          <div className="admin-card green">
            <h3>Total Revenue</h3>
            <p>₹{stats.totalRevenue}</p>
          </div>

          <div className="admin-card yellow">
            <h3>Active Rides</h3>
            <p>{stats.activeRides} / {stats.totalRides}</p>
          </div>

          <div className="admin-card red">
            <h3>Crowd Count</h3>
            <p>856</p>
          </div>

        </div>

      </div>
    </div>
  );
}
