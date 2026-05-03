import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import { Html5QrcodeScanner } from "html5-qrcode";
import { socket } from "../../../socket";
import "../../../styles/TicketStaff.css";

/* ===== TYPES ===== */
type BookingStatus = "Confirmed" | "Cancelled" | "Refunded" | "Validated";
type TicketType    = "VIP" | "Normal";
type PaymentMethod = "Cash" | "UPI" | "Card";
type FilterType    = "All" | "VIP" | "Normal";
type DateFilter    = "all" | "today" | "week" | "month" | "year";
type TabType       = "dashboard" | "add" | "search" | "scanner" | "reports";

interface Booking {
  _id: string;
  booking_id: string;
  customer_name: string;
  email: string;
  phone?: string;
  ticket_type: TicketType;
  quantity: number;
  visit_date: string;
  payment_method: PaymentMethod;
  total_amount: number;
  qr_code: string;
  bookedBy: string;
  status: BookingStatus;
  checkedIn: boolean;
  validatedAt: string | null;
  notes: string;
  createdAt: string;
}

interface Stats {
  bookingsToday: number;
  revenueToday: number;
  bookingsAllTime: number;
  revenueAllTime: number;
  visitorsToday: number;
  visitorsAllTime: number;
  staffCreated: number;
  customerCreated: number;
}

const VIP_PRICE    = 1500;
const NORMAL_PRICE = 500;

const EMPTY_FORM = {
  customer_name: "",
  email:         "",
  ticket_type:   "Normal" as TicketType,
  quantity:      1,
  visit_date:    "",
  payment_method:"Cash" as PaymentMethod,
  notes:         ""
};

const fmtDate = (d: string) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const fmtDateTime = (d: string) =>
  d ? new Date(d).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "—";

const badgeCls: Record<BookingStatus, string> = {
  Confirmed: "ts-badge-confirmed",
  Validated: "ts-badge-validated",
  Cancelled: "ts-badge-cancelled",
  Refunded:  "ts-badge-refunded",
};

/* ===== SWEETALERT HELPERS ===== */
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2800,
  timerProgressBar: true,
  background: "#0d1530",
  color: "#fff",
});

const confirmDialog = (text: string) =>
  Swal.fire({
    title: "Are you sure?",
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, proceed",
    cancelButtonText:  "Cancel",
    background:        "#0d1530",
    color:             "#fff",
    confirmButtonColor:"#bfc4ff",
    cancelButtonColor: "rgba(255,77,77,0.4)",
  });

