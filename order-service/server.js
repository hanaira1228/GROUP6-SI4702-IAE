import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import axios from "axios";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5003;
const GATEWAY = process.env.API_GATEWAY || "http://localhost:5000"; // gunakan gateway kalau ada

// connect
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => {
    console.error("MongoDB connection error:", err.message || err);
    process.exit(1);
  });

// model
const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  restaurantId: { type: String, required: true },
  items: [{ name: String, quantity: Number, price: Number }],
  totalPrice: Number,
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now }
});
const Order = mongoose.model("Order", orderSchema);

// routes
app.get("/", (req, res) => res.send("Order Service running"));

app.post("/orders", async (req, res) => {
  try {
    const { userId, restaurantId, items, totalPrice } = req.body;
    if (!userId || !restaurantId) return res.status(400).json({ message: "userId and restaurantId required" });

    // optional: validasi user & restaurant via API Gateway
    try {
      const [uResp, rResp] = await Promise.all([
        axios.get(`${GATEWAY}/users/${userId}`),
        axios.get(`${GATEWAY}/restaurants/${restaurantId}`)
      ]);
      if (!uResp.data || !rResp.data) return res.status(400).json({ message: "user or restaurant not found" });
    } catch (err) {
      return res.status(400).json({ message: "failed to verify user/restaurant", detail: err.response?.data || err.message });
    }

    const order = new Order({ userId, restaurantId, items, totalPrice });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/orders", async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

app.get("/orders/user/:userId", async (req, res) => {
  const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
  res.json(orders);
});

app.put("/orders/:id", async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete("/orders/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () => console.log(`Order Service running on port ${PORT}`));
