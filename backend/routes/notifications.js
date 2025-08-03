const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/customers/notifications
router.get('/', async (req, res) => {
  try {
    // สมมติว่ามี customer_id จาก session หรือ query
    const customer_id = req.user?.id || req.query.customer_id;
    console.log('GET /api/customers/notifications', { customer_id });
    if (!customer_id) return res.status(404).json({ message: 'ไม่พบผู้ใช้งาน' });
    const notifications = await db('notifications')
      .where({ customer_id })
      .orderBy('created_at', 'desc');
    console.log('notifications:', notifications);
    res.json(notifications);
  } catch (err) {
    console.error('Error in /api/customers/notifications:', err);
    res.status(500).json([]);
  }
});

module.exports = router;
