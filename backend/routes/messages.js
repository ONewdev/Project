const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');


// ดึงข้อความทั้งหมด (admin)
router.get('/all', messageController.getAllMessages);

router.get('/', messageController.getMessages);
router.post('/', messageController.sendMessage);
router.get('/contacts', messageController.getContacts); // คนที่เคยแชทด้วย

module.exports = router;