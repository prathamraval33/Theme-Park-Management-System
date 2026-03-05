import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../../styles/profile.css";

interface RideBooking {
  booking_date: string;
  ticket_quantity: number;
  total_amount: number;
  payment_status: string;
  qr_code: string;
}

interface FoodOrder {
  items: {
    food_name: string;
    quantity: number;
    price: number;
  }[];
  total_amount: number;
  qr_code: string;
  createdAt: string;
}

export function Profile() {

  const [bookings, setBookings] = useState<RideBooking[]>([]);
  const [foodOrders, setFoodOrders] = useState<FoodOrder[]>([]);
  const [filterDate, setFilterDate] = useState("");

  const navigate = useNavigate();

  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  useEffect(() => {

    if (user?.email) {

      fetchRideBookings();
      fetchFoodOrders();

    }

  }, []);

  const fetchRideBookings = async () => {

    const res = await axios.get(
      `http://localhost:5000/api/booking/user/${user.email}`
    );

    setBookings(res.data);

  };

  const fetchFoodOrders = async () => {

    const res = await axios.get(
      `http://localhost:5000/api/foodorders/user/${user.email}`
    );

    setFoodOrders(res.data);

  };

  const logout = () => {

    localStorage.removeItem("user");
    navigate("/login");

  };

  if (!user) {
    return <p>Please login first</p>;
  }

  /* DATE FILTER */

  const filteredBookings = bookings.filter(b =>
    !filterDate ||
    b.booking_date.slice(0,10) === filterDate
  );

  const filteredFoodOrders = foodOrders.filter(o =>
    !filterDate ||
    o.createdAt.slice(0,10) === filterDate
  );

  return (

    <div className="profile-page">

      {/* TOP BUTTONS */}

      <button
        className="home-btn"
        onClick={() => navigate("/")}
      >
        ← Home
      </button>

      <button
        className="logout-btn"
        onClick={logout}
      >
        Logout
      </button>

      {/* USER INFO GLASS CARD */}

      <div className="user-glass-card">

        <h2>{user.name}</h2>
        <p>{user.email}</p>

        <span className="role-badge">
          {user.role}
        </span>

      </div>

      {/* DATE FILTER */}

      <div className="filter-box">

        <label>Filter by date</label>

        <input
          type="date"
          value={filterDate}
          onChange={(e) =>
            setFilterDate(e.target.value)
          }
        />

      </div>

      {/* SPLIT VIEW */}

      <div className="profile-split">

        {/* RIDE BOOKINGS */}

        <div className="profile-section">

          <h3>🎢 Ride Bookings</h3>

          {filteredBookings.length === 0 ? (
            <p className="empty">No bookings</p>
          ) : (

            filteredBookings.map((b,i)=>(

              <motion.div
                key={i}
                className="booking-card"
                whileHover={{scale:1.03}}
              >

                <div>

                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(b.booking_date).toDateString()}
                  </p>

                  <p>
                    <strong>Tickets:</strong> {b.ticket_quantity}
                  </p>

                  <p>
                    <strong>Total:</strong> ₹{b.total_amount}
                  </p>

                  <span className={`status ${b.payment_status}`}>
                    {b.payment_status}
                  </span>

                </div>

                {b.qr_code && (
                  <img
                    src={b.qr_code}
                    className="qr-image"
                  />
                )}

              </motion.div>

            ))

          )}

        </div>

        {/* FOOD ORDERS */}

        <div className="profile-section">

          <h3>🍔 Food Orders</h3>

          {filteredFoodOrders.length === 0 ? (
            <p className="empty">No food orders</p>
          ) : (

            filteredFoodOrders.map((o,i)=>(

              <motion.div
                key={i}
                className="booking-card"
                whileHover={{scale:1.03}}
              >

                <div>

                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(o.createdAt).toDateString()}
                  </p>

                  {o.items.map((item,index)=>(
                    <p key={index}>
                      {item.food_name} × {item.quantity}
                    </p>
                  ))}

                  <p>
                    <strong>Total:</strong> ₹{o.total_amount}
                  </p>

                </div>

                {o.qr_code && (
                  <img
                    src={o.qr_code}
                    className="qr-image"
                  />
                )}

              </motion.div>

            ))

          )}

        </div>

      </div>

    </div>

  );

}