import { Link, useNavigate } from "react-router-dom";
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

        {/* LOGO */}
        <Link to="/" className="nav-logo">
          🎢 ThemePark
        </Link>

        {/* LINKS */}
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/rides">Rides</Link>
          <Link to="/tickets">Tickets</Link>
          <Link to="/queue">Queue</Link>
          <Link to="/food">Food</Link>
          <Link to="/contact">Contact</Link>

          {user && user.role !== "Customer" && (
            <Link to={getDashboardRoute()} className="dashboard-link">
              Dashboard
            </Link>
          )}

          {user ? (
            <div className="profile-wrapper">
              <FaUserCircle
                size={30}
                className="profile-icon"
                onClick={() => setOpen(!open)}
              />

              {open && (
                <div className="profile-dropdown">
                  <p className="profile-name">👤 {user.name}</p>

                  <button onClick={() => navigate("/profile")}>
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
            <Link to="/login" className="login-btn">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}