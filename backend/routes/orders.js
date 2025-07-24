const express = require('express');
const router = express.Router();
const orderController = require('../controllers/ordersController');

router.get('/', orderController.getAllOrders);
router.post('/', orderController.createOrder);
router.patch('/:id', orderController.updateOrder);
router.delete('/:id', orderController.deleteOrder);
router.get('/:id', orderController.getOrderById); // optional

module.exports = router;
