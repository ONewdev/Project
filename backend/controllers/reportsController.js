const db = require('../db');

function parseDateRange(query) {
  const from = query.from ? new Date(query.from) : new Date(Date.now() - 29 * 24 * 60 * 60 * 1000);
  const to = query.to ? new Date(query.to) : new Date();
  // Normalize to cover full days
  const fromStart = new Date(from);
  fromStart.setHours(0, 0, 0, 0);
  const toEnd = new Date(to);
  toEnd.setHours(23, 59, 59, 999);
  return { from: fromStart, to: toEnd };
}

function groupExpr(group) {
  if (group === 'month') {
    // YYYY-MM
    return db.raw("DATE_FORMAT(??, '%Y-%m')", ['created_at']);
  }
  // default: day YYYY-MM-DD
  return db.raw('DATE(??)', ['created_at']);
}

exports.getSales = async (req, res) => {
  try {
    const { from, to } = parseDateRange(req.query);
    const group = (req.query.group || 'day').toLowerCase();

    const base = db('payments')
      .where('status', 'approved')
      .whereBetween('created_at', [from, to]);

    const totalRow = await base.clone().sum({ total: 'amount' }).first();
    const period = groupExpr(group);
    const series = await base
      .clone()
      .select({ period })
      .sum({ total: 'amount' })
      .groupBy('period')
      .orderBy('period', 'asc');

    res.json({
      from,
      to,
      group,
      total: Number(totalRow?.total) || 0,
      series: series.map(r => ({ period: String(r.period), total: Number(r.total) || 0 }))
    });
  } catch (err) {
    console.error('getSales error', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Helper to attempt query with new requisition tables, fallback to legacy tables
async function materialIssuesAgg(from, to) {
  // Try new schema: requisitions + requisition_items
  try {
    const rows = await db('requisition_items as ri')
      .leftJoin('requisitions as r', 'ri.requisition_id', 'r.id')
      .whereBetween('r.created_at', [from, to])
      .select(
        db.raw('COALESCE(ri.material_code, ?) as material_code', ['']),
        db.raw('COALESCE(ri.material_name, ?) as material_name', ['']),
        db.raw('SUM(ri.qty_issued) as qty_issued')
      )
      .groupBy('ri.material_code', 'ri.material_name');

    // Try to enrich with materials price for cost estimation
    const withCost = await Promise.all(rows.map(async (r) => {
      let price = 0;
      if (r.material_code) {
        const m = await db('materials').where('code', r.material_code).first();
        price = Number(m?.price) || 0;
      }
      return {
        material_code: r.material_code || '',
        material_name: r.material_name || '',
        qty_issued: Number(r.qty_issued) || 0,
        est_cost: (Number(r.qty_issued) || 0) * price,
      };
    }));
    return withCost;
  } catch (e) {
    // Fallback legacy: material_requisition + material_requisition_items
    const rows = await db('material_requisition_items as mri')
      .leftJoin('material_requisition as mr', 'mri.requisition_id', 'mr.requisition_id')
      .leftJoin('materials as m', 'mri.material_id', 'm.id')
      .whereBetween('mr.requisition_date', [from, to])
      .select(
        db.raw('COALESCE(m.code, ?) as material_code', ['']),
        db.raw('COALESCE(m.name, ?) as material_name', ['']),
        db.raw('SUM(mri.quantity_issued) as qty_issued'),
        db.raw('COALESCE(m.price, 0) as price')
      )
      .groupBy('m.code', 'm.name', 'm.price');

    return rows.map(r => ({
      material_code: r.material_code || '',
      material_name: r.material_name || '',
      qty_issued: Number(r.qty_issued) || 0,
      est_cost: (Number(r.qty_issued) || 0) * (Number(r.price) || 0)
    }));
  }
}

exports.getMaterials = async (req, res) => {
  try {
    const { from, to } = parseDateRange(req.query);
    const rows = await materialIssuesAgg(from, to);
    const totalQty = rows.reduce((s, r) => s + (Number(r.qty_issued) || 0), 0);
    const totalCost = rows.reduce((s, r) => s + (Number(r.est_cost) || 0), 0);
    res.json({ from, to, totalQty, totalCost, items: rows });
  } catch (err) {
    console.error('getMaterials error', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const { from, to } = parseDateRange(req.query);
    const group = (req.query.group || 'day').toLowerCase();
    const base = db('orders').whereBetween('created_at', [from, to]);

    // Counts by status
    const statuses = await base
      .clone()
      .select('status')
      .count({ count: '*' })
      .groupBy('status');

    const totalRow = await base.clone().count({ total: '*' }).first();

    const period = groupExpr(group);
    const series = await base
      .clone()
      .select({ period })
      .count({ count: '*' })
      .groupBy('period')
      .orderBy('period', 'asc');

    res.json({
      from,
      to,
      group,
      total: Number(totalRow?.total) || 0,
      byStatus: statuses.map(r => ({ status: r.status || 'unknown', count: Number(r.count) || 0 })),
      series: series.map(r => ({ period: String(r.period), count: Number(r.count) || 0 }))
    });
  } catch (err) {
    console.error('getOrders error', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getProfit = async (req, res) => {
  try {
    const { from, to } = parseDateRange(req.query);
    const group = (req.query.group || 'day').toLowerCase();

    // Revenue from approved payments
    const payBase = db('payments')
      .where('status', 'approved')
      .whereBetween('created_at', [from, to]);
    const revRow = await payBase.clone().sum({ revenue: 'amount' }).first();

    // COGS estimated from material issues
    const materials = await materialIssuesAgg(from, to);
    const cogs = materials.reduce((s, r) => s + (Number(r.est_cost) || 0), 0);

    // Series per period
    const period = groupExpr(group);
    const revenueSeries = await payBase
      .clone()
      .select({ period })
      .sum({ revenue: 'amount' })
      .groupBy('period')
      .orderBy('period', 'asc');

    // For COGS series we approximate using requisition header date group
    let cogsSeries = [];
    try {
      // New schema
      cogsSeries = await db('requisition_items as ri')
        .leftJoin('requisitions as r', 'ri.requisition_id', 'r.id')
        .leftJoin('materials as m', 'ri.material_code', 'm.code')
        .whereBetween('r.created_at', [from, to])
        .select({ period: groupExpr(group) })
        .sum({ cost: db.raw('COALESCE(ri.qty_issued,0) * COALESCE(m.price,0)') })
        .groupBy('period')
        .orderBy('period', 'asc');
    } catch (e) {
      // Legacy schema
      cogsSeries = await db('material_requisition_items as mri')
        .leftJoin('material_requisition as mr', 'mri.requisition_id', 'mr.requisition_id')
        .leftJoin('materials as m', 'mri.material_id', 'm.id')
        .whereBetween('mr.requisition_date', [from, to])
        .select({ period: groupExpr(group) })
        .sum({ cost: db.raw('COALESCE(mri.quantity_issued,0) * COALESCE(m.price,0)') })
        .groupBy('period')
        .orderBy('period', 'asc');
    }

    const series = [];
    const mapRev = new Map();
    for (const r of revenueSeries) mapRev.set(String(r.period), Number(r.revenue) || 0);
    const mapCogs = new Map();
    for (const c of cogsSeries) mapCogs.set(String(c.period), Number(c.cost) || 0);
    const keys = new Set([...mapRev.keys(), ...mapCogs.keys()]);
    [...keys].sort().forEach(k => {
      const revenue = mapRev.get(k) || 0;
      const cost = mapCogs.get(k) || 0;
      series.push({ period: k, revenue, cogs: cost, profit: revenue - cost });
    });

    res.json({
      from,
      to,
      group,
      revenue: Number(revRow?.revenue) || 0,
      cogs: Number(cogs) || 0,
      profit: (Number(revRow?.revenue) || 0) - (Number(cogs) || 0),
      series
    });
  } catch (err) {
    console.error('getProfit error', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// --- Exports: CSV and PDF helpers ---
const PDFDocument = require('pdfkit');

function sendCSV(res, filename, headerRow, rows) {
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  const esc = (v) => {
    if (v == null) return '';
    const s = String(v);
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  };
  res.write(headerRow.map(esc).join(',') + '\n');
  rows.forEach(r => res.write(r.map(esc).join(',') + '\n'));
  res.end();
}

function buildTablePDF(doc, columns, rows, startX, startY, rowH) {
  let y = startY;
  // header
  doc.font('Helvetica-Bold');
  let x = startX;
  columns.forEach(col => {
    doc.text(col.label, x, y, { width: col.width, continued: false });
    x += col.width;
  });
  y += rowH;
  doc.moveTo(startX, y - 5).lineTo(startX + columns.reduce((s, c) => s + c.width, 0), y - 5).stroke();
  // rows
  doc.font('Helvetica');
  rows.forEach(r => {
    let cx = startX;
    columns.forEach((col, idx) => {
      const txt = r[idx] == null ? '' : String(r[idx]);
      doc.text(txt, cx, y, { width: col.width, align: col.align || 'left' });
      cx += col.width;
    });
    y += rowH;
    if (y > doc.page.height - 50) { doc.addPage(); y = 50; }
  });
}

// Sales CSV/PDF
exports.exportSalesCSV = async (req, res) => {
  const { from, to } = parseDateRange(req.query);
  const group = (req.query.group || 'day').toLowerCase();
  const base = db('payments').where('status', 'approved').whereBetween('created_at', [from, to]);
  const period = groupExpr(group);
  const series = await base.select({ period }).sum({ total: 'amount' }).groupBy('period').orderBy('period');
  const rows = series.map(r => [String(r.period), Number(r.total).toFixed(2)]);
  sendCSV(res, `sales_${group}.csv`, ['Period', 'Revenue'], rows);
};

exports.exportSalesPDF = async (req, res) => {
  const { from, to } = parseDateRange(req.query);
  const group = (req.query.group || 'day').toLowerCase();
  const base = db('payments').where('status', 'approved').whereBetween('created_at', [from, to]);
  const period = groupExpr(group);
  const series = await base.select({ period }).sum({ total: 'amount' }).groupBy('period').orderBy('period');
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="sales_report.pdf"');
  const doc = new PDFDocument({ margin: 40 });
  doc.pipe(res);
  doc.fontSize(16).text('Sales Report', { align: 'left' });
  doc.moveDown(0.5);
  doc.fontSize(10).text(`Range: ${from.toISOString()} - ${to.toISOString()}`);
  doc.moveDown();
  const cols = [
    { label: 'Period', width: 200 },
    { label: 'Revenue', width: 120, align: 'right' },
  ];
  const rows = series.map(r => [String(r.period), Number(r.total).toFixed(2)]);
  buildTablePDF(doc, cols, rows, 40, 120, 20);
  doc.end();
};

// Materials CSV/PDF
exports.exportMaterialsCSV = async (req, res) => {
  const { from, to } = parseDateRange(req.query);
  const items = await materialIssuesAgg(from, to);
  const rows = items.map(r => [r.material_code, r.material_name, Number(r.qty_issued).toFixed(2), Number(r.est_cost).toFixed(2)]);
  sendCSV(res, 'materials_usage.csv', ['Code', 'Name', 'Qty Issued', 'Est. Cost'], rows);
};

exports.exportMaterialsPDF = async (req, res) => {
  const { from, to } = parseDateRange(req.query);
  const items = await materialIssuesAgg(from, to);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="materials_report.pdf"');
  const doc = new PDFDocument({ margin: 40, size: 'A4' });
  doc.pipe(res);
  doc.fontSize(16).text('Materials Report');
  doc.moveDown(0.5);
  doc.fontSize(10).text(`Range: ${from.toISOString()} - ${to.toISOString()}`);
  doc.moveDown();
  const cols = [
    { label: 'Code', width: 80 },
    { label: 'Name', width: 220 },
    { label: 'Qty Issued', width: 100, align: 'right' },
    { label: 'Est. Cost', width: 100, align: 'right' },
  ];
  const rows = items.map(r => [r.material_code, r.material_name, Number(r.qty_issued).toFixed(2), Number(r.est_cost).toFixed(2)]);
  buildTablePDF(doc, cols, rows, 40, 120, 20);
  doc.end();
};

// Orders CSV/PDF
exports.exportOrdersCSV = async (req, res) => {
  const { from, to } = parseDateRange(req.query);
  const group = (req.query.group || 'day').toLowerCase();
  const base = db('orders').whereBetween('created_at', [from, to]);
  const period = groupExpr(group);
  const series = await base.select({ period }).count({ count: '*' }).groupBy('period').orderBy('period');
  const rows = series.map(r => [String(r.period), Number(r.count)]);
  sendCSV(res, `orders_${group}.csv`, ['Period', 'Orders'], rows);
};

exports.exportOrdersPDF = async (req, res) => {
  const { from, to } = parseDateRange(req.query);
  const group = (req.query.group || 'day').toLowerCase();
  const base = db('orders').whereBetween('created_at', [from, to]);
  const period = groupExpr(group);
  const series = await base.select({ period }).count({ count: '*' }).groupBy('period').orderBy('period');
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="orders_report.pdf"');
  const doc = new PDFDocument({ margin: 40 });
  doc.pipe(res);
  doc.fontSize(16).text('Orders Report');
  doc.moveDown(0.5);
  doc.fontSize(10).text(`Range: ${from.toISOString()} - ${to.toISOString()}`);
  doc.moveDown();
  const cols = [
    { label: 'Period', width: 200 },
    { label: 'Orders', width: 120, align: 'right' },
  ];
  const rows = series.map(r => [String(r.period), Number(r.count)]);
  buildTablePDF(doc, cols, rows, 40, 120, 20);
  doc.end();
};

// Profit CSV/PDF
exports.exportProfitCSV = async (req, res) => {
  const { from, to } = parseDateRange(req.query);
  const group = (req.query.group || 'day').toLowerCase();
  // Build series identical to getProfit
  const payBase = db('payments').where('status', 'approved').whereBetween('created_at', [from, to]);
  const period = groupExpr(group);
  const revenueSeries = await payBase.select({ period }).sum({ revenue: 'amount' }).groupBy('period').orderBy('period');
  let cogsSeries = [];
  try {
    cogsSeries = await db('requisition_items as ri')
      .leftJoin('requisitions as r', 'ri.requisition_id', 'r.id')
      .leftJoin('materials as m', 'ri.material_code', 'm.code')
      .whereBetween('r.created_at', [from, to])
      .select({ period: groupExpr(group) })
      .sum({ cost: db.raw('COALESCE(ri.qty_issued,0) * COALESCE(m.price,0)') })
      .groupBy('period')
      .orderBy('period');
  } catch (e) {
    cogsSeries = await db('material_requisition_items as mri')
      .leftJoin('material_requisition as mr', 'mri.requisition_id', 'mr.requisition_id')
      .leftJoin('materials as m', 'mri.material_id', 'm.id')
      .whereBetween('mr.requisition_date', [from, to])
      .select({ period: groupExpr(group) })
      .sum({ cost: db.raw('COALESCE(mri.quantity_issued,0) * COALESCE(m.price,0)') })
      .groupBy('period')
      .orderBy('period');
  }
  const mapRev = new Map();
  for (const r of revenueSeries) mapRev.set(String(r.period), Number(r.revenue) || 0);
  const mapCogs = new Map();
  for (const c of cogsSeries) mapCogs.set(String(c.period), Number(c.cost) || 0);
  const keys = [...new Set([...mapRev.keys(), ...mapCogs.keys()])].sort();
  const rows = keys.map(k => {
    const revenue = mapRev.get(k) || 0;
    const cogs = mapCogs.get(k) || 0;
    const profit = revenue - cogs;
    return [k, revenue.toFixed(2), cogs.toFixed(2), profit.toFixed(2)];
  });
  sendCSV(res, `profit_${group}.csv`, ['Period', 'Revenue', 'COGS', 'Profit'], rows);
};

exports.exportProfitPDF = async (req, res) => {
  const { from, to } = parseDateRange(req.query);
  const group = (req.query.group || 'day').toLowerCase();
  const payBase = db('payments').where('status', 'approved').whereBetween('created_at', [from, to]);
  const period = groupExpr(group);
  const revenueSeries = await payBase.select({ period }).sum({ revenue: 'amount' }).groupBy('period').orderBy('period');
  let cogsSeries = [];
  try {
    cogsSeries = await db('requisition_items as ri')
      .leftJoin('requisitions as r', 'ri.requisition_id', 'r.id')
      .leftJoin('materials as m', 'ri.material_code', 'm.code')
      .whereBetween('r.created_at', [from, to])
      .select({ period: groupExpr(group) })
      .sum({ cost: db.raw('COALESCE(ri.qty_issued,0) * COALESCE(m.price,0)') })
      .groupBy('period')
      .orderBy('period');
  } catch (e) {
    cogsSeries = await db('material_requisition_items as mri')
      .leftJoin('material_requisition as mr', 'mri.requisition_id', 'mr.requisition_id')
      .leftJoin('materials as m', 'mri.material_id', 'm.id')
      .whereBetween('mr.requisition_date', [from, to])
      .select({ period: groupExpr(group) })
      .sum({ cost: db.raw('COALESCE(mri.quantity_issued,0) * COALESCE(m.price,0)') })
      .groupBy('period')
      .orderBy('period');
  }
  const mapRev = new Map();
  for (const r of revenueSeries) mapRev.set(String(r.period), Number(r.revenue) || 0);
  const mapCogs = new Map();
  for (const c of cogsSeries) mapCogs.set(String(c.period), Number(c.cost) || 0);
  const keys = [...new Set([...mapRev.keys(), ...mapCogs.keys()])].sort();

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="profit_report.pdf"');
  const doc = new PDFDocument({ margin: 40 });
  doc.pipe(res);
  doc.fontSize(16).text('Profit Report');
  doc.moveDown(0.5);
  doc.fontSize(10).text(`Range: ${from.toISOString()} - ${to.toISOString()}`);
  doc.moveDown();
  const cols = [
    { label: 'Period', width: 160 },
    { label: 'Revenue', width: 110, align: 'right' },
    { label: 'COGS', width: 110, align: 'right' },
    { label: 'Profit', width: 110, align: 'right' },
  ];
  const rows = keys.map(k => {
    const revenue = mapRev.get(k) || 0;
    const cogs = mapCogs.get(k) || 0;
    const profit = revenue - cogs;
    return [k, revenue.toFixed(2), cogs.toFixed(2), profit.toFixed(2)];
  });
  buildTablePDF(doc, cols, rows, 40, 120, 20);
  doc.end();
};
