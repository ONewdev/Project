const db = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// === เตรียม multer สำหรับรูปภาพวัสดุ ===
const materialUploadDir = path.join(__dirname, '..', 'public', 'uploads', 'materials');
if (!fs.existsSync(materialUploadDir)) {
  fs.mkdirSync(materialUploadDir, { recursive: true });
}

const materialStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, materialUploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const materialUpload = multer({ 
  storage: materialStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Export multer middleware สำหรับใช้ใน routes
exports.uploadMaterialImage = materialUpload.single('image');

// ดึงข้อมูลวัสดุทั้งหมด
exports.getAllMaterials = async (req, res) => {
  try {
    const materials = await db('materials').select('id', 'code', 'name', 'unit', 'quantity', 'price', 'image', 'created_at');
    res.json(materials);
  } catch (err) {
    console.error('Get Materials Error:', err);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลวัสดุ' });
  }
};

// เพิ่มวัสดุใหม่
exports.addMaterial = async (req, res) => {
  try {
    console.log('Request body:', req.body); // Debug log
    console.log('Request file:', req.file); // Debug log
    
    const { code, name, quantity, unit, price } = req.body;
    let image = null;

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!code || !name || !quantity || !unit || !price) {
      return res.status(400).json({ 
        error: 'กรุณากรอกข้อมูลให้ครบถ้วน',
        missing: {
          code: !code,
          name: !name,
          quantity: !quantity,
          unit: !unit,
          price: !price
        }
      });
    }

    // ถ้ามีการอัปโหลดรูปใหม่
    if (req.file) {
      image = `/uploads/materials/${req.file.filename}`;
      console.log('Image uploaded:', image); // Debug log
    }

    // ตรวจสอบว่า code ซ้ำหรือไม่
    const existingCode = await db('materials').where({ code }).first();
    if (existingCode) {
      return res.status(400).json({ error: 'รหัสวัสดุนี้มีอยู่แล้ว กรุณาใช้รหัสอื่น' });
    }

    // สร้างข้อมูลวัสดุตาม database schema
    const materialData = {
      code,
      name,
      quantity: parseFloat(quantity) || 0,
      unit,
      price: parseFloat(price) || 0, // เปลี่ยนเป็น decimal ตาม schema
      image,
      created_at: new Date()
      // ไม่มี updated_at ใน schema ของคุณ
    };

    console.log('Material data to insert:', materialData); // Debug log

    const [id] = await db('materials').insert(materialData);
    console.log('Inserted material ID:', id); // Debug log
    
    const newMaterial = await db('materials').where({ id }).first();
    console.log('New material:', newMaterial); // Debug log
    
    res.status(201).json(newMaterial);
  } catch (err) {
    console.error('Add Material Error:', err);
    console.error('Error stack:', err.stack); // Debug log
    
    // ส่ง error message ที่ชัดเจน
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'รหัสวัสดุนี้มีอยู่แล้ว กรุณาใช้รหัสอื่น' });
    } else if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      res.status(400).json({ error: 'ข้อมูลที่อ้างอิงไม่ถูกต้อง' });
    } else {
      res.status(500).json({ 
        error: 'เกิดข้อผิดพลาดในการเพิ่มวัสดุ',
        details: err.message 
      });
    }
  }
};


// แก้ไขวัสดุ
exports.updateMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, name, quantity, unit, price } = req.body;
    let image = req.body.image; // รูปเดิม

    console.log('Update request for ID:', id); // Debug log
    console.log('Update data:', req.body); // Debug log

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!code || !name || !quantity || !unit || !price) {
      return res.status(400).json({ 
        error: 'กรุณากรอกข้อมูลให้ครบถ้วน',
        missing: {
          code: !code,
          name: !name,
          quantity: !quantity,
          unit: !unit,
          price: !price
        }
      });
    }

    // ถ้ามีการอัปโหลดรูปใหม่
    if (req.file) {
      // ลบรูปเก่าถ้ามี
      const oldMaterial = await db('materials').where({ id }).first();
      if (oldMaterial && oldMaterial.image) {
        const oldImagePath = path.join(__dirname, '..', 'public', oldMaterial.image);
        if (fs.existsSync(oldImagePath)) {
          try { 
            fs.unlinkSync(oldImagePath); 
          } catch (err) { 
            console.error('Error deleting old image:', err);
          }
        }
      }
      
      image = `/uploads/materials/${req.file.filename}`;
      console.log('New image:', image); // Debug log
    }

    // ตรวจสอบว่า code ซ้ำหรือไม่ (ยกเว้นวัสดุที่กำลังแก้ไข)
    const existingCode = await db('materials').where({ code }).whereNot({ id }).first();
    if (existingCode) {
      return res.status(400).json({ error: 'รหัสวัสดุนี้มีอยู่แล้ว กรุณาใช้รหัสอื่น' });
    }

    // สร้างข้อมูลอัปเดตตาม database schema
    const updateData = { 
      code, 
      name, 
      quantity: parseFloat(quantity) || 0, 
      unit, 
      price: parseFloat(price) || 0, // เปลี่ยนเป็น decimal ตาม schema
      image
      // ไม่มี updated_at ใน schema ของคุณ
    };

    console.log('Update data:', updateData); // Debug log

    const updated = await db('materials').where({ id }).update(updateData);
    
    if (updated === 0) {
      return res.status(404).json({ error: 'ไม่พบวัสดุที่ต้องการแก้ไข' });
    }
    
    const updatedMaterial = await db('materials').where({ id }).first();
    console.log('Updated material:', updatedMaterial); // Debug log
    
    res.json(updatedMaterial);
  } catch (err) {
    console.error('Update Material Error:', err);
    console.error('Error stack:', err.stack); // Debug log
    
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'รหัสวัสดุนี้มีอยู่แล้ว กรุณาใช้รหัสอื่น' });
    } else {
      res.status(500).json({ 
        error: 'เกิดข้อผิดพลาดในการแก้ไขวัสดุ',
        details: err.message 
      });
    }
  }
};


// ลบวัสดุ
exports.deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    
    // ดึงข้อมูลวัสดุเพื่อลบรูปภาพ
    const material = await db('materials').where({ id }).first();
    if (material && material.image) {
      const imagePath = path.join(__dirname, '..', 'public', material.image);
      if (fs.existsSync(imagePath)) {
        try { 
          fs.unlinkSync(imagePath); 
        } catch (err) { 
          console.error('Error deleting image:', err);
        }
      }
    }

    const deleted = await db('materials').where({ id }).del();
    if (deleted === 0) {
      return res.status(404).json({ error: 'ไม่พบวัสดุที่ต้องการลบ' });
    }
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
    if (!material) {
      return res.status(404).json({ error: 'ไม่พบวัสดุ' });
    }
    
    if (material.image) {
      const imagePath = path.join(__dirname, '..', 'public', material.image);
      if (fs.existsSync(imagePath)) {
        try { 
          fs.unlinkSync(imagePath); 
        } catch (err) { 
          console.error('Error deleting image:', err);
        }
      }
      
      await db('materials').where({ id }).update({ image: null });
      return res.status(200).json({ message: 'ลบรูปภาพสำเร็จ' });
    } else {
      return res.status(400).json({ error: 'ไม่มีรูปภาพให้ลบ' });
    }
  } catch (error) {
    console.error('Error deleting material image:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลบรูปภาพ' });
  }
};