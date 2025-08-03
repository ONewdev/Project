// อัปเดตสถานะเป็น shipped (จัดส่งสินค้า)
const PDFDocument = require('pdfkit');
const db = require('../db'); // <- ได้ instance ของ knex
const bcrypt = require('bcrypt');

exports.shipOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await db('orders').where('id', id).first();
     console.log('order:', order);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    await db('orders').where('id', id).update({ status: 'shipped' });
    await db('notifications').insert({
      customer_id: order.customer_id,
      type: 'info',
      title: 'คำสั่งซื้อถูกจัดส่งแล้ว',
      message: `คำสั่งซื้อ #${id} ของคุณถูกจัดส่งแล้ว กรุณาตรวจสอบสถานะการจัดส่ง`,
      created_at: new Date()
    });
    res.json({ success: true, message: 'Order shipped successfully' });
  } catch (err) {
    console.error('Error shipping order:', err);
    res.status(500).json({ success: false, message: 'Failed to ship order', error: err.message });
  }
};
// ดึงข้อมูล order ตาม id
exports.getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    // ดึงข้อมูล order หลัก
    const order = await db('orders').where('id', id).first();
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // ดึงรายการสินค้าในออเดอร์นี้
    const items = await db('order_items')
      .where('order_id', id)
      .leftJoin('products', 'order_items.product_id', 'products.id')
      .select(
        'order_items.*',
        'products.name as product_name',
        'products.image_url'
      );

    // คำนวณยอดรวม
    const total_price = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    res.json({ ...order, items, total_price });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching order' });
  }
};


exports.createOrder = async (req, res) => {
  const trx = await db.transaction();
  try {
    const { customer_id, items, order_type, customDetails, shipping_address, phone } = req.body;

    if (!customer_id || !items || items.length === 0) {
      await trx.rollback();
      return res.status(400).json({ message: 'Missing required data' });
    }

    // ถ้าเป็น custom order ต้องมี customDetails
    if (order_type === 'custom') {
      if (!customDetails || !customDetails.width || !customDetails.height || !customDetails.material) {
        await trx.rollback();
        return res.status(400).json({ message: 'Missing custom details for custom order' });
      }
    }

    const [orderId] = await trx('orders').insert({
      customer_id,
      order_type: order_type || 'standard',
      status: 'pending',
      shipping_address: shipping_address || null,
      phone: phone || null,
    });

    for (const item of items) {
      const product = await trx('products').where({ id: item.product_id }).first();
      if (!product) {
        await trx.rollback();
        return res.status(404).json({ message: `Product ${item.product_id} not found` });
      }

      await trx('order_items').insert({
        order_id: orderId,
        product_id: item.product_id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // Insert customDetails แค่ครั้งเดียวหลังจาก loop
    if (order_type === 'custom' && customDetails) {
      await trx('order_custom_details').insert({
        order_id: orderId,
        width: customDetails.width,
        height: customDetails.height,
        material: customDetails.material,
        special_request: customDetails.special_request,
        estimated_price: customDetails.estimated_price,
      });
    }

    await trx.commit();
    res.status(201).json({ message: 'Order created successfully', orderId });
  } catch (err) {
    await trx.rollback();
    console.error('Error creating order:', err);
    res.status(500).json({ message: 'Error creating order', error: err.message });
  }
};

// ดึงคำสั่งซื้อทั้งหมด
exports.getAllOrders = async (req, res) => {
  try {
    // ดึง orders หลัก
    const orders = await db('orders')
      .leftJoin('customers', 'orders.customer_id', 'customers.id')
      .select(
        'orders.*',
        'customers.name as customer_name',
        'customers.email as customer_email'
      )
      .orderBy('orders.created_at', 'desc');

    // ดึง order_items ทั้งหมดใน orders เหล่านี้
    const orderIds = orders.map(o => o.id);
    const items = await db('order_items')
      .whereIn('order_id', orderIds)
      .leftJoin('products', 'order_items.product_id', 'products.id')
      .select(
        'order_items.*',
        'products.name as product_name',
        'products.image_url'
      );

    // map orderId -> items
    const itemsByOrder = {};
    for (const item of items) {
      if (!itemsByOrder[item.order_id]) itemsByOrder[item.order_id] = [];
      itemsByOrder[item.order_id].push(item);
    }

    // ใส่ items และ total_price ในแต่ละ order
    const result = orders.map(order => {
      const orderItems = itemsByOrder[order.id] || [];
      const total_price = orderItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);
      return { ...order, items: orderItems, total_price };
    });

    res.json(result);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

// ดึงคำสั่งซื้อตาม customer_id
exports.getOrdersByCustomer = async (req, res) => {
  try {
    const { customer_id } = req.params;
    // ดึง orders หลัก
    const orders = await db('orders')
      .where({ customer_id })
      .orderBy('created_at', 'desc');

    const orderIds = orders.map(o => o.id);
    const items = orderIds.length > 0 ? await db('order_items')
      .whereIn('order_id', orderIds)
      .leftJoin('products', 'order_items.product_id', 'products.id')
      .select(
        'order_items.*',
        'products.name as product_name',
        'products.image_url'
      ) : [];

    // map orderId -> items
    const itemsByOrder = {};
    for (const item of items) {
      if (!itemsByOrder[item.order_id]) itemsByOrder[item.order_id] = [];
      itemsByOrder[item.order_id].push(item);
    }

    // ใส่ items และ total_price ในแต่ละ order
    const result = orders.map(order => {
      const orderItems = itemsByOrder[order.id] || [];
      const total_price = orderItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);
      return { ...order, items: orderItems, total_price };
    });

    res.json(result);
  } catch (err) {
    console.error('Error fetching customer orders:', err);
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

// อัปเดตสถานะคำสั่งซื้อ
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await db('orders')
      .where({ id })
      .update({ status });

    res.json({ message: 'Order status updated' });
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ message: 'Error updating order status' });
  }
};



exports.approveOrder = async (req, res) => {
  const { id } = req.params;
  try {
    // ตรวจสอบว่า order มีอยู่จริงหรือไม่
    const order = await db('orders').where('id', id).first();
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // อัปเดต status เป็น 'approved' เพื่อให้ตรงกับ enum และฝั่ง payment
    await db('orders').where('id', id).update({ status: 'approved' });
     await db('notifications').insert({
      customer_id: order.customer_id,
      type: 'success',
      title: 'คำสั่งซื้อได้รับการอนุมัติ',
      message: `คำสั่งซื้อ #${id} ของคุณได้รับการอนุมัติแล้ว`,
      created_at: new Date()
    });
    
    res.json({ success: true, message: 'Order approved successfully' });
  } catch (err) {
    console.error('Error approving order:', err);
    res.status(500).json({ success: false, message: 'Failed to approve order', error: err.message });
  }
};


exports.getOrdersByStatus = async (req, res) => {
  const { status } = req.params;

  try {
    const orders = await db('orders')
      .leftJoin('customers', 'orders.customer_id', 'customers.id')
      .leftJoin('order_items', 'orders.id', 'order_items.order_id')
      .leftJoin('products', 'order_items.product_id', 'products.id')
      .select(
        'orders.id as order_id',
        'orders.status',
        'orders.order_type',
        'orders.created_at',
        'customers.id as customer_id',
        'customers.name as customer_name',
        'products.id as product_id',
        'products.name as product_name',
        'products.image_url',
        'order_items.quantity'
      )
      .where('orders.status', status)
      .orderBy('orders.created_at', 'desc');

    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders by status:', err);
    res.status(500).json({ message: 'Error fetching orders by status' });
  }
};

// ยกเลิกคำสั่งซื้อ (เปลี่ยนสถานะเป็น canceled)
exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    // ตรวจสอบว่าคำสั่งซื้อนั้นมีอยู่ก่อน
    const order = await db('orders').where({ id }).first();
    if (!order) {
      return res.status(404).json({ message: 'ไม่พบคำสั่งซื้อนี้' });
    }
    await db('orders')
      .where({ id })
      .update({ status: 'cancelled' });
    // คืน order ที่อัปเดตแล้ว
    const updated = await db('orders').where({ id }).first();
    res.json(updated);
  } catch (err) {
    console.error('Error canceling order:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการยกเลิกคำสั่งซื้อ' });
  }
};

