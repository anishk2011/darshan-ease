const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const templeRoutes = require("./routes/templeRoutes");
const slotRoutes = require("./routes/slotRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const donationRoutes = require("./routes/donationRoutes");
const { notFoundHandler, errorHandler, ApiError } = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "DarshanEase API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/temples", templeRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/donations", donationRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function startServer() {
  if (!process.env.MONGO_URI) {
    throw new ApiError(500, "MONGO_URI is missing in environment");
  }
  if (!process.env.JWT_SECRET) {
    throw new ApiError(500, "JWT_SECRET is missing in environment");
  }

  await mongoose.connect(process.env.MONGO_URI);
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err.message);
  process.exit(1);
});
