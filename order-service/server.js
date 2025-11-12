require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5003;
const GATEWAY = process.env.API_GATEWAY || "http://localhost:5000";

// 🔗 Connect ke MongoDB
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// ✅ Model
const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  restaurantId: { type: String, required: true },
  items: [{ name: String, quantity: Number, price: Number }],
  totalPrice: Number,
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', orderSchema);

// ✅ Routes
app.get('/', (req, res) => res.send('Order Service running 🚀'));

app.post('/orders', async (req, res) => {
  try {
    const { userId, restaurantId, items, totalPrice } = req.body;
    if (!userId || !restaurantId)
      return res.status(400).json({ message: 'userId and restaurantId required' });

    // Optional: validasi via gateway
    try {
      const [uResp, rResp] = await Promise.all([
        axios.get(`${GATEWAY}/users/${userId}`),
        axios.get(`${GATEWAY}/restaurants/${restaurantId}`)
      ]);
      if (!uResp.data || !rResp.data)
        return res.status(400).json({ message: 'user or restaurant not found' });
    } catch (err) {
      return res.status(400).json({ message: 'Failed to verify user/restaurant' });
    }

    const order = new Order({ userId, restaurantId, items, totalPrice });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/orders', async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

app.put('/orders/:id', async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/orders/:id', async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Start server
app.listen(PORT, () => console.log(`Order Service running on port ${PORT}`));
