import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../../styles/ticket.css";

interface Ride {
  _id: string;
  ride_name: string;
  price: number;
}

export function TicketBooking() {
  const { id } = useParams(); // ride id from URL

  const [ride, setRide] = useState<Ride | null>(null);
  const [visitDate, setVisitDate] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (id) fetchRide();
  }, [id]);

  const fetchRide = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/rides/${id}`
      );
      setRide(res.data);
    } catch (error) {
      console.error("Error fetching ride:", error);
      setError("Ride not found");
    }
  };

  const totalPrice = ride ? ride.price * quantity : 0;

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

    if (!ride) {
      setError("Ride not available");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/booking/create",
        {
          user_id: user._id, // ✅ FIXED HERE
          ride_id: ride._id,
          booking_date: visitDate,
          ticket_quantity: quantity,
          total_amount: totalPrice,
          payment_status: "Paid"
        }
      );

      setQrCode(response.data.qr_code);
      setSuccess("Ticket booked successfully!");

      setVisitDate("");
      setQuantity(1);

    } catch (error: any) {
      setError(error.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ticket-page">
      <div className="ticket-container">
        <h2 className="ticket-title">
          Book Ticket {ride && `for ${ride.ride_name}`}
        </h2>

        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}

        <div className="ticket-grid">

          <div className="ticket-box">
            <h3>Ticket Details</h3>

            {ride && (
              <p style={{ fontWeight: "bold", marginBottom: "10px" }}>
                Price per ticket: ₹{ride.price}
              </p>
            )}

            <form onSubmit={handleSubmit} className="ticket-form">

              <label>Visit Date</label>
              <input
                type="date"
                min={today}
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                required
              />

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