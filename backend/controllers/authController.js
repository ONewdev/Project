const db = require('../db');

const jwt = require('jsonwebtoken');
const { setAuthCookie } = require('../utils/authCookie');

const JWT_SECRET = process.env.JWT_SECRET || 'alshop_secret_key';
const JWT_EXPIRES = '2d';

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const users = await db('admin')
      .where({ username, password })
      .select();

    if (users.length > 0) {
      const user = users[0];
      // สร้าง JWT token
      const token = jwt.sign({ user_id: user.admin_id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
      // Set cookie
      setAuthCookie(res, token);
      res.json({ success: true, message: 'Login successful', user: { ...user, token } });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Database error' });
  }
};
