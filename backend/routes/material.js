const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');

// เพิ่มวัสดุใหม่ (พร้อมรูปภาพ)
router.post('/', materialController.uploadMaterialImage, materialController.addMaterial);

// แก้ไขวัสดุ (พร้อมรูปภาพ)
router.put('/:id', materialController.uploadMaterialImage, materialController.updateMaterial);

// ลบวัสดุ
router.delete('/:id', materialController.deleteMaterial);

// ลบเฉพาะรูปภาพวัสดุ
router.delete('/:id/image', materialController.deleteMaterialImage);

// ดึงข้อมูลวัสดุทั้งหมด
router.get('/', materialController.getAllMaterials);

module.exports = router;