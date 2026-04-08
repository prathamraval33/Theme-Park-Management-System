import { useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import "../../../styles/admin.css";

export function AdminLayout() {
  const navigate = useNavigate();
  const [active, setActive] = useState("dashboard");

  const navItems = [
    { key: "dashboard",  label: "Dashboard",       icon: "📊" },
    { key: "rides",      label: "Ride Management",  icon: "🎢" },
    { key: "food",       label: "Food Management",  icon: "🍔" },
    { key: "users",      label: "User Management",  icon: "👥" },
  ];

  const go = (key: string) => {
    setActive(key);
    navigate(`/admin/${key === "dashboard" ? "" : key}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="admin-layout">

      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <span className="logo-icon">🎡</span>
          <span className="logo-text">FunFusion</span>
        </div>

        <nav className="admin-nav">
          {navItems.map(item => (
            <div
              key={item.key}
              className={`admin-nav-item ${active === item.key ? "active" : ""}`}
              onClick={() => go(item.key)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-nav-item logout" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            <span>Logout</span>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="admin-main">
        <Outlet />
      </main>

    </div>
  );
}