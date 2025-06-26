const db = require('../db');

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const users = await db('admin')
      .where({username, password })
      .select();

    if (users.length > 0) {
      res.json({ success: true, message: 'Login successful', user: users[0] });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Database error' });
  }
};
