import { useState } from "react";
import axios from "axios";
import "../../styles/ticket.css";

export function TicketBooking() {

  const [visitDate, setVisitDate] = useState("");
  const [ticketType, setTicketType] = useState("Adult");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const prices: { [key: string]: number } = {
    Adult: 1200,
    Child: 800,
    VIP: 2500,
  };

  const totalPrice = prices[ticketType] * quantity;
  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const userData = localStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;

    if (!user) {
      setError("Please login first");
      return;
    }

    if (!visitDate) {
      setError("Please select visit date");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/booking/create",
        {
          user_id: user.user_id,
          booking_date: visitDate,
          ticket_quantity: quantity,
          total_amount: totalPrice,
          payment_status: "Paid"
        }
      );

      setQrCode(response.data.qr_code);
      setSuccess("Ticket booked successfully!");

      setVisitDate("");
      setTicketType("Adult");
      setQuantity(1);

    } catch (error) {
      setError("Booking failed. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="ticket-page">
      <div className="ticket-container">
        <h2 className="ticket-title">Book Your Tickets</h2>

        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}

        <div className="ticket-grid">

          <div className="ticket-box">
            <h3>Ticket Details</h3>

            <form onSubmit={handleSubmit} className="ticket-form">

              <label>Visit Date</label>
              <input
                type="date"
                min={today}
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

              <button type="submit" disabled={loading} className="book-btn">
                {loading ? "Booking..." : "Book Ticket"}
              </button>

            </form>
          </div>

          <div className="qr-box">
            <h3>QR Code Ticket</h3>

            {qrCode ? (
              <img src={qrCode} alt="QR Code" className="qr-img" />
            ) : (
              <div className="qr-placeholder">
                QR Code will appear here after booking
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
