import { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../styles/Signup.css";

export function Signup() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [role, setRole] = useState<string>("Customer");

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !email || !phone || !password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/signup", {
        name,
        email,
        phone,
        password,
        role
      });

      alert("Signup Successful");

      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setConfirmPassword("");
      setRole("Customer");

    } catch (error: any) {
      alert(error.response?.data?.message || "Signup Failed");
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">

        <h2 className="signup-title">Create Account</h2>

        <form onSubmit={handleSignup} className="signup-form">

          <input
            type="text"
            placeholder="User Name"
            className="signup-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email Address"
            className="signup-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="tel"
            placeholder="Phone Number"
            className="signup-input"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="signup-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="signup-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <select
            className="signup-input"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="Customer">Customer</option>
            <option value="RideStaff">Ride Staff</option>
            <option value="TicketStaff">Ticket Staff</option>
            <option value="FoodStaff">Food Staff</option>
            <option value="Admin">Admin</option>
          </select>

          <button type="submit" className="signup-button">
            Sign Up
          </button>

        </form>

        <div className="signup-footer">
          Already have an account? <Link to="/login">Login</Link>
        </div>

      </div>
    </div>
  );
}
