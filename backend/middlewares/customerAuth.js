// middlewares/customerAuth.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'alshop_secret_key';

function authenticateCustomer(req, res, next) {
  const token = req.cookies?.alshop_token || req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'กรุณาเข้าสู่ระบบ' });
  }
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ success: false, message: 'Token ไม่ถูกต้อง' });
    req.customer = user;
    next();
  });
}

module.exports = { authenticateCustomer };
