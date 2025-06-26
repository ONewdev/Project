import React from 'react';

export default function Contact() {
  // Google Fonts
  if (!document.getElementById('kanit-font')) {
    const link = document.createElement('link');
    link.id = 'kanit-font';
    link.href = 'https://fonts.googleapis.com/css2?family=Kanit:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }

  return (
    <div style={{ fontFamily: "'Kanit', sans-serif", minHeight: '100vh', background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', color: '#fff' }} className="d-flex align-items-center justify-content-center p-4">
      <div className="bg-white rounded-4 shadow-lg p-5" style={{ maxWidth: 480, width: '100%', color: '#222' }}>
        <h2 className="mb-4 fw-bold text-center" style={{ color: '#16a34a', letterSpacing: 1 }}>ติดต่อแอดมิน</h2>
        <div className="mb-3">
          <label className="form-label fw-semibold">ชื่อของคุณ</label>
          <input type="text" className="form-control rounded-3" placeholder="กรอกชื่อของคุณ" />
        </div>
        <div className="mb-3">
          <label className="form-label fw-semibold">อีเมล</label>
          <input type="email" className="form-control rounded-3" placeholder="your@email.com" />
        </div>
        <div className="mb-3">
          <label className="form-label fw-semibold">ข้อความ</label>
          <textarea className="form-control rounded-3" rows={4} placeholder="พิมพ์ข้อความของคุณ"></textarea>
        </div>
        <button className="btn w-100 fw-bold" style={{ background: '#16a34a', color: '#fff', fontSize: 18 }}>
          ส่งข้อความ
        </button>
      </div>
    </div>
  );
}
