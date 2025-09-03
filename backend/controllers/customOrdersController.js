const db = require('../db'); // knex instance
// สมมติคุณมีฟังก์ชันคำนวณราคา server-side เช่นเดียวกับหน้าเว็บ

exports.estimatePrice = async (req, res) => {
  try {
    const input = req.body || {};
    const price = calculatePrice({
      type: input.productType,
      quantity: Number(input.quantity) || 1,
      color: input.color,
      size: input.size,
      parsed: input.parsed,        // {widthM,heightM,...} ก็ได้
      hasScreen: !!input.hasScreen,
      roundFrame: !!input.roundFrame,
      swingType: input.swingType,
      mode: input.mode,
      fixedLeftM2: Number(input.fixedLeftM2) || 0,
      fixedRightM2: Number(input.fixedRightM2) || 0,
    });
    return res.json({ estimatedPrice: price });
  } catch (e) {
    return res.status(500).json({ message: 'คำนวณราคาไม่สำเร็จ' });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const {
      category, productType, width, height, unit, color, quantity, details,
      hasScreen, roundFrame, swingType, mode, fixedLeftM2, fixedRightM2, priceClient, user_id
    } = req.body;

    // ถ้าใช้ auth middleware: const userId = req.user?.id || user_id;
    const userId = user_id;
    if (!userId) return res.status(401).json({ message: 'ผู้ใช้ไม่ได้เข้าสู่ระบบ' });

    // validate ขั้นพื้นฐาน
    const widthNum = Number(width);
    const heightNum = Number(height);
    const qty = Math.max(1, Number.isFinite(Number(quantity)) ? Math.floor(Number(quantity)) : 1);
    if (!category || !productType || !widthNum || !heightNum) {
      return res.status(400).json({ message: 'ข้อมูลไม่ครบ' });
    }

    const insertPayload = {
      user_id: userId,
      category: String(category),
      product_type: String(productType),
      width: widthNum,
      height: heightNum,
      unit: unit === 'm' ? 'm' : 'cm',
      color: color || '',
      quantity: qty,
      details: details || null,
      has_screen: !!hasScreen ? 1 : 0,
      round_frame: !!roundFrame ? 1 : 0,
      swing_type: swingType || 'บานเดี่ยว',
      mode: mode || 'มาตรฐาน',
      fixed_left_m2: Number(fixedLeftM2) || 0,
      fixed_right_m2: Number(fixedRightM2) || 0,
      price: Math.max(0, Math.round(Number(priceClient) || 0)),
      status: 'pending',
      created_at: db.fn.now(),
    };

    await db('custom_orders').insert(insertPayload);
    return res.status(201).json({ success: true });
  } catch (e) {
    console.error('createOrder error:', e);
    return res.status(500).json({ message: 'บันทึกคำสั่งทำไม่สำเร็จ' });
  }
};

// Admin: list all custom orders (basic list)
exports.listOrders = async (req, res) => {
  try {
    const rows = await db('custom_orders').select('*').orderBy('created_at', 'desc');
    const shaped = rows.map(r => ({
      ...r,
      status: r.status === 'completed' ? 'finished' : r.status,
    }));
    return res.json(shaped);
  } catch (e) {
    console.error('listOrders error:', e);
    return res.status(500).json({ message: 'ไม่สามารถดึงข้อมูลคำสั่งทำพิเศษได้' });
  }
};

// Admin: update status of a custom order
exports.updateOrderStatus = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ message: 'รหัสคำสั่งไม่ถูกต้อง' });

    let { status } = req.body || {};
    if (!status || typeof status !== 'string') {
      return res.status(400).json({ message: 'สถานะไม่ถูกต้อง' });
    }

    // Accept both UI value "finished" and DB value "completed"
    const normalized = status === 'finished' ? 'completed' : status;
    const allowed = new Set([
      'pending',
      'approved',
      'waiting_payment',
      'paid',
      'in_production',
      'delivering',
      'completed',
      'rejected',
    ]);
    if (!allowed.has(normalized)) {
      return res.status(400).json({ message: 'สถานะไม่รองรับ' });
    }

    const updated = await db('custom_orders')
      .where({ id })
      .update({ status: normalized, updated_at: db.fn.now() });

    if (!updated) return res.status(404).json({ message: 'ไม่พบคำสั่งทำพิเศษ' });
    return res.json({ success: true });
  } catch (e) {
    console.error('updateOrderStatus error:', e);
    return res.status(500).json({ message: 'อัปเดตสถานะไม่สำเร็จ' });
  }
};
