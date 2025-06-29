const db = require('../db');

// ดึงข้อมูลหมวดหมู่ทั้งหมด
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await db('category').select('category_id', 'category_name');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลหมวดหมู่' });
  }
};

// เพิ่มหมวดหมู่ใหม่ (รับแค่ชื่อ)
exports.addCategory = async (req, res) => {
  const { category_name } = req.body;
  try {
    // ไม่ต้องป้อน id, ให้ MySQL auto increment
    const [category_id] = await db('category').insert({ category_name });
    const newCategory = await db('category').where({ category_id }).first();
    res.status(201).json(newCategory);
  } catch (err) {
    console.error('Add Category Error:', err); // เพิ่ม log error
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการเพิ่มหมวดหมู่' });
  }
};

// แก้ไขหมวดหมู่
exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { category_name } = req.body;
  try {
    const updated = await db('category').where({ category_id: id }).update({ category_name });
    if (updated === 0) {
      return res.status(404).json({ error: 'ไม่พบหมวดหมู่ที่ต้องการแก้ไข' });
    }
    const updatedCategory = await db('category').where({ category_id: id }).first();
    res.json(updatedCategory);
  } catch (err) {
    console.error('Update Category Error:', err); // เพิ่ม log error
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการแก้ไขหมวดหมู่' });
  }
};

// ลบหมวดหมู่
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    await db('category').where({ category_id: id }).del();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลบหมวดหมู่' });
  }
};

