import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import "../../styles/login.css";
import toast from "react-hot-toast";

export default function Login() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  /* ================= INPUT HANDLER ================= */

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  /* ================= LOGIN ================= */

  const handleLogin = async (e: any) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        form
      );

      // ✅ Save user
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // ✅ Smooth redirect
      navigate("/", { replace: true });
      toast.success("🎉 Login Successful!");

    } catch (err: any) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  /* ================= GOOGLE LOGIN ================= */

  const handleGoogleLogin = async (credentialResponse: any) => {
    try {

      const res = await axios.post(
        "http://localhost:5000/api/auth/google",
        {
          token: credentialResponse.credential
        }
      );

      localStorage.setItem("user", JSON.stringify(res.data.user));

      // ✅ Redirect to home
      navigate("/", { replace: true });

    } catch (err) {
      console.log(err);
      alert("Google login failed");
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <h2 className="login-title">Welcome Back</h2>

        {/* ================= FORM ================= */}
        <form className="login-form" onSubmit={handleLogin}>

          <input
            className="login-input"
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />

          <input
            className="login-input"
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <button className="login-button" type="submit">
            Login
          </button>

        </form>

        {/* ================= GOOGLE ================= */}
        <div className="google-section">
          <p>OR</p>

          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => console.log("Google Error")}
          />
        </div>

        {/* ================= FOOTER ================= */}
        <div className="login-footer">
          Don’t have an account? <Link to="/signup">Sign Up</Link>
        </div>

      </div>
    </div>
  );
}