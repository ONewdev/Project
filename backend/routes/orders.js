const express = require('express');
const router = express.Router();
const orderController = require('../controllers/ordersController');

// สร้างคำสั่งซื้อใหม่
router.post('/create', orderController.createOrder);

// ดึงคำสั่งซื้อทั้งหมด (สำหรับ admin)
router.get('/', orderController.getAllOrders);

// ดึงคำสั่งซื้อตาม customer_id
router.get('/customer/:customer_id', orderController.getOrdersByCustomer);

// อัปเดตสถานะคำสั่งซื้อ
router.patch('/:id/status', orderController.updateOrderStatus);

// ลบคำสั่งซื้อ
router.delete('/:id', orderController.deleteOrder);

module.exports = router;

