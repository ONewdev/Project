const db = require('../db');

// GET /api/notifications?customer_id=123
exports.getNotificationsByCustomer = async (req, res) => {
  try {
    const { customer_id } = req.query;
    if (!customer_id) {
      return res.status(400).json({ success: false, message: 'customer_id is required' });
    }

    const rows = await db('notifications')
      .select('*')
      .where({ customer_id })
      .orderBy('created_at', 'desc');

    res.json(rows);
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch notifications', error: err.message });
  }
};

exports.createNotification = async (req, res) => {
  try {
    const { customer_id, type, title, message } = req.body;

    if (!customer_id || !type || !title || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    const [notification] = await db('notifications').insert({
      customer_id,
      type,
      title,
      message,
      created_at: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      notification
    });
  } catch (err) {
    console.error('Error creating notification:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create notification',
      error: err.message 
    });
  }
};

// GET /api/notifications/unread_count?customer_id=123
// Note: current schema has no read flag; returns total notifications count for the customer.
exports.getUnreadCountByCustomer = async (req, res) => {
  try {
    const { customer_id } = req.query;
    if (!customer_id) {
      return res.status(400).json({ success: false, message: 'customer_id is required' });
    }
    const row = await db('notifications').where({ customer_id }).count({ count: '*' }).first();
    res.json({ count: Number(row?.count) || 0 });
  } catch (err) {
    console.error('Error counting notifications:', err);
    res.status(500).json({ success: false, message: 'Failed to count notifications', error: err.message });
  }
};
