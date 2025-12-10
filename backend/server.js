require("dotenv").config();

const PORT = process.env.PORT;
const MONGO_URL=process.env.MONGO_URI;
const mongoose = require('mongoose');
const express=require("express");
const cors=require("cors");

const app=express();
const path = require("path");

app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());


const authRoutes=require("./routes/auth");
const productRoutes=require("./routes/products");
const borrowRequest=require("./routes/borrowRequest");

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("Connected to database");
}
main().catch(err => console.log(err));


app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/borrow", borrowRequest);


app.listen(PORT, ()=>{
   console.log("Connected to port:", process.env.PORT);

});