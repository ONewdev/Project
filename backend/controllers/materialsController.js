const db = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// === utils ===
function toDec2(v) {
  const n = Number(v);
  if (!Number.isFinite(n)) return '0.00';
  return n.toFixed(2); // เก็บเป็นสตริงเพื่อเข้ากับ DECIMAL(10,2)
}
function toPublicAbs(p) {
  // กันกรณี p เริ่มด้วย '/' แล้ว path.join หลุด root
  const rel = String(p || '').replace(/^\/+/, '');
  return path.join(__dirname, '..', 'public', rel);
}

// === เตรียม multer สำหรับรูปภาพวัสดุ ===
const materialUploadDir = path.join(__dirname, '..', 'public', 'uploads', 'materials');
if (!fs.existsSync(materialUploadDir)) {
  fs.mkdirSync(materialUploadDir, { recursive: true });
}

const materialStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, materialUploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const materialUpload = multer({ 
  storage: materialStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed!'), false);
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Export multer middleware สำหรับใช้ใน routes
exports.uploadMaterialImage = materialUpload.single('image');

// ดึงข้อมูลวัสดุทั้งหมด (รองรับค้นหา/แบ่งหน้าเบื้องต้น)
exports.getAllMaterials = async (req, res) => {
  try {
    const { q = '', page = 1, limit = 100 } = req.query;
    const pg = Math.max(parseInt(page, 10) || 1, 1);
    const lm = Math.min(Math.max(parseInt(limit, 10) || 100, 1), 500);

    let query = db('materials')
      .select('id', 'code', 'name', 'unit', 'quantity', 'price', 'image', 'created_at')
      .orderBy('id', 'asc');

    if (q) {
      query = query.where(builder => {
        builder.where('code', 'like', `%${q}%`)
               .orWhere('name', 'like', `%${q}%`);
      });
    }

    const rows = await query.limit(lm).offset((pg - 1) * lm);
    res.json(rows);
  } catch (err) {
    console.error('Get Materials Error:', err);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลวัสดุ' });
  }
};

exports.getMaterialById = async (req, res) => {
  try {
    const { id } = req.params;
    const mat = await db('materials').where({ id }).first();
    if (!mat) return res.status(404).json({ error: 'ไม่พบวัสดุ' });
    res.json(mat);
  } catch (err) {
    console.error('Get Material By ID Error:', err);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลวัสดุ' });
  }
};

// /api/materials/find?code=...&id=...
exports.findMaterial = async (req, res) => {
  try {
    const { code, id } = req.query;
    let q = db('materials').select('*');
    if (id) q = q.where('id', id);
    if (code) q = q.where('code', code);
    const row = await q.first();
    if (!row) return res.status(404).json({ error: 'ไม่พบวัสดุ' });
    res.json(row);
  } catch (err) {
    console.error('Find Material Error:', err);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการค้นหาวัสดุ' });
  }
};

// เพิ่มวัสดุใหม่
exports.addMaterial = async (req, res) => {
  try {
    const { code, name, quantity, unit, price } = req.body;
    let image = null;

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!code || !name || quantity == null || !unit || price == null) {
      return res.status(400).json({ 
        error: 'กรุณากรอกข้อมูลให้ครบถ้วน',
        missing: {
          code: !code,
          name: !name,
          quantity: quantity == null,
          unit: !unit,
          price: price == null
        }
      });
    }

    // ถ้ามีการอัปโหลดรูปใหม่
    if (req.file) image = `/uploads/materials/${req.file.filename}`;

    // ตรวจสอบว่า code ซ้ำหรือไม่
    const codeNorm = String(code).trim();
    const existingCode = await db('materials').where({ code: codeNorm }).first();
    if (existingCode) {
      return res.status(400).json({ error: 'รหัสวัสดุนี้มีอยู่แล้ว กรุณาใช้รหัสอื่น' });
    }

    // สร้างข้อมูลวัสดุตาม schema
    const materialData = {
      code: codeNorm,
      name: String(name).trim(),
      quantity: toDec2(quantity),
      unit: String(unit).trim(),
      price: toDec2(price),
      image,
      created_at: new Date()
    };

    const [id] = await db('materials').insert(materialData);
    const newMaterial = await db('materials').where({ id }).first();
    res.status(201).json(newMaterial);
  } catch (err) {
    console.error('Add Material Error:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'รหัสวัสดุนี้มีอยู่แล้ว กรุณาใช้รหัสอื่น' });
    } else if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      res.status(400).json({ error: 'ข้อมูลที่อ้างอิงไม่ถูกต้อง' });
    } else {
      res.status(500).json({ error: 'เกิดข้อผิดพลาดในการเพิ่มวัสดุ', details: err.message });
    }
  }
};

