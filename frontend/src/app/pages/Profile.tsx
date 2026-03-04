import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../../styles/profile.css";

interface BookingItem {
  title: string;
  qty: number;
  price: number;
}

interface Booking {
  booking_date: string;
  items: BookingItem[];
  total_amount: number;
  payment_status: string;
  qr_code: string;
}

export function Profile() {

  const [bookings, setBookings] = useState<Booking[]>([]);
  const navigate = useNavigate();

  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  /* ========================== */
  /* FETCH BOOKINGS */
  /* ========================== */

  useEffect(() => {

    if (user?.email) {
      fetchBookings();
    }

  }, []);

  const fetchBookings = async () => {

    try {

      const res = await axios.get(
        `http://localhost:5000/api/booking/user/${user.email}`
      );

      console.log("Bookings:", res.data);

      setBookings(res.data);

    } catch (error) {

      console.error("Error loading bookings", error);

    }

  };

  /* ========================== */
  /* LOGOUT */
  /* ========================== */

  const logout = () => {

    localStorage.removeItem("user");
    navigate("/login");

  };

  if (!user) {
    return <p className="profile-message">Please login first.</p>;
  }

  return (

    <div className="profile-page">

      {/* HEADER ACTIONS */}

      <div className="profile-actions">

        <button onClick={() => navigate("/")}>
          ← Back Home
        </button>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>

      </div>


      {/* PROFILE CARD */}

      <motion.div
        className="profile-card"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >

        <h2>👤 {user.name}</h2>

        <p>{user.email}</p>

        <span className="role-badge">
          {user.role}
        </span>

      </motion.div>


      {/* BOOKINGS */}

      <h2 className="ticket-title">🎟 My Bookings</h2>

      {bookings.length === 0 ? (

        <p className="profile-message">
          No bookings found.
        </p>

      ) : (

        <div className="ticket-grid">

          {bookings.map((booking, index) => (

            <motion.div
              key={index}
              className="ticket-card"
              whileHover={{ scale: 1.03 }}
            >

              <div className="ticket-info">

                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(booking.booking_date).toDateString()}
                </p>

                <p>
                  <strong>Total:</strong> ₹{booking.total_amount}
                </p>

                <span className={`status ${booking.payment_status}`}>
                  {booking.payment_status}
                </span>


                {/* ITEMS */}

                <div className="ticket-items">

                  {booking.items.map((item, i) => (

                    <p key={i}>

                      {item.title} → {item.qty} × ₹{item.price}

                    </p>

                  ))}

                </div>

              </div>


              {/* QR */}

              {booking.qr_code && (

                <img
                  src={booking.qr_code}
                  alt="QR Code"
                  className="qr-image"
                />

              )}

            </motion.div>

          ))}

        </div>

      )}

    </div>

  );

}