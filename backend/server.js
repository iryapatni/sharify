// backend/server.js
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const app = express();

// PORT (Render provides process.env.PORT — fallback to 10000 for local/testing)
const PORT = process.env.PORT || 10000;
const MONGO_URL = process.env.MONGO_URI;

// FRONTEND origin (use env var when possible)
const FRONTEND_ORIGIN = process.env.FRONTEND_URL || "https://sharify-frontend.onrender.com";

/*
 * CORS configuration
 * - allow only the frontend origin (do NOT set '*' when using credentials)
 * - expose Authorization header if needed
 * - enable credentials so cookies or Authorization header usage works
 */
const corsOptions = {
  origin: (origin, callback) => {
    callback(null, FRONTEND_ORIGIN);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  credentials: true,
  optionsSuccessStatus: 200
};

// Apply CORS middleware globally
app.use(cors(corsOptions));

// Ensure preflight requests are handled by CORS (Express 4)
app.options("*", cors(corsOptions));

// Serve uploads directory (images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Parse JSON bodies
app.use(express.json());
// Optionally parse urlencoded (forms)
app.use(express.urlencoded({ extended: true }));

// Simple logger for startup troubleshooting (can be removed later)
app.use((req, res, next) => {
  // Avoid noisy logs in production, but helpful while debugging deploys
  // console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
});

// Routes (keep these requires AFTER middleware)
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const borrowRequest = require("./routes/borrowRequest");

// Connect to MongoDB
async function main() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to database");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}
main();

// Mount API routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/borrow", borrowRequest);

// Root test route
app.get("/", (req, res) => {
  res.send("Sharify backend is running!");
});

// 404 handler (for unmatched routes)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found. Please check the URL."
  });
});

// Global error handler (optional - helps with debugging)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Server error" });
});

// Start server — listen on PORT provided by Render
app.listen(PORT, () => {
  console.log("CORS ALLOWED ORIGIN:", FRONTEND_ORIGIN);
  console.log("Connected to port:", PORT);
  console.log("Sharify backend is live ✅");
});