// แก้ไขวัสดุ
exports.updateMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, name, quantity, unit, price } = req.body;
    let image = req.body.image || null; // รูปเดิม (อาจเป็น null)

    if (!code || !name || quantity == null || !unit || price == null) {
      return res.status(400).json({ 
        error: 'กรุณากรอกข้อมูลให้ครบถ้วน',
        missing: {
          code: !code,
          name: !name,
          quantity: quantity == null,
          unit: !unit,
          price: price == null
        }
      });
    }

    // ถ้ามีการอัปโหลดรูปใหม่ → ลบรูปเก่า
    if (req.file) {
      const oldMaterial = await db('materials').where({ id }).first();
      if (oldMaterial && oldMaterial.image) {
        const oldImagePath = toPublicAbs(oldMaterial.image);
        if (fs.existsSync(oldImagePath)) {
          try { fs.unlinkSync(oldImagePath); } catch (e) { console.error('Delete old image error:', e); }
        }
      }
      image = `/uploads/materials/${req.file.filename}`;
    }

    // ตรวจสอบ code ซ้ำ (ยกเว้นวัสดุที่กำลังแก้ไข)
    const codeNorm = String(code).trim();
    const existingCode = await db('materials').where({ code: codeNorm }).whereNot({ id }).first();
    if (existingCode) {
      return res.status(400).json({ error: 'รหัสวัสดุนี้มีอยู่แล้ว กรุณาใช้รหัสอื่น' });
    }

    const updateData = { 
      code: codeNorm,
      name: String(name).trim(),
      quantity: toDec2(quantity),
      unit: String(unit).trim(),
      price: toDec2(price),
      image
      // ไม่มี updated_at ใน schema
    };

    const updated = await db('materials').where({ id }).update(updateData);
    if (!updated) return res.status(404).json({ error: 'ไม่พบวัสดุที่ต้องการแก้ไข' });

    const updatedMaterial = await db('materials').where({ id }).first();
    res.json(updatedMaterial);
  } catch (err) {
    console.error('Update Material Error:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'รหัสวัสดุนี้มีอยู่แล้ว กรุณาใช้รหัสอื่น' });
    } else {
      res.status(500).json({ error: 'เกิดข้อผิดพลาดในการแก้ไขวัสดุ', details: err.message });
    }
  }
};

// ลบวัสดุ
exports.deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;

    const material = await db('materials').where({ id }).first();
    if (material && material.image) {
      const imagePath = toPublicAbs(material.image);
      if (fs.existsSync(imagePath)) {
        try { fs.unlinkSync(imagePath); } catch (e) { console.error('Error deleting image:', e); }
      }
    }

    const deleted = await db('materials').where({ id }).del();
    if (!deleted) return res.status(404).json({ error: 'ไม่พบวัสดุที่ต้องการลบ' });

    res.json({ success: true });
  } catch (err) {
    console.error('Delete Material Error:', err);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลบวัสดุ' });
  }
};

// ลบเฉพาะรูปภาพวัสดุ
exports.deleteMaterialImage = async (req, res) => {
  try {
    const { id } = req.params;
    const material = await db('materials').where({ id }).first();
    if (!material) return res.status(404).json({ error: 'ไม่พบวัสดุ' });
    
    if (!material.image) return res.status(400).json({ error: 'ไม่มีรูปภาพให้ลบ' });

    const imagePath = toPublicAbs(material.image);
    if (fs.existsSync(imagePath)) {
      try { fs.unlinkSync(imagePath); } catch (e) { console.error('Error deleting image:', e); }
    }

    await db('materials').where({ id }).update({ image: null });
    res.status(200).json({ message: 'ลบรูปภาพสำเร็จ' });
  } catch (error) {
    console.error('Error deleting material image:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลบรูปภาพ' });
  }
};
