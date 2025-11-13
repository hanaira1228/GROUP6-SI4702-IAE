const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "🍔 Food Delivery API Gateway",
    version: "1.0.0",
    description:
      "Dokumentasi lengkap untuk sistem **Food Delivery** (Users, Restaurants, Orders).",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Local API Gateway Server",
    },
  ],
  tags: [
    { name: "Users", description: "Endpoints untuk manajemen user" },
    { name: "Restaurants", description: "Endpoints untuk data restoran" },
    { name: "Orders", description: "Endpoints untuk pesanan" },
  ],
  paths: {
    // ================== USERS ==================
    "/api/users": {
      get: {
        tags: ["Users"],
        summary: "Ambil semua user",
        responses: {
          200: { description: "Berhasil ambil semua user" },
        },
      },
      post: {
        tags: ["Users"],
        summary: "Tambah user baru",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  email: { type: "string" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "User berhasil ditambahkan" },
        },
      },
    },
    "/api/users/{id}": {
      get: {
        tags: ["Users"],
        summary: "Ambil detail user berdasarkan ID",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          200: { description: "Detail user ditemukan" },
          404: { description: "User tidak ditemukan" },
        },
      },
      put: {
        tags: ["Users"],
        summary: "Perbarui data user",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  email: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "User berhasil diperbarui" },
        },
      },
      delete: {
        tags: ["Users"],
        summary: "Hapus user berdasarkan ID",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          200: { description: "User berhasil dihapus" },
        },
      },
    },

    // ================== RESTAURANTS ==================
    "/api/restaurants": {
      get: {
        tags: ["Restaurants"],
        summary: "Ambil semua restoran",
        responses: {
          200: { description: "Daftar restoran berhasil diambil" },
        },
      },
      post: {
        tags: ["Restaurants"],
        summary: "Tambah restoran baru",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  address: { type: "string" },
                  rating: { type: "number" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Restoran berhasil ditambahkan" },
        },
      },
    },
    "/api/restaurants/{id}": {
      get: {
        tags: ["Restaurants"],
        summary: "Ambil detail restoran berdasarkan ID",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          200: { description: "Detail restoran ditemukan" },
          404: { description: "Restoran tidak ditemukan" },
        },
      },
      put: {
        tags: ["Restaurants"],
        summary: "Perbarui data restoran",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  address: { type: "string" },
                  rating: { type: "number" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Restoran berhasil diperbarui" },
        },
      },
      delete: {
        tags: ["Restaurants"],
        summary: "Hapus restoran berdasarkan ID",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          200: { description: "Restoran berhasil dihapus" },
        },
      },
    },

    // ================== ORDERS ==================
    "/api/orders": {
      get: {
        tags: ["Orders"],
        summary: "Ambil semua pesanan",
        responses: {
          200: { description: "Daftar pesanan berhasil diambil" },
        },
      },
      post: {
        tags: ["Orders"],
        summary: "Buat pesanan baru",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  userId: { type: "string" },
                  restaurantId: { type: "string" },
                  items: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        quantity: { type: "number" },
                      },
                    },
                  },
                  totalPrice: { type: "number" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Pesanan berhasil dibuat" },
        },
      },
    },
    "/api/orders/{id}": {
      get: {
        tags: ["Orders"],
        summary: "Ambil detail pesanan berdasarkan ID",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          200: { description: "Detail pesanan ditemukan" },
          404: { description: "Pesanan tidak ditemukan" },
        },
      },
      put: {
        tags: ["Orders"],
        summary: "Perbarui status pesanan",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Pesanan berhasil diperbarui" },
        },
      },
      delete: {
        tags: ["Orders"],
        summary: "Hapus pesanan berdasarkan ID",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          200: { description: "Pesanan berhasil dihapus" },
        },
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

function setupSwagger(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("📘 Swagger UI tersedia di: http://localhost:3000/api-docs");
}

module.exports = setupSwagger;