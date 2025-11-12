// order-service/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// ✅ Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Create new order
router.post('/', async (req, res) => {
  const order = new Order({
    customerName: req.body.customerName,
    restaurantId: req.body.restaurantId,
    items: req.body.items,
    totalPrice: req.body.totalPrice
  });

  try {
    const newOrder = await order.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ Get one order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Update order status
router.put('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ Delete order
router.delete('/:id', async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
