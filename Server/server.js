import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/bus_services_db";

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root & Health Check Endpoints
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Bus Services API is running...",
    status: "success",
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);  

// 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Not Found - ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack || err);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

// Database Connection & Server Startup
const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(" Connected to MongoDB successfully");

    app.listen(PORT, () => {
      console.log(` Server is running on port: ${PORT}`);
      console.log(` Health check available at: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error(" Error connecting to MongoDB:", error.message);
    if (error.name === "MongooseServerSelectionError") {
      console.error(" Hint: If using MongoDB Atlas, check your network connection and ensure your current IP address is whitelisted in MongoDB Atlas (Network Access -> Add IP -> Allow from anywhere 0.0.0.0/0 or Current IP).");
    }
    process.exit(1);
  }
};

startServer();

