const db = require('../db');

// ดึงข้อมูลสต็อกทั้งหมด
exports.getAllStocks = async (req, res) => {
  try {
    const stocks = await db('stocks').select('id', 'material_name', 'quantity', 'unit', 'updated_at');
    res.json(stocks);
  } catch (err) {
    console.error('Get Stocks Error:', err);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลสต็อก' });
  }
};

// เพิ่มสต็อกใหม่
exports.addStock = async (req, res) => {
  const { material_name, quantity, unit } = req.body;
  try {
    const [id] = await db('stocks').insert({ material_name, quantity, unit });
    const newStock = await db('stocks').where({ id }).first();
    res.status(201).json(newStock);
  } catch (err) {
    console.error('Add Stock Error:', err);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการเพิ่มสต็อก' });
  }
};

// แก้ไขสต็อก
exports.updateStock = async (req, res) => {
  const { id } = req.params;
  const { material_name, quantity, unit } = req.body;
  try {
    const updated = await db('stocks').where({ id }).update({ material_name, quantity, unit });
    if (updated === 0) {
      return res.status(404).json({ error: 'ไม่พบสต็อกที่ต้องการแก้ไข' });
    }
    const updatedStock = await db('stocks').where({ id }).first();
    res.json(updatedStock);
  } catch (err) {
    console.error('Update Stock Error:', err);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการแก้ไขสต็อก' });
  }
};

// ลบสต็อก
exports.deleteStock = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await db('stocks').where({ id }).del();
    if (deleted === 0) {
      return res.status(404).json({ error: 'ไม่พบสต็อกที่ต้องการลบ' });
    }
    res.json({ success: true });
  } catch (err) {
    console.error('Delete Stock Error:', err);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลบสต็อก' });
  }
};
