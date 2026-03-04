import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "../../styles/ticket.css";

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
  const [qrCode, setQrCode] = useState("");

  const today = new Date().toISOString().split("T")[0];

  /* ============================ */
  /* TICKET PLANS */
  /* ============================ */

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

  /* ============================ */
  /* UPDATE CART */
  /* ============================ */

  const updateCart = (plan: Plan, qty: number) => {

    if (qty <= 0) {
      setCart(cart.filter((item) => item.title !== plan.title));
      return;
    }

    const newItem: CartItem = {
      title: plan.title,
      price: plan.price,
      qty
    };

    const exists = cart.find((item) => item.title === plan.title);

    if (exists) {

      setCart(
        cart.map((item) =>
          item.title === plan.title ? newItem : item
        )
      );

    } else {

      setCart([...cart, newItem]);

    }

  };

  /* ============================ */
  /* TOTAL PRICE */
  /* ============================ */

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  /* ============================ */
  /* BOOK TICKET */
  /* ============================ */

  const handleBooking = async () => {

    const userData = localStorage.getItem("user");

    if (!userData) {
      alert("Please login first");
      return;
    }

    const user = JSON.parse(userData);

    if (!user.email) {
      alert("Session expired. Please login again.");
      return;
    }

    if (!visitDate) {
      alert("Please select visit date");
      return;
    }

    if (cart.length === 0) {
      alert("Please select tickets");
      return;
    }

    const cleanItems = cart.map((item) => ({
      title: item.title,
      qty: item.qty,
      price: item.price
    }));

    console.log("Booking Request:", {
      email: user.email,
      booking_date: visitDate,
      items: cleanItems,
      total_amount: total
    });

    setLoading(true);

    try {

      const res = await axios.post(
        "http://localhost:5000/api/booking/create",
        {
          email: user.email,
          booking_date: visitDate,
          items: cleanItems,
          total_amount: total,
          payment_status: "Paid"
        }
      );

      setQrCode(res.data.qr_code);

      alert("Booking Successful 🎉");

    } catch (error: any) {

      console.log("Booking Error:", error);
      console.log("Server Response:", error.response?.data);

      alert(error.response?.data?.message || "Booking failed");

    } finally {

      setLoading(false);

    }

  };

  /* ============================ */
  /* UI */
  /* ============================ */

  return (

    <div className="ticket-page">

      <h2 className="ticket-title">🎟 Theme Park Ticket Booking</h2>

      {/* ============================ */}
      {/* PLAN GRID */}
      {/* ============================ */}

      <div className="plan-grid">

        {plans.map((plan, index) => (

          <motion.div
            key={index}
            className={`plan-card ${
              cart.some((c) => c.title === plan.title)
                ? "selected"
                : ""
            }`}
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
              placeholder="Add quantity"
              onChange={(e) =>
                updateCart(plan, parseInt(e.target.value) || 0)
              }
            />

          </motion.div>

        ))}

      </div>


      {/* ============================ */}
      {/* BOOKING SUMMARY */}
      {/* ============================ */}

      <div className="booking-summary">

        <h3>🧾 Booking Summary</h3>

        {cart.length === 0 ? (
          <p className="empty-msg">No tickets selected</p>
        ) : (
          cart.map((item, i) => (
            <div key={i} className="summary-item">
              <span>{item.title}</span>
              <span>{item.qty} × ₹{item.price}</span>
              <span>₹{item.qty * item.price}</span>
            </div>
          ))
        )}

        <div className="summary-divider"></div>

        <div className="summary-total">
          <span>Total</span>
          <span>₹{total}</span>
        </div>

        <label>Select Visit Date</label>

        <input
          type="date"
          min={today}
          value={visitDate}
          onChange={(e) => setVisitDate(e.target.value)}
        />

      </div>


      {/* ============================ */}
      {/* QR CODE TICKET */}
      {/* ============================ */}

      {qrCode && (

        <div className="qr-section">

          <h3>Your Ticket</h3>

          <img
            src={qrCode}
            alt="QR Ticket"
            className="qr-img"
          />

        </div>

      )}


      {/* ============================ */}
      {/* STICKY BOOKING BAR */}
      {/* ============================ */}

      <div className="sticky-booking-bar">

        <div className="sticky-info">

          <span className="sticky-total">
            Total: ₹{total}
          </span>

          <span className="sticky-items">
            {cart.length} ticket types selected
          </span>

        </div>

        <button
          onClick={handleBooking}
          className="sticky-book-btn"
          disabled={loading || cart.length === 0 || !visitDate}
        >
          {loading ? "Processing..." : "Book Tickets 🎟"}
        </button>

      </div>

    </div>

  );
}