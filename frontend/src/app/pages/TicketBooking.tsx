import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../styles/ticket.css";
import toast from "react-hot-toast";
interface Plan {
  title: string;
  price: number;
  features: string[];
}

interface CartItem {
  title: string;
  price: number;
  qty: number;
}

export function TicketBooking() {

  const [visitDate, setVisitDate] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const plans: Plan[] = [
    { title: "Kids Regular", price: 1000, features: ["All Rides", "Limited Food"] },
    { title: "Kids VIP", price: 1500, features: ["Unlimited Buffet", "Fast Entry"] },
    { title: "Adult Regular", price: 1500, features: ["All Rides", "Regular Entry"] },
    { title: "Adult VIP", price: 2500, features: ["VIP Fast Entry", "Unlimited Buffet"] }
  ];

  /* Smart Pricing */
  const getPrice = (plan: Plan) => {
    if (!visitDate) return plan.price;
    const day = new Date(visitDate).getDay();
    return (day === 0 || day === 6) ? plan.price + 300 : plan.price;
  };

  /* Update Cart */
  const updateCart = (plan: Plan, qty: number) => {

    if (qty <= 0) {
      setCart(cart.filter((i) => i.title !== plan.title));
      return;
    }

    const newItem = {
      title: plan.title,
      price: getPrice(plan),
      qty
    };

    const exists = cart.find((i) => i.title === plan.title);

    if (exists) {
      setCart(cart.map((i) => i.title === plan.title ? newItem : i));
    } else {
      setCart([...cart, newItem]);
    }
  };

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const totalTickets = cart.reduce((s, i) => s + i.qty, 0);

  /* Booking */
  const handleBooking = async () => {

  const userData = localStorage.getItem("user");

  if (!userData) {
    alert("Please login first");
    return;
  }

  const user = JSON.parse(userData);

  if (!user.email) {
    alert("Session expired. Login again.");
    return;
  }

  if (!visitDate) {
    alert("Select date");
    return;
  }

  if (cart.length === 0) {
    alert("Select tickets");
    return;
  }

  setLoading(true);

  try {

    const res = await axios.post(
      "http://localhost:5000/api/booking/create",
      {
        email: user.email, // 🔥 REQUIRED
        booking_date: visitDate,
        items: cart.map(item => ({
          title: item.title,
          qty: item.qty,
          price: item.price
        })),
        total_amount: total,
        payment_status: "Paid" // 🔥 REQUIRED
      }
    );

    console.log("SUCCESS:", res.data);

  toast.success("🎉 Booking Successful!");

    setCart([]);
    setVisitDate("");

  } catch (err: any) {

    console.log("ERROR:", err.response?.data);

    alert(err.response?.data?.message || "Booking failed");

  } finally {
    setLoading(false);
  }
};
  return (

    <div className="ticket-page">

      <h2 className="ticket-title">🎟 Ticket Booking</h2>

      <div className="ticket-layout">

        {/* LEFT */}
        <div className="left-section">

          <div className="plan-grid">

            {plans.map((plan, i) => {

              const qty = cart.find(c => c.title === plan.title)?.qty || 0;

              return (
                <motion.div
                  key={i}
                  className={`plan-card ${qty > 0 ? "selected" : ""}`}
                  whileHover={{ scale: 1.05 }}
                >

                  <h3>{plan.title}</h3>
                  <h2>₹{getPrice(plan)}</h2>

                  <ul>
                    {plan.features.map((f, idx) => (
                      <li key={idx}>✔ {f}</li>
                    ))}
                  </ul>

                  {/* 🔥 NEW QUANTITY CONTROL */}
                  <div className="qty-control">

                    <button onClick={() => updateCart(plan, qty - 1)}>−</button>

                    <span>{qty}</span>

                    <button onClick={() => updateCart(plan, qty + 1)}>+</button>

                  </div>

                </motion.div>
              );
            })}

          </div>

        </div>

        {/* RIGHT */}
        <div className="right-section">

          {cart.length === 0 ? (

            <div className="empty-state">
              <h3>🎟 No Tickets Selected</h3>
              <p>Select tickets to see breakdown</p>
            </div>

          ) : (

            <div className="live-summary">

              <h3>🧾 Ticket Breakdown</h3>

              {cart.map((item, i) => (
                <div key={i} className="summary-item">
                  <span>{item.title}</span>
                  <span>{item.qty} × ₹{item.price}</span>
                  <span>₹{item.qty * item.price}</span>
                </div>
              ))}

              <div className="summary-divider"></div>

              <div className="summary-total">
                <span>Total Tickets</span>
                <span>{totalTickets}</span>
              </div>

              <div className="summary-total">
                <span>Total Amount</span>
                <span>₹{total}</span>
              </div>

            </div>

          )}

        </div>

      </div>

      {/* CALENDAR */}
      {showCalendar && (
        <div className="calendar-modal">
          <div className="calendar-card">

            <Calendar
              minDate={new Date()} /* 🔥 FIX */
              onChange={(date: any) => {
                const d = new Date(date).toISOString().split("T")[0];
                setVisitDate(d);
                setShowCalendar(false);
              }}
            />

            <button
              className="calendar-close"
              onClick={() => setShowCalendar(false)}
            >
              ✖ Close
            </button>

          </div>
        </div>
      )}

      {/* STICKY */}
      <div className="sticky-booking-bar">

        <div className="sticky-left">

          <div className="sticky-info">
            <span className="sticky-total">₹{total}</span>
            <span className="sticky-items">{totalTickets} tickets</span>
          </div>

          <div
            className="date-box"
            onClick={() => setShowCalendar(true)}
          >
            {visitDate ? `📅 ${visitDate}` : "Select Date"}
          </div>

        </div>

        <button
          onClick={handleBooking}
          className="sticky-book-btn"
          disabled={loading}
        >
          {loading ? "Processing..." : "Book Now 🎟"}
        </button>

      </div>

    </div>
  );
}