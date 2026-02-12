import { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../styles/Login.css";

export function Signup() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const nameRegex = /^[A-Za-z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,10}$/;

    if (!name || !email || !phone || !password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (!nameRegex.test(name)) {
      alert("Name must contain only alphabets");
      return;
    }

    if (!emailRegex.test(email)) {
      alert("Enter a valid email address");
      return;
    }

    if (!passwordRegex.test(password)) {
      alert(
        "Password must be 8-10 characters and include uppercase, lowercase, number and special character"
      );
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/signup", // corrected route
        {
          name,
          email,
          phone,
          password
        }
      );

      alert("Signup Successful");
      console.log(res.data);

      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setConfirmPassword("");

    } catch (error: any) {
      alert(error.response?.data?.message || "Signup Failed");
      console.error(error);
    }
  };

  return (
    <div className="background">
      <div className="login-container">
        <h2 style={{ color: "white" }}>Create Account</h2>

        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="User-Name"
            className="login-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email Address"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="tel"
            placeholder="Phone Number"
            className="login-input"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <input
            type="text"
            placeholder="Password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="login-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button type="submit" className="login-button">
            Sign Up
          </button>
        </form>

        <p style={{ marginTop: "15px", fontSize: "14px", color: "white" }}>
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              color: "#00d4ff",
              textDecoration: "none",
              fontWeight: "bold"
            }}
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
