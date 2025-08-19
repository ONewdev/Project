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
        map_url: '',
        status: 'active'
      });
    }

    // Normalize DB status (supports numeric 0/1 or string)
    const statusNormalized = (info.status === 'active' || info.status === 1 || info.status === '1')
      ? 'active'
      : 'inactive';

    return res.status(200).json({
      address: info.name || '',
      phone: info.tel || '',
      email: info.gmail || '',
      open_hours: info.time || '',
      map_url: info.map || '',
      status: statusNormalized
    });
  } catch (error) {
    console.error('Error fetching contact:', error);
    return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลติดต่อ' });
  }
};

// PUT
exports.updateContact = async (req, res) => {
  const { address, phone, email, map_url, open_hours, status } = req.body;

  if (!address || !phone || !email) {
    return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
  }

  try {
    const exists = await db('contact').first();
    // Map incoming status to DB-friendly value (0/1). Default to active (1)
    const statusDbValue = (status === 'inactive' || status === 0 || status === '0') ? 0 : 1;
    if (exists) {
      await db('contact').update({
        name: address,
        tel: phone,
        gmail: email,
        map: map_url,
        time: open_hours,
        status: statusDbValue
      }).where({ id: exists.id });
    } else {
      await db('contact').insert({
        name: address,
        tel: phone,
        gmail: email,
        map: map_url,
        time: open_hours,
        status: statusDbValue
      });
    }
    return res.status(200).json({ message: 'อัปเดตข้อมูลเรียบร้อยแล้ว' });
  } catch (err) {
    console.error('Error updating contact:', err);
    return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล' });
  }
};
