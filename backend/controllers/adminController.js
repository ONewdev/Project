const db = require('../db');

// ดึงข้อมูลแอดมินทั้งหมด (id, username, password)
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await db('admin').select('id', 'username', 'password');
    res.json(admins);
  } catch (err) {
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลแอดมิน' });
  }
};

// เพิ่มแอดมินใหม่
exports.createAdmin = async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      return res.status(400).json({ error: 'กรุณาระบุ username และ password' });
    }
    const [id] = await db('admin').insert({ username, password });
    const created = await db('admin')
      .select('id', 'username')
      .where({ id })
      .first();
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการเพิ่มแอดมิน' });
  }
};

// แก้ไขข้อมูลแอดมิน
exports.updateAdmin = async (req, res) => {
  const { id } = req.params;
  const { username, password } = req.body;
  try {
    await db('admin').where({ id }).update({ username, ...(password ? { password } : {}) });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการแก้ไขแอดมิน' });
  }
};

// ลบแอดมิน
exports.deleteAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    await db('admin').where({ id }).del();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลบแอดมิน' });
  }
};
