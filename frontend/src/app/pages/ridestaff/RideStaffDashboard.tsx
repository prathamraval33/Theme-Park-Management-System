import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import "../../../styles/RideStaffDashboard.css";

export function RideStaffDashboard() {

  const [rides, setRides] = useState<any[]>([]);
  const [localQueue, setLocalQueue] = useState<any>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const editingRef = useRef<string | null>(null);
  const busyRef = useRef(false);

  const navigate = useNavigate();

  useEffect(() => {
    editingRef.current = editingId;
  }, [editingId]);

  const calcWaitTime = (count: number, capacity: number, duration: number) => {
    if (count === 0) return 0;
    return Math.ceil(count / capacity) * duration;
  };

  const fetchRides = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/rides");
      setRides(res.data);
    } catch (err) {
      console.log("Fetch error:", err);
    }
  };

  useEffect(() => { fetchRides(); }, []);

  useEffect(() => {
    const socket = io("http://localhost:5000", { transports: ["websocket"] });
    socket.on("rideUpdated", () => {
      if (!editingRef.current && !busyRef.current) fetchRides();
    });
    return () => socket.disconnect();
  }, []);

  const updateQueue = async (id: string, change: number) => {
    busyRef.current = true;
    setRides(prev => prev.map(r => {
      if (r._id !== id) return r;
      const newCount = Math.max(0, (r.currentQueue || 0) + change);
      return { ...r, currentQueue: newCount, waiting_time: calcWaitTime(newCount, r.capacity, r.avgDuration) };
    }));
    try {
      await axios.put(`http://localhost:5000/api/queue/update/${id}`, { change });
    } catch (err) {
      console.log(err); fetchRides();
    } finally {
      setTimeout(() => { busyRef.current = false; }, 800);
    }
  };

  const setManualQueue = async (id: string, value: number) => {
    setRides(prev => prev.map(r => {
      if (r._id !== id) return r;
      return { ...r, currentQueue: value, waiting_time: calcWaitTime(value, r.capacity, r.avgDuration) };
    }));
    try {
      await axios.put(`http://localhost:5000/api/queue/set/${id}`, { value });
    } catch (err) {
      console.log(err); fetchRides();
    }
  };

  const clearQueue = async (id: string) => {
    busyRef.current = true;
    setRides(prev => prev.map(r => r._id === id ? { ...r, currentQueue: 0, waiting_time: 0 } : r));
    try {
      await axios.put(`http://localhost:5000/api/queue/clear/${id}`);
    } catch (err) {
      console.log(err); fetchRides();
    } finally {
      setTimeout(() => { busyRef.current = false; }, 800);
    }
  };

  const startRideCycle = async (ride: any) => {
    busyRef.current = true;
    setRides(prev => prev.map(r => {
      if (r._id !== ride._id) return r;
      const newCount = Math.max(0, r.currentQueue - r.capacity);
      return { ...r, currentQueue: newCount, waiting_time: calcWaitTime(newCount, r.capacity, r.avgDuration) };
    }));
    try {
      await axios.put(`http://localhost:5000/api/queue/cycle/${ride._id}`);
    } catch (err) {
      console.log(err); fetchRides();
    } finally {
      setTimeout(() => { busyRef.current = false; }, 800);
    }
  };

  const changeStatus = async (id: string, status: string) => {
    busyRef.current = true;
    setRides(prev => prev.map(r => r._id === id ? { ...r, status } : r));
    try {
      await axios.put(`http://localhost:5000/api/rides/${id}`, { status });
    } catch (err) {
      console.log(err); fetchRides();
    } finally {
      setTimeout(() => { busyRef.current = false; }, 800);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const total = rides.length;
  const open = rides.filter(r => r.status === "Open").length;
  const closed = rides.filter(r => r.status === "Closed").length;
  const maintenance = rides.filter(r => r.status === "Maintenance").length;

  return (
    <div className="staff-layout">

      {/* SIDEBAR */}
      <div className="sidebar">

        <div className="sidebar-logo">
          <span className="logo-icon">🎢</span>
          <span className="logo-text">RideOps</span>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li className="nav-item active" onClick={() => navigate("/ride-staff")}>
              <span className="nav-icon">⚡</span> Dashboard
            </li>
            <li className="nav-item" onClick={() => navigate("/profile")}>
              <span className="nav-icon">👤</span> Profile
            </li>
          </ul>
        </nav>

        {/* LOGOUT PINNED TO BOTTOM */}
        <div className="sidebar-footer">
          <div className="logout-btn" onClick={handleLogout}>
            <span className="nav-icon">🚪</span> Logout
          </div>
        </div>

      </div>

      {/* MAIN */}
      <div className="main-content">

        <div className="page-header">
          <h1>Ride Operations</h1>
          <p className="page-subtitle">Live queue & status management</p>
        </div>

        {/* TOP STATS */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🎠</div>
            <div className="stat-info"><h3>{total}</h3><p>Total Rides</p></div>
          </div>
          <div className="stat-card open">
            <div className="stat-icon">✅</div>
            <div className="stat-info"><h3>{open}</h3><p>Open</p></div>
          </div>
          <div className="stat-card closed">
            <div className="stat-icon">🔴</div>
            <div className="stat-info"><h3>{closed}</h3><p>Closed</p></div>
          </div>
          <div className="stat-card maintenance">
            <div className="stat-icon">🔧</div>
            <div className="stat-info"><h3>{maintenance}</h3><p>Maintenance</p></div>
          </div>
        </div>

        {/* RIDE CARDS */}
        <div className="ride-grid">
          {rides.map((ride) => {

            const progress = Math.min((ride.currentQueue / (ride.capacity * 5)) * 100, 100);
            const statusColor =
              ride.status === "Open" ? "#00ffae" :
              ride.status === "Closed" ? "#ff4d4d" : "#ffc107";

            return (
              <div key={ride._id} className="ride-card">

                {/* HEADER */}
                <div className="card-header">
                  <h3 className="ride-name">{ride.ride_name}</h3>
                  <span className="status-badge" style={{
                    background: `${statusColor}18`,
                    color: statusColor,
                    border: `1px solid ${statusColor}40`
                  }}>
                    <span className="badge-dot" style={{ background: statusColor }} />
                    {ride.status}
                  </span>
                </div>

                {/* 2x2 GLASS TILES */}
                <div className="stats-2x2">
                  <div className="stat-tile">
                    <span className="tile-icon">👥</span>
                    <span className="tile-label">Current Queue</span>
                    <span className="tile-value queue-val">{ride.currentQueue || 0}</span>
                  </div>
                  <div className="stat-tile">
                    <span className="tile-icon">🎡</span>
                    <span className="tile-label">Capacity</span>
                    <span className="tile-value">{ride.capacity}</span>
                  </div>
                  <div className="stat-tile">
                    <span className="tile-icon">🕒</span>
                    <span className="tile-label">Duration</span>
                    <span className="tile-value">{ride.avgDuration}<span className="tile-unit">min</span></span>
                  </div>
                  <div className="stat-tile highlight">
                    <span className="tile-icon">⏳</span>
                    <span className="tile-label">Wait Time</span>
                    <span className="tile-value wait-val">{ride.waiting_time || 0}<span className="tile-unit">min</span></span>
                  </div>
                </div>

                {/* PROGRESS */}
                <div className="progress-wrap">
                  <div className="progress-meta">
                    <span>Queue Fill</span>
                    <span className="progress-pct">{Math.round(progress)}%</span>
                  </div>
                  <div className="queue-progress">
                    <div className="progress-bar" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                <div className="card-divider" />

                {/* CONTROLS */}
                <div className="queue-control">
                  <button className="ctrl-btn" onClick={() => updateQueue(ride._id, -1)}>−</button>
                  <input
                    type="number"
                    value={editingId === ride._id ? localQueue[ride._id] ?? "" : ride.currentQueue ?? 0}
                    onFocus={() => setEditingId(ride._id)}
                    onChange={(e) => setLocalQueue({ ...localQueue, [ride._id]: e.target.value })}
                    onBlur={() => {
                      const val = Number(localQueue[ride._id] ?? ride.currentQueue);
                      setManualQueue(ride._id, val);
                      setTimeout(() => setEditingId(null), 800);
                    }}
                  />
                  <button className="ctrl-btn" onClick={() => updateQueue(ride._id, 1)}>+</button>
                </div>

                {/* ACTIONS */}
                <div className="queue-actions">
                  <button className="clear-btn" onClick={() => clearQueue(ride._id)}>🗑 Clear</button>
                  <button className="cycle-btn" onClick={() => startRideCycle(ride)}>🚀 Start Ride</button>
                </div>

                {/* STATUS */}
                <select
                  className="status-select"
                  value={ride.status}
                  onChange={(e) => changeStatus(ride._id, e.target.value)}
                >
                  <option>Open</option>
                  <option>Closed</option>
                  <option>Maintenance</option>
                </select>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}