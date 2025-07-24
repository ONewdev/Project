const db = require('../db'); // knex instance

// ----- LIKE -----
exports.likeProduct = async (req, res) => {
  const { customer_id, product_id } = req.body;
  if (!customer_id || !product_id) return res.status(400).json({ message: 'Missing data' });

  try {
    await db('likes').insert({ customer_id, product_id });
    res.json({ success: true });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ message: 'Already liked' });
    } else {
      res.status(500).json({ message: 'Error inserting like', error: err });
    }
  }
};

exports.unlikeProduct = async (req, res) => {
  const { customer_id, product_id } = req.body;
  await db('likes').where({ customer_id, product_id }).del();
  res.json({ success: true });
};

// ----- FAVORITE -----
exports.favoriteProduct = async (req, res) => {
  const { customer_id, product_id } = req.body;
  if (!customer_id || !product_id) return res.status(400).json({ message: 'Missing data' });

  try {
    await db('favorites').insert({ customer_id, product_id });
    res.json({ success: true });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ message: 'Already favorited' });
    } else {
      res.status(500).json({ message: 'Error inserting favorite', error: err });
    }
  }
};

exports.unfavoriteProduct = async (req, res) => {
  const { customer_id, product_id } = req.body;
  await db('favorites').where({ customer_id, product_id }).del();
  res.json({ success: true });
};

// ----- เช็คสถานะ -----
exports.checkLikeStatus = async (req, res) => {
  const { customer_id, product_id } = req.query;
  const liked = await db('likes').where({ customer_id, product_id }).first();
  res.json({ liked: !!liked });
};

exports.checkFavoriteStatus = async (req, res) => {
  const { customer_id, product_id } = req.query;
  const fav = await db('favorites').where({ customer_id, product_id }).first();
  res.json({ favorited: !!fav });
};
