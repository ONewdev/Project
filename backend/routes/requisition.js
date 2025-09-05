// routes/requisition.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/requisitionController');

// สร้างใบเบิก + ตัดสต๊อก
router.post('/', ctrl.createRequisition);

// รายการใบเบิก (อ็อปชัน: รองรับ q,page,limit)
router.get('/', ctrl.listRequisitions);

// ดูเอกสารพร้อมรายการ
router.get('/:id', ctrl.getRequisitionById);

module.exports = router;
