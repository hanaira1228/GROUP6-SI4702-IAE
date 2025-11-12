const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName: String,
  restaurantId: String,
  items: Array,
  totalPrice: Number,
  status: { type: String, default: 'Pending' }
});

module.exports = mongoose.model('Order', orderSchema);
