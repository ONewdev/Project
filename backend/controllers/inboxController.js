// backend/controllers/inboxController.js
const db = require('../db');

exports.createInboxMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    await db('inbox').insert({ name, email, phone, subject, message });
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save message' });
  }
};

exports.getInboxMessages = async (req, res) => {
  try {
    const messages = await db('inbox').orderBy('created_at', 'desc');
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};
