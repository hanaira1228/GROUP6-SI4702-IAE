import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import "./seed/adminSeeder.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ===== DATABASE =====
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected (User Service)"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ===== ROUTES =====
app.use("/users", userRoutes);

// ===== SERVER =====
const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
  console.log(`🚀 User Service running on port ${PORT}`)
);