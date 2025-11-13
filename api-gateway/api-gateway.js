require('dotenv').config();

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

function createApiGateway(options = {}) {
    const app = express();

    // jangan pakai express.json() atau urlencoded() di gateway
    // biar request body gak "habis dibaca" sebelum diteruskan ke service lain

    const userService = options.userServiceUrl || process.env.USER_SERVICE_URL || 'http://localhost:3001';
    const restaurantService = options.restaurantServiceUrl || process.env.RESTAURANT_SERVICE_URL || 'http://localhost:3002';
    const orderService = options.orderServiceUrl || process.env.ORDER_SERVICE_URL || 'http://localhost:3003';

    app.get('/', (req, res) => {
        res.json({
            service: 'api-gateway',
            routes: ['/api/users', '/api/restaurants', '/api/orders'],
            targets: { userService, restaurantService, orderService }
        });
    });

    // 🔹 user-service
    app.use('/api/users', createProxyMiddleware({
        target: userService,
        changeOrigin: true,
        pathRewrite: { '^/api/users': '' },
        onProxyReq: (proxyReq, req) => {
            if (req.ip) proxyReq.setHeader('x-forwarded-for', req.ip);
        }
    }));

    // 🔹 restaurant-service
    app.use('/api/restaurants', createProxyMiddleware({
        target: restaurantService,
        changeOrigin: true,
        pathRewrite: { '^/api/restaurants': '' },
        onProxyReq: (proxyReq, req) => {
            if (req.ip) proxyReq.setHeader('x-forwarded-for', req.ip);
        }
    }));

    // 🔹 order-service
    app.use('/api/orders', createProxyMiddleware({
        target: orderService,
        changeOrigin: true,
        pathRewrite: { '^/api/orders': '' },
        onProxyReq: (proxyReq, req) => {
            if (req.ip) proxyReq.setHeader('x-forwarded-for', req.ip);
        }
    }));

    // 404 handler
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
    });
}