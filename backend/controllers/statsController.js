// controllers/statsController.js
const db = require('../db');

exports.getStatistics = async (req, res) => {
  try {
    const totalCustomers = await db('customers').count('id as count').first();
    const totalOrders = await db('orders').count('id as count').first();
    const totalProducts = await db('products').count('id as count').first();
    const totalSales = await db('orders')
      .sum('total_price as sum')
      .where('status', 'paid') // นับเฉพาะคำสั่งซื้อที่ชำระเงินแล้ว
      .first();

    res.json({
      customers: totalCustomers.count,
      orders: totalOrders.count,
      products: totalProducts.count,
      totalSales: totalSales.sum || 0,
    });
  } catch (err) {
    console.error('Error getting statistics:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
