const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant'); // path case-sensitive

// POST create restaurant
router.post('/', async (req, res) => {
  const { name, address, rating, menus } = req.body;
  try {
    const restaurant = new Restaurant({ name, address, rating, menus });
    const saved = await restaurant.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET all restaurants
router.get('/', async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update restaurant by ID
router.put('/:id', async (req, res) => {
  try {
    const updated = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Restaurant not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE restaurant by ID
router.delete('/:id', async (req, res) => {
  try {
    const removed = await Restaurant.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: 'Restaurant not found' });
    res.json({ message: 'Restaurant deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
