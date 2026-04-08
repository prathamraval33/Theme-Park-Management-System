import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "../../styles/otp.css";

export default function VerifyOTP() {

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  
    const email =
  (location.state?.email || localStorage.getItem("otp_email"))?.toLowerCase();

  const handleVerify = async () => {
    try {
      setLoading(true);

      await axios.post("http://localhost:5000/api/auth/verify-otp", {
        email,
        otp
      });

      toast.success("Account created 🎉");

      localStorage.removeItem("otp_email");

      navigate("/login");

    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/resend-otp", { email });
      toast.success("OTP resent 📩");
    } catch {
      toast.error("Failed to resend");
    }
  };

  return (
    <div className="otp-page">
      <div className="otp-card">

        <h2 className="otp-title">Verify OTP</h2>

        <input
          className="otp-input"
          value={otp}
          maxLength={6}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button className="otp-button" onClick={handleVerify}>
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <p className="otp-resend">
          Didn’t receive code?
          <span onClick={handleResend}> Resend</span>
        </p>

      </div>
    </div>
  );
}