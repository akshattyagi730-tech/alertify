import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";
import "./config/firebase.js";

import healthRoutes from "./routes/health.js";
import authRoutes from "./routes/auth.js";
import sosRoutes from "./routes/sos.js";
import contactRoutes from "./routes/contacts.js";


// Load env

// Connect DB
connectDB();

const app = express();
const PORT = 5001;


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/health", healthRoutes);
app.use("/auth", authRoutes);
app.use("/sos", sosRoutes);

app.use("/contacts", contactRoutes);


// Root
app.get("/", (req, res) => {
  res.json({
    message: "Alertify Backend API",
    status: "running"
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.path
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("ERROR:", err);
  res.status(500).json({
    error: "Internal server error",
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
  console.log(`📍 Health: http://localhost:${PORT}/health`);
});
