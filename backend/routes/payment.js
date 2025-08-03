const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const paymentController = require('../controllers/paymentController');

const upload = multer({
  dest: path.join(__dirname, '../public/uploads/payments')
});

// รองรับทั้ง proof_image และ image
function flexibleSingleFile(req, res, next) {
  const field = req.headers['content-type']?.includes('multipart') && req.body?.image ? 'image' : 'proof_image';
  return upload.single(field)(req, res, next);
}

// ชำระเงิน (แนบหลักฐาน)
router.post('/', flexibleSingleFile, paymentController.createPayment);

// ตรวจสอบสถานะ
router.get('/status/:order_id', paymentController.checkPaymentStatus);

// อัปเดตสถานะ (admin ยืนยัน)
router.put('/:id', paymentController.updatePaymentStatus);

module.exports = router;
