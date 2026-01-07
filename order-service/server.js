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
  customerName: String,
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
    console.log("📦 POST /orders - Received:", JSON.stringify(req.body));
    const order = await Order.create(req.body);
    console.log("✅ Order created:", order._id);
    res.status(201).json(order);
  } catch (err) {
    console.error("❌ Order creation error:", err);
    res.status(500).json({ message: err.message });
  }
});

app.get("/orders", async (_, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    console.error("❌ Error fetching orders:", err);
    res.status(500).json({ message: err.message });
  }
});

app.put("/orders/:id", async (req, res) => {
  try {
    console.log(`📝 PUT /orders/${req.params.id} - Updating:`, JSON.stringify(req.body));
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    console.log("✅ Order updated:", updatedOrder._id, "- Status:", updatedOrder.status);
    res.json(updatedOrder);
  } catch (err) {
    console.error("❌ Error updating order:", err);
    res.status(500).json({ message: err.message });
  }
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