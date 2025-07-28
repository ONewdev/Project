const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const paymentController = require('../controllers/paymentController');

const upload = multer({
  dest: path.join(__dirname, '../public/uploads/payments')
});

// ชำระเงิน (แนบหลักฐาน)
router.post('/', upload.single('proof_image'), paymentController.createPayment);

// ตรวจสอบสถานะ
router.get('/status/:order_id', paymentController.checkPaymentStatus);

// อัปเดตสถานะ (admin ยืนยัน)
router.put('/:id', paymentController.updatePaymentStatus);

module.exports = router;
