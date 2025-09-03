const express = require('express');
const { createOrder, estimatePrice, listOrders, updateOrderStatus } = require('../controllers/customOrdersController');
const router = express.Router();

// POST /api/custom/estimate
router.post('/estimate', estimatePrice);

// POST /api/custom/order
router.post('/order', createOrder);

// GET /api/custom/orders (admin list)
router.get('/orders', listOrders);

// PUT /api/custom/order/:id/status (admin update)
router.put('/order/:id/status', updateOrderStatus);

module.exports = router;