exports.generateReceiptPdf = async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await db('orders').where({ id: orderId }).first();
    if (!order) return res.status(404).send('Order not found');
    const items = await db('order_items')
      .where({ order_id: orderId })
      .leftJoin('products', 'order_items.product_id', 'products.id')
      .select('order_items.*', 'products.name as product_name');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=receipt_order_${orderId}.pdf`);

    const fontPath = require('path').join(__dirname, '../fonts/NotoSansThai-Regular.ttf');
    const fs = require('fs');
    const doc = new PDFDocument({ margin: 40 });
    doc.pipe(res);
    if (fs.existsSync(fontPath)) {
      doc.registerFont('thai', fontPath);
      doc.font('thai');
    } else {
      console.error('ไม่พบไฟล์ฟอนต์ภาษาไทย:', fontPath);
      doc.font('Helvetica');
    }

    doc.fontSize(22).text('ใบเสร็จรับเงิน', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(13).text(`รหัสออเดอร์: ${order.id}`, { align: 'center' });
    doc.text(`วันที่: ${new Date(order.created_at).toLocaleString('th-TH')}`, { align: 'center' });
    doc.moveDown(1);

    doc.fontSize(14).text('รายการสินค้า', { align: 'left', underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12)
      .text('ลำดับ', 60, doc.y, { width: 50, align: 'center', continued: true })
      .text('ชื่อสินค้า', 110, doc.y, { width: 220, align: 'left', continued: true })
      .text('จำนวน', 330, doc.y, { width: 60, align: 'center', continued: true })
      .text('ราคา', 390, doc.y, { width: 80, align: 'right' });
    doc.moveDown(0.2);
    doc.moveTo(60, doc.y).lineTo(470, doc.y).stroke();

    items.forEach((item, idx) => {
      const y = doc.y;
      doc.fontSize(12)
        .text(`${idx + 1}`, 60, y, { width: 50, align: 'center' });
      doc.text(item.product_name || '', 110, y, { width: 220, align: 'left' });
      doc.text(item.quantity, 330, y, { width: 60, align: 'center' });
      doc.text(`฿${Number(item.price).toLocaleString('th-TH', { minimumFractionDigits: 2 })}`, 390, y, { width: 80, align: 'right' });
      doc.moveDown(0.2);
    });
    doc.moveDown(1);

    const total = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    doc.fontSize(14).text(`รวมทั้งสิ้น: ฿${total.toLocaleString('th-TH', { minimumFractionDigits: 2 })}`, 60, doc.y, { width: 410, align: 'right' });

    doc.end();
  } catch (err) {
    console.error('PDF Error:', err);
    if (!res.headersSent) res.status(500).send('เกิดข้อผิดพลาดในการสร้างไฟล์ PDF');
  }
};


