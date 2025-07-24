const db = require('../db');

// ดึงคำสั่งซื้อทั้งหมด
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await db('orders').select('*');
    console.log('✅ Orders:', orders); // ✅ เพิ่ม log ตรงนี้
    res.status(200).json(orders);
  } catch (error) {
    console.error('❌ Error fetching orders:', error); // ✅ เพิ่ม log error เต็ม
    res.status(500).json({ message: 'Internal server error' });
  }
};

// เพิ่มคำสั่งซื้อ
exports.createOrder = async (req, res) => {
  const { customer, total, status } = req.body;

  if (!customer || !total || !status) {
    return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
  }

  try {
    const now = new Date();
    const [id] = await db('orders').insert({
      customer,
      total,
      status,
      created_at: now,
      updated_at: now
    });

    const newOrder = { id, customer, total, status, created_at: now, updated_at: now };
    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error creating order:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// แก้ไขคำสั่งซื้อ
exports.updateOrder = async (req, res) => {
  const { id } = req.params;
  const { customer, total, status } = req.body;

  try {
    const updated_at = new Date();

    await db('orders')
      .where({ id })
      .update({ customer, total, status, updated_at });

    res.status(200).json({ message: 'อัปเดตคำสั่งซื้อเรียบร้อยแล้ว' });
  } catch (error) {
    console.error('Error updating order:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ลบคำสั่งซื้อ
exports.deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    await db('orders').where({ id }).del();
    res.status(200).json({ message: 'ลบคำสั่งซื้อเรียบร้อยแล้ว' });
  } catch (error) {
    console.error('Error deleting order:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ดึงคำสั่งซื้อรายการเดียว (optional)
exports.getOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await db('orders')
      .select('id', 'customer', 'total', 'status', 'created_at', 'updated_at')
      .where({ id })
      .first();

    if (!order) {
      return res.status(404).json({ message: 'ไม่พบคำสั่งซื้อนี้' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};
