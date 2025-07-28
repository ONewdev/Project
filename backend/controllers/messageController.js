// GET: ดึงข้อความทั้งหมด (admin)
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await db('messages').orderBy('created_at', 'asc');
    res.json(messages);
  } catch (error) {
    console.error('Error fetching all messages:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
const db = require('../db'); // Knex instance

// GET: ดึงข้อความระหว่าง 2 คน
exports.getMessages = async (req, res) => {
  const { senderId, receiverId } = req.query;

  if (!senderId || !receiverId) {
    return res.status(400).json({ error: 'Missing senderId or receiverId' });
  }

  try {
    let messages;
    // ถ้า admin (receiverId) ไม่ใช่ 1 แต่ต้องการเห็นข้อความที่ส่งถึง admin id 1 (จาก guest)
    if (receiverId != 0 && receiverId != 1) {
      // ดึงข้อความที่เกี่ยวข้องกับ admin id จริง และ guest (sender_id=0, receiver_id=1)
      messages = await db('messages')
        .where(function () {
          this.where('sender_id', senderId).andWhere('receiver_id', receiverId);
        })
        .orWhere(function () {
          this.where('sender_id', receiverId).andWhere('receiver_id', senderId);
        })
        // เพิ่ม: ดึงข้อความที่ guest ส่งถึง admin id 1
        .orWhere(function () {
          this.where('sender_id', 0).andWhere('receiver_id', 1);
        })
        .orderBy('created_at', 'asc');
    } else {
      // กรณีปกติ (admin id 1 หรือ guest)
      messages = await db('messages')
        .where(function () {
          this.where('sender_id', senderId).andWhere('receiver_id', receiverId);
        })
        .orWhere(function () {
          this.where('sender_id', receiverId).andWhere('receiver_id', senderId);
        })
        .orderBy('created_at', 'asc');
    }
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// POST: ส่งข้อความ
// POST: ส่งข้อความ
exports.sendMessage = async (req, res) => {
  let { sender_id, receiver_id, message } = req.body;

  // ถ้า sender_id เป็น 0 หรือ null ให้ถือว่าเป็น guest
  if (typeof sender_id === 'undefined' || sender_id === '' || !receiver_id || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const now = new Date();
    const [id] = await db('messages').insert({ sender_id, receiver_id, message, created_at: now });
    res.status(201).json({
      id,
      sender_id,
      receiver_id,
      message,
      created_at: now
    });
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
