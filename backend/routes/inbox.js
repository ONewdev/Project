// backend/routes/inbox.js
const express = require('express');
const router = express.Router();
const inboxController = require('../controllers/inboxController');

router.post('/', inboxController.createInboxMessage);
router.get('/', inboxController.getInboxMessages);

module.exports = router;
