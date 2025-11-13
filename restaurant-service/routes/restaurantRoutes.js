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

// POST add menu to a restaurant
router.post('/:id/menus', async (req, res) => {
  const { name, price } = req.body;
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

    restaurant.menus.push({ name, price });
    await restaurant.save();

    res.status(201).json({ message: 'Menu added', menu: { name, price } });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET all menus from all restaurants with pagination
// GET /api/restaurants/menus?limit=10&page=1
router.get("/menus", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const restaurants = await Restaurant.find({}, "name menus");

    const allMenus = restaurants.flatMap((r) =>
      r.menus.map((menu) => ({
        _id: menu._id,
        name: menu.name,
        price: menu.price,
        restaurant: { _id: r._id, name: r.name },
      }))
    );

    const paginated = allMenus.slice(skip, skip + limit);

    res.json({
      total: allMenus.length,
      page,
      totalPages: Math.ceil(allMenus.length / limit),
      menus: paginated,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// GET menus from specific restaurant with pagination
// GET /api/restaurants/:id/menus?limit=5&page=1
router.get("/:id/menus", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const restaurant = await Restaurant.findById(req.params.id, "name menus");
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    const paginatedMenus = restaurant.menus
      .slice(skip, skip + limit)
      .map((menu) => ({
        _id: menu._id,
        name: menu.name,
        price: menu.price,
        restaurant: { _id: restaurant._id, name: restaurant.name },
      }));

    res.json({
      restaurantName: restaurant.name,
      total: restaurant.menus.length,
      page,
      totalPages: Math.ceil(restaurant.menus.length / limit),
      menus: paginatedMenus,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

router.post("/:id/reviews", async (req, res) => {
  const { user, rating, comment } = req.body;
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    restaurant.reviews.push({ user, rating, comment });
    await restaurant.save();
    res.status(201).json({ message: "Review added", rating: restaurant.reviews.length ? restaurant.reviews.reduce((a,b)=>a+b.rating,0)/restaurant.reviews.length : 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
