const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/', adminController.getAllAdmins);
router.patch('/:id', adminController.updateAdmin);
router.delete('/:id', adminController.deleteAdmin);

// ตรวจสอบ JWT admin (cookie auth)
const { authenticateToken } = require('../middlewares/authMiddleware');
router.get('/me', authenticateToken, (req, res) => {
  // คืนข้อมูล admin ที่ login อยู่ (หรือแค่ 200 OK ก็พอ)
  res.json({ success: true, user: req.user });
});
const { clearAuthCookie } = require('../utils/authCookie');
router.post('/logout', (req, res) => {
  clearAuthCookie(res, 'admin');
  res.json({ message: 'ออกจากระบบสำเร็จ' });
});

module.exports = router;