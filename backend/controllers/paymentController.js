const db = require('../db');
const knex = require('../db');

// 1. บันทึกข้อมูลการชำระเงิน
exports.createPayment = async (req, res) => {
  const { customer_id, order_id, amount } = req.body;
  const file = req.file;

  try {
    const [id] = await db('payments').insert({
      customer_id,
      order_id,
      amount,
      image: file?.filename,
      status: 'pending'
    });

    // อัปเดตสถานะ order เป็น 'processing' ทันทีหลังแจ้งชำระเงิน
    await db('orders').where({ id: order_id }).update({ status: 'processing' });
    // ดึงข้อมูล order เพื่อลดจำนวนสินค้า
    const order = await db('orders').where({ id: order_id }).first();
    console.log('Order for payment:', order);
    if (order && order.product_id && order.quantity) {
      // ลดจำนวนสินค้าใน products
      await db('products')
        .where({ id: order.product_id })
        .decrement('quantity', order.quantity);
    }

    res.json({ success: true, id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Insert payment failed' });
  }
  
};

// 2. ตรวจสอบสถานะการชำระเงิน
exports.checkPaymentStatus = async (req, res) => {
  const { order_id } = req.params;

  try {
    const payment = await db('payments')
      .where({ order_id })
      .orderBy('id', 'desc')
      .first();

    if (!payment) return res.status(404).json({ error: 'ยังไม่พบข้อมูลการชำระเงิน' });

    res.json(payment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'ตรวจสอบการชำระเงินล้มเหลว' });
  }
  
};

// 3. อัปเดตสถานะการชำระเงิน (แอดมินยืนยัน)
exports.updatePaymentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await db('payments').where({ id }).update({
      status
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'อัปเดตสถานะล้มเหลว' });
  }
};
