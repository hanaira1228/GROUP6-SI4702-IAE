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
  // Log error untuk debugging
  console.error("❌ GraphQL Error:", {
    message: err?.message,
    response: err?.response?.data,
    status: err?.response?.status,
    url: err?.config?.url,
    code: err?.code,
  });

  // Extract error message dengan lebih detail
  let message = fallback;
  
  if (err?.response) {
    // HTTP Error Response
    message = err.response.data?.message || 
              err.response.data?.error || 
              `HTTP ${err.response.status}: ${err.response.statusText}` ||
              fallback;
  } else if (err?.code === "ECONNREFUSED") {
    // Connection refused - service tidak running
    message = `Cannot connect to service. Make sure the service is running. (${err.message})`;
  } else if (err?.code === "ETIMEDOUT") {
    // Timeout
    message = `Request timeout. Service may be slow or unavailable.`;
  } else if (err?.message) {
    // Other errors
    message = err.message;
  }

  throw new GraphQLError(message);
};

// helper untuk convert MongoDB _id ke GraphQL id
const transformRestaurant = (restaurant) => {
  if (!restaurant) return null;
  
  const { _id, ...rest } = restaurant;
  return {
    ...rest,
    id: _id || restaurant.id,
  };
};

// helper untuk transform array of restaurants
const transformRestaurants = (restaurants) => {
  if (!Array.isArray(restaurants)) return [];
  return restaurants.map(transformRestaurant);
};

const resolvers = {
  Query: {
    // ================= USER =================
    users: async () => {
      try {
        const res = await axios.get(`${USER_SERVICE}/users`, {
          timeout: 5000,
        });
        return res.data;
      } catch (err) {
        console.error("Users query error:", err);
        handleError(err, "Failed to fetch users");
      }
    },

    // ================= RESTAURANT =================
    restaurants: async () => {
      try {
        const res = await axios.get(`${RESTAURANT_SERVICE}/restaurants`);
        return transformRestaurants(res.data);
      } catch (err) {
        handleError(err, "Failed to fetch restaurants");
      }
    },

    restaurant: async (_, { id }) => {
      try {
        const res = await axios.get(`${RESTAURANT_SERVICE}/restaurants/${id}`);
        return transformRestaurant(res.data);
      } catch (err) {
        handleError(err, "Restaurant not found");
      }
    },

    menus: async (_, { page = 1, limit = 10 }) => {
      try {
        const res = await axios.get(
          `${RESTAURANT_SERVICE}/restaurants/menus?page=${page}&limit=${limit}`
        );
        return res.data;
      } catch (err) {
        handleError(err, "Failed to fetch menus");
      }
    },

    latestMenus: async (_, { limit = 5 }) => {
      try {
        const res = await axios.get(
          `${RESTAURANT_SERVICE}/restaurants/menus/latest?limit=${limit}`
        );
        return res.data;
      } catch (err) {
        handleError(err, "Failed to fetch latest menus");
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
        // User service uses POST /users for registration, not /register
        const res = await axios.post(`${USER_SERVICE}/users`, {
          name: args.name,
          email: args.email,
          password: args.password,
        }, {
          timeout: 5000,
        });
        return res.data;
      } catch (err) {
        console.error("Register mutation error:", err);
        handleError(err, "Failed to register user");
      }
    },

    // ================= RESTAURANT =================
    createRestaurant: async (_, { data }) => {
      try {
        console.log("📝 Creating restaurant:", data);
        console.log("🔗 Calling:", `${RESTAURANT_SERVICE}/restaurants`);
        
        const res = await axios.post(`${RESTAURANT_SERVICE}/restaurants`, data);
        console.log("✅ Restaurant created:", res.data);
        
        return transformRestaurant(res.data);
      } catch (err) {
        handleError(err, "Failed to create restaurant");
      }
    },

    updateRestaurant: async (_, { id, data }) => {
      try {
        const res = await axios.put(`${RESTAURANT_SERVICE}/restaurants/${id}`, data);
        return transformRestaurant(res.data);
      } catch (err) {
        handleError(err, "Failed to update restaurant");
      }
    },

    deleteRestaurant: async (_, { id }) => {
      try {
        const res = await axios.delete(`${RESTAURANT_SERVICE}/restaurants/${id}`);
        return { message: res.data.message || "Restaurant deleted successfully" };
      } catch (err) {
        handleError(err, "Failed to delete restaurant");
      }
    },

    addMenu: async (_, { restaurantId, menu }) => {
      try {
        await axios.post(
          `${RESTAURANT_SERVICE}/restaurants/${restaurantId}/menus`,
          menu
        );
        // Fetch updated restaurant to return full data
        const res = await axios.get(`${RESTAURANT_SERVICE}/restaurants/${restaurantId}`);
        return transformRestaurant(res.data);
      } catch (err) {
        handleError(err, "Failed to add menu");
      }
    },

    addReview: async (_, { restaurantId, review }) => {
      try {
        await axios.post(
          `${RESTAURANT_SERVICE}/restaurants/${restaurantId}/reviews`,
          review
        );
        // Fetch updated restaurant to return full data
        const res = await axios.get(`${RESTAURANT_SERVICE}/restaurants/${restaurantId}`);
        return transformRestaurant(res.data);
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