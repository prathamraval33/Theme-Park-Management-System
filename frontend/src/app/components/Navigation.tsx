import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { useState } from "react";
import "../../styles/Navigation.css";

export function Navigation() {
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("user");
    setOpen(false);
    navigate("/login");
  };

  const getDashboardRoute = () => {
    if (!user) return "/";

    switch (user.role) {
      case "Admin":
        return "/admin";
      case "RideStaff":
        return "/ride-staff";
      case "TicketStaff":
        return "/ticket-staff";
      case "FoodStaff":
        return "/food-staff";
      default:
        return "/";
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">

        {/* 🔥 LOGO IMAGE */}
        <div className="nav-logo" onClick={() => navigate("/")}>
          <img
            src="/assets/logo.png"   // ⚠️ make sure file name is correct
            alt="FunFusion Logo"
            className="nav-logo-img"
          />
          <span className="logo-text">FunFusion</span>
        </div>

        {/* LINKS */}
        <div className="nav-links">
          <span onClick={() => navigate("/")}>Home</span>
          <span onClick={() => navigate("/rides")}>Rides</span>
          <span onClick={() => navigate("/tickets")}>Tickets</span>
          <span onClick={() => navigate("/queue")}>Queue</span>
          <span onClick={() => navigate("/food")}>Food</span>
          <span onClick={() => navigate("/contact")}>Contact</span>

          {user && user.role !== "Customer" && (
            <span
              className="dashboard-link"
              onClick={() => navigate(getDashboardRoute())}
            >
              Dashboard
            </span>
          )}

          {user ? (
            <div className="profile-wrapper">
              <FaUserCircle
                size={32}
                className="profile-icon"
                onClick={() => setOpen(!open)}
              />

              {open && (
                <div className="profile-dropdown">
                  <p className="profile-name">👤 {user.name}</p>

                  <button onClick={() => navigate("/Profile")}>
                    Profile
                  </button>

                  <button onClick={() => navigate(getDashboardRoute())}>
                    Dashboard
                  </button>

                  <button onClick={logout} className="logout-red">
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              className="login-btn"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}