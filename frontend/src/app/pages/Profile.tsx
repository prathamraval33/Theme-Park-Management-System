import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import jsPDF from "jspdf";
import Swal from "sweetalert2";

import { io } from "socket.io-client";

import "../../styles/Profile.css";

export function Profile() {

  const [bookings,    setBookings]    = useState<any[]>([]);
  const [foodOrders,  setFoodOrders]  = useState<any[]>([]);
  const [filterDate,  setFilterDate]  = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [profilePic,  setProfilePic]  = useState("");
  const [editMode,    setEditMode]    = useState(false);
  const [name,        setName]        = useState("");
  const [loadingBook, setLoadingBook] = useState(true);
  const [loadingFood, setLoadingFood] = useState(true);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  /* ===== FETCH USER PROFILE ===== */
  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/user/${user.email}`);
      setProfilePic(res.data.profilePic || "");
      setName(res.data.name || user.name || "");
    } catch (err) {
      console.log("User fetch error:", err);
      setName(user?.name || "");
    }
  };

  /* ===== FETCH BOOKINGS ===== */
  const fetchRideBookings = async () => {
    try {
      setLoadingBook(true);
      const res = await axios.get(
        `http://localhost:5000/api/booking/user/${encodeURIComponent(user.email)}`
      );
      setBookings(res.data || []);
    } catch (err) {
      console.log("Booking fetch error:", err);
      setBookings([]);
    } finally {
      setLoadingBook(false);
    }
  };

  /* ===== FETCH FOOD ORDERS ===== */
  const fetchFoodOrders = async () => {
    try {
      setLoadingFood(true);
      const res = await axios.get(
        `http://localhost:5000/api/foodorders/user/${encodeURIComponent(user.email)}`
      );
      setFoodOrders(res.data || []);
    } catch (err) {
      console.log("Food orders fetch error:", err);
      setFoodOrders([]);
    } finally {
      setLoadingFood(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchUserProfile();
      fetchRideBookings();
      fetchFoodOrders();
    }
  }, []);
    /* ===== REFUND REQUEST ===== */
  const handleRefundRequest = async (bookingId: string, visitDate: string) => {

    const today = new Date();
    const visit = new Date(visitDate);

    const diffDays =
      (visit.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

    if (diffDays < 2) {
      Swal.fire({
        icon: "warning",
        title: "Refund Not Allowed",
        text: "Refund can only be requested at least 2 days before your visit date.",
        confirmButtonColor: "#ff7a18",
        background: "#0a0f2c",
        color: "#fff"
      });
      return;
    }

    const result = await Swal.fire({
      title: "Request Refund?",
      text: "This booking will be cancelled and refund process will begin.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Refund",
      cancelButtonText: "No",
      confirmButtonColor: "#ff3c8e",
      cancelButtonColor: "#6b7280",
      background: "#0a0f2c",
      color: "#fff"
    });

    if (!result.isConfirmed) return;

    try {

      await axios.put(
        `http://localhost:5000/api/booking/refund/${bookingId}`
      );

      Swal.fire({
        icon: "success",
        title: "Refund Requested",
        text: "Refund processed successfully. Confirmation email sent.",
        confirmButtonColor: "#ff7a18",
        background: "#0a0f2c",
        color: "#fff"
      });

      fetchRideBookings();

    } catch (err: any) {

      Swal.fire({
        icon: "error",
        title: "Refund Failed",
        text:
          err.response?.data?.message ||
          "Something went wrong.",
        confirmButtonColor: "#ff7a18",
        background: "#0a0f2c",
        color: "#fff"
      });

    }
  };

  /* ===== LOGOUT ===== */
  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  /* ===== IMAGE UPLOAD ===== */
  const handleImageUpload = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result as string;
      try {
        const res = await axios.put("http://localhost:5000/api/user/update-profile", {
          email:      user.email,
          name,
          profilePic: base64Image
        });
        setProfilePic(res.data.user.profilePic);
      } catch {
        alert("Upload failed");
      }
    };
    reader.readAsDataURL(file);
  };

  /* ===== SAVE NAME ===== */
  const saveProfile = async () => {
    try {
      const res = await axios.put("http://localhost:5000/api/user/update-profile", {
        email: user.email,
        name,
        profilePic
      });
      setName(res.data.user.name);
      setEditMode(false);
    } catch {
      alert("Update failed");
    }
  };

  /* ===== PDF DOWNLOAD ===== */
  const downloadPDF = (data: any, type: "ticket" | "food") => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Theme Park Receipt", 20, 20);
    doc.setFontSize(12);
    doc.text(`Name: ${name}`, 20, 40);
    doc.text(`Email: ${user.email}`, 20, 50);

    let y = 65;

    if (type === "ticket") {
      // use visit_date (new schema) with fallback to booking_date (old)
      const dateVal = data.visit_date || data.booking_date;
      doc.text(`Visit Date: ${new Date(dateVal).toDateString()}`, 20, y);
      y += 10;
      doc.text(`Booking ID: ${data.booking_id || data._id}`, 20, y);
      y += 10;
      doc.text(`Ticket Type: ${data.ticket_type || "—"}`, 20, y);
      y += 10;
      doc.text(`Quantity: ${data.quantity || "—"}`, 20, y);
      y += 10;
    } else {
      doc.text(`Date: ${new Date(data.createdAt).toDateString()}`, 20, y);
      y += 10;
      doc.text("Items:", 20, y);
      y += 10;
      (data.items || []).forEach((item: any) => {
        doc.text(`  ${item.name || item.food_name} x${item.quantity}`, 20, y);
        y += 8;
      });
    }

    doc.text(`Total: ₹${data.total_amount}`, 20, y + 5);

    if (data.qr_code) {
      doc.addImage(data.qr_code, "PNG", 20, y + 15, 60, 60);
    }

    doc.save(type === "ticket" ? "ticket.pdf" : "food_receipt.pdf");
  };

  /* ===== FILTER ===== */
  // new schema uses visit_date; old bookings may use booking_date — handle both
  const filteredBookings = bookings.filter(b => {
    if (!filterDate) return true;
    const d = b.visit_date || b.booking_date || "";
    return d.slice(0, 10) === filterDate;
  });

  const filteredFoodOrders = foodOrders.filter(o =>
    !filterDate || (o.createdAt || "").slice(0, 10) === filterDate
  );

  if (!user) return <p style={{ color: "white", padding: 40 }}>Please login first</p>;

  return (
    <div className="profile-page">

      {/* HEADER */}
      <div className="profile-header">
        <button className="home-btn" onClick={() => navigate("/")}>← Home</button>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </div>

      {/* USER CARD */}
      <div className="user-glass-card">
        <div className="profile-pic-wrapper">
          <img
            src={profilePic || "https://via.placeholder.com/90"}
            className="profile-pic"
            alt="profile"
          />
          <input type="file" id="upload" hidden onChange={handleImageUpload} />
          <label htmlFor="upload" className="upload-btn">+</label>
        </div>

        {editMode ? (
          <input
            value={name}
            onChange={e => setName(e.target.value)}
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
          <div className="date-box" onClick={() => setShowCalendar(true)}>
            {filterDate ? `📅 ${filterDate}` : "Filter by Date"}
          </div>
          {filterDate && (
            <button className="reset-btn" onClick={() => setFilterDate("")}>
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
            <button className="calendar-close" onClick={() => setShowCalendar(false)}>
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

          {loadingBook ? (
            <p className="empty">Loading...</p>
          ) : filteredBookings.length === 0 ? (
            <p className="empty">No bookings found</p>
          ) : (
            filteredBookings.map((b, i) => {
              const dateVal = b.visit_date || b.booking_date;
              return (
                <motion.div
                  key={i}
                  className="booking-card"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div>
                    {b.booking_id && (
                      <p><strong>ID:</strong> {b.booking_id}</p>
                    )}
                    <p><strong>Visit Date:</strong> {new Date(dateVal).toDateString()}</p>
                    {b.ticket_type && (
                      <p><strong>Type:</strong> {b.ticket_type} × {b.quantity}</p>
                    )}
                    {b.notes && (
                      <p style={{ fontSize: 12, opacity: 0.6 }}>{b.notes}</p>
                    )}
                    <p><strong>Total:</strong> ₹{b.total_amount}</p>
                    <p>
                      <strong>Status:</strong>&nbsp;
                      <span style={{
                        color: b.status === "Validated" ? "#00ffae" :
                               b.status === "Cancelled" ? "#ff4d4d" :
                               b.status === "Refunded"  ? "#ffc107" : "#bfc4ff"
                      }}>
                        {b.status || "Confirmed"}
                      </span>
                    </p>
                    <button
                      className="download-btn"
                      onClick={() => downloadPDF(b, "ticket")}
                    >
                      Download Ticket
                    </button>
                    <br></br>
                     <button
  className="refund-btn"
  onClick={() =>
    handleRefundRequest(
      b._id,
      b.visit_date || b.booking_date
    )
  }
>
  Request Refund
</button>
                  </div>
                 

                  {b.qr_code && (
                    <img src={b.qr_code} className="qr-image" alt="QR" />
                  )}
                </motion.div>
              );
            })
          )}
        </div>

        {/* FOOD ORDERS */}
        <div className="profile-section">
          <h3>🍔 Food Orders</h3>

          {loadingFood ? (
            <p className="empty">Loading...</p>
          ) : filteredFoodOrders.length === 0 ? (
            <p className="empty">No food orders found</p>
          ) : (
            filteredFoodOrders.map((o, i) => (
              <motion.div
                key={i}
                className="booking-card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div>
                  <p><strong>Date:</strong> {new Date(o.createdAt).toDateString()}</p>

                  {(o.items || []).map((item: any, index: number) => (
                    <p key={index}>
                      {item.name || item.food_name} × {item.quantity}
                    </p>
                  ))}

                  <p><strong>Total:</strong> ₹{o.total_amount}</p>
                  <p>
                    <strong>Status:</strong>&nbsp;
                    <span style={{
                      color: o.status === "Delivered"  ? "#00ffae" :
                             o.status === "Cancelled"  ? "#ff4d4d" :
                             o.status === "Prepared"   ? "#bfc4ff" : "#ffc107"
                    }}>
                      {o.status || "Preparing"}
                    </span>
                  </p>

                  <button
                    className="download-btn"
                    onClick={() => downloadPDF(o, "food")}
                  >
                    Download Receipt
                  </button>
                </div>

                {o.qr_code && (
                  <img src={o.qr_code} className="qr-image" alt="QR" />
                )}
              </motion.div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}