import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import jsPDF from "jspdf";
import "../../styles/Profile.css";

export function Profile() {

  const [bookings, setBookings] = useState<any[]>([]);
  const [foodOrders, setFoodOrders] = useState<any[]>([]);
  const [filterDate, setFilterDate] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);

  const [profilePic, setProfilePic] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  /* ================= FETCH USER ================= */

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/user/${user.email}`
      );

      setProfilePic(res.data.profilePic || "");
      setName(res.data.name || user.name);

    } catch (err) {
      console.log("User fetch error");
    }
  };

  /* ================= FETCH BOOKINGS ================= */

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

  useEffect(() => {
    if (user?.email) {
      fetchUserProfile();   // 🔥 NEW
      fetchRideBookings();
      fetchFoodOrders();
    }
  }, []);

  /* ================= LOGOUT ================= */

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  /* ================= IMAGE UPLOAD ================= */

  const handleImageUpload = (e: any) => {

    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = async () => {

      const base64Image = reader.result as string;

      try {

        const res = await axios.put(
          "http://localhost:5000/api/user/update-profile",
          {
            email: user.email,
            name,
            profilePic: base64Image
          }
        );

        setProfilePic(res.data.user.profilePic);

      } catch {
        alert("Upload failed");
      }

    };

    reader.readAsDataURL(file);
  };

  /* ================= SAVE NAME ================= */

  const saveProfile = async () => {

    try {

      const res = await axios.put(
        "http://localhost:5000/api/user/update-profile",
        {
          email: user.email,
          name,
          profilePic
        }
      );

      setName(res.data.user.name);
      setEditMode(false);

    } catch {
      alert("Update failed");
    }
  };

  /* ================= PDF ================= */

  const downloadPDF = (data: any, type: "ticket" | "food") => {

    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Theme Park Receipt", 20, 20);

    doc.setFontSize(12);
    doc.text(`Name: ${name}`, 20, 40);
    doc.text(`Email: ${user.email}`, 20, 50);

    let y = 60;

    if (type === "ticket") {
      doc.text(`Date: ${new Date(data.booking_date).toDateString()}`, 20, y);
      y += 10;
    } else {
      doc.text(`Date: ${new Date(data.createdAt).toDateString()}`, 20, y);
      y += 10;

      doc.text("Items:", 20, y);
      y += 10;

      data.items.forEach((item: any) => {
        doc.text(`${item.food_name} x${item.quantity}`, 20, y);
        y += 8;
      });
    }

    doc.text(`Total: ₹${data.total_amount}`, 20, y + 5);

    if (data.qr_code) {
      doc.addImage(data.qr_code, "PNG", 20, y + 15, 60, 60);
    }

    doc.save(type === "ticket" ? "ticket.pdf" : "food_receipt.pdf");
  };

  /* ================= FILTER ================= */

  const filteredBookings = bookings.filter(b =>
    !filterDate || b.booking_date.slice(0, 10) === filterDate
  );

  const filteredFoodOrders = foodOrders.filter(o =>
    !filterDate || o.createdAt.slice(0, 10) === filterDate
  );

  if (!user) return <p>Please login first</p>;

  return (

    <div className="profile-page">

      {/* HEADER */}
      <div className="profile-header">

        <button className="home-btn" onClick={() => navigate("/")}>
          ← Home
        </button>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>

      </div>

      {/* USER CARD */}
      <div className="user-glass-card">

        <div className="profile-pic-wrapper">

          <img
            src={profilePic || "https://via.placeholder.com/90"}
            className="profile-pic"
          />

          <input
            type="file"
            id="upload"
            hidden
            onChange={handleImageUpload}
          />

          <label htmlFor="upload" className="upload-btn">
            +
          </label>

        </div>

        {editMode ? (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="glass-input"
          />
        ) : (
          <h2>{name}</h2>
        )}

        <p>{user.email}</p>

        <span className="role-badge">{user.role}</span>

        <button
          className="edit-btn"
          onClick={() => editMode ? saveProfile() : setEditMode(true)}
        >
          {editMode ? "Save Profile" : "Edit Profile"}
        </button>

      </div>

      {/* DATE FILTER */}
      <div className="filter-box">

  <div className="filter-actions">

    <div
      className="date-box"
      onClick={() => setShowCalendar(true)}
    >
      {filterDate || "Select Date"}
    </div>

    {/* 🔥 RESET BUTTON */}
    {filterDate && (
      <button
        className="reset-btn"
        onClick={() => setFilterDate("")}
      >
        Reset ✖
      </button>
    )}

  </div>

</div>

      {/* CALENDAR */}
      {showCalendar && (
        <div className="calendar-modal">
          <div className="calendar-card">

            <Calendar
              onChange={(date: any) => {
                const d = new Date(date).toISOString().split("T")[0];
                setFilterDate(d);
                setShowCalendar(false);
              }}
            />

            <button
              className="calendar-close"
              onClick={() => setShowCalendar(false)}
            >
              Close
            </button>

          </div>
        </div>
      )}

      {/* SPLIT */}
      <div className="profile-split">

        {/* BOOKINGS */}
        <div className="profile-section">

          <h3>🎢 Ride Bookings</h3>

          {filteredBookings.length === 0 ? (
            <p className="empty">No bookings</p>
          ) : (

            filteredBookings.map((b, i) => (
              <motion.div key={i} className="booking-card">

                <div>
                  <p><strong>Date:</strong> {new Date(b.booking_date).toDateString()}</p>
                  <p><strong>Total:</strong> ₹{b.total_amount}</p>
{/*<span className={`status ${b.payment_status}`}>
                    {b.payment_status}
                  </span>*/}
                  

                  <button
                    className="download-btn"
                    onClick={() => downloadPDF(b, "ticket")}
                  >
                    Download Ticket
                  </button>
                </div>

                {b.qr_code && (
                  <img src={b.qr_code} className="qr-image" />
                )}

              </motion.div>
            ))

          )}

        </div>

        {/* FOOD */}
        <div className="profile-section">

          <h3>🍔 Food Orders</h3>

          {filteredFoodOrders.length === 0 ? (
            <p className="empty">No food orders</p>
          ) : (

            filteredFoodOrders.map((o, i) => (
              <motion.div key={i} className="booking-card">

                <div>
                  <p><strong>Date:</strong> {new Date(o.createdAt).toDateString()}</p>

                  {o.items.map((item: any, index: number) => (
                    <p key={index}>
                      {item.food_name} × {item.quantity}
                    </p>
                  ))}

                  <p><strong>Total:</strong> ₹{o.total_amount}</p>

                  <button
                    className="download-btn"
                    onClick={() => downloadPDF(o, "food")}
                  >
                    Download Receipt
                  </button>
                </div>

                {o.qr_code && (
                  <img src={o.qr_code} className="qr-image" />
                )}

              </motion.div>
            ))

          )}

        </div>

      </div>

    </div>
  );
}