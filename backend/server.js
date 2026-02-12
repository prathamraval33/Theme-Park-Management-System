const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/rides", require("./routes/rideRoute"));
app.use("/api/booking", require("./routes/bookingRoute"));


app.listen(5000, () => console.log("Server running on port 5000"));
