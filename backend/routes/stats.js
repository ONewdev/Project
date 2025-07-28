const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

// GET /api/stats
router.get('/', statsController.getStatistics);

module.exports = router;