import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useAdminSocket } from "../../../hook/useAdminSocket";
import "../../../styles/admin.css";

const EMPTY_RIDE = {
  ride_name: "", description: "", category: "Family",
  capacity: "", avgDuration: "", price: "", image: "", gif: ""
};

export function RideManagement() {

  const [rides, setRides] = useState<any[]>([]);
  const [form, setForm]   = useState<any>(EMPTY_RIDE);
  const [editId, setEditId] = useState<string | null>(null);

  const fetchRides = useCallback(async () => {
    const res = await axios.get("http://localhost:5000/api/admin/rides");
    setRides(res.data || []);
  }, []);

  useEffect(() => { fetchRides(); }, [fetchRides]);
  useAdminSocket(fetchRides);

  const saveRide = async () => {
    if (!form.ride_name || !form.capacity  || !form.avgDuration) return;

    const payload = {
  ride_name: form.ride_name,
  description: form.description,
  category: form.category,
  capacity: Number(form.capacity),        // 🔥 FIX
  avgDuration: Number(form.avgDuration),  // 🔥 FIX
               // 🔥 FIX
  image: form.image,
  gif: form.gif,
};
    if (editId) {
      await axios.put(`http://localhost:5000/api/admin/rides/${editId}`, payload);
      setEditId(null);
    } else {
      await axios.post("http://localhost:5000/api/admin/rides", payload);
    }

    setForm(EMPTY_RIDE);
    fetchRides();
  };

  const startEdit = (ride: any) => {
    setEditId(ride._id);
    setForm({
      ride_name:   ride.ride_name,
      description: ride.description || "",
      category:    ride.category    || "Family",
      capacity:    ride.capacity,
      avgDuration: ride.avgDuration,
      //price:       ride.price,
      image:       ride.image       || "",
      gif:         ride.gif         || "",
    });
  };

  const deleteRide = async (id: string) => {
    await axios.delete(`http://localhost:5000/api/admin/rides/${id}`);
   fetchRides();
  };

  const updateStatus = async (id: string, status: string) => {
  try {
    const res = await axios.put(
      `http://localhost:5000/api/admin/rides/${id}/status`,
      { status }
    );
    fetchRides();

    // 🔥 UPDATE UI WITHOUT REFRESH
    setRides(prev =>
      prev.map(r =>
        r._id === id ? { ...r, status: res.data.status } : r
      )
    );

  } catch (err) {
    console.log(err);
  }
};

  const f = (key: string) => (e: any) => setForm({ ...form, [key]: e.target.value });

  return (
    <div className="admin-page">
      <h1 className="admin-title"> Ride Management</h1>

      {/* FORM */}
      <div className="admin-section">
        <div className="section-header">
          <span className="section-title">{editId ? "✏️ Edit Ride" : "➕ Add New Ride"}</span>
          {editId && (
            <button className="btn-ghost" onClick={() => { setEditId(null); setForm(EMPTY_RIDE); }}>
              Cancel
            </button>
          )}
        </div>

        <div className="admin-form">
          <div className="form-group">
            <label>Ride Name *</label>
            <input className="admin-input" placeholder="e.g. Roller Coaster" value={form.ride_name} onChange={f("ride_name")} />
          </div>
          <div className="form-group">
            <label>Description</label>
            <input className="admin-input" placeholder="Short description" value={form.description} onChange={f("description")} />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select className="admin-input admin-select-input" value={form.category} onChange={f("category")}>
              <option>Thrill</option>
              <option>Water</option>
              <option>Kids</option>
              <option>Family</option>
            </select>
          </div>
          <div className="form-group">
            <label>Capacity *</label>
            <input className="admin-input" type="number" placeholder="30" value={form.capacity} onChange={f("capacity")} />
          </div>
          <div className="form-group">
            <label>Duration (min) *</label>
            <input className="admin-input" type="number" placeholder="25" value={form.avgDuration} onChange={f("avgDuration")} />
          </div>
          
          <div className="form-group">
            <label>Image URL</label>
            <input className="admin-input" placeholder="https://..." value={form.image} onChange={f("image")} />
          </div>
          <div className="form-group">
            <label>GIF URL</label>
            <input className="admin-input" placeholder="https://..." value={form.gif} onChange={f("gif")} />
          </div>
          <div className="form-group" style={{ justifyContent: "flex-end" }}>
            <button className="btn-primary" onClick={saveRide}>
              {editId ? " Save Changes" : "+ Add Ride"}
            </button>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="admin-section">
        <div className="section-header">
          <span className="section-title">All Rides ({rides.length})</span>
        </div>
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Category</th>
                <th>Capacity</th>
                <th>Duration</th>
                
                <th>Status</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rides.map((ride, i) => (
                <tr key={ride._id}>
                  <td style={{ color: "rgba(255,255,255,0.3)", fontFamily: "Space Mono", fontSize: 12 }}>
                    {String(i + 1).padStart(2, "0")}
                  </td>
                  <td>
                    <div style={{ fontWeight: 700 }}>{ride.ride_name}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{ride.description}</div>
                  </td>
                  <td>
                    <span className="category-pill">{ride.category}</span>
                  </td>
                  <td style={{ fontFamily: "Space Mono" }}>{ride.capacity}</td>
                  <td style={{ fontFamily: "Space Mono" }}>{ride.avgDuration}m</td>
                  
                  <td>
                    <select
                      className="status-select-table"
                      value={ride.status}
                      onChange={e => updateStatus(ride._id, e.target.value)}
                      style={{
                        color: ride.status === "Open" ? "#00ffae" : ride.status === "Closed" ? "#ff4d4d" : "#ffc107"
                      }}
                    >
                      <option value="Open">Open</option>
                      <option value="Closed">Closed</option>
                      <option value="Maintenance">Maintenance</option>
                    </select>
                  </td>
                  <td>
                    {ride.image && ride.image !== "default.jpg" ? (
                      <img src={ride.image} alt="" style={{ width: 44, height: 44, borderRadius: 8, objectFit: "cover", border: "1px solid rgba(255,255,255,0.1)" }} />
                    ) : (
                      <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 12 }}>—</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="btn-edit" onClick={() => startEdit(ride)}>✏️ Edit</button>
                      <button className="btn-delete" onClick={() => deleteRide(ride._id)}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
              {rides.length === 0 && (
                <tr><td colSpan={9} style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", padding: 28 }}>No rides yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}