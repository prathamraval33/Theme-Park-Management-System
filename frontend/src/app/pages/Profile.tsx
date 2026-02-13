import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/profile.css";

interface Booking {
  booking_date: string;
  ticket_quantity: number;
  total_amount: number;
  payment_status: string;
  qr_code: string;
}

export function Profile() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  useEffect(() => {
    if (user && user.user_id) {
      fetchBookings();
    }
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/booking/user/${user.user_id}`
      );
      console.log("Bookings:", res.data); // debug
      setBookings(res.data);
    } catch (error) {
      console.error("Error loading bookings", error);
    }
  };

  if (!user) {
    return <p className="profile-message">Please login first.</p>;
  }

  return (
    <div className="profile-page">
      <h2 className="profile-title">My Profile</h2>

      <div className="profile-card">
        <h3>Welcome, {user.name}</h3>
        <p>Email: {user.email}</p>
        <p>Role: {user.role}</p>
      </div>

      <h2 className="ticket-title">My Tickets</h2>

      {bookings.length === 0 ? (
        <p className="profile-message">No bookings found.</p>
      ) : (
        bookings.map((booking, index) => (
          <div key={index} className="ticket-card">
            <div className="ticket-info">
              <p><strong>Date:</strong> {booking.booking_date}</p>
              <p><strong>Tickets:</strong> {booking.ticket_quantity}</p>
              <p><strong>Total:</strong> ₹{booking.total_amount}</p>
              <p><strong>Status:</strong> {booking.payment_status}</p>
            </div>

            {booking.qr_code && (
              <img
                src={booking.qr_code}
                alt="QR Code"
                className="qr-image"
              />
            )}
          </div>
        ))
      )}
    </div>
  );
}
