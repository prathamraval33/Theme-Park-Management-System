import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import "../../styles/signup.css";

export default function Signup() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSignup = async (e: any) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/auth/signup", form);
      alert("Signup successful");
      navigate("/login");
    } catch (err: any) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  /* ================= GOOGLE ================= */

  const handleGoogleSignup = async (credentialResponse: any) => {
    try {

      const res = await axios.post(
        "http://localhost:5000/api/auth/google",
        { token: credentialResponse.credential }
      );

      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Account created with Google 🎉");
      navigate("/");

    } catch (err) {
      alert("Google signup failed");
    }
  };

  return (
    <div className="signup-page">

      <div className="signup-card">

        <h2 className="signup-title">Create Account</h2>

        <form className="signup-form" onSubmit={handleSignup}>

          <input
            className="signup-input"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
          />

          <input
            className="signup-input"
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />

          <input
            className="signup-input"
            name="phone"
            placeholder="Phone Number"
            onChange={handleChange}
            required
          />

          <input
            className="signup-input"
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <button className="signup-button" type="submit">
            Sign Up
          </button>

        </form>

        {/* 🔥 GOOGLE SIGNUP */}
        <div className="google-section">
          <p>OR</p>

          <GoogleLogin
            onSuccess={handleGoogleSignup}
            onError={() => console.log("Google Error")}
          />
        </div>

        <div className="signup-footer">
          Already have an account? <Link to="/login">Login</Link>
        </div>

      </div>
    </div>
  );
}