const db = require('../db'); // <- ได้ instance ของ knex
const bcrypt = require('bcrypt');

// ดึงข้อมูล
exports.getAllCustomers = async (req, res) => {
  try {
    const rows = await db('customers')
      .select('id', 'email', 'name', 'created_at', 'updated_at', 'status', 'profile_picture');

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
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดที่เซิร์ฟเวอร์' });
  }
};

// สมัครสมาชิกลูกค้า
exports.registerCustomer = async (req, res) => {
  const { email, password, username } = req.body;
  const name = username;

  console.log("REQ BODY:", req.body); // ✅ ตรวจสอบข้อมูลที่ส่งมา

  try {
    const existing = await db('customers').where({ email }).first();
    if (existing) {
      return res.status(400).json({ message: 'อีเมลนี้มีอยู่แล้ว' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const now = new Date();

  const customerData = {
  email,
  password: hashedPassword,
  name, // ✅ ต้องไม่เป็น undefined
  created_at: now,
  updated_at: now,
  status: 'active',
  profile_picture: null,
};
    console.log("INSERTING:", customerData); // ✅ ตรวจสอบข้อมูลก่อน insert

    const [id] = await db('customers').insert(customerData);
    res.status(201).json({ message: 'สมัครสมาชิกสำเร็จ', id });

  } catch (error) {
    console.error('Error in registerCustomer:', error); // ✅ ตรงนี้ดูใน Terminal
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการสมัครสมาชิก' });
  }
};

// ดึงโปรไฟล์ลูกค้า (ตาม id)
exports.getCustomerById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await db('customers')
      .select('id', 'email', 'name', 'status', 'profile_picture', 'created_at', 'updated_at')
      .where({ id })
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
  const { name, email, profile_picture } = req.body;

  try {
    const updated_at = new Date();

    await db('customers')
      .where({ id })
      .update({ name, email, profile_picture, updated_at });

    res.status(200).json({ message: 'อัปเดตโปรไฟล์สำเร็จ' });
  } catch (error) {
    console.error('Error updating profile:', error.message);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์' });
  }
};
