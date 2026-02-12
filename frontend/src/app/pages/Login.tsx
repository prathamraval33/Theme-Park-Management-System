import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import"../../styles/Login.css";
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
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: "url('/assets/login_back.jpg')" }}
    >
      <div className="
        w-full max-w-md
        p-10
        rounded-2xl
        backdrop-blur-xl
        bg-white/15
        border border-white/30
        shadow-2xl
      ">
        <h2 className="text-3xl font-bold text-white text-center mb-10">
          Theme Park Login
        </h2>

        <form onSubmit={handleLogin}>

          {/* Email */}
          <div className="mb-6">
            <input
              type="email"
              placeholder="Enter Email"
              className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-orange-400 hover:bg-white/30 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <input
              type="password"
              placeholder="Enter Password"
              className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-orange-400 hover:bg-white/30 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Dropdown */}
          <div className="mb-8 relative">
            <select
              className="
                w-full px-4 py-3 rounded-xl
                bg-gradient-to-r from-orange-400/40 to-pink-500/40
                text-white
                border border-white/30
                focus:outline-none focus:ring-2 focus:ring-orange-400
                appearance-none
                transition
              "
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="" className="text-black">Select Role</option>
              <option value="Customer" className="text-black">Customer</option>
              <option value="RideStaff" className="text-black">Ride Staff</option>
              <option value="TicketStaff" className="text-black">Ticket Staff</option>
              <option value="FoodStaff" className="text-black">Food Staff</option>
              <option value="Admin" className="text-black">Admin</option>
            </select>

            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-white">
              ▼
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="
              w-full py-3 rounded-xl
              font-semibold text-white
              bg-gradient-to-r from-orange-500 to-pink-500
              hover:from-orange-600 hover:to-pink-600
              transform hover:scale-105
              transition duration-300 shadow-lg
            "
          >
            Login
          </button>
        </form>

        <p className="text-center text-white mt-6 text-sm">
          Don’t have an account?{" "}
          <Link to="/signup" className="font-semibold underline hover:text-orange-300">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
