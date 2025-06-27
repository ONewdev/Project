// routes/contactInfoRoutes.js
const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

router.get('/', contactController.getContact);
router.put('/', contactController.updateContact);

module.exports = router;