/* ===== DATE FILTER HELPER ===== */
const matchesDateFilter = (dateStr: string, df: DateFilter): boolean => {
  if (df === "all" || !dateStr) return true;
  const d = new Date(dateStr);
  const n = new Date();

  if (df === "today") {
    return d.toDateString() === n.toDateString();
  }
  if (df === "week") {
    const startOfWeek = new Date(n);
    startOfWeek.setDate(n.getDate() - n.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    return d >= startOfWeek;
  }
  if (df === "month") {
    return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear();
  }
  if (df === "year") {
    return d.getFullYear() === n.getFullYear();
  }
  return true;
};

/* ===== PDF GENERATOR ===== */
const downloadPDF = (bookings: Booking[], dateFilter: DateFilter, typeFilter: FilterType) => {
  const doc = new jsPDF();

  const labelMap: Record<DateFilter, string> = {
    all: "All Time", today: "Today", week: "This Week",
    month: "This Month", year: "This Year"
  };

  doc.setFontSize(18);
  doc.setTextColor(40, 40, 80);
  doc.text("Theme Park — Booking Report", 14, 18);

  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Period: ${labelMap[dateFilter]}   Type: ${typeFilter}`, 14, 26);
  doc.text(`Generated: ${new Date().toLocaleString("en-IN")}`, 14, 32);
  doc.text(`Total Records: ${bookings.length}`, 14, 38);

  const totalRev = bookings.reduce((s, b) => s + b.total_amount, 0);
  doc.text(`Total Revenue: ₹${totalRev}`, 14, 44);

  // table header
  let y = 54;
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.setFillColor(30, 30, 70);
  doc.rect(14, y - 5, 182, 8, "F");

  const cols = [14, 48, 90, 118, 136, 154, 172];
  const headers = ["Booking ID", "Name", "Type", "Amount", "Visit Date", "Status", "By"];
  headers.forEach((h, i) => doc.text(h, cols[i], y));

  y += 6;
  doc.setTextColor(30, 30, 30);

  bookings.forEach((b, idx) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    if (idx % 2 === 0) {
      doc.setFillColor(245, 245, 255);
      doc.rect(14, y - 4, 182, 8, "F");
    }

    doc.setFontSize(8);
    doc.text(b.booking_id || "—",                cols[0], y);
    doc.text((b.customer_name || "—").slice(0, 18), cols[1], y);
    doc.text(b.ticket_type   || "—",              cols[2], y);
    doc.text(`₹${b.total_amount}`,                cols[3], y);
    doc.text(fmtDate(b.visit_date),               cols[4], y);
    doc.text(b.status        || "—",              cols[5], y);
    doc.text(b.bookedBy === "TicketStaff" ? "Staff" : "User", cols[6], y);

    y += 8;
  });

  const filename = `bookings_${dateFilter}_${typeFilter}_${Date.now()}.pdf`;
  doc.save(filename);
};

/* ===== COMPONENT ===== */
export function TicketStaff() {

  const navigate = useNavigate();
  const [tab,      setTab]      = useState<TabType>("dashboard");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats,    setStats]    = useState<Stats | null>(null);
  const [filter,   setFilter]   = useState<FilterType>("All");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [form,     setForm]     = useState({ ...EMPTY_FORM });
  const [loading,  setLoading]  = useState(true);

  // search + edit
  const [searchQ,         setSearchQ]         = useState("");
  const [searchResults,   setSearchResults]   = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [editMode,        setEditMode]        = useState(false);
  const [editForm,        setEditForm]        = useState<Partial<Booking>>({});

  // scanner
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [scanning,       setScanning]       = useState(false);
  const [scannedBooking, setScannedBooking] = useState<Booking | null>(null);
  const [scanAlert,      setScanAlert]      = useState<{ type: "success"|"error"|"warning"; msg: string } | null>(null);

  // pagination
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  /* ===== FETCH ===== */
  const fetchAll = useCallback(async () => {
    try {
      const [bRes, sRes] = await Promise.all([
        axios.get("http://localhost:5000/api/bookings"),
        axios.get("http://localhost:5000/api/bookings/stats"),
      ]);
      setBookings(bRes.data || []);
      setStats(sRes.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  useEffect(() => {
    socket.on("bookingUpdated", fetchAll);
    return () => { socket.off("bookingUpdated", fetchAll); };
  }, [fetchAll]);

  /* ===== TOTAL AMOUNT ===== */
  const totalAmount = (form.ticket_type === "VIP" ? VIP_PRICE : NORMAL_PRICE) * form.quantity;

  /* ===== ADD BOOKING ===== */
  const handleAdd = async () => {
    if (!form.customer_name || !form.email || !form.visit_date) {
      Toast.fire({ icon: "error", title: "Fill all required fields" });
      return;
    }
    const res = await confirmDialog("This will create a new booking in the system.");
    if (!res.isConfirmed) return;
    try {
      await axios.post("http://localhost:5000/api/bookings/staff-create", {
        ...form,
        total_amount: totalAmount
      });
      Toast.fire({ icon: "success", title: "Booking created!" });
      setForm({ ...EMPTY_FORM });
      fetchAll();
    } catch (err: any) {
      Toast.fire({ icon: "error", title: err.response?.data?.message || "Failed" });
    }
  };

  /* ===== SEARCH ===== */
  const handleSearch = async () => {
    if (!searchQ.trim()) return;
    try {
      const res = await axios.get(
        `http://localhost:5000/api/bookings/search?q=${encodeURIComponent(searchQ)}`
      );
      setSearchResults(res.data || []);
      if ((res.data || []).length === 0) {
        Toast.fire({ icon: "info", title: "No results found" });
      }
    } catch {
      Toast.fire({ icon: "error", title: "Search failed" });
    }
  };

  /* ===== OPEN EDIT ===== */
  const openEdit = (b: Booking) => {
    setSelectedBooking(b);
    setEditForm({
      customer_name:  b.customer_name,
      email:          b.email,
      ticket_type:    b.ticket_type,
      quantity:       b.quantity,
      visit_date:     b.visit_date?.slice(0, 10),
      payment_method: b.payment_method,
      notes:          b.notes,
      total_amount:   b.total_amount,
    });
    setEditMode(true);
  };

  /* ===== SAVE EDIT ===== */
  const handleSaveEdit = async () => {
    if (!selectedBooking) return;
    const res = await confirmDialog("Save changes to this booking?");
    if (!res.isConfirmed) return;
    try {
      // recalculate total if type/qty changed
      const newTotal =
        ((editForm.ticket_type === "VIP" ? VIP_PRICE : NORMAL_PRICE)) *
        (editForm.quantity || 1);

      await axios.put(
        `http://localhost:5000/api/bookings/${selectedBooking._id}/edit`,
        { ...editForm, total_amount: newTotal }
      );
      Toast.fire({ icon: "success", title: "Booking updated!" });
      setEditMode(false);
      setSelectedBooking(null);
      fetchAll();
      if (searchQ) handleSearch();
    } catch (err: any) {
      Toast.fire({ icon: "error", title: err.response?.data?.message || "Update failed" });
    }
  };

  /* ===== CANCEL ===== */
  const handleCancel = async (id: string) => {
    const res = await confirmDialog("This booking will be marked as Cancelled.");
    if (!res.isConfirmed) return;
    try {
      await axios.put(`http://localhost:5000/api/bookings/${id}/cancel`);
      Toast.fire({ icon: "success", title: "Booking cancelled" });
      setSelectedBooking(null);
      setEditMode(false);
      fetchAll();
      if (searchQ) handleSearch();
    } catch (err: any) {
      Toast.fire({ icon: "error", title: err.response?.data?.message || "Failed" });
    }
  };

  /* ===== REFUND ===== */
  const handleRefund = async (id: string) => {
    const res = await confirmDialog("Mark this booking as Refunded?");
    if (!res.isConfirmed) return;
    try {
      await axios.put(`http://localhost:5000/api/bookings/${id}/refund`);
      Toast.fire({ icon: "success", title: "Marked as Refunded" });
      setSelectedBooking(null);
      setEditMode(false);
      fetchAll();
      if (searchQ) handleSearch();
    } catch (err: any) {
      Toast.fire({ icon: "error", title: err.response?.data?.message || "Failed" });
    }
  };

  /* ===== SCANNER ===== */
  const startScanner = () => {
    if (scannerRef.current) return;

    const scanner = new Html5QrcodeScanner(
      "ts-qr-reader",
      { fps: 10, qrbox: { width: 220, height: 220 } },
      false
    );

    scanner.render(
      async (decodedText) => {
        scanner.clear();
        scannerRef.current = null;
        setScanning(false);

        let booking_id: string | null = null;

        try {
          const parsed = JSON.parse(decodedText);
          booking_id = parsed.booking_id || null;
        } catch { /* not JSON */ }

        if (!booking_id) {
          const m1 = decodedText.match(/ID:\s*(BK-[\w-]+)/i);
          if (m1) booking_id = m1[1];
        }

        if (!booking_id) {
          const m2 = decodedText.match(/([a-f\d]{24})/i);
          if (m2) booking_id = m2[1];
        }

        if (!booking_id) {
          setScanAlert({ type: "error", msg: "❌ Invalid or unrecognized QR code" });
          return;
        }

        try {
          const res = await axios.get(
            `http://localhost:5000/api/bookings/find/${encodeURIComponent(booking_id)}`
          );
          setScannedBooking(res.data);
          setScanAlert(null);
        } catch (err: any) {
          if (err.response?.status === 404) {
            setScanAlert({ type: "error", msg: "❌ Booking not found in system" });
          } else {
            setScanAlert({ type: "error", msg: "❌ Failed to fetch booking details" });
          }
        }
      },
      () => { /* frame errors — ignore */ }
    );

    scannerRef.current = scanner;
    setScanning(true);
  };

  const stopScanner = () => {
    scannerRef.current?.clear().catch(() => {});
    scannerRef.current = null;
    setScanning(false);
  };

  useEffect(() => () => stopScanner(), []);

  /* ===== VALIDATE ===== */
  const handleValidate = async () => {
    if (!scannedBooking) return;
    const res = await confirmDialog("Validate this ticket and allow entry?");
    if (!res.isConfirmed) return;
    try {
      await axios.put(`http://localhost:5000/api/bookings/${scannedBooking._id}/validate`);
      Toast.fire({ icon: "success", title: "✅ Entry Validated!" });
      setScannedBooking(prev => prev ? { ...prev, status: "Validated", checkedIn: true } : null);
      setScanAlert({ type: "success", msg: "✅ Entry validated successfully" });
      fetchAll();
    } catch (err: any) {
      const msg = err.response?.data?.message;
      setScanAlert({
        type: "error",
        msg: msg === "already_used"    ? "⚠️ Ticket already used"         :
             msg === "expired"         ? "❌ Ticket expired"               :
             msg === "invalid_ticket"  ? "❌ Invalid or cancelled ticket"  :
                                        "❌ Validation failed"
      });
    }
  };

  /* ===== FILTERED BOOKINGS for reports ===== */
  const filtered = bookings.filter(b => {
    const typeOk = filter === "All" || b.ticket_type === filter;
    const dateOk = matchesDateFilter(b.visit_date, dateFilter);
    return typeOk && dateOk;
  });

  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  const navItems: { key: TabType; icon: string; label: string }[] = [
    { key: "dashboard", icon: "📊", label: "Dashboard"   },
    { key: "add",       icon: "➕", label: "Add Booking" },
    { key: "search",    icon: "🔍", label: "Search/Edit" },
    { key: "scanner",   icon: "📷", label: "QR Scanner"  },
    { key: "reports",   icon: "📋", label: "Reports"     },
  ];

  /* ===== RENDER ===== */
  return (
    <div className="ts-layout">

      {/* SIDEBAR */}
      <aside className="ts-sidebar">
        <div className="ts-logo">
          <span className="ts-logo-icon">🎟️</span>
          <span className="ts-logo-text">TicketOps</span>
        </div>

        <nav className="ts-nav">
          {navItems.map(item => (
            <div
              key={item.key}
              className={`ts-nav-item ${tab === item.key ? "active" : ""}`}
              onClick={() => { setTab(item.key); if (item.key !== "scanner") stopScanner(); }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </nav>

        <div className="ts-sidebar-footer">
          <div className="ts-logout"
            onClick={() => { localStorage.removeItem("user"); navigate("/login"); }}>
            <span>🚪</span><span>Logout</span>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="ts-main">

        <div className="ts-page-header">
          <h1>
            {tab === "dashboard" ? "Ticket Operations" :
             tab === "add"       ? "Add Booking"       :
             tab === "search"    ? "Search & Edit"     :
             tab === "scanner"   ? "QR Validation"     : "Reports"}
          </h1>
          <p className="ts-page-subtitle">
            <span className="ts-live-dot" style={{ marginRight: 8 }} />
            Live booking management
          </p>
        </div>

        {/* ======================== DASHBOARD ======================== */}
        {tab === "dashboard" && (
          <>
            <div className="ts-stats">
              {[
                { icon: "🎟️", label: "Bookings Today",    value: stats?.bookingsToday   ?? 0, cls: "blue"   },
                { icon: "💰", label: "Revenue Today",     value: `₹${stats?.revenueToday ?? 0}`, cls: "green" },
                { icon: "📦", label: "Total Bookings",    value: stats?.bookingsAllTime  ?? 0, cls: ""        },
                { icon: "💵", label: "Total Revenue",     value: `₹${stats?.revenueAllTime ?? 0}`, cls: "green" },
                { icon: "🚶", label: "Visitors Today",    value: stats?.visitorsToday   ?? 0, cls: "orange"  },
                { icon: "🏟️", label: "Visitors All Time", value: stats?.visitorsAllTime ?? 0, cls: "blue"    },
              ].map((s, i) => (
                <motion.div key={i} className="ts-stat-card"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}>
                  <span className="ts-stat-icon">{s.icon}</span>
                  <span className="ts-stat-label">{s.label}</span>
                  <span className={`ts-stat-value ${s.cls}`}>{s.value}</span>
                </motion.div>
              ))}
            </div>

            <div className="ts-section" style={{ display: "flex", gap: 28 }}>
              <div style={{ flex: 1 }}>
                <div className="ts-section-title">🧑‍💼 Bookings by Source</div>
                <div style={{ display: "flex", gap: 14 }}>
                  {[
                    { label: "Staff Created",    value: stats?.staffCreated    ?? 0, color: "#bfc4ff" },
                    { label: "Customer Created", value: stats?.customerCreated ?? 0, color: "#00ffae" },
                  ].map((s, i) => (
                    <div key={i} style={{
                      flex: 1, padding: "18px 20px", borderRadius: 14,
                      background: "rgba(255,255,255,0.04)",
                      border: `1px solid ${s.color}30`
                    }}>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 8 }}>{s.label}</div>
                      <div style={{ fontFamily: "Space Mono", fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ flex: 2 }}>
                <div className="ts-section-title">🕐 Recent Bookings</div>
                <div className="ts-table-wrap">
                  <table className="ts-table">
                    <thead>
                      <tr>
                        <th>ID</th><th>Name</th><th>Type</th><th>Amount</th><th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.slice(0, 5).map(b => (
                        <tr key={b._id}>
                          <td className="ts-mono">{b.booking_id}</td>
                          <td style={{ fontWeight: 600 }}>{b.customer_name}</td>
                          <td>{b.ticket_type === "VIP" ? <span className="ts-vip-badge">⭐ VIP</span> : "Normal"}</td>
                          <td className="ts-amount">₹{b.total_amount}</td>
                          <td>
                            <span className={`ts-badge ${badgeCls[b.status]}`}>
                              <span className="ts-badge-dot" />{b.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ======================== ADD BOOKING ======================== */}
        {tab === "add" && (
          <div className="ts-section">
            <div className="ts-section-title">🎟️ New Ticket Booking</div>
            <div className="ts-form">
              <div className="ts-form-group">
                <label className="ts-label">Customer Name *</label>
                <input className="ts-input" placeholder="John Doe"
                  value={form.customer_name}
                  onChange={e => setForm({ ...form, customer_name: e.target.value })} />
              </div>
              <div className="ts-form-group">
                <label className="ts-label">Email *</label>
                <input className="ts-input" type="email" placeholder="john@email.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="ts-form-group">
                <label className="ts-label">Ticket Type</label>
                <select className="ts-select" value={form.ticket_type}
                  onChange={e => setForm({ ...form, ticket_type: e.target.value as TicketType })}>
                  <option value="Normal">Normal — ₹{NORMAL_PRICE}</option>
                  <option value="VIP">VIP — ₹{VIP_PRICE}</option>
                </select>
              </div>
              <div className="ts-form-group">
                <label className="ts-label">Quantity</label>
                <input className="ts-input" type="number" min={1} max={20}
                  value={form.quantity}
                  onChange={e => setForm({ ...form, quantity: Math.max(1, +e.target.value) })} />
              </div>
              <div className="ts-form-group">
                <label className="ts-label">Visit Date *</label>
                <input className="ts-input" type="date"
                  value={form.visit_date}
                  onChange={e => setForm({ ...form, visit_date: e.target.value })} />
              </div>
              <div className="ts-form-group">
                <label className="ts-label">Payment Method</label>
                <select className="ts-select" value={form.payment_method}
                  onChange={e => setForm({ ...form, payment_method: e.target.value as PaymentMethod })}>
                  <option value="Cash">💵 Cash</option>
                  <option value="UPI">📱 UPI</option>
                  <option value="Card">💳 Card</option>
                </select>
              </div>
              <div className="ts-form-group half">
                <label className="ts-label">Notes</label>
                <input className="ts-input" placeholder="Optional..."
                  value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })} />
              </div>
              <div className="ts-total-display">
                <span className="ts-total-label">Total Amount</span>
                <span className="ts-total-value">₹{totalAmount}</span>
              </div>
              <div className="ts-form-actions">
                <button className="ts-btn ts-btn-ghost"
                  onClick={() => setForm({ ...EMPTY_FORM })}>Reset</button>
                <button className="ts-btn ts-btn-primary" onClick={handleAdd}>
                  🎟️ Create Booking
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================== SEARCH & EDIT ======================== */}
{tab === "search" && (
  <div className="ts-section">
    <div className="ts-section-title">🔍 Search & Edit Bookings</div>

    <div className="ts-search-bar">
      <input
        className="ts-search-input"
        placeholder="Search by Booking ID, Email or Name..."
        value={searchQ}
        onChange={e => setSearchQ(e.target.value)}
        onKeyDown={e => e.key === "Enter" && handleSearch()}
      />
      <button className="ts-btn ts-btn-primary" onClick={handleSearch}>
        Search
      </button>
    </div>

    {/* RESULTS */}
    {searchResults.length > 0 && (
      <div className="ts-search-results">
        {searchResults.map(b => {

          const isExpanded = selectedBooking?._id === b._id;
          const isEditing  = isExpanded && editMode;

          return (
            <div key={b._id} className={`ts-result-row-card ${isExpanded ? "expanded" : ""}`}>

              {/* ===== SUMMARY ROW — always visible, click to expand ===== */}
              <div
                className="ts-result-summary"
                onClick={() => {
                  if (isExpanded) {
                    setSelectedBooking(null);
                    setEditMode(false);
                  } else {
                    setSelectedBooking(b);
                    setEditMode(false);
                    setEditForm({
                      customer_name:  b.customer_name,
                      email:          b.email,
                      ticket_type:    b.ticket_type,
                      quantity:       b.quantity,
                      visit_date:     b.visit_date?.slice(0, 10),
                      payment_method: b.payment_method,
                      notes:          b.notes,
                    });
                  }
                }}
              >
                {/* LEFT: ID + name */}
                <div className="ts-rs-left">
                  <span className="ts-rs-id">{b.booking_id || b._id.slice(-8).toUpperCase()}</span>
                  <span className="ts-rs-name">{b.customer_name || "—"}</span>
                </div>

                {/* MIDDLE: type + date + amount */}
                <div className="ts-rs-mid">
                  {b.ticket_type === "VIP"
                    ? <span className="ts-vip-badge">⭐ VIP</span>
                    : <span className="ts-normal-badge">Normal</span>
                  }
                  <span className="ts-rs-date">
                    {b.visit_date ? fmtDate(b.visit_date) : "—"}
                  </span>
                  <span className="ts-rs-amount">₹{b.total_amount}</span>
                </div>

                {/* RIGHT: status + chevron */}
                <div className="ts-rs-right">
                  <span className={`ts-badge ${badgeCls[b.status]}`}>
                    <span className="ts-badge-dot" />{b.status}
                  </span>
                  <span className={`ts-rs-chevron ${isExpanded ? "open" : ""}`}>›</span>
                </div>
              </div>

              {/* ===== EXPANDED PANEL ===== */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    className="ts-result-panel"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                  >
                    <div className="ts-result-panel-inner">

                      {/* ===== VIEW MODE ===== */}
                      {!isEditing && (
                        <>
                          <div className="ts-detail-grid">
                            {[
                              { k: "Booking ID",   v: b.booking_id },
                              { k: "Name",         v: b.customer_name },
                              { k: "Email",        v: b.email },
                              { k: "Ticket Type",  v: b.ticket_type },
                              { k: "Quantity",     v: String(b.quantity) },
                              { k: "Visit Date",   v: fmtDate(b.visit_date) },
                              { k: "Payment",      v: b.payment_method },
                              { k: "Total",        v: `₹${b.total_amount}` },
                              { k: "Checked In",   v: b.checkedIn ? "✅ Yes" : "No" },
                              { k: "Booked By",    v: b.bookedBy },
                              { k: "Notes",        v: b.notes || "—" },
                              { k: "Validated At", v: b.validatedAt ? fmtDateTime(b.validatedAt) : "—" },
                            ].map(row => (
                              <div key={row.k} className="ts-detail-cell">
                                <span className="ts-detail-key">{row.k}</span>
                                <span className="ts-detail-val">{row.v}</span>
                              </div>
                            ))}
                          </div>

                          {/* QR */}
                          {b.qr_code && (
                            <div className="ts-panel-qr">
                              <img src={b.qr_code} alt="QR" />
                            </div>
                          )}

                          {/* ACTIONS */}
                          <div className="ts-panel-actions">
                            {b.status === "Confirmed" && (
                              <>
                                <button
                                  className="ts-btn ts-btn-primary"
                                  onClick={e => { e.stopPropagation(); setEditMode(true); }}
                                >
                                  ✏️ Edit Booking
                                </button>
                                <button
                                  className="ts-btn ts-btn-danger"
                                  onClick={e => { e.stopPropagation(); handleCancel(b._id); }}
                                >
                                  ✕ Cancel
                                </button>
                                <button
                                  className="ts-btn ts-btn-orange"
                                  onClick={e => { e.stopPropagation(); handleRefund(b._id); }}
                                >
                                  ↩ Refund
                                </button>
                              </>
                            )}
                            {b.status !== "Confirmed" && (
                              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>
                                No actions available for {b.status} bookings
                              </span>
                            )}
                          </div>
                        </>
                      )}

                      {/* ===== EDIT MODE ===== */}
                      {isEditing && (
                        <>
                          <div className="ts-edit-grid">

                            <div className="ts-edit-field">
                              <label className="ts-label">Customer Name</label>
                              <input className="ts-input"
                                value={editForm.customer_name || ""}
                                onChange={e => setEditForm({ ...editForm, customer_name: e.target.value })}
                              />
                            </div>

                            <div className="ts-edit-field">
                              <label className="ts-label">Email</label>
                              <input className="ts-input" type="email"
                                value={editForm.email || ""}
                                onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                              />
                            </div>

                            <div className="ts-edit-field">
                              <label className="ts-label">Ticket Type</label>
                              <select className="ts-select"
                                value={editForm.ticket_type || "Normal"}
                                onChange={e => setEditForm({ ...editForm, ticket_type: e.target.value as TicketType })}
                              >
                                <option value="Normal">Normal — ₹{NORMAL_PRICE}</option>
                                <option value="VIP">VIP — ₹{VIP_PRICE}</option>
                              </select>
                            </div>

                            <div className="ts-edit-field">
                              <label className="ts-label">Quantity</label>
                              <input className="ts-input" type="number" min={1} max={50}
                                value={editForm.quantity || 1}
                                onChange={e => setEditForm({ ...editForm, quantity: Math.max(1, +e.target.value) })}
                              />
                            </div>

                            <div className="ts-edit-field">
                              <label className="ts-label">Visit Date</label>
                              <input className="ts-input" type="date"
                                value={editForm.visit_date?.slice(0, 10) || ""}
                                onChange={e => setEditForm({ ...editForm, visit_date: e.target.value })}
                              />
                            </div>

                            <div className="ts-edit-field">
                              <label className="ts-label">Payment Method</label>
                              <select className="ts-select"
                                value={editForm.payment_method || "Cash"}
                                onChange={e => setEditForm({ ...editForm, payment_method: e.target.value as PaymentMethod })}
                              >
                                <option value="Cash">💵 Cash</option>
                                <option value="UPI">📱 UPI</option>
                                <option value="Card">💳 Card</option>
                              </select>
                            </div>

                            <div className="ts-edit-field ts-edit-field-full">
                              <label className="ts-label">Notes</label>
                              <input className="ts-input" placeholder="Optional..."
                                value={editForm.notes || ""}
                                onChange={e => setEditForm({ ...editForm, notes: e.target.value })}
                              />
                            </div>

                          </div>

                          {/* live total */}
                          <div className="ts-edit-total">
                            <span>Updated Total</span>
                            <span className="ts-edit-total-val">
                              ₹{(editForm.ticket_type === "VIP" ? VIP_PRICE : NORMAL_PRICE) * (editForm.quantity || 1)}
                            </span>
                          </div>

                          <div className="ts-panel-actions">
                            <button
                              className="ts-btn ts-btn-success"
                              onClick={e => { e.stopPropagation(); handleSaveEdit(); }}
                            >
                              💾 Save Changes
                            </button>
                            <button
                              className="ts-btn ts-btn-ghost"
                              onClick={e => { e.stopPropagation(); setEditMode(false); }}
                            >
                              Discard
                            </button>
                          </div>
                        </>
                      )}

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          );
        })}
      </div>
    )}

    {searchQ && searchResults.length === 0 && (
      <div className="ts-empty">
        <div className="ts-empty-icon">🔍</div>
        <div className="ts-empty-text">No results found</div>
        <div className="ts-empty-sub">Try booking ID, email or name</div>
      </div>
    )}

  </div>
)}

        {/* ======================== QR SCANNER ======================== */}
        {tab === "scanner" && (
          <div className="ts-section">
            <div className="ts-section-title">📷 QR Ticket Validation</div>

            <div className="ts-scanner-wrap">
              <div>
                {/* scanner mounts here — styled via CSS */}
                <div id="ts-qr-reader" className="ts-qr-reader-box" />

                <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                  {!scanning ? (
                    <button className="ts-btn ts-btn-primary"
                      style={{ flex: 1 }} onClick={startScanner}>
                      📷 Start Scanner
                    </button>
                  ) : (
                    <button className="ts-btn ts-btn-danger"
                      style={{ flex: 1 }} onClick={stopScanner}>
                      ⏹ Stop Scanner
                    </button>
                  )}
                  <button className="ts-btn ts-btn-ghost"
                    onClick={() => { setScannedBooking(null); setScanAlert(null); stopScanner(); }}>
                    Reset
                  </button>
                </div>
              </div>

              <div>
                {scanAlert && (
                  <motion.div
                    className={`ts-scan-alert ${scanAlert.type}`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ marginBottom: 16 }}
                  >
                    {scanAlert.msg}
                  </motion.div>
                )}

                {scannedBooking ? (
                  <div className="ts-scan-result">
                    <div className="ts-result-title">Scan Result</div>
                    {[
                      { k: "Booking ID",  v: scannedBooking.booking_id },
                      { k: "Name",        v: scannedBooking.customer_name },
                      { k: "Email",       v: scannedBooking.email },
                      { k: "Ticket Type", v: scannedBooking.ticket_type === "VIP" ? "⭐ VIP" : "Normal" },
                      { k: "Quantity",    v: String(scannedBooking.quantity) },
                      { k: "Visit Date",  v: fmtDate(scannedBooking.visit_date) },
                      { k: "Amount",      v: `₹${scannedBooking.total_amount}` },
                      { k: "Checked In",  v: scannedBooking.checkedIn ? "✅ Yes" : "❌ No" },
                    ].map(row => (
                      <div key={row.k} className="ts-result-row">
                        <span className="ts-result-key">{row.k}</span>
                        <span className="ts-result-val">{row.v}</span>
                      </div>
                    ))}
                    <div className="ts-result-row">
                      <span className="ts-result-key">Status</span>
                      <span className={`ts-badge ${badgeCls[scannedBooking.status]}`}>
                        <span className="ts-badge-dot" />{scannedBooking.status}
                      </span>
                    </div>
                    <div className="ts-scan-actions">
                      <button
                        className="ts-btn ts-btn-success"
                        disabled={scannedBooking.checkedIn || scannedBooking.status === "Cancelled"}
                        onClick={handleValidate}
                        style={{ flex: 1 }}>
                        ✅ Validate Entry
                      </button>
                      <button className="ts-btn ts-btn-danger" style={{ flex: 1 }}
                        onClick={() => { setScannedBooking(null); setScanAlert(null); }}>
                        ✕ Clear
                      </button>
                    </div>
                  </div>
                ) : !scanAlert ? (
                  <div className="ts-scan-result"
                    style={{ alignItems: "center", justifyContent: "center", minHeight: 280 }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>🎟️</div>
                    <div className="ts-empty-text">Scan a QR code to view booking</div>
                    <div className="ts-empty-sub">Point camera at ticket QR</div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}

        {/* ======================== REPORTS ======================== */}
        {tab === "reports" && (
          <div className="ts-section">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
              <div className="ts-section-title" style={{ margin: 0 }}>📋 Booking Reports</div>
              <button
                className="ts-btn ts-btn-success"
                onClick={() => downloadPDF(filtered, dateFilter, filter)}
              >
                ⬇ Download PDF
              </button>
            </div>

            {/* TYPE FILTER */}
            <div className="ts-filter-bar">
              {(["All", "VIP", "Normal"] as FilterType[]).map(f => (
                <button key={f}
                  className={`ts-filter-btn ${filter === f ? "active" : ""}`}
                  onClick={() => { setFilter(f); setPage(1); }}>
                  {f}
                </button>
              ))}
            </div>

            {/* DATE FILTER */}
            <div className="ts-filter-bar" style={{ marginBottom: 20 }}>
              {([
                { key: "all",   label: "All Time"   },
                { key: "today", label: "Today"       },
                { key: "week",  label: "This Week"   },
                { key: "month", label: "This Month"  },
                { key: "year",  label: "This Year"   },
              ] as { key: DateFilter; label: string }[]).map(d => (
                <button key={d.key}
                  className={`ts-filter-btn ${dateFilter === d.key ? "active" : ""}`}
                  onClick={() => { setDateFilter(d.key); setPage(1); }}>
                  {d.label}
                </button>
              ))}

              <span style={{ marginLeft: "auto", fontSize: 13, color: "rgba(255,255,255,0.35)" }}>
                {filtered.length} records · ₹{filtered.reduce((s, b) => s + b.total_amount, 0)} total
              </span>
            </div>

            {loading ? (
              <div className="ts-empty"><div className="ts-empty-icon">⏳</div></div>
            ) : (
              <>
                <div className="ts-table-wrap">
                  <table className="ts-table">
                    <thead>
                      <tr>
                        <th>Booking ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Type</th>
                        <th>Qty</th>
                        <th>Amount</th>
                        <th>Visit Date</th>
                        <th>Status</th>
                        <th>Checked In</th>
                        <th>Payment</th>
                        <th>By</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginated.length === 0 ? (
                        <tr>
                          <td colSpan={12} style={{ textAlign: "center", padding: 40, color: "rgba(255,255,255,0.25)" }}>
                            No records found
                          </td>
                        </tr>
                      ) : paginated.map(b => (
                        <tr key={b._id}>
                          <td className="ts-mono">{b.booking_id}</td>
                          <td style={{ fontWeight: 600 }}>{b.customer_name}</td>
                          <td style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>{b.email}</td>
                          <td>{b.ticket_type === "VIP"
                            ? <span className="ts-vip-badge">⭐ VIP</span>
                            : "Normal"}</td>
                          <td style={{ fontFamily: "Space Mono", textAlign: "center" }}>{b.quantity}</td>
                          <td className="ts-amount">₹{b.total_amount}</td>
                          <td style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", whiteSpace: "nowrap" }}>
                            {fmtDate(b.visit_date)}
                          </td>
                          <td>
                            <span className={`ts-badge ${badgeCls[b.status]}`}>
                              <span className="ts-badge-dot" />{b.status}
                            </span>
                          </td>
                          <td style={{ textAlign: "center" }}>{b.checkedIn ? "✅" : "—"}</td>
                          <td style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
                            {b.payment_method}
                          </td>
                          <td>
                            <span style={{
                              fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 8,
                              background: b.bookedBy === "TicketStaff" ? "rgba(191,196,255,0.1)" : "rgba(0,255,174,0.08)",
                              color: b.bookedBy === "TicketStaff" ? "#bfc4ff" : "#00ffae"
                            }}>
                              {b.bookedBy === "TicketStaff" ? "Staff" : "User"}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: "flex", gap: 6 }}>
                              <button className="ts-btn ts-btn-ghost"
                                style={{ padding: "5px 10px", fontSize: 11 }}
                                onClick={() => { setSelectedBooking(b); setEditMode(false); }}>
                                View
                              </button>
                              {b.status === "Confirmed" && (
                                <button className="ts-btn ts-btn-danger"
                                  style={{ padding: "5px 10px", fontSize: 11 }}
                                  onClick={() => handleCancel(b._id)}>
                                  Cancel
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 && (
                  <div className="ts-pagination">
                    <button className="ts-page-btn"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}>‹</button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                      <button key={p}
                        className={`ts-page-btn ${page === p ? "active" : ""}`}
                        onClick={() => setPage(p)}>{p}</button>
                    ))}
                    <button className="ts-page-btn"
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}>›</button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

      </main>

      {/* ======================== MODAL ======================== */}
      <AnimatePresence>
        {selectedBooking && (
          <motion.div className="ts-modal-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={e => { if (e.target === e.currentTarget) { setSelectedBooking(null); setEditMode(false); } }}>
            <motion.div className="ts-modal"
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1,    opacity: 1, y: 0  }}
              exit={{    scale: 0.92, opacity: 0, y: 20 }}>

              <div className="ts-modal-header">
                <span className="ts-modal-title">
                  {editMode ? "✏️ Edit Booking" : "🎟️ Booking Details"}
                </span>
                <button className="ts-modal-close"
                  onClick={() => { setSelectedBooking(null); setEditMode(false); }}>✕</button>
              </div>

              {/* QR */}
              {!editMode && selectedBooking.qr_code && (
                <div className="ts-modal-qr">
                  <img src={selectedBooking.qr_code} alt="QR" />
                </div>
              )}

              {/* VIEW MODE */}
              {!editMode && (
                <>
                  {[
                    { k: "Booking ID",   v: selectedBooking.booking_id    },
                    { k: "Name",         v: selectedBooking.customer_name },
                    { k: "Email",        v: selectedBooking.email          },
                    { k: "Ticket Type",  v: selectedBooking.ticket_type   },
                    { k: "Quantity",     v: String(selectedBooking.quantity) },
                    { k: "Visit Date",   v: fmtDate(selectedBooking.visit_date) },
                    { k: "Payment",      v: selectedBooking.payment_method },
                    { k: "Total",        v: `₹${selectedBooking.total_amount}` },
                    { k: "Booked By",    v: selectedBooking.bookedBy       },
                    { k: "Checked In",   v: selectedBooking.checkedIn ? "✅ Yes" : "No" },
                    { k: "Validated At", v: selectedBooking.validatedAt ? fmtDateTime(selectedBooking.validatedAt) : "—" },
                    { k: "Notes",        v: selectedBooking.notes || "—"  },
                  ].map(row => (
                    <div key={row.k} className="ts-modal-row">
                      <span className="ts-modal-key">{row.k}</span>
                      <span className="ts-modal-val">{row.v}</span>
                    </div>
                  ))}
                  <div className="ts-modal-row">
                    <span className="ts-modal-key">Status</span>
                    <span className={`ts-badge ${badgeCls[selectedBooking.status]}`}>
                      <span className="ts-badge-dot" />{selectedBooking.status}
                    </span>
                  </div>
                  <div className="ts-modal-actions">
                    {selectedBooking.status === "Confirmed" && (
                      <>
                        <button className="ts-btn ts-btn-primary"
                          onClick={() => openEdit(selectedBooking)}>✏️ Edit</button>
                        <button className="ts-btn ts-btn-danger"
                          onClick={() => handleCancel(selectedBooking._id)}>✕ Cancel</button>
                        <button className="ts-btn ts-btn-orange"
                          onClick={() => handleRefund(selectedBooking._id)}>↩ Refund</button>
                      </>
                    )}
                    <button className="ts-btn ts-btn-ghost" style={{ marginLeft: "auto" }}
                      onClick={() => setSelectedBooking(null)}>Close</button>
                  </div>
                </>
              )}

              {/* EDIT MODE */}
              {editMode && (
                <div className="ts-form" style={{ marginTop: 8 }}>
                  <div className="ts-form-group">
                    <label className="ts-label">Customer Name</label>
                    <input className="ts-input"
                      value={editForm.customer_name || ""}
                      onChange={e => setEditForm({ ...editForm, customer_name: e.target.value })} />
                  </div>
                  <div className="ts-form-group">
                    <label className="ts-label">Email</label>
                    <input className="ts-input" type="email"
                      value={editForm.email || ""}
                      onChange={e => setEditForm({ ...editForm, email: e.target.value })} />
                  </div>
                  <div className="ts-form-group">
                    <label className="ts-label">Ticket Type</label>
                    <select className="ts-select"
                      value={editForm.ticket_type || "Normal"}
                      onChange={e => setEditForm({ ...editForm, ticket_type: e.target.value as TicketType })}>
                      <option value="Normal">Normal — ₹{NORMAL_PRICE}</option>
                      <option value="VIP">VIP — ₹{VIP_PRICE}</option>
                    </select>
                  </div>
                  <div className="ts-form-group">
                    <label className="ts-label">Quantity</label>
                    <input className="ts-input" type="number" min={1}
                      value={editForm.quantity || 1}
                      onChange={e => setEditForm({ ...editForm, quantity: +e.target.value })} />
                  </div>
                  <div className="ts-form-group">
                    <label className="ts-label">Visit Date</label>
                    <input className="ts-input" type="date"
                      value={editForm.visit_date?.slice(0, 10) || ""}
                      onChange={e => setEditForm({ ...editForm, visit_date: e.target.value })} />
                  </div>
                  <div className="ts-form-group">
                    <label className="ts-label">Payment Method</label>
                    <select className="ts-select"
                      value={editForm.payment_method || "Cash"}
                      onChange={e => setEditForm({ ...editForm, payment_method: e.target.value as PaymentMethod })}>
                      <option value="Cash">💵 Cash</option>
                      <option value="UPI">📱 UPI</option>
                      <option value="Card">💳 Card</option>
                    </select>
                  </div>
                  <div className="ts-form-group full">
                    <label className="ts-label">Notes</label>
                    <input className="ts-input"
                      value={editForm.notes || ""}
                      onChange={e => setEditForm({ ...editForm, notes: e.target.value })} />
                  </div>

                  <div className="ts-total-display">
                    <span className="ts-total-label">New Total</span>
                    <span className="ts-total-value">
                      ₹{((editForm.ticket_type === "VIP" ? VIP_PRICE : NORMAL_PRICE) * (editForm.quantity || 1))}
                    </span>
                  </div>

                  <div className="ts-form-actions">
                    <button className="ts-btn ts-btn-ghost"
                      onClick={() => setEditMode(false)}>Cancel</button>
                    <button className="ts-btn ts-btn-primary"
                      onClick={handleSaveEdit}>💾 Save Changes</button>
                  </div>
                </div>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}