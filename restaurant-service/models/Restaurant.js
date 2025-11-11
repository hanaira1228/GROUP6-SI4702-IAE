const mongoose = require('mongoose');

const MenuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true }
});

const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: String,
  rating: { type: Number, default: 0 },
  menus: { type: [MenuSchema], default: [] }
}, { timestamps: true });

// Export model
module.exports = mongoose.model('Restaurant', RestaurantSchema);
