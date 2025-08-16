// backend/controllers/chatController.js
const db = require('../db');

// GET /api/messages/contacts?userId=...
exports.getContacts = async (req, res) => {
  const userId = Number(req.query.userId);
  // ดึงรายชื่อผู้เคยแชทกับ userId (admin หรือ user)
  try {
    const contacts = await db('messages')
      .where('sender_id', userId)
      .orWhere('receiver_id', userId)
      .select('sender_id', 'receiver_id')
      .then(rows => {
        // รวม id ที่ไม่ใช่ตัวเอง
        const ids = [...new Set(rows.flatMap(r => [r.sender_id, r.receiver_id]))].filter(id => id !== userId);
        // ดึงข้อมูล user/customer
        return db('customers').whereIn('id', ids).select('id', 'name', 'email', 'profile_picture');
      });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
};

// GET /api/messages?senderId=...&receiverId=...
exports.getMessages = async (req, res) => {
  const { senderId, receiverId } = req.query;
  try {
    const messages = await db('messages')
      .where(function() {
        this.where('sender_id', senderId).andWhere('receiver_id', receiverId)
      })
      .orWhere(function() {
        this.where('sender_id', receiverId).andWhere('receiver_id', senderId)
      })
      .orderBy('created_at', 'asc');
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

// POST /api/messages
exports.sendMessage = async (req, res) => {
  const { sender_id, receiver_id, message } = req.body;
  if (!sender_id || !receiver_id || !message) return res.status(400).json({ error: 'Missing fields' });
  try {
    const [id] = await db('messages').insert({ sender_id, receiver_id, message });
    const msg = await db('messages').where({ id }).first();
    res.json(msg);
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message' });
  }
};
