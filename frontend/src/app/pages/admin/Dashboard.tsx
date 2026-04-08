import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useAdminSocket } from "../../../hook/useAdminSocket";
import "../../../styles/admin.css";
export function Dashboard() {

  const [stats, setStats]       = useState<any>({});
  const [bookings, setBookings] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, bookingRes, chartRes] = await Promise.all([
        axios.get("http://localhost:5000/api/admin/stats"),
        axios.get("http://localhost:5000/api/admin/bookings"),
        axios.get("http://localhost:5000/api/admin/revenue-chart"),
      ]);
      setStats(statsRes.data || {});
      setBookings(bookingRes.data || []);
      setChartData(chartRes.data || []);
    } catch (err) { console.log(err); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);
  useAdminSocket(fetchData);

  const maxRevenue = Math.max(...chartData.map((d: any) => d.totalRevenue || 0), 1);

  const statusStyle: any = {
    Confirmed: { color: "#00ffae", borderColor: "rgba(0,255,174,0.25)", background: "rgba(0,255,174,0.08)" },
    Pending:   { color: "#ffc107", borderColor: "rgba(255,193,7,0.25)",  background: "rgba(255,193,7,0.08)"  },
    Cancelled: { color: "#ff4d4d", borderColor: "rgba(255,77,77,0.25)",  background: "rgba(255,77,77,0.08)"  },
  };

  return (
    <div className="admin-page">

      <h1 className="admin-title">Dashboard</h1>

      {/* STAT CARDS */}
      <div className="stats-row">
        {[
          { icon: "👥", label: "Total Users",    value: stats.totalUsers    ?? 0 },
          { icon: "🎢", label: "Total Rides",    value: stats.totalRides    ?? 0 },
          { icon: "🍔", label: "Food Items",     value: stats.totalFoods    ?? 0 },
          { icon: "🎫", label: "Bookings",       value: stats.totalBookings ?? 0 },
          { icon: "💰", label: "Revenue",        value: `₹${stats.totalRevenue ?? 0}`, green: true },
        ].map((s, i) => (
          <div className="stat-card" key={i}>
            <span className="stat-card-icon">{s.icon}</span>
            <span className="stat-card-label">{s.label}</span>
            <span className={`stat-card-value ${s.green ? "revenue" : ""}`}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* CHART */}
      {chartData.length > 0 && (
        <div className="chart-section">
          <h3>📈 Revenue Overview</h3>
          <div className="chart-bars">
            {chartData.slice(-12).map((d: any, i: number) => (
              <div className="chart-bar-wrap" key={i}>
                <div
                  className="chart-bar"
                  style={{ height: `${(d.totalRevenue / maxRevenue) * 140}px` }}
                  title={`₹${d.totalRevenue}`}
                />
                <span className="chart-bar-label">
                  {d._id ? String(d._id).slice(5) : `W${i + 1}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BOOKING HISTORY */}
      <div className="admin-section">
        <div className="section-header">
          <span className="section-title">🎫 Booking History</span>
        </div>
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>User</th>
                <th>Ride</th>
                <th>Amount (₹)</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b: any, i: number) => (
                <tr key={b._id}>
                  <td style={{ color: "rgba(255,255,255,0.3)", fontFamily: "Space Mono", fontSize: 12 }}>
                    {String(i + 1).padStart(2, "0")}
                  </td>
                  <td style={{ fontWeight: 600 }}>{b.user?.name || "—"}</td>
                  <td style={{ color: "rgba(255,255,255,0.7)" }}>{b.ride?.ride_name || "—"}</td>
                  <td style={{ fontFamily: "Space Mono", color: "#00ffae" }}>₹{b.total_amount}</td>
                  <td style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
                    {b.booking_date ? new Date(b.booking_date).toLocaleDateString() : "—"}
                  </td>
                  <td>
                    <span className="status-badge" style={statusStyle[b.status] || {}}>
                      <span className="dot" style={{ background: (statusStyle[b.status] || {}).color }} />
                      {b.status || "—"}
                    </span>
                  </td>
                  <td>
                    <select
                      className="status-select-table"
                      value={b.status}
                      onChange={async (e) => {
                        await axios.put(`http://localhost:5000/api/admin/bookings/${b._id}`, { status: e.target.value });
                        fetchData();
                      }}
                    >
                      <option>Confirmed</option>
                      <option>Pending</option>
                      <option>Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", padding: 24 }}>No bookings yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}