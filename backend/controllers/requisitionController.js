// controllers/requisition.controller.js
const db = require('../db'); // knex instance จาก knexfile

// helpers
const toNum = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};
const toDec2 = (n) => Number(n).toFixed(2); // ให้เข้ากับ DECIMAL(10,2)

/** หา material ตามลำดับ: id > code > name (ล็อกแถวด้วย FOR UPDATE) */
async function findMaterialLocked(trx, row) {
  if (row.material_id) {
    return trx('materials').where('id', row.material_id).forUpdate().first();
  }
  if (row.material_code) {
    return trx('materials').where('code', row.material_code).forUpdate().first();
  }
  if (row.name) {
    return trx('materials').where('name', row.name).forUpdate().first();
  }
  return null;
}

/** POST /api/requisition  สร้างใบเบิก + รายการ + ตัดสต๊อก + ลง ledger */
exports.createRequisition = async (req, res) => {
  const { requisition, items } = req.body || {};

  if (!requisition?.requisition_by || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, error: 'Invalid payload' });
  }

  try {
    await db.transaction(async trx => {
      // 1) หัวเอกสาร
      const [reqId] = await trx('requisitions').insert({
        requisition_by: requisition.requisition_by.trim(),
        remarks: (requisition.remarks || '').trim()
      });

      // 2) รายการ + ตัดสต๊อก
      for (const row of items) {
        const qtyReq = toNum(row.qty_req);
        const qtyIssued = toNum(row.qty_issued);

        if (qtyReq <= 0) throw new Error('qty_req must be > 0');
        if (qtyIssued < 0) throw new Error('qty_issued invalid');
        if (qtyIssued > qtyReq) throw new Error('qty_issued cannot exceed qty_req');

        const material = await findMaterialLocked(trx, row);
        if (!material) throw new Error('Material not found');

        const curBal = toNum(material.quantity);
        if (curBal < qtyIssued) {
          throw new Error(`Stock not enough for ${material.code || material.id}`);
        }

        // 2.1 บันทึกรายการ (snapshot ข้อมูล ณ วันที่เบิก)
        await trx('requisition_items').insert({
          requisition_id: reqId,
          material_id: material.id,
          material_code: material.code,
          material_name: (row.name?.trim() || material.name),
          unit: (material.unit || '').trim(),
          qty_req: toDec2(qtyReq),
          qty_issued: toDec2(qtyIssued),
          remarks: (row.remarks || '').trim()
        });

        // 2.2 ตัดสต๊อก
        const newBal = toDec2(curBal - qtyIssued);
        await trx('materials').where('id', material.id).update({ quantity: newBal });

        // 2.3 ลงสมุดเคลื่อนไหว
        await trx('stock_ledger').insert({
          material_id: material.id,
          ref_type: 'REQUISITION',
          ref_id: reqId,
          qty_change: toDec2(-qtyIssued), // เบิก = ติดลบ
          balance_after: newBal
        });
      }

      res.status(201).json({ success: true, requisitionId: reqId });
    });
  } catch (err) {
    console.error('Create requisition error:', err);
    res.status(400).json({ success: false, error: err.message || 'Create failed' });
  }
};

/** GET /api/requisition/:id  ดึงหัวเอกสาร + รายการ */
exports.getRequisitionById = async (req, res) => {
  const { id } = req.params;
  try {
    const header = await db('requisitions').where({ id }).first();
    if (!header) return res.status(404).json({ error: 'not found' });

    const items = await db('requisition_items')
      .where({ requisition_id: id })
      .select(
        'id',
        'material_id',
        'material_code',
        'material_name',
        'unit',
        'qty_req',
        'qty_issued',
        'remarks'
      )
      .orderBy('id', 'asc');

    res.json({ header, items });
  } catch (e) {
    console.error('Get requisition error:', e);
    res.status(500).json({ error: 'server error' });
  }
};

/** (อ็อปชัน) GET /api/requisition  รายการเอกสารแบบหน้า/ค้นหา */
exports.listRequisitions = async (req, res) => {
  try {
    const { q = '', page = 1, limit = 50 } = req.query;
    const pg = Math.max(parseInt(page, 10) || 1, 1);
    const lm = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 200);

    let query = db('requisitions')
      .select('id', 'requisition_by', 'remarks', 'created_at')
      .orderBy('id', 'desc');

    if (q) {
      query = query.where(b =>
        b.where('requisition_by', 'like', `%${q}%`)
         .orWhere('remarks', 'like', `%${q}%`)
      );
    }

    const rows = await query.limit(lm).offset((pg - 1) * lm);
    res.json(rows);
  } catch (e) {
    console.error('List requisitions error:', e);
    res.status(500).json({ error: 'server error' });
  }
};
