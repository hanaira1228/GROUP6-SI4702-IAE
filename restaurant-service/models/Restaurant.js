const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  user: String,
  rating: { type: Number, required: true },
  comment: String
});

const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: String,
  reviews: { type: [ReviewSchema], default: [] },
  menus: { type: [{ name: String, price: Number }], default: [] } // tambahin ini biar bisa add menu
}, { timestamps: true });

RestaurantSchema.virtual("rating").get(function () {
  const reviews = this.reviews || [];
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return sum / reviews.length;
});

module.exports = mongoose.model("Restaurant", RestaurantSchema);