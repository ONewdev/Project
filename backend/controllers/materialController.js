const db = require('../db');

// ดึงข้อมูลวัสดุทั้งหมด
exports.getAllMaterials = async (req, res) => {
  try {
    const materials = await db('materials').select('id', 'code', 'name', 'unit', 'quantity', 'price', 'image', 'created_at');
    res.json(materials);
  } catch (err) {
    console.error('Get Materials Error:', err);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลวัสดุ' });
  }
};

// เพิ่มวัสดุใหม่
exports.addMaterial = async (req, res) => {
  const { code, name, quantity, unit, price, image } = req.body;
  try {
    // รับ price เป็น string ตาม frontend
    const [id] = await db('materials').insert({ code, name, quantity, unit, price: price?.toString(), image });
    const newMaterial = await db('materials').where({ id }).first();
    res.status(201).json(newMaterial);
  } catch (err) {
    console.error('Add Material Error:', err);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการเพิ่มวัสดุ' });
  }
};

// แก้ไขวัสดุ
exports.updateMaterial = async (req, res) => {
  const { id } = req.params;
  const { code, name, quantity, unit, price, image } = req.body;
  try {
    // รับ price เป็น string ตาม frontend
    const updated = await db('materials').where({ id }).update({ code, name, quantity, unit, price: price?.toString(), image });
    if (updated === 0) {
      return res.status(404).json({ error: 'ไม่พบวัสดุที่ต้องการแก้ไข' });
    }
    const updatedMaterial = await db('materials').where({ id }).first();
    res.json(updatedMaterial);
  } catch (err) {
    console.error('Update Material Error:', err);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการแก้ไขวัสดุ' });
  }
};

// ลบวัสดุ
exports.deleteMaterial = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await db('materials').where({ id }).del();
    if (deleted === 0) {
      return res.status(404).json({ error: 'ไม่พบวัสดุที่ต้องการลบ' });
    }
    res.json({ success: true });
  } catch (err) {
    console.error('Delete Material Error:', err);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลบวัสดุ' });
  }
};
