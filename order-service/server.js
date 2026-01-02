import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ===== DATABASE =====
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected (Order Service)"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ===== MODEL =====
const orderSchema = new mongoose.Schema({
  userId: String,
  restaurantId: String,
  items: [{ name: String, quantity: Number, price: Number }],
  totalPrice: Number,
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", orderSchema);

// ===== ROUTES =====
app.post("/orders", async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/orders", async (_, res) => {
  res.json(await Order.find());
});

app.put("/orders/:id", async (req, res) => {
  res.json(
    await Order.findByIdAndUpdate(req.params.id, req.body, { new: true })
  );
});

app.delete("/orders/:id", async (req, res) => {
  await Order.findByIdAndDelete(req.params.id);
  res.json({ message: "Order deleted" });
});

// ===== SERVER =====
const PORT = process.env.PORT || 3003;
app.listen(PORT, () =>
  console.log(`🚀 Order Service running on port ${PORT}`)
);