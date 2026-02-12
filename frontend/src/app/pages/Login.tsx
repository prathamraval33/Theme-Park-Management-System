import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/Login.css";

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

      alert(res.data.message);

      // Save user to localStorage
      localStorage.setItem("user", JSON.stringify(res.data.user));

      const userRole = res.data.user.role;

      // Redirect based on role
      if (userRole === "RideStaff") {
        navigate("/ride-staff");
      } else if (userRole === "TicketStaff") {
        navigate("/ticket-staff");
      } else if (userRole === "FoodStaff") {
        navigate("/food-staff");
      } else if (userRole === "Admin") {
        navigate("/admin");
      } else {
        navigate("/"); // Customer or default
      }

    } catch (error: any) {
      alert(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="background">
      <div className="login-container">
        <h2 style={{ color: "white" }}>Theme Park Login</h2>

        <form onSubmit={handleLogin}>
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
            className="login-input"
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

        <p style={{ marginTop: "15px", fontSize: "14px", color: "white" }}>
          Don’t have an account?{" "}
          <Link
            to="/signup"
            style={{
              color: "#00d4ff",
              textDecoration: "none",
              fontWeight: "bold"
            }}
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
