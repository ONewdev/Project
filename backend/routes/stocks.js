const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

// ดึงข้อมูลสต็อกทั้งหมด
router.get('/', stockController.getAllStocks);

// เพิ่มสต็อกใหม่
router.post('/', stockController.addStock);

// แก้ไขสต็อก
router.patch('/:id', stockController.updateStock);

// ลบสต็อก
router.delete('/:id', stockController.deleteStock);

module.exports = router;
