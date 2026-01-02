import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import restaurantRoutes from "./routes/restaurantRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ===== DATABASE =====
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected (Restaurant Service)"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// ===== ROUTES =====
app.use("/restaurants", restaurantRoutes);

// ===== SERVER =====
const PORT = process.env.PORT || 3002;
app.listen(PORT, () =>
  console.log(`🚀 Restaurant Service running on port ${PORT}`)
);