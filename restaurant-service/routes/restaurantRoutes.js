import express from "express";
import Restaurant from "../models/Restaurant.js";

const router = express.Router();

// =======================
// CREATE RESTAURANT
// =======================
router.post("/", async (req, res) => {
  const { name, address } = req.body;

  try {
    const restaurant = new Restaurant({ name, address });
    const saved = await restaurant.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// =======================
// GET ALL RESTAURANTS
// =======================
router.get("/", async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =======================
// GET ALL MENUS (GLOBAL)
// HARUS DI ATAS /:id
// =======================
router.get("/menus", async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const restaurants = await Restaurant.find({}, "name menus");

    const allMenus = restaurants.flatMap((r) =>
      r.menus.map((menu) => ({
        _id: menu._id,
        name: menu.name,
        price: menu.price,
        createdAt: menu.createdAt,
        restaurant: {
          _id: r._id,
          name: r.name,
        },
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
    res.status(500).json({ message: err.message });
  }
});

// =======================
// GET LATEST MENUS (GLOBAL - 5 MOST RECENT)
// HARUS DI ATAS /:id
// =======================
router.get("/menus/latest", async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 5;

    const restaurants = await Restaurant.find({}, "name menus");

    const allMenus = restaurants.flatMap((r) =>
      r.menus.map((menu) => ({
        _id: menu._id,
        name: menu.name,
        price: menu.price,
        createdAt: menu.createdAt || r.createdAt || new Date(),
        restaurant: {
          _id: r._id,
          name: r.name,
        },
      }))
    );

    // Sort by createdAt descending and take latest
    const latestMenus = allMenus
      .sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      })
      .slice(0, limit);

    res.json({
      menus: latestMenus,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =======================
// GET RESTAURANT BY ID
// =======================
router.get("/:id", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.json(restaurant);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// =======================
// UPDATE RESTAURANT
// =======================
router.put("/:id", async (req, res) => {
  try {
    const updated = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// =======================
// DELETE RESTAURANT
// =======================
router.delete("/:id", async (req, res) => {
  try {
    const removed = await Restaurant.findByIdAndDelete(req.params.id);
    if (!removed) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.json({ message: "Restaurant deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =======================
// ADD MENU TO RESTAURANT
// =======================
router.post("/:id/menus", async (req, res) => {
  const { name, price } = req.body;

  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    restaurant.menus.push({ name, price, createdAt: new Date() });
    await restaurant.save();

    res.status(201).json({
      name,
      price,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// =======================
// GET MENUS BY RESTAURANT
// =======================
router.get("/:id/menus", async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const restaurant = await Restaurant.findById(req.params.id, "name menus");
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const menus = restaurant.menus.map((menu) => ({
      _id: menu._id,
      name: menu.name,
      price: menu.price,
      createdAt: menu.createdAt,
    }));

    const paginated = menus.slice(skip, skip + limit);

    res.json({
      restaurantName: restaurant.name,
      total: menus.length,
      page,
      totalPages: Math.ceil(menus.length / limit),
      menus: paginated,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =======================
// ADD REVIEW
// =======================
router.post("/:id/reviews", async (req, res) => {
  const { user, rating, comment } = req.body;

  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    restaurant.reviews.push({ user, rating, comment });
    await restaurant.save();

    const avgRating =
      restaurant.reviews.reduce((sum, r) => sum + r.rating, 0) /
      restaurant.reviews.length;

    restaurant.rating = avgRating;
    await restaurant.save();

    res.status(201).json({
      rating: avgRating,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;