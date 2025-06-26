const db = require('../db'); // Knex instance
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// === เตรียม path อัปโหลด ===
const uploadDir = path.join(__dirname, '..', 'public', 'uploads', 'products');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });
const uploadProductImage = upload.single('image'); // ใช้กับ field name="image"

// === Controller ===

// 1. Get all products
const getAllProducts = async (req, res) => {
  try {
    const rows = await db('products').select(
      'id', 'name', 'description', 'category_id', 'price', 'quantity',
      'image_url', 'status', 'created_at', 'updated_at'
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching products:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 2. Add new product (พร้อมรูป)
const addProduct = async (req, res) => {
  const { name, description, category_id, price, quantity, status } = req.body;
  const imageUrl = req.file ? `/uploads/products/${req.file.filename}` : null;
  console.log(req.file); 

  try {
    const [id] = await db('products').insert({
      name,
      description,
      category_id,
      price,
      quantity,
      status,
      image_url: imageUrl,
      created_at: db.fn.now(),
      updated_at: db.fn.now()
    });

    const newProduct = await db('products').where({ id }).first();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error adding product:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 3. Update product
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, category_id, price, quantity, status } = req.body;
  console.log(req.file); // ตรวจสอบว่ามีไฟล์อัปโหลดหรือไม่

  try {
    // เตรียมข้อมูลที่จะอัปเดต
    const updateData = {
      name,
      description,
      category_id,
      price,
      quantity,
      status,
      updated_at: db.fn.now()
    };

    // ถ้ามีการอัปโหลดรูปใหม่ (req.file)
    if (req.file) {
      updateData.image_url = `public/uploads/products/${req.file.filename}`;
    }

    await db('products').where({ id }).update(updateData);

    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating product:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// 4. Delete product
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    await db('products').where({ id }).del();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 5. Update only status
const updateProductStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await db('products')
      .where({ id })
      .update({ status, updated_at: db.fn.now() });

    res.json({ message: 'Status updated successfully' });
  } catch (error) {
    console.error('Error updating status:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  uploadProductImage,
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  updateProductStatus
};
