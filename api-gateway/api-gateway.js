require('dotenv').config();

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

function createApiGateway(options = {}) {
    const app = express();

    const userService = options.userServiceUrl || process.env.USER_SERVICE_URL || 'http://localhost:3001';
    const restaurantService = options.restaurantServiceUrl || process.env.RESTAURANT_SERVICE_URL || 'http://localhost:3002';
    const orderService = options.orderServiceUrl || process.env.ORDER_SERVICE_URL || 'http://localhost:3003';

    // 🔹 Swagger setup
    const swaggerOptions = {
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'Food Delivery API Gateway',
                version: '1.0.0',
                description: 'Dokumentasi API Gateway untuk sistem Food Delivery',
            },
            servers: [
                { url: `http://localhost:${process.env.API_GATEWAY_PORT || 3000}` },
            ],
        },
        apis: ['./api-gateway.js'], // ambil dokumentasi dari file ini
    };

    const swaggerSpec = swaggerJsdoc(swaggerOptions);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    /**
     * @swagger
     * /:
     *   get:
     *     summary: Cek status API Gateway
     *     description: Menampilkan informasi rute dan target service dari API Gateway.
     *     responses:
     *       200:
     *         description: Informasi gateway.
     *         content:
     *           application/json:
     *             example:
     *               service: "api-gateway"
     *               routes: ["/api/users", "/api/restaurants", "/api/orders"]
     *               docs: "/api-docs"
     */
    app.get('/', (req, res) => {
        res.json({
            service: 'api-gateway',
            routes: ['/api/users', '/api/restaurants', '/api/orders'],
            docs: '/api-docs',
            targets: { userService, restaurantService, orderService }
        });
    });

    /**
     * @swagger
     * /api/users:
     *   get:
     *     summary: Proxy ke User Service
     *     description: Mengarahkan permintaan ke service user (misalnya http://localhost:3001)
     *     responses:
     *       200:
     *         description: Respons dari user-service.
     */
    app.use('/api/users', createProxyMiddleware({
        target: userService,
        changeOrigin: true,
        pathRewrite: { '^/api/users': '' },
        onProxyReq: (proxyReq, req) => {
            if (req.ip) proxyReq.setHeader('x-forwarded-for', req.ip);
        }
    }));

    /**
     * @swagger
     * /api/restaurants:
     *   get:
     *     summary: Proxy ke Restaurant Service
     *     description: Mengarahkan permintaan ke service restaurant (misalnya http://localhost:3002)
     *     responses:
     *       200:
     *         description: Respons dari restaurant-service.
     */
    app.use('/api/restaurants', createProxyMiddleware({
        target: restaurantService,
        changeOrigin: true,
        pathRewrite: { '^/api/restaurants': '' },
        onProxyReq: (proxyReq, req) => {
            if (req.ip) proxyReq.setHeader('x-forwarded-for', req.ip);
        }
    }));

    /**
     * @swagger
     * /api/orders:
     *   get:
     *     summary: Proxy ke Order Service
     *     description: Mengarahkan permintaan ke service order (misalnya http://localhost:3003)
     *     responses:
     *       200:
     *         description: Respons dari order-service.
     */
    app.use('/api/orders', createProxyMiddleware({
        target: orderService,
        changeOrigin: true,
        pathRewrite: { '^/api/orders': '' },
        onProxyReq: (proxyReq, req) => {
            if (req.ip) proxyReq.setHeader('x-forwarded-for', req.ip);
        }
    }));

    app.use((req, res) => {
        res.status(404).json({ error: 'Not found on API Gateway' });
    });

    return app;
}

module.exports = { createApiGateway };

if (require.main === module) {
    const port = process.env.API_GATEWAY_PORT || 3000;
    const app = createApiGateway();
    
    app.listen(port, () => {
        console.log(`🌐 API Gateway listening on port ${port}`);
        console.log(`📘 Swagger Docs available at http://localhost:${port}/api-docs`);
    });
}