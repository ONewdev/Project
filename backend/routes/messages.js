const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

router.get('/', messageController.getMessages);
router.post('/', messageController.sendMessage);
router.get('/contacts', messageController.getContacts); // คนที่เคยแชทด้วย

module.exports = router;