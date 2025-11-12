// order-service/models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true
  },
  restaurantId: {
    type: String,
    required: true
  },
  items: [
    {
      name: String,
      price: Number,
      quantity: Number
    }
  ],
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    default: "Pending"
  }
});

module.exports = mongoose.model('Order', orderSchema);
