const db = require('../db'); // <- ได้ instance ของ knex
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sendEmail = require('../utils/sendEmail');

// === เตรียม multer สำหรับ profile picture ===
const profileUploadDir = path.join(__dirname, '..', 'public', 'uploads', 'profiles');
if (!fs.existsSync(profileUploadDir)) {
  fs.mkdirSync(profileUploadDir, { recursive: true });
}

const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, profileUploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const profileUpload = multer({ 
  storage: profileStorage,
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
exports.uploadProfilePicture = profileUpload.single('profile_picture');

// ดึงข้อมูล
exports.getAllCustomers = async (req, res) => {
  try {
    const rows = await db('customers')
      .leftJoin('subdistricts', 'customers.subdistrict_id', 'subdistricts.id')
      .leftJoin('districts', 'customers.district_id', 'districts.id')
      .leftJoin('provinces', 'customers.province_id', 'provinces.id')
      .select(
        'customers.id', 'customers.email', 'customers.name', 'customers.created_at', 'customers.updated_at', 'customers.status', 'customers.profile_picture',
        'customers.phone', 'customers.address',
        'customers.subdistrict_id', 'customers.district_id', 'customers.province_id',
        'subdistricts.name_th as subdistrict_name',
        'districts.name_th as district_name',
        'provinces.name_th as province_name',
        'subdistricts.postal_code'
      );

    res.json(rows);
  } catch (error) {
    console.error('Error fetching customers:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};



// ลบข้อมูลลูกค้า
exports.deleteCustomer = async (req, res) => {
  const { id } = req.params;

  try {
    await db('customers').where('id', id).del();
    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// เปลี่ยนสถานะลูกค้า
exports.changeCustomerStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await db('customers').where('id', id).update({ status });
    res.status(200).json({ message: `Customer status updated to ${status}` });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ลบเฉพาะรูปโปรไฟล์ ไม่ลบบัญชี
exports.deleteProfilePicture = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await db('customers').where({ id }).first();
    if (!user) {
      return res.status(404).json({ message: 'ไม่พบผู้ใช้งาน' });
    }
    if (user.profile_picture) {
      const filePath = path.join(__dirname, '..', 'public', user.profile_picture);
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch (err) { /* ignore */ }
      }
      await db('customers').where({ id }).update({ profile_picture: null });
      return res.status(200).json({ message: 'ลบรูปโปรไฟล์สำเร็จ' });
    } else {
      return res.status(400).json({ message: 'ไม่มีรูปโปรไฟล์ให้ลบ' });
    }
  } catch (error) {
    console.error('Error deleting profile picture:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบรูปโปรไฟล์' });
  }
};
// ลบโปรไฟล์ลูกค้า (และไฟล์รูปโปรไฟล์ถ้ามี)
exports.deleteCustomerProfile = async (req, res) => {
  const { id } = req.params;
  try {
    // ดึงข้อมูลลูกค้าเพื่อเช็ค profile_picture
    const user = await db('customers').where({ id }).first();
    if (!user) {
      return res.status(404).json({ message: 'ไม่พบผู้ใช้งาน' });
    }

    // ลบไฟล์รูปโปรไฟล์ถ้ามี
    if (user.profile_picture) {
      const filePath = path.join(__dirname, '..', 'public', user.profile_picture);
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch (err) { /* ignore */ }
      }
    }

    // ลบข้อมูลลูกค้า
    await db('customers').where({ id }).del();
    res.status(200).json({ message: 'ลบบัญชีผู้ใช้สำเร็จ' });
  } catch (error) {
    console.error('Error deleting customer profile:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบบัญชี' });
  }
};


// อัปเดตข้อมูลลูกค้าทั่วไป
exports.updateCustomer = async (req, res) => {
  const { id } = req.params;
  const { email, name, status } = req.body;

  try {
    const updated_at = new Date();
    await db('customers')
      .where('id', id)
      .update({ email, name, status, updated_at });

    res.status(200).json({ message: 'Customer updated successfully' });
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const jwt = require('jsonwebtoken');
// const { setAuthCookie } = require('../utils/authCookie');
const JWT_SECRET = process.env.JWT_SECRET || 'alshop_secret_key';
const JWT_EXPIRES = '7d';

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db('customers').where({ email }).first();

    if (!user) {
      return res.status(401).json({ message: 'อีเมลไม่ถูกต้อง' });
    }

    // ตรวจสอบสถานะผู้ใช้
    if (user.status === 'inactive') {
      return res.status(403).json({ message: 'บัญชีของคุณถูกปิดใช้งาน กรุณาติดต่อผู้ดูแลระบบ' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'รหัสผ่านไม่ถูกต้อง' });
    }

    // สร้าง JWT token
    const token = jwt.sign({ user_id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    // ไม่ set cookie อีกต่อไป ส่ง token กลับไปให้ frontend เก็บใน localStorage
    res.status(200).json({
      message: 'เข้าสู่ระบบสำเร็จ',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        status: user.status,
      },
      token
    });
  } catch (error) {
    console.error('เข้าสู่ระบบไม่สำเร็จ', error.message);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดที่เซิร์ฟเวอร์' });
  }
};

// สมัครสมาชิกลูกค้า
exports.registerCustomer = async (req, res) => {
  let { email, password, username } = req.body;
  email = (email || '').trim().toLowerCase();
  const name = (username || '').trim();

  try {
    // ตรวจสอบอีเมลซ้ำ (case-insensitive)
    const existingEmail = await db('customers')
      .whereRaw('LOWER(email) = ?', [email])
      .first();
    if (existingEmail) {
      return res.status(400).json({ message: 'อีเมลนี้มีอยู่แล้ว' });
    }
    // ตรวจสอบชื่อผู้ใช้ซ้ำ
    const existingName = await db('customers').where({ name }).first();
    if (existingName) {
      return res.status(400).json({ message: 'ชื่อผู้ใช้นี้มีอยู่แล้ว' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const now = new Date();

    const customerData = {
      email,
      password: hashedPassword,
      name,
      created_at: now,
      updated_at: now,
      status: 'active',
      profile_picture: null,
    };

    const [id] = await db('customers').insert(customerData);

    // === ส่งอีเมลยืนยันการสมัคร ===
    const subject = "ยินดีต้อนรับสู่ ALShop";
    const html = `
      <div style="font-family: Arial, sans-serif; color: #222;">
        <h2 style="color: #16a34a;">สวัสดีคุณ ${name}</h2>
        <p>ขอบคุณที่สมัครสมาชิกกับ <b>ALShop</b>!</p>
        <p>บัญชีของคุณถูกสร้างเรียบร้อยแล้ว คุณสามารถเข้าสู่ระบบได้ทันทีด้วยอีเมล <b>${email}</b></p>
        <hr style="margin: 24px 0;">
        <p>หากคุณไม่ได้เป็นผู้สมัครสมาชิกนี้ กรุณาติดต่อทีมงาน ALShop โดยตรงที่ <a href="mailto:support@alshop.com">support@alshop.com</a></p>
        <p style="margin-top: 32px; color: #555; font-size: 14px;">ขอขอบคุณที่ไว้วางใจใช้บริการ<br>ทีมงาน ALShop<br>www.alshop.com</p>
      </div>
    `;
    const emailResult = await sendEmail(email, subject, html);

    if (!emailResult) {
      return res.status(201).json({ message: 'สมัครสมาชิกสำเร็จ แต่ส่งอีเมลไม่สำเร็จ กรุณาตรวจสอบอีเมลของคุณ', id, emailSent: false });
    }
    res.status(201).json({ message: 'สมัครสมาชิกสำเร็จ', id, emailSent: true });
  } catch (error) {
    console.error('Error in registerCustomer:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการสมัครสมาชิก' });
  }
};

// ดึงโปรไฟล์ลูกค้า (ตาม id)
exports.getCustomerById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await db('customers')
      .leftJoin('subdistricts', 'customers.subdistrict_id', 'subdistricts.id')
      .leftJoin('districts', 'customers.district_id', 'districts.id')
      .leftJoin('provinces', 'customers.province_id', 'provinces.id')
      .select(
        'customers.id', 'customers.email', 'customers.name', 'customers.status', 'customers.profile_picture', 'customers.created_at', 'customers.updated_at',
        'customers.phone', 'customers.address',
        'customers.subdistrict_id', 'customers.district_id', 'customers.province_id',
        'subdistricts.name_th as subdistrict_name',
        'districts.name_th as district_name',
        'provinces.name_th as province_name',
        'subdistricts.postal_code'
      )
      .where('customers.id', id)
      .first();

    if (!user) {
      return res.status(404).json({ message: 'ไม่พบผู้ใช้งาน' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching customer:', error.message);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดที่เซิร์ฟเวอร์' });
  }
};

// แก้ไขโปรไฟล์ลูกค้า
exports.updateCustomerProfile = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, address, subdistrict_id, district_id, province_id, postal_code } = req.body;
  let profile_picture = req.body.profile_picture;

  // helper สำหรับ integer หรือ null
  const toIntOrNull = v => (v === '' || v === 'null' || v == null ? null : Number(v));

  try {
    // ถ้ามีการอัปโหลดรูปใหม่
    if (req.file) {
      profile_picture = `/uploads/profiles/${req.file.filename}`;
    }

    const updated_at = new Date();
    const updateData = { 
      name, 
      email, 
      phone, 
      address, 
      subdistrict_id: toIntOrNull(subdistrict_id),
      district_id: toIntOrNull(district_id),
      province_id: toIntOrNull(province_id),
      updated_at
    };
    // เพิ่ม postal_code ถ้ามี
    if (typeof postal_code !== 'undefined') {
      updateData.postal_code = postal_code;
    }
    
    // เพิ่ม profile_picture ในข้อมูลที่จะอัปเดตเฉพาะเมื่อมีการอัปโหลดรูป
    if (profile_picture) {
      updateData.profile_picture = profile_picture;
    }

    await db('customers')
      .where({ id })
      .update(updateData);

    // ดึงข้อมูล user ที่อัปเดตล่าสุด (ส่งฟิลด์ครบ)
    const updatedUser = await db('customers')
      .select(
        'id', 'email', 'name', 'status', 'profile_picture', 'created_at', 'updated_at',
        'phone', 'address', 'province_id', 'district_id', 'subdistrict_id', 'postal_code'
      )
      .where({ id })
      .first();

    res.status(200).json({ 
      message: 'อัปเดตโปรไฟล์สำเร็จ',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating customer profile:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์' });
  }
};

// ดึงรายการโปรดของลูกค้า
exports.getCustomerFavorites = async (req, res) => {
  const { id } = req.params;

  try {
    const favorites = await db('favorites')
      .join('products', 'favorites.product_id', 'products.id')
      .leftJoin('category', 'products.category_id', 'category.category_id')
      .select(
        'products.id',
        'products.name',
        'products.description',
        'products.price',
        'products.image_url',
        'products.status',
        'category.category_name',
        'favorites.created_at as favorited_at'
      )
      .where('favorites.customer_id', id)
      .where('products.status', 'active')
      .orderBy('favorites.created_at', 'desc');

    res.status(200).json(favorites);
  } catch (error) {
    console.error('Error fetching customer favorites:', error.message);
    console.error('Full error:', error);
    res.status(500).json({ 
      message: 'เกิดข้อผิดพลาดในการดึงรายการโปรด',
      error: error.message 
    });
  }
};

// ดึงข้อมูลจังหวัด
exports.getProvinces = async (req, res) => {
  try {
    const provinces = await db('provinces').select('id', 'name_th');
    res.json(provinces);
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงจังหวัด' });
  }
};

// ดึงข้อมูลอำเภอ (districts) ตาม province_id
exports.getDistricts = async (req, res) => {
  const { province_id } = req.query;
  try {
    if (!province_id) return res.status(400).json({ message: 'ต้องระบุ province_id' });
    const districts = await db('districts').where('province_id', province_id).select('id', 'name_th');
    res.json(districts);
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงอำเภอ' });
  }
};

// ดึงข้อมูลตำบล (subdistricts) ตาม district_id
exports.getSubdistricts = async (req, res) => {
  const { district_id } = req.query;
  try {
    if (!district_id) return res.status(400).json({ message: 'ต้องระบุ district_id' });
    const subdistricts = await db('subdistricts').where('district_id', district_id).select('id', 'name_th', 'postal_code');
    res.json(subdistricts);
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงตำบล' });
  }
};
