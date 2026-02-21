import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/admin.css";

interface AdminStats {
  totalUsers: number;
  totalBookings: number;
  totalRides: number;
  totalRevenue: number;
}

interface Booking {
  _id: string;
  user_id: string;
  booking_date: string;
  ticket_quantity: number;
  total_amount: number;
  payment_status: string;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalBookings: 0,
    totalRides: 0,
    totalRevenue: 0
  });

  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const statsRes = await axios.get("http://localhost:5000/api/admin/stats");
      const bookingsRes = await axios.get("http://localhost:5000/api/admin/recent-bookings");

      setStats(statsRes.data);
      setRecentBookings(bookingsRes.data);

    } catch (error) {
      console.error("Admin Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-container">

        <h2 className="admin-title">Admin Dashboard</h2>

        {loading ? (
          <p>Loading dashboard data...</p>
        ) : (
          <>
            <div className="admin-grid">
              <div className="admin-card blue">
                <h3>Total Users</h3>
                <p>{stats.totalUsers}</p>
              </div>

              <div className="admin-card green">
                <h3>Total Revenue</h3>
                <p>₹{stats.totalRevenue}</p>
              </div>

              <div className="admin-card yellow">
                <h3>Total Rides</h3>
                <p>{stats.totalRides}</p>
              </div>

              <div className="admin-card red">
                <h3>Total Bookings</h3>
                <p>{stats.totalBookings}</p>
              </div>
            </div>

            <div className="admin-table-section">
              <h3>Recent Bookings</h3>

              {recentBookings.length === 0 ? (
                <p>No recent bookings found.</p>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>User ID</th>
                      <th>Date</th>
                      <th>Tickets</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((booking) => (
                      <tr key={booking._id}>
                        <td>{booking.user_id}</td>
                        <td>{booking.booking_date}</td>
                        <td>{booking.ticket_quantity}</td>
                        <td>₹{booking.total_amount}</td>
                        <td>{booking.payment_status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
}