const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const http = require("http");            // 🔥 ADD
const { Server } = require("socket.io"); // 🔥 ADD

const connectDB = require("./config/db");

const app = express();

/* ================= DB ================= */
connectDB();

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

/* ================= ROUTES ================= */
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/rides", require("./routes/rideRoute"));
app.use("/api/booking", require("./routes/bookingRoute"));
app.use("/api/foods", require("./routes/foodRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/foodorders", require("./routes/foodOrderRoute"));
app.use("/api/reviews", require("./routes/reviewRoute"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/queue", require("./routes/queueRoutes"));


/* ================= SOCKET SETUP ================= */

// 🔥 CREATE HTTP SERVER
const server = http.createServer(app);

// 🔥 ATTACH SOCKET.IO
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

// 🔥 SOCKET CONNECTION
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

/* 🔥 MAKE IO GLOBAL */
app.set("io", io);

/* ================= ERROR HANDLER ================= */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

/* ================= START SERVER ================= */

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});