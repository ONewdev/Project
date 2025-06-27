// controllers/contactInfoController.js
const db = require('../db');

// GET: ดึงข้อมูลติดต่อ
// GET
exports.getContact = async (req, res) => {
  try {
    const info = await db('contact').first();
    if (!info) {
      return res.status(200).json({
        address: '',
        phone: '',
        email: '',
        open_hours: '',
        map_url: ''
      });
    }
    return res.status(200).json({
      address: info.name || '',
      phone: info.tel || '',
      email: info.gmail || '',
      open_hours: info.time || '',
      map_url: info.map || ''
    });
  } catch (error) {
    console.error('Error fetching contact:', error);
    return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลติดต่อ' });
  }
};

// PUT
exports.updateContact = async (req, res) => {
  const { address, phone, email, map_url, open_hours } = req.body;

  if (!address || !phone || !email) {
    return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
  }

  try {
    const exists = await db('contact').first();
    if (exists) {
      await db('contact').update({
        name: address,
        tel: phone,
        gmail: email,
        map: map_url,
        time: open_hours
      }).where({ id: exists.id });
    } else {
      await db('contact').insert({
        name: address,
        tel: phone,
        gmail: email,
        map: map_url,
        time: open_hours
      });
    }
    return res.status(200).json({ message: 'อัปเดตข้อมูลเรียบร้อยแล้ว' });
  } catch (err) {
    console.error('Error updating contact:', err);
    return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล' });
  }
};
