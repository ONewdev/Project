try { require('dotenv').config(); } catch (err) { /* noop when dotenv is missing */ }
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // หรือ SMTP ของผู้ให้บริการอีเมล
  auth: {
    user: process.env.EMAIL_USER, // อีเมลของคุณ
    pass: process.env.EMAIL_PASS, // รหัสผ่าน/รหัสแอป
  },
});

async function sendEmail(to, subject, html) {
  try {
    if (process.env.EMAIL_ENABLED !== 'true') {
      return true;
    }
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('Email is disabled: missing EMAIL_USER or EMAIL_PASS');
      return true;
    }
    const info = await transporter.sendMail({
      from: `"ALShop" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

module.exports = sendEmail;
