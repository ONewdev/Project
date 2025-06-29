const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth');
const customersRouter = require('./routes/customers');
const productsRouter = require('./routes/products');
const contactRouter = require('./routes/contact');
const adminRouter = require('./routes/admin'); 
const categoryRouter = require('./routes/categories'); 

const app = express();
app.use(cors({
  origin: 'http://localhost:5173', // เปลี่ยนเป็น domain frontend จริงถ้า deploy
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());

// Serve static files (ภาพ) จาก public/uploads
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Routes
app.use('/api', authRoutes);
app.use('/api/customers', customersRouter);
app.use('/api/products', productsRouter);
app.use('/api/contact', contactRouter);
app.use('/api/admin', adminRouter); // <-- เพิ่มให้ตรง path
app.use('/api/categories', categoryRouter); 

app.listen(3001, () => {
  console.log('Backend running on http://localhost:3001');
});
