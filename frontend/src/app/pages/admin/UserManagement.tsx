import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useAdminSocket } from "../../../hook/useAdminSocket";
import "../../../styles/admin.css";
import { color } from "framer-motion";

const EMPTY_USER = { name: "", email: "", phone: "", password: "" };

const roleClass: any = {
  Customer:    "role-customer",
  Admin:       "role-admin",
  RideStaff:   "role-ridestaff",
  FoodStaff:   "role-foodstaff",
  TicketStaff: "role-ticketstaff",
};

export function UserManagement() {

  const [users, setUsers]   = useState<any[]>([]);
  const [form, setForm]     = useState<any>(EMPTY_USER);
  const [search, setSearch] = useState("");

  const fetchUsers = useCallback(async () => {
    const res = await axios.get("http://localhost:5000/api/admin/users");
    setUsers(res.data || []);
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);
  useAdminSocket(fetchUsers);

  const addUser = async () => {
    if (!form.name || !form.email || !form.password || !form.phone) return;
    await axios.post("http://localhost:5000/api/auth/signup", form);
    setForm(EMPTY_USER);
    //fetchUsers();
  };

  const updateRole = async (id: string, role: string) => {
    await axios.put(`http://localhost:5000/api/admin/users/${id}`, { role });
    //fetchUsers();
  };

  const deleteUser = async (id: string) => {
    await axios.delete(`http://localhost:5000/api/admin/users/${id}`);
    //fetchUsers();
  };

  const f = (key: string) => (e: any) => setForm({ ...form, [key]: e.target.value });

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-page">
      <h1 className="admin-title" >User Management</h1>

      

      {/* USER TABLE */}
      <div className="admin-section">
        <div className="section-header">
          <span className="section-title">All Users ({users.length})</span>
          <input
            className="admin-input"
            placeholder="🔍 Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: 260 }}
          />
        </div>
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user, i) => (
                <tr key={user._id}>
                  <td style={{ color: "rgba(255,255,255,0.3)", fontFamily: "Space Mono", fontSize: 12 }}>
                    {String(i + 1).padStart(2, "0")}
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div className="user-avatar">
                        {user.profilePic
                          ? <img src={user.profilePic} alt="" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                          : user.name?.charAt(0).toUpperCase()
                        }
                      </div>
                      <span style={{ fontWeight: 600 }}>{user.name}</span>
                    </div>
                  </td>
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
                      <option value="TicketStaff">TicketStaff</option>
                    </select>
                  </td>
                  <td style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                  </td>
                  <td>
                    <button className="btn-delete" onClick={() => deleteUser(user._id)}>🗑 Delete</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", padding: 28 }}>No users found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}