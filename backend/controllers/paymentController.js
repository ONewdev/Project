const db = require('../db');
const path = require('path');
const fs = require('fs');

// 1. บันทึกข้อมูลการชำระเงิน
exports.createPayment = async (req, res) => {
  const { customer_id, order_id, amount, payment_method } = req.body;
  const file = req.file;

  try {
    const [id] = await db('payments').insert({
      customer_id,
      order_id,
      amount,
      payment_method,
      proof_image: file?.filename,
      payment_status: 'pending'
    });

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
      payment_status: status,
      paid_at: status === 'paid' ? new Date() : null
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'อัปเดตสถานะล้มเหลว' });
  }
};
