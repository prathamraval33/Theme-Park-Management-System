import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import "../../styles/admin.css";

const socket = io("http://localhost:5000");

export function AdminDashboard() {

  const [stats, setStats] = useState<any>({});
  const [rides, setRides] = useState<any[]>([]);
  const [foods, setFoods] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  const [newRide, setNewRide] = useState({
    ride_name: "", description: "", capacity: "", avgDuration: "", price: ""
  });

  const [newFood, setNewFood] = useState({ name: "", price: "" });

  const [newUser, setNewUser] = useState({
    name: "", email: "", phone: "", password: ""
  });

  /* ================= FETCH ================= */

  const fetchAll = async () => {
    try {
      const [statsRes, rideRes, foodRes, userRes, chartRes] = await Promise.all([
        axios.get("http://localhost:5000/api/admin/stats"),
        axios.get("http://localhost:5000/api/admin/rides"),
        axios.get("http://localhost:5000/api/admin/foods"),
        axios.get("http://localhost:5000/api/admin/users"),
        axios.get("http://localhost:5000/api/admin/revenue-chart")
      ]);

      setStats(statsRes.data || {});
      setRides(rideRes.data || []);
      setFoods(foodRes.data || []);
      setUsers(userRes.data || []);
      setChartData(chartRes.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  /* 🔥 FIXED SOCKET (IMPORTANT) */
  useEffect(() => {

    socket.on("adminUpdated", () => {
      fetchAll();
    });

    return () => {
      socket.off("adminUpdated"); // prevents duplicate listeners
    };

  }, []);

  /* ================= RIDES ================= */

  const addRide = async () => {
    if (!newRide.ride_name || !newRide.capacity || !newRide.price) return;

    await axios.post("http://localhost:5000/api/admin/rides", {
      ride_name: newRide.ride_name,
      description: newRide.description,
      capacity: Number(newRide.capacity),
      avgDuration: Number(newRide.avgDuration),
      price: Number(newRide.price)
    });

    setNewRide({
      ride_name: "",
      description: "",
      capacity: "",
      avgDuration: "",
      price: ""
    });

    fetchAll();
  };

  const updateRideField = async (id: string, field: string, value: any) => {
    await axios.put(`http://localhost:5000/api/admin/rides/${id}`, {
      [field]: value
    });
    fetchAll();
  };

  const updateRideStatus = async (id: string, status: string) => {
    await axios.put(`http://localhost:5000/api/admin/rides/${id}`, { status });
    fetchAll();
  };

  const deleteRide = async (id: string) => {
    await axios.delete(`http://localhost:5000/api/admin/rides/${id}`);
    fetchAll();
  };

  /* ================= FOOD ================= */

  const addFood = async () => {
    if (!newFood.name || !newFood.price) return;

    await axios.post("http://localhost:5000/api/foods", {
      name: newFood.name,
      price: Number(newFood.price)
    });

    setNewFood({ name: "", price: "" });
    fetchAll();
  };

  const deleteFood = async (id: string) => {
    await axios.delete(`http://localhost:5000/api/admin/foods/${id}`);
    fetchAll();
  };

  /* ================= USERS ================= */

  const addUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) return;

    await axios.post("http://localhost:5000/api/auth/signup", newUser);

    setNewUser({
      name: "",
      email: "",
      phone: "",
      password: ""
    });

    fetchAll();
  };

  const updateRole = async (id: string, role: string) => {
    await axios.put(`http://localhost:5000/api/admin/users/${id}`, { role });
    fetchAll();
  };

  const deleteUser = async (id: string) => {
    await axios.delete(`http://localhost:5000/api/admin/users/${id}`);
    fetchAll();
  };

  /* ================= CHART ================= */

  const maxRevenue = Math.max(
    ...chartData.map((d: any) => d.totalRevenue || 0),
    1
  );

  const roleClass: any = {
    Customer: "role-customer",
    Admin: "role-admin",
    RideStaff: "role-ridestaff",
    FoodStaff: "role-foodstaff"
  };

  /* ================= RENDER ================= */

  return (
    <div className="admin-page">
      <div className="admin-container">

        <h1 className="admin-title">Admin Panel</h1>

        {/* ===== STAT CARDS ===== */}
        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-card-icon">👥</span>
            <span className="stat-card-label">Total Users</span>
            <span className="stat-card-value">{stats.totalUsers ?? 0}</span>
          </div>
          <div className="stat-card">
            <span className="stat-card-icon">🎢</span>
            <span className="stat-card-label">Total Rides</span>
            <span className="stat-card-value">{stats.totalRides ?? 0}</span>
          </div>
          <div className="stat-card">
            <span className="stat-card-icon">🍔</span>
            <span className="stat-card-label">Food Items</span>
            <span className="stat-card-value">{stats.totalFoods ?? 0}</span>
          </div>
          <div className="stat-card">
            <span className="stat-card-icon">🎫</span>
            <span className="stat-card-label">Bookings</span>
            <span className="stat-card-value">{stats.totalBookings ?? 0}</span>
          </div>
          <div className="stat-card">
            <span className="stat-card-icon">💰</span>
            <span className="stat-card-label">Revenue</span>
            <span className="stat-card-value revenue">₹{stats.totalRevenue ?? 0}</span>
          </div>
        </div>

        

        {/* ===== RIDE MANAGEMENT ===== */}
        <div className="admin-section">
          <div className="section-header">
            <span className="section-title">🎢 Ride Management</span>
          </div>

          {/* ADD RIDE FORM */}
          <div className="admin-form" style={{ marginBottom: 20 }}>
            <div className="form-group">
              <label>Ride Name</label>
              <input className="admin-input" placeholder="e.g. Roller Coaster"
                value={newRide.ride_name}
                onChange={e => setNewRide({ ...newRide, ride_name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <input className="admin-input" placeholder="Short description"
                value={newRide.description}
                onChange={e => setNewRide({ ...newRide, description: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Capacity</label>
              <input className="admin-input" type="number" placeholder="30"
                value={newRide.capacity}
                onChange={e => setNewRide({ ...newRide, capacity: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Duration (min)</label>
              <input className="admin-input" type="number" placeholder="25"
                value={newRide.avgDuration}
                onChange={e => setNewRide({ ...newRide, avgDuration: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Price (₹)</label>
              <input className="admin-input" type="number" placeholder="199"
                value={newRide.price}
                onChange={e => setNewRide({ ...newRide, price: e.target.value })}
              />
            </div>
            <div className="form-group" style={{ justifyContent: "flex-end" }}>
              <button className="btn-primary" onClick={addRide}>+ Add Ride</button>
            </div>
          </div>

          {/* RIDE TABLE */}
          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Ride Name</th>
                  <th>Description</th>
                  <th>Capacity</th>
                  <th>Duration</th>
                  <th>Price (₹)</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {rides.map(ride => (
                  <tr key={ride._id}>
                    <td style={{ fontWeight: 600 }}>{ride.ride_name}</td>
                    <td style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
                      {ride.description || "—"}
                    </td>
                    <td>
                      <input className="table-input"
                        type="number"
                        defaultValue={ride.capacity}
                        onBlur={e => updateRideField(ride._id, "capacity", Number(e.target.value))}
                      />
                    </td>
                    <td>
                      <input className="table-input"
                        type="number"
                        defaultValue={ride.avgDuration}
                        onBlur={e => updateRideField(ride._id, "avgDuration", Number(e.target.value))}
                      />
                    </td>
                    <td>
                      <input className="table-input"
                        type="number"
                        defaultValue={ride.price}
                        onBlur={e => updateRideField(ride._id, "price", Number(e.target.value))}
                      />
                    </td>
                    <td>
                      <select
                        className="status-select-table"
                        value={ride.status}
                        onChange={e => updateRideStatus(ride._id, e.target.value)}
                        style={{
                          color:
                            ride.status === "Open" ? "#00ffae" :
                            ride.status === "Closed" ? "#ff4d4d" : "#ffc107"
                        }}
                      >
                        <option value="Open">Open</option>
                        <option value="Closed">Closed</option>
                        <option value="Maintenance">Maintenance</option>
                      </select>
                    </td>
                    <td>
                      <button className="btn-delete" onClick={() => deleteRide(ride._id)}>
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {rides.length === 0 && (
                  <tr><td colSpan={7} style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", padding: 24 }}>No rides yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ===== FOOD MANAGEMENT ===== */}
        <div className="admin-section">
          <div className="section-header">
            <span className="section-title">🍔 Food Management</span>
          </div>

          {/* ADD FOOD FORM */}
          <div className="admin-form" style={{ marginBottom: 20 }}>
            <div className="form-group">
              <label>Food Name</label>
              <input className="admin-input" placeholder="e.g. Burger"
                value={newFood.name}
                onChange={e => setNewFood({ ...newFood, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Price (₹)</label>
              <input className="admin-input" type="number" placeholder="99"
                value={newFood.price}
                onChange={e => setNewFood({ ...newFood, price: e.target.value })}
              />
            </div>
            <div className="form-group" style={{ justifyContent: "flex-end" }}>
              <button className="btn-primary" onClick={addFood}>+ Add Food</button>
            </div>
          </div>

          {/* FOOD TABLE */}
          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Food Name</th>
                  <th>Price (₹)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {foods.map((food, i) => (
                  <tr key={food._id}>
                    <td style={{ color: "rgba(255,255,255,0.3)", fontFamily: "Space Mono", fontSize: 12 }}>
                      {String(i + 1).padStart(2, "0")}
                    </td>
                    <td style={{ fontWeight: 600 }}>{food.name}</td>
                    <td style={{ fontFamily: "Space Mono", color: "#00ffae" }}>₹{food.price}</td>
                    <td>
                      <button className="btn-delete" onClick={() => deleteFood(food._id)}>
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {foods.length === 0 && (
                  <tr><td colSpan={4} style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", padding: 24 }}>No food items yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ===== USER MANAGEMENT ===== */}
        <div className="admin-section">
          <div className="section-header">
            <span className="section-title">👥 User Management</span>
          </div>

          {/* ADD USER FORM */}
          <div className="admin-form" style={{ marginBottom: 20 }}>
            <div className="form-group">
              <label>Name</label>
              <input className="admin-input" placeholder="John Doe"
                value={newUser.name}
                onChange={e => setNewUser({ ...newUser, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input className="admin-input" placeholder="john@email.com"
                value={newUser.email}
                onChange={e => setNewUser({ ...newUser, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input className="admin-input" placeholder="9876543210"
                value={newUser.phone}
                onChange={e => setNewUser({ ...newUser, phone: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input className="admin-input" type="password" placeholder="••••••••"
                value={newUser.password}
                onChange={e => setNewUser({ ...newUser, password: e.target.value })}
              />
            </div>
            <div className="form-group" style={{ justifyContent: "flex-end" }}>
              <button className="btn-primary" onClick={addUser}>+ Add User</button>
            </div>
          </div>

          {/* USER TABLE */}
          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id}>
                    <td style={{ fontWeight: 600 }}>{user.name}</td>
                    <td style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>{user.email}</td>
                    <td style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>{user.phone || "—"}</td>
                    <td>
                      <select
                        className={`role-select ${roleClass[user.role] || ""}`}
                        value={user.role}
                        onChange={e => updateRole(user._id, e.target.value)}
                      >
                        <option value="Customer">Customer</option>
                        <option value="Admin">Admin</option>
                        <option value="RideStaff">RideStaff</option>
                        <option value="FoodStaff">FoodStaff</option>
                      </select>
                    </td>
                    <td>
                      <button className="btn-delete" onClick={() => deleteUser(user._id)}>
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr><td colSpan={5} style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", padding: 24 }}>No users yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}