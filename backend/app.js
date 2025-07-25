const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
// const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth');
const customersRouter = require('./routes/customers');
const productsRouter = require('./routes/products');
const contactRouter = require('./routes/contact');
const adminRouter = require('./routes/admin'); 
const categoryRouter = require('./routes/categories'); 
const ordersRouter = require('./routes/orders'); 
const stockRouter = require('./routes/stocks'); 
const interactionRoutes = require('./routes/interactions'); 
const messageRoutes = require('./routes/messages');


const app = express();
app.use(cors({
  origin: 'http://localhost:5173', // เปลี่ยนเป็น domain frontend จริงถ้า deploy
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
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
app.use('/api/admin', adminRouter); 
app.use('/api/categories', categoryRouter); 
app.use('/api/orders', ordersRouter); 
app.use('/api/stocks', stockRouter);
app.use('/api/interactions', interactionRoutes); 
app.use('/api/messages', messageRoutes);


app.listen(3001, () => {
  console.log('Backend running on http://localhost:3001');
});
