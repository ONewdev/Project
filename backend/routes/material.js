const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');

// ดึงข้อมูลวัสดุทั้งหมด
router.get('/', materialController.getAllMaterials);

// เพิ่มวัสดุใหม่
router.post('/', materialController.addMaterial);

// แก้ไขวัสดุ
router.patch('/:id', materialController.updateMaterial);

// ลบวัสดุ
router.delete('/:id', materialController.deleteMaterial);

module.exports = router;
