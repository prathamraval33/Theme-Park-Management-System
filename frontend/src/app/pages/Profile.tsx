import { useNavigate } from "react-router-dom";
import "../../styles/Profile.css";

export function Profile() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="profile-container">
      <div className="profile-card">

        <h2>My Profile</h2>

        <p><strong>Name:</strong> {user.name || "N/A"}</p>
        <p><strong>Email:</strong> {user.email || "N/A"}</p>
        <p><strong>Role:</strong> {user.role || "N/A"}</p>

        <div className="profile-buttons">
          <button onClick={() => navigate("/")} className="btn-home">
            Back to Home
          </button>

          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>

      </div>
    </div>
  );
}
