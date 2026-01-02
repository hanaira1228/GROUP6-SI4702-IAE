import "dotenv/config";

import express from "express";
import cors from "cors";
import morgan from "morgan";
import { ApolloServer } from "apollo-server-express";
import axios from "axios";

// ====== GRAPHQL SCHEMA & RESOLVER ======
import typeDefs from "./graphql/schema.js";       // gabungan schema
import resolvers from "./graphql/resolvers.js";   // gabungan resolver

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// ====== SERVICE URL ======
const USER_SERVICE =
  process.env.USER_SERVICE_URL || "http://localhost:3001";

const RESTAURANT_SERVICE =
  process.env.RESTAURANT_SERVICE_URL || "http://localhost:3002";

const ORDER_SERVICE =
  process.env.ORDER_SERVICE_URL || "http://localhost:3003";

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