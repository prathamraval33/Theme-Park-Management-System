import { Link, useNavigate } from "react-router-dom";
import "../../styles/navigation.css";

export function Navigation() {
  const user = localStorage.getItem("user");
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="nav-container">

        {/* Logo */}
        <div className="logo-section" onClick={() => navigate("/")}>
          <img src="/assets/logo.png" alt="FunSion" className="logo-img" />
          <span className="logo-text">FunSion</span>
        </div>

        {/* Links */}
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/rides">Rides</Link>
          <Link to="/tickets">Tickets</Link>
          <Link to="/queue">Queue</Link>
          <Link to="/food">Food</Link>
          <Link to="/contact">Contact</Link>

          {user ? (
            <Link to="/profile" className="profile-btn">Profile</Link>
          ) : (
            <Link to="/login" className="login-btn">Login</Link>
          )}
        </div>

      </div>
    </nav>
  );
}
