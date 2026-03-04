import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../../styles/ticket.css";

interface Plan {
  title: string;
  price: number;
  features: string[];
}

export function TicketBooking() {
  const navigate = useNavigate();

  const [visitDate, setVisitDate] = useState("");
  const [cart, setCart] = useState<any[]>([]);
  const [qrCode, setQrCode] = useState("");
  const [loading, setLoading] = useState(false);

  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  const today = new Date().toISOString().split("T")[0];

  const plans: Plan[] = [
    {
      title: "Kids Regular",
      price: 1000,
      features: ["All Rides", "Limited Food", "Regular Entry"]
    },
    {
      title: "Kids VIP",
      price: 1500,
      features: ["All Rides", "Unlimited Buffet", "Fast Entry"]
    },
    {
      title: "Adult Regular",
      price: 1500,
      features: ["All Rides", "Limited Food", "Regular Entry"]
    },
    {
      title: "Adult VIP",
      price: 2500,
      features: ["All Rides", "Unlimited Buffet", "VIP Fast Entry"]
    }
  ];

  const updateCart = (plan: Plan, qty: number) => {
    if (qty <= 0) {
      setCart(cart.filter((item) => item.title !== plan.title));
      return;
    }

    const exists = cart.find((item) => item.title === plan.title);

    if (exists) {
      setCart(
        cart.map((item) =>
          item.title === plan.title ? { ...item, qty } : item
        )
      );
    } else {
      setCart([...cart, { ...plan, qty }]);
    }
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const handleBooking = async () => {
    if (!user) return alert("Please login first");
    if (!visitDate) return alert("Select visit date");
    if (cart.length === 0) return alert("Select at least one plan");

    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/booking/create",
        {
          user_id: user._id,
          user_email: user.email,
          booking_date: visitDate,
          items: cart,
          total_amount: total,
          payment_status: "Paid"
        }
      );

      setQrCode(res.data.qr_code);
      setCart([]);
      setVisitDate("");

    } catch (err) {
      alert("Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ticket-page">

      {/* HEADER */}
      <div className="ticket-header">
        <button onClick={() => navigate("/")} className="back-btn">
          ← Back Home
        </button>
        <h2>🎟 Family Ticket Booking</h2>
      </div>

      {/* PLANS */}
      <div className="plan-grid">
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            className="plan-card"
            whileHover={{ scale: 1.05 }}
          >
            <h3>{plan.title}</h3>
            <h2>₹{plan.price}</h2>

            <ul>
              {plan.features.map((f, i) => (
                <li key={i}>✔ {f}</li>
              ))}
            </ul>

            <input
              type="number"
              min="0"
              placeholder="Add qty"
              onChange={(e) =>
                updateCart(plan, parseInt(e.target.value) || 0)
              }
            />
          </motion.div>
        ))}
      </div>

      {/* BOOKING SECTION */}
      <div className="booking-box">

        {/* SUMMARY */}
        <div className="summary-box">
          <h3>🧾 Booking Summary</h3>

          {cart.length === 0 ? (
            <p className="empty-msg">No tickets selected</p>
          ) : (
            <>
              {cart.map((item, i) => (
                <div key={i} className="summary-item">
                  <span>{item.title}</span>
                  <span>{item.qty} × ₹{item.price}</span>
                  <span>₹{item.qty * item.price}</span>
                </div>
              ))}

              <div className="summary-divider"></div>

              <div className="summary-total">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </>
          )}

          <label className="date-label">Visit Date</label>
          <input
            type="date"
            min={today}
            value={visitDate}
            onChange={(e) => setVisitDate(e.target.value)}
          />

          {/* 🔥 MAIN BUTTON */}
          <button
            onClick={handleBooking}
            className="book-btn main-book-btn"
            disabled={cart.length === 0 || !visitDate || loading}
          >
            {loading ? "Processing..." : "Proceed to Book 🎟"}
          </button>
        </div>

        {/* QR */}
        <div className="qr-section">
          <h3>🎫 Your Ticket</h3>

          {qrCode ? (
            <img src={qrCode} className="qr-img" />
          ) : (
            <div className="qr-placeholder">
              QR will appear after booking
            </div>
          )}
        </div>

      </div>
    </div>
  );
}