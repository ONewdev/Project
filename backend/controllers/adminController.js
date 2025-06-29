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
