const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
//ดึง
router.get('/', customerController.getAllCustomers);

//ลบ
router.delete('/:id', customerController.deleteCustomer);
//สถานะ
router.patch('/:id/status', customerController.changeCustomerStatus);
//ลงทะเบียน
router.post('/login', customerController.login);
//สมัครสมาชิก
router.post('/register', customerController.registerCustomer); 




module.exports = router;
