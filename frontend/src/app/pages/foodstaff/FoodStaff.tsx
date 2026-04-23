import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { socket } from "../../../socket";
import "../../../styles/FoodStaff.css";

/* ===== TYPES ===== */
type OrderStatus = "Preparing" | "Prepared" | "Delivered" | "Cancelled";

interface OrderItem { name: string; quantity: number; }

interface FoodOrder {
  _id: string;
  email: string;
  items: OrderItem[];
  total_amount: number;
  status: OrderStatus;
  createdAt: string;
  isNew?: boolean;
}

type FilterType = "All" | "Today" | "Preparing" | "Prepared" | "Cancelled";

/* ===== HELPERS ===== */
const timeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return "Just now";
  if (m < 60) return `${m}m ago`;
  return `${Math.floor(m / 60)}h ${m % 60}m ago`;
};

const fmtTime = (dateStr: string) =>
  new Date(dateStr).toLocaleString("en-IN", {
    day: "2-digit", month: "short",
    hour: "2-digit", minute: "2-digit"
  });

const badgeClass: Record<OrderStatus, string> = {
  Preparing: "fs-badge-preparing",
  Prepared:  "fs-badge-prepared",
  Delivered: "fs-badge-delivered",
  Cancelled: "fs-badge-cancelled",
};

const isToday = (dateStr: string) => {
  const d = new Date(dateStr), n = new Date();
  return d.getDate() === n.getDate() &&
    d.getMonth() === n.getMonth() &&
    d.getFullYear() === n.getFullYear();
};

const STATUS_BTNS: { s: OrderStatus; icon: string }[] = [
  { s: "Preparing", icon: "🔥" },
  { s: "Prepared",  icon: "✅" },
  { s: "Delivered", icon: "📦" },
  { s: "Cancelled", icon: "❌" },
];

