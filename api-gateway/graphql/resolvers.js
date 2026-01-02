import axios from "axios";
import { GraphQLError } from "graphql";

const USER_SERVICE =
  process.env.USER_SERVICE_URL || "http://localhost:3001";
const RESTAURANT_SERVICE =
  process.env.RESTAURANT_SERVICE_URL || "http://localhost:3002";
const ORDER_SERVICE =
  process.env.ORDER_SERVICE_URL || "http://localhost:3003";

// helper biar konsisten & ga bocor axios error
const handleError = (err, fallback) => {
  const message =
    err?.response?.data?.message ||
    err?.message ||
    fallback;

  throw new GraphQLError(message);
};

const resolvers = {
  Query: {
    // ================= USER =================
    users: async () => {
      try {
        const res = await axios.get(`${USER_SERVICE}/users`);
        return res.data;
      } catch (err) {
        handleError(err, "Failed to fetch users");
      }
    },

    // ================= RESTAURANT =================
    restaurants: async () => {
      try {
        const res = await axios.get(`${RESTAURANT_SERVICE}/`);
        return res.data;
      } catch (err) {
        handleError(err, "Failed to fetch restaurants");
      }
    },

    restaurant: async (_, { id }) => {
      try {
        const res = await axios.get(`${RESTAURANT_SERVICE}/${id}`);
        return res.data;
      } catch (err) {
        handleError(err, "Restaurant not found");
      }
    },

    // ================= ORDER =================
    orders: async () => {
      try {
        const res = await axios.get(`${ORDER_SERVICE}/orders`);
        return res.data;
      } catch (err) {
        handleError(err, "Failed to fetch orders");
      }
    },

    order: async (_, { id }) => {
      try {
        const res = await axios.get(`${ORDER_SERVICE}/orders/${id}`);
        return res.data;
      } catch (err) {
        handleError(err, "Order not found");
      }
    },
  },

  Mutation: {
    // ================= USER =================
    register: async (_, args) => {
      try {
        const res = await axios.post(`${USER_SERVICE}/register`, args);
        return res.data;
      } catch (err) {
        handleError(err, "Failed to register user");
      }
    },

    // ================= RESTAURANT =================
    createRestaurant: async (_, { data }) => {
      try {
        const res = await axios.post(`${RESTAURANT_SERVICE}/`, data);
        return res.data;
      } catch (err) {
        handleError(err, "Failed to create restaurant");
      }
    },

    addMenu: async (_, { restaurantId, menu }) => {
      try {
        const res = await axios.post(
          `${RESTAURANT_SERVICE}/${restaurantId}/menus`,
          menu
        );
        return res.data;
      } catch (err) {
        handleError(err, "Failed to add menu");
      }
    },

    addReview: async (_, { restaurantId, review }) => {
      try {
        const res = await axios.post(
          `${RESTAURANT_SERVICE}/${restaurantId}/reviews`,
          review
        );
        return res.data;
      } catch (err) {
        handleError(err, "Failed to add review");
      }
    },

    // ================= ORDER =================
    createOrder: async (_, { data }) => {
      try {
        const res = await axios.post(`${ORDER_SERVICE}/orders`, data);
        return res.data;
      } catch (err) {
        handleError(err, "Failed to create order");
      }
    },

    updateOrder: async (_, { id, data }) => {
      try {
        const res = await axios.put(`${ORDER_SERVICE}/orders/${id}`, data);
        return res.data;
      } catch (err) {
        handleError(err, "Failed to update order");
      }
    },

    deleteOrder: async (_, { id }) => {
      try {
        const res = await axios.delete(`${ORDER_SERVICE}/orders/${id}`);
        return res.data;
      } catch (err) {
        handleError(err, "Failed to delete order");
      }
    },
  },
};

export default resolvers;