const db = require('../db');

// สร้างคำสั่งซื้อใหม่
exports.createOrder = async (req, res) => {
  try {
    const { customer_id, items, order_type, customDetails, shipping_address, phone } = req.body;

    console.log('Received order data:', { customer_id, items, shipping_address, phone });

    if (!customer_id || !items || items.length === 0) {
      return res.status(400).json({ message: 'Missing required data' });
    }

    // สร้างคำสั่งซื้อสำหรับแต่ละสินค้า
    const createdOrders = [];

    for (const item of items) {
      const product = await db('products').where({ id: item.product_id }).first();
      if (!product) {
        return res.status(404).json({ message: `Product ${item.product_id} not found` });
      }
      
      const total_price = parseFloat(product.price) * item.quantity;

      console.log('Creating order for product:', product.name, 'quantity:', item.quantity, 'total:', total_price);

      // สร้างคำสั่งซื้อสำหรับสินค้านี้
      const [orderId] = await db('orders').insert({
        customer_id,
        product_id: item.product_id,
        quantity: item.quantity,
        total_price,
        order_type: order_type || 'standard',
        status: 'pending'
      });

      createdOrders.push({
        orderId,
        product_name: product.name,
        quantity: item.quantity,
        total_price
      });
    }

    console.log('Created orders:', createdOrders);

    res.status(201).json({ 
      message: 'Orders created successfully', 
      orders: createdOrders
    });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ message: 'Error creating order', error: err.message });
  }
};

// ดึงคำสั่งซื้อทั้งหมด
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await db('orders')
      .leftJoin('customers', 'orders.customer_id', 'customers.id')
      .leftJoin('products', 'orders.product_id', 'products.id')
      .select(
        'orders.*',
        'customers.name as customer_name',
        'customers.email as customer_email',
        'products.name as product_name',
        'products.image_url'
      )
      .orderBy('orders.created_at', 'desc');

    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

// ดึงคำสั่งซื้อตาม customer_id
exports.getOrdersByCustomer = async (req, res) => {
  try {
    const { customer_id } = req.params;
    
    const orders = await db('orders')
      .leftJoin('products', 'orders.product_id', 'products.id')
      .select(
        'orders.*',
        'products.name as product_name',
        'products.image_url'
      )
      .where({ customer_id })
      .orderBy('created_at', 'desc');

    res.json(orders);
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

// ลบคำสั่งซื้อ
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    await db('orders').where({ id }).del();

    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    console.error('Error deleting order:', err);
    res.status(500).json({ message: 'Error deleting order' });
  }
};
