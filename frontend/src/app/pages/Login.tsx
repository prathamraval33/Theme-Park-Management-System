import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/login.css";

export function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  /* ========================= */
  /* AUTO REDIRECT IF LOGGED IN */
  /* ========================= */

  useEffect(() => {

    const userData = localStorage.getItem("user");

    if (userData) {

      const user = JSON.parse(userData);

      if (user.role === "Admin") navigate("/admin");
      else if (user.role === "RideStaff") navigate("/ride-staff");
      else navigate("/");

    }

  }, [navigate]);


  /* ========================= */
  /* LOGIN HANDLER */
  /* ========================= */

  const handleLogin = async (e: React.FormEvent) => {

    e.preventDefault();

    setError("");

    if (!email.trim() || !password.trim()) {

      setError("Please fill all fields");
      return;

    }

    try {

      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email: email.trim(),
          password
        }
      );

      /* ========================= */
      /* STORE USER SESSION */
      /* ========================= */

      const userData = {
        _id: res.data.user._id,
        name: res.data.user.name,
        email: res.data.user.email,
        role: res.data.user.role
      };

      console.log("Login success:", userData);

      localStorage.setItem("user", JSON.stringify(userData));

      /* ========================= */
      /* REDIRECT BASED ON ROLE */
      /* ========================= */

      if (userData.role === "Admin") navigate("/admin");
      else if (userData.role === "RideStaff") navigate("/ride-staff");
      else navigate("/");

    } catch (err: any) {

      console.log("Login error:", err);

      setError(err.response?.data?.message || "Login Failed");

    } finally {

      setLoading(false);

    }

  };


  /* ========================= */
  /* UI */
  /* ========================= */

  return (

    <div className="login-page">

      <div className="login-card">

        <h2 className="login-title">Theme Park Login</h2>

        {error && (
          <p style={{ color: "#ff4d4d", marginBottom: "10px" }}>
            {error}
          </p>
        )}

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

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="login-footer">
          Don’t have an account? <Link to="/signup">Sign up</Link>
        </p>

      </div>

    </div>

  );
}