/* ===== COMPONENT ===== */
export function FoodStaff() {

  const navigate = useNavigate();
  const [tab,     setTab]     = useState<"dashboard" | "live" | "history">("dashboard");
  const [orders,  setOrders]  = useState<FoodOrder[]>([]);
  const [filter,  setFilter]  = useState<FilterType>("All");
  const [loading, setLoading] = useState(true);
  const [alert,   setAlert]   = useState(false);
  const [search,  setSearch]  = useState("");
  const prevIds  = useRef<Set<string>>(new Set());
  const audioRef = useRef<HTMLAudioElement | null>(null);

  /* ===== FETCH ===== */
  const fetchOrders = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/foodorders");
      const incoming: FoodOrder[] = res.data || [];

      setOrders(prev => {
        const hasNew = incoming.some(o => !prevIds.current.has(o._id));

        if (hasNew && prevIds.current.size > 0) {
          setAlert(true);
          setTimeout(() => setAlert(false), 3500);
          audioRef.current?.play().catch(() => {});
        }

        prevIds.current = new Set(incoming.map(o => o._id));

        return incoming.map(o => ({
          ...o,
          isNew: !prev.find(p => p._id === o._id)
        }));
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  /* ===== SOCKET ===== */
  useEffect(() => {
    socket.on("newFoodOrder", fetchOrders);
    socket.on("orderUpdated", fetchOrders);
    return () => {
      socket.off("newFoodOrder", fetchOrders);
      socket.off("orderUpdated", fetchOrders);
    };
  }, [fetchOrders]);

  /* ===== STATUS UPDATE ===== */
  const updateStatus = async (id: string, status: OrderStatus) => {
    // optimistic
    setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
    try {
      await axios.put(`http://localhost:5000/api/foodorders/${id}/status`, { status });
    } catch (err) {
      console.error(err);
      fetchOrders(); // rollback
    }
  };

  /* ===== STATS ===== */
  const todayOrders  = orders.filter(o => isToday(o.createdAt));
  const todayRevenue = todayOrders.reduce((s, o) => s + o.total_amount, 0);
  const totalRevenue = orders.reduce((s, o) => s + o.total_amount, 0);
  const preparing    = orders.filter(o => o.status === "Preparing").length;

  /* ===== LIVE ORDERS (exclude Delivered + Cancelled) ===== */
  const liveOrders = orders.filter(
    o => o.status !== "Delivered" && o.status !== "Cancelled"
  );

  /* ===== FILTERED PANEL (dashboard tab) ===== */
  const filteredPanel = liveOrders.filter(o => {
    if (filter === "Today")     return isToday(o.createdAt);
    if (filter === "Preparing") return o.status === "Preparing";
    if (filter === "Prepared")  return o.status === "Prepared";
    return true;
  });

  /* ===== HISTORY (all orders, searchable) ===== */
  const historyOrders = orders.filter(o => {
    const q = search.toLowerCase();
    return (
      o.email.toLowerCase().includes(q) ||
      o._id.slice(-6).toLowerCase().includes(q) ||
      o.status.toLowerCase().includes(q)
    );
  });

  /* ===== ACTIVE ORDERS TO RENDER ===== */
  const activeOrders = tab === "live" ? liveOrders : filteredPanel;

  /* ===== LOGOUT ===== */
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  /* ===== RENDER ===== */
  return (
    <div className="fs-layout">

      <audio ref={audioRef} src="/sounds/ding.mp3" preload="auto" />

      {/* ===== SIDEBAR ===== */}
      <aside className="fs-sidebar">

        <div className="fs-logo">
          <span className="fs-logo-icon">🍔</span>
          <span className="fs-logo-text">FoodOps</span>
        </div>

        <nav className="fs-nav">
          {([
            { key: "dashboard", icon: "📊", label: "Dashboard"   },
            { key: "live",      icon: "🔴", label: "Live Orders" },
            { key: "history",   icon: "📋", label: "History"     },
          ] as const).map(item => (
            <div
              key={item.key}
              className={`fs-nav-item ${tab === item.key ? "active" : ""}`}
              onClick={() => setTab(item.key)}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
              {item.key === "live" && preparing > 0 && (
                <span style={{
                  marginLeft: "auto",
                  background: "#ffc107",
                  color: "#000",
                  borderRadius: "20px",
                  padding: "1px 8px",
                  fontSize: "11px",
                  fontWeight: 800
                }}>{preparing}</span>
              )}
            </div>
          ))}
        </nav>

        <div className="fs-sidebar-footer">
          <div className="fs-logout" onClick={handleLogout}>
            <span>🚪</span>
            <span>Logout</span>
          </div>
        </div>

      </aside>

      {/* ===== MAIN ===== */}
      <main className="fs-main">

        {/* HEADER */}
        <div className="fs-page-header">
          <h1>
            {tab === "dashboard" ? "Food Staff Dashboard"
              : tab === "live"  ? "Live Orders"
              : "Order History"}
          </h1>
          <p className="fs-page-subtitle">Real-time kitchen management panel</p>
        </div>

        {/* STAT CARDS */}
        <div className="fs-stats">
          {[
            { icon: "🧾", label: "Orders Today",   value: todayOrders.length, cls: ""      },
            { icon: "💰", label: "Revenue Today",  value: `₹${todayRevenue}`, cls: "green" },
            { icon: "📦", label: "Total Orders",   value: orders.length,      cls: ""      },
            { icon: "💵", label: "Total Revenue",  value: `₹${totalRevenue}`, cls: "green" },
          ].map((s, i) => (
            <motion.div
              key={i}
              className="fs-stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0  }}
              transition={{ delay: i * 0.08 }}
            >
              <span className="fs-stat-icon">{s.icon}</span>
              <span className="fs-stat-label">{s.label}</span>
              <span className={`fs-stat-value ${s.cls}`}>{s.value}</span>
            </motion.div>
          ))}
        </div>

        {/* ===========================
            HISTORY TAB
        =========================== */}
        {tab === "history" ? (
          <div className="fs-history-section">

            <div className="fs-section-header">
              <span className="fs-history-title">📋 All Orders</span>
              <input
                style={{
                  padding: "9px 16px",
                  borderRadius: "12px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "white",
                  fontFamily: "Outfit, sans-serif",
                  fontSize: "13px",
                  width: "240px",
                  outline: "none"
                }}
                placeholder="🔍 Search email, ID, status..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <div className="fs-table-wrap">
              <table className="fs-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {historyOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", padding: "40px", color: "rgba(255,255,255,0.25)" }}>
                        No orders found
                      </td>
                    </tr>
                  ) : historyOrders.map(order => (
                    <tr key={order._id}>
                      <td className="fs-table-id">#{order._id.slice(-6).toUpperCase()}</td>
                      <td className="fs-table-email">{order.email}</td>
                      <td className="fs-table-items">
                        {order.items.map(i => `${i.name} ×${i.quantity}`).join(", ")}
                      </td>
                      <td className="fs-table-amount">₹{order.total_amount}</td>
                      <td>
                        <span className={`fs-status-badge ${badgeClass[order.status]}`}>
                          <span className="fs-dot" />
                          {order.status}
                        </span>
                      </td>
                      <td className="fs-table-time">{fmtTime(order.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

        ) : (
          /* ===========================
              DASHBOARD + LIVE TAB
          =========================== */
          <>
            {/* FILTER BAR — only for dashboard tab */}
            {tab === "dashboard" && (
              <div className="fs-filter-bar">
                {(["All", "Today", "Preparing", "Prepared"] as FilterType[]).map(f => (
                  <button
                    key={f}
                    className={`fs-filter-btn ${filter === f ? "active" : ""}`}
                    onClick={() => setFilter(f)}
                  >
                    {f}
                  </button>
                ))}
                <div className="fs-new-badge">
                  <div className="fs-live-dot" />
                  Live
                </div>
              </div>
            )}

            {/* SECTION HEADER */}
            <div className="fs-section-header">
              <span className="fs-section-title">
                {tab === "live" ? "🔴 Active Orders" : "🍽️ Orders Panel"}
              </span>
              <span className="fs-count-badge">{activeOrders.length} orders</span>
            </div>

            {/* CARDS */}
            {loading ? (
              <div className="fs-skeleton-grid">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="fs-skeleton-card" />
                ))}
              </div>
            ) : (
              <div className="fs-orders-grid">
                <AnimatePresence>
                  {activeOrders.length === 0 ? (
                    <div className="fs-empty">
                      <div className="fs-empty-icon">🍽️</div>
                      <div className="fs-empty-text">No active orders</div>
                      <div className="fs-empty-sub">New orders will appear here in real-time</div>
                    </div>
                  ) : (
                    activeOrders.map(order => (
                      <motion.div
                        key={order._id}
                        className={`fs-order-card ${order.isNew ? "new-order" : ""}`}
                        initial={{ opacity: 0, scale: 0.94, y: 16 }}
                        animate={{ opacity: 1, scale: 1,    y: 0   }}
                        exit={{    opacity: 0, scale: 0.94, y: -10 }}
                        transition={{ duration: 0.22 }}
                        layout
                      >

                        {/* HEADER */}
                        <div className="fs-order-header">
                          <div className="fs-order-meta">
                            <div className="fs-order-id">#{order._id.slice(-6).toUpperCase()}</div>
                            <div className="fs-order-email">{order.email}</div>
                            <div className="fs-order-time">{timeAgo(order.createdAt)}</div>
                          </div>
                          <span className={`fs-status-badge ${badgeClass[order.status]}`}>
                            <span className="fs-dot" />
                            {order.status}
                          </span>
                        </div>

                        <div className="fs-divider" />

                        {/* ITEMS */}
                        <div className="fs-items">
                          {order.items.map((item, i) => (
                            <div key={i} className="fs-item-row">
                              <span className="fs-item-name">{item.name}</span>
                              <span className="fs-item-qty">×{item.quantity}</span>
                            </div>
                          ))}
                        </div>

                        <div className="fs-divider" />

                        {/* TOTAL */}
                        <div className="fs-total-row">
                          <span className="fs-total-label">Total</span>
                          <span className="fs-total-value">₹{order.total_amount}</span>
                        </div>

                        {/* STATUS BUTTONS */}
                        <div className="fs-status-btns">
                          {STATUS_BTNS.map(({ s, icon }) => (
                            <button
                              key={s}
                              className={`fs-btn fs-btn-${s.toLowerCase()} ${order.status === s ? "active" : ""}`}
                              onClick={() => updateStatus(order._id, s)}
                            >
                              {icon} {s}
                            </button>
                          ))}
                        </div>

                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* HISTORY TABLE BELOW CARDS (dashboard tab only) */}
            {tab === "dashboard" && !loading && orders.length > 0 && (
              <div className="fs-history-section">
                <div className="fs-section-header" style={{ marginTop: 40 }}>
                  <span className="fs-history-title">📋 Recent History</span>
                  <span className="fs-count-badge">{orders.length} total</span>
                </div>
                <div className="fs-table-wrap">
                  <table className="fs-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr key={order._id}>
                          <td className="fs-table-id">#{order._id.slice(-6).toUpperCase()}</td>
                          <td className="fs-table-email">{order.email}</td>
                          <td className="fs-table-items">
                            {order.items.map(i => `${i.name} ×${i.quantity}`).join(", ")}
                          </td>
                          <td className="fs-table-amount">₹{order.total_amount}</td>
                          <td>
                            <span className={`fs-status-badge ${badgeClass[order.status]}`}>
                              <span className="fs-dot" />
                              {order.status}
                            </span>
                          </td>
                          <td className="fs-table-time">{fmtTime(order.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

      </main>

      {/* NEW ORDER ALERT */}
      <AnimatePresence>
        {alert && (
          <motion.div
            className="fs-alert"
            initial={{ opacity: 0, x: 60  }}
            animate={{ opacity: 1, x: 0   }}
            exit={{    opacity: 0, x: 60  }}
          >
            🔔 New order received!
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}