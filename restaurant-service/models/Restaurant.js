import mongoose from "mongoose";

// =======================
// REVIEW SCHEMA
// =======================
const reviewSchema = new mongoose.Schema({
  user: String,
  rating: {
    type: Number,
    required: true,
  },
  comment: String,
});

// =======================
// RESTAURANT SCHEMA
// =======================
const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: String,

    reviews: {
      type: [reviewSchema],
      default: [],
    },

    menus: {
      type: [
        {
          name: String,
          price: Number,
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// =======================
// VIRTUAL FIELD: rating
// =======================
restaurantSchema.virtual("rating").get(function () {
  const reviews = this.reviews || [];
  if (reviews.length === 0) return 0;

  const total = reviews.reduce((sum, r) => sum + r.rating, 0);
  return total / reviews.length;
});

// =======================
// MODEL EXPORT
// =======================
const Restaurant = mongoose.model("Restaurant", restaurantSchema);
export default Restaurant;