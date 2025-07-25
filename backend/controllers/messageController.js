const db = require('../db'); // Knex instance

// GET: ดึงข้อความระหว่าง 2 คน
exports.getMessages = async (req, res) => {
  const { senderId, receiverId } = req.query;

  if (!senderId || !receiverId) {
    return res.status(400).json({ error: 'Missing senderId or receiverId' });
  }

  try {
    const messages = await db('messages')
      .where(function () {
        this.where('sender_id', senderId).andWhere('receiver_id', receiverId);
      })
      .orWhere(function () {
        this.where('sender_id', receiverId).andWhere('receiver_id', senderId);
      })
      .orderBy('created_at', 'asc');

    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// POST: ส่งข้อความ
exports.sendMessage = async (req, res) => {
  const { sender_id, receiver_id, message } = req.body;

  if (!sender_id || !receiver_id || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const [id] = await db('messages').insert({ sender_id, receiver_id, message });
    res.status(201).json({ message: 'Message sent', id });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET: ดูว่าใครเคยทักมาหาเรา
exports.getContacts = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'Missing userId' });
  }

  try {
    const contacts = await db('messages')
      .where('receiver_id', userId)
      .orWhere('sender_id', userId)
      .select('sender_id', 'receiver_id')
      .groupBy('sender_id', 'receiver_id');

    // แปลงให้เหลือแค่รายชื่อคนที่คุยด้วย
    const contactIds = new Set();
    contacts.forEach((msg) => {
      if (msg.sender_id !== parseInt(userId)) contactIds.add(msg.sender_id);
      if (msg.receiver_id !== parseInt(userId)) contactIds.add(msg.receiver_id);
    });

    res.json({ contacts: Array.from(contactIds) });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
