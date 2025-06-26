const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const authRoutes = require('./routes/auth');
const customersRouter = require('./routes/customers');
const productsRouter = require('./routes/products');

const app = express();
app.use(cors());
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


app.listen(3001, () => {
  console.log('Backend running on http://localhost:3001');
});
