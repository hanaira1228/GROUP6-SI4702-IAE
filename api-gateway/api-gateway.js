import "dotenv/config";

import express from "express";
import cors from "cors";
import morgan from "morgan";
import { ApolloServer } from "apollo-server-express";
import axios from "axios";
import { createProxyMiddleware } from "http-proxy-middleware";

// ====== GRAPHQL SCHEMA & RESOLVER ======
import typeDefs from "./graphql/schema.js";       // gabungan schema
import resolvers from "./graphql/resolvers.js";   // gabungan resolver

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));

// ====== SERVICE URL ======
const USER_SERVICE =
  process.env.USER_SERVICE_URL || "http://localhost:3001";

const RESTAURANT_SERVICE =
  process.env.RESTAURANT_SERVICE_URL || "http://localhost:3002";

const ORDER_SERVICE =
  process.env.ORDER_SERVICE_URL || "http://localhost:3003";

// ====== REST API PROXY ======
// Proxy /api/users to user service
app.use(
  "/api/users",
  createProxyMiddleware({
    target: USER_SERVICE,
    changeOrigin: true,
    pathRewrite: {
      "^/api/users": "/users",
    },
  })
);

// Proxy /api/restaurants to restaurant service
app.use(
  "/api/restaurants",
  createProxyMiddleware({
    target: RESTAURANT_SERVICE,
    changeOrigin: true,
    pathRewrite: {
      "^/api/restaurants": "/restaurants",
    },
  })
);

// Proxy /api/orders to order service (using axios for POST/PUT, proxy for GET/DELETE)
app.post("/api/orders", async (req, res) => {
  try {
    const response = await axios.post(`${ORDER_SERVICE}/orders`, req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Order creation error:", error.message);
    res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || error.message,
    });
  }
});

// Handle PUT requests directly with axios
app.put("/api/orders/:id", async (req, res) => {
  try {
    const response = await axios.put(`${ORDER_SERVICE}/orders/${req.params.id}`, req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Order update error:", error.message);
    res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || error.message,
    });
  }
});

app.use(
  "/api/orders",
  createProxyMiddleware({
    target: ORDER_SERVICE,
    changeOrigin: true,
    pathRewrite: {
      "^/api/orders": "/orders",
    },
    // Only proxy GET, DELETE (POST and PUT are handled above)
    filter: (pathname, req) => {
      return req.method !== "POST" && req.method !== "PUT";
    },
  })
);

// ====== ROOT CHECK ======
app.get("/", (req, res) => {
  res.json({
    service: "api-gateway",
    status: "running",
    graphql: "/graphql",
    services: {
      user: USER_SERVICE,
      restaurant: RESTAURANT_SERVICE,
      order: ORDER_SERVICE,
    },
  });
});

// ====== START SERVER ======
async function startServer() {
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => ({
      services: {
        user: USER_SERVICE,
        restaurant: RESTAURANT_SERVICE,
        order: ORDER_SERVICE,
      },
      axios,
    }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: "/graphql" });

  const PORT = process.env.API_GATEWAY_PORT || 3000;
  app.listen(PORT, () => {
    console.log("🌐 API Gateway running");
    console.log(`🚀 GraphQL → http://localhost:${PORT}/graphql`);
  });
}

startServer().catch((err) => {
  console.error("❌ Gateway failed to start:", err);
});