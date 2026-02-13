import { useState } from "react";
import axios from "axios";
import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import "../../styles/ticket.css";

export function TicketBooking() {
  
  const [visitDate, setVisitDate] = useState("");
  const [ticketType, setTicketType] = useState("Adult");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState("");

  const prices: { [key: string]: number } = {
    Adult: 1200,
    Child: 800,
    VIP: 2500,
  };

  const totalPrice = prices[ticketType] * quantity;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const userData = localStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;

    if (!user) {
      alert("Please login first");
      return;
    }

    if (!visitDate) {
      alert("Please select visit date");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/booking/create", {
        user_id: user.user_id,
        booking_date: visitDate,
        ticket_quantity: quantity,
        total_amount: totalPrice,
        payment_status: "Paid"
      });

      // Save QR code from backend
      setQrCode(response.data.qr_code);

      alert("Ticket booked successfully!");

      // Reset form
      setVisitDate("");
      setTicketType("Adult");
      setQuantity(1);

    } catch (error) {
      console.error(error);
      alert("Booking failed");
    }

    setLoading(false);
  };

  return (
    <div className="ticket-page">
      <Navigation />

      <div className="ticket-container">
        <h2 className="ticket-title">Book Your Tickets</h2>

        <div className="ticket-grid">

          {/* Ticket Form */}
          <div className="ticket-box">
            <h3>Ticket Details</h3>

            <form onSubmit={handleSubmit} className="ticket-form">

              <label>Visit Date</label>
              <input
                type="date"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                required
              />

              <label>Ticket Type</label>
              <select
                value={ticketType}
                onChange={(e) => setTicketType(e.target.value)}
              >
                <option value="Adult">Adult - ₹1200</option>
                <option value="Child">Child - ₹800</option>
                <option value="VIP">VIP - ₹2500</option>
              </select>

              <label>Quantity</label>
              <input
                type="number"
                min="1"
                max="10"
                value={quantity}
                onChange={(e) =>
                  setQuantity(parseInt(e.target.value) || 1)
                }
                required
              />

              <div className="total-box">
                Total Price: ₹{totalPrice}
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  background: "#ff7a18",
                  color: "white",
                  padding: "14px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  width: "100%"
                }}
              >
                {loading ? "Booking..." : "Book Ticket"}
              </button>

            </form>
          </div>

          {/* QR Section */}
          <div className="qr-box">
            <h3>QR Code Ticket</h3>

            {qrCode ? (
              <img
                src={qrCode}
                alt="QR Code"
                style={{ width: "180px", marginTop: "10px" }}
              />
            ) : (
              <div className="qr-placeholder">
                QR Code will appear here after booking
              </div>
            )}
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
