import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/login.css";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !role) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password, role }
      );

      localStorage.setItem("user", JSON.stringify(res.data.user));

      const userRole = res.data.user.role;

      if (userRole === "RideStaff") navigate("/ride-staff");
      else if (userRole === "TicketStaff") navigate("/ticket-staff");
      else if (userRole === "FoodStaff") navigate("/food-staff");
      else if (userRole === "Admin") navigate("/admin");
      else navigate("/");

    } catch (error: any) {
      alert(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <h2 className="login-title">Theme Park Login</h2>

        <form onSubmit={handleLogin} className="login-form">

          <input
            type="email"
            placeholder="Enter Email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Enter Password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <select
  className="login-select"
  value={role}
  onChange={(e) => setRole(e.target.value)}
>
  <option value="">Select Role</option>
  <option value="Customer">Customer</option>
  <option value="RideStaff">Ride Staff</option>
  <option value="TicketStaff">Ticket Staff</option>
  <option value="FoodStaff">Food Staff</option>
  <option value="Admin">Admin</option>
</select>


          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        <p className="login-footer">
          Don’t have an account? <Link to="/signup">Sign up</Link>
        </p>

      </div>
    </div>
  );
}
