// utils/authCookie.js

/**
 * Set authentication cookie (httpOnly, secure in production)
 * @param {Response} res - Express response
 * @param {string} token - JWT token
 */
function setAuthCookie(res, token) {
  res.cookie('alshop_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 2 * 24 * 60 * 60 * 1000 // 2 days
  });
}

/**
 * Clear authentication cookie
 * @param {Response} res - Express response
 */
function clearAuthCookie(res) {
  res.clearCookie('alshop_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
}

module.exports = { setAuthCookie, clearAuthCookie };
