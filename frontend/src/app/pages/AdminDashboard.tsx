import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/admin.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

interface AdminStats {
  totalUsers: number;
  totalBookings: number;
  totalRides: number;
  totalRevenue: number;
}

interface Ride {
  _id: string;
  ride_name: string;
  description: string;
  capacity: number;
  price: number;
  status: string;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalBookings: 0,
    totalRides: 0,
    totalRevenue: 0
  });

  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);

  const [ride_name, setRideName] = useState("");
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState(1);
  const [price, setPrice] = useState(0);
  const [editRideId, setEditRideId] = useState<string | null>(null);
  const [revenueChart, setRevenueChart] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
    fetchRides();
    fetchRevenueChart();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const statsRes = await axios.get("http://localhost:5000/api/admin/stats");
      setStats(statsRes.data);
    } catch (error) {
      console.error("Admin Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRides = async () => {
    const res = await axios.get("http://localhost:5000/api/admin/rides");
    setRides(res.data);
  };

  const fetchRevenueChart = async () => {
    const res = await axios.get("http://localhost:5000/api/admin/revenue-chart");

    const formattedData = res.data.map((item: any) => ({
      date: new Date(item._id).toLocaleDateString(),
      revenue: item.totalRevenue
    }));

    setRevenueChart(formattedData);
  };

  const resetForm = () => {
    setRideName("");
    setDescription("");
    setCapacity(1);
    setPrice(0);
    setEditRideId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editRideId) {
      await axios.put(`http://localhost:5000/api/admin/rides/${editRideId}`, {
        ride_name,
        description,
        capacity,
        price
      });
    } else {
      await axios.post("http://localhost:5000/api/admin/rides", {
        ride_name,
        description,
        capacity,
        price
      });
    }

    resetForm();
    fetchRides();
  };

  const handleEditRide = (ride: Ride) => {
    setRideName(ride.ride_name);
    setDescription(ride.description);
    setCapacity(ride.capacity);
    setPrice(ride.price);
    setEditRideId(ride._id);
  };

  const handleDeleteRide = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This ride will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
      await axios.delete(`http://localhost:5000/api/admin/rides/${id}`);
      fetchRides();
      Swal.fire("Deleted!", "Ride has been deleted.", "success");
    }
  };

  const handleToggleStatus = async (id: string) => {
    await axios.put(`http://localhost:5000/api/admin/rides/${id}/toggle`);
    fetchRides();
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <h2 className="admin-title">Admin Dashboard</h2>

        {loading ? (
          <p>Loading dashboard data...</p>
        ) : (
          <>
            {/* Stats Cards */}
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

            {/* Revenue Chart */}
            <div className="revenue-chart-section">
              <h3>Revenue Overview</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#4CAF50" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Ride Management */}
            <div className="admin-table-section">
              <h3>Manage Rides</h3>

              <form onSubmit={handleSubmit} className="admin-form">
                <input
                  type="text"
                  placeholder="Ride Name"
                  value={ride_name}
                  onChange={(e) => setRideName(e.target.value)}
                  required
                />

                <input
                  type="text"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />

                <input
                  type="number"
                  placeholder="Capacity"
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  required
                />

                <input
                  type="number"
                  placeholder="Price"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  required
                />

                <button type="submit" className="admin-btn btn-primary">
                  {editRideId ? "Update Ride" : "Add Ride"}
                </button>

                {editRideId && (
                  <button
                    type="button"
                    className="admin-btn btn-delete"
                    onClick={resetForm}
                  >
                    Cancel
                  </button>
                )}
              </form>

              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Capacity</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {rides.map((ride) => (
                    <tr key={ride._id}>
                      <td>{ride.ride_name}</td>
                      <td>{ride.capacity}</td>
                      <td>₹{ride.price}</td>

                      <td>
                        <span
                          style={{
                            padding: "5px 12px",
                            borderRadius: "20px",
                            color: "white",
                            fontWeight: "bold",
                            backgroundColor:
                              ride.status === "Open"
                                ? "green"
                                : ride.status === "Closed"
                                ? "red"
                                : "orange"
                          }}
                        >
                          {ride.status}
                        </span>
                      </td>

                      <td>
                        <button
                          className="admin-btn btn-edit"
                          onClick={() => handleEditRide(ride)}
                        >
                          Edit
                        </button>

                        <button
                          className="admin-btn btn-toggle"
                          onClick={() => handleToggleStatus(ride._id)}
                        >
                          Toggle
                        </button>

                        <button
                          className="admin-btn btn-delete"
                          onClick={() => handleDeleteRide(ride._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}