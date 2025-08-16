const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { authenticateCustomer } = require('../middlewares/customerAuth');

// ตรวจสอบ JWT ลูกค้า (cookie auth)
router.get('/me', authenticateCustomer, (req, res) => {
  res.json({ success: true, user: req.customer });
});

// ดึงข้อมูล user profile (ใช้ token)
router.get('/profile', authenticateCustomer, async (req, res) => {
  try {
    const db = require('../db');
    const user = await db('customers')
      .select('id', 'email', 'name', 'status', 'profile_picture', 'created_at', 'updated_at')
      .where({ id: req.customer.user_id })
      .first();

    if (!user) {
      return res.status(404).json({ message: 'ไม่พบผู้ใช้งาน' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error.message);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดที่เซิร์ฟเวอร์' });
  }
});

//ดึง
router.get('/', customerController.getAllCustomers);
//ลบ
router.delete('/:id', customerController.deleteCustomer);
//สถานะ
router.patch('/:id/status', customerController.changeCustomerStatus);
//อัปเดตข้อมูลทั่วไป
router.patch('/:id', customerController.updateCustomer);
//ลงทะเบียน
router.post('/login', customerController.login);
// ดึงข้อมูลลูกค้า 1 คน
router.get('/:id', customerController.getCustomerById);
// อัปเดตโปรไฟล์
router.put('/:id', customerController.uploadProfilePicture, customerController.updateCustomerProfile);
//สมัครสมาชิก
router.post('/register', customerController.registerCustomer); 

// ดึงรายการโปรดของลูกค้า
router.get('/:id/favorites', customerController.getCustomerFavorites);
// ลบโปรไฟล์ลูกค้า (delete account)
router.delete('/:id/delete', customerController.deleteCustomerProfile);

module.exports = router;
