const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// ดึงข้อมูลหมวดหมู่ทั้งหมด
router.get('/', categoryController.getAllCategories);
// เพิ่มหมวดหมู่ใหม่
router.post('/', categoryController.addCategory);
// แก้ไขหมวดหมู่
router.patch('/:id', categoryController.updateCategory);
// ลบหมวดหมู่
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;

