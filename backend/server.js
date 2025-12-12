require("dotenv").config();

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URI;

const mongoose = require("mongoose");
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");

// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ---------- CORS FIX (FINAL WORKING VERSION) ----------
app.use(
  cors({
    origin: "https://sharify-frontend.onrender.com",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Handle all OPTIONS preflight requests
app.options(
  "*",
  cors({
    origin: "https://sharify-frontend.onrender.com",
    credentials: true,
  })
);

console.log("CORS ALLOWED ORIGIN:", "https://sharify-frontend.onrender.com");
// -------------------------------------------------------

app.use(express.json());

// Import routes
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const borrowRequest = require("./routes/borrowRequest");

// Database connection
async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("Connected to database");
}
main().catch((err) => console.log(err));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/borrow", borrowRequest);

// Root test endpoint
app.get("/", (req, res) => {
  res.send("Sharify backend is running!");
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found. Please check the URL.",
  });
});

// Start server
app.listen(PORT, () => {
  console.log("Connected to port:", PORT);
});
