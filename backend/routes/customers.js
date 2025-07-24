const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { authenticateCustomer } = require('../middlewares/customerAuth');

// ตรวจสอบ JWT ลูกค้า (cookie auth)
router.get('/me', authenticateCustomer, (req, res) => {
  res.json({ success: true, user: req.customer });
});

//ดึง
router.get('/', customerController.getAllCustomers);
//ลบ
router.delete('/:id', customerController.deleteCustomer);
//สถานะ
router.patch('/:id/status', customerController.changeCustomerStatus);
//ลงทะเบียน
router.post('/login', customerController.login);
// ดึงข้อมูลลูกค้า 1 คน
router.get('/:id', customerController.getCustomerById);
// อัปเดตโปรไฟล์
router.put('/:id', customerController.updateCustomerProfile);
//สมัครสมาชิก
router.post('/register', customerController.registerCustomer); 

module.exports = router;
