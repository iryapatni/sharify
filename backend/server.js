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

// ----------- FIXED CORS (Express 5 compatible) -----------
app.use(
  cors({
    origin: "https://sharify-frontend.onrender.com",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Handle ALL preflight requests safely (Express 5)
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Origin", "https://sharify-frontend.onrender.com");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    return res.sendStatus(200);
  }
  next();
});

console.log("CORS ALLOWED ORIGIN:", "https://sharify-frontend.onrender.com");
// ----------------------------------------------------------

app.use(express.json());

// Routes
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const borrowRequest = require("./routes/borrowRequest");

// DB connect
async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("Connected to database");
}
main().catch(err => console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/borrow", borrowRequest);

// Test endpoint
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
