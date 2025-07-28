import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

export default function ContactAdmin() {
  const host = import.meta.env.VITE_HOST;

  const [formData, setFormData] = useState({
    address: '',
    phone: '',
    email: '',
    open_hours: '',
    map_url: ''
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  

  // โหลดข้อมูลติดต่อเมื่อ component โหลด
  useEffect(() => {
    fetch(`${host}/api/contact`)
      .then((res) => res.json())
      .then((data) => {
        setFormData(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching contact:', err);
        Swal.fire('ผิดพลาด', 'ไม่สามารถโหลดข้อมูลได้', 'error');
        setIsLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      const res = await fetch(`${host}/api/contact`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        Swal.fire('สำเร็จ', 'อัปเดตข้อมูลเรียบร้อยแล้ว', 'success');
      } else {
        Swal.fire('ผิดพลาด', 'ไม่สามารถอัปเดตข้อมูลได้', 'error');
      }
    } catch (err) {
      console.error('Update failed:', err);
      Swal.fire('ผิดพลาด', 'เกิดข้อผิดพลาดบางอย่าง', 'error');
    }
    setIsSubmitting(false);
  };

  if (isLoading) return <div className="text-center mt-5">กำลังโหลดข้อมูล...</div>;

  return (
    <div
      style={{
        fontFamily: "'Kanit', sans-serif",
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', // เขียว
        color: '#333'
      }}
      className="d-flex align-items-center justify-content-center p-4"
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-4 shadow-lg p-5"
        style={{ maxWidth: 600, width: '100%' }}
      >
        <h2 className="mb-4 fw-bold text-center" style={{ color: '#16a34a', letterSpacing: 1 }}>
          แก้ไขข้อมูลการติดต่อ
        </h2>

        <div className="mb-3">
          <label className="form-label fw-semibold">ที่อยู่</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="form-control rounded-3"
            rows={2}
            placeholder="ใส่ที่อยู่"
          ></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">เบอร์โทร</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="form-control rounded-3"
            placeholder="0812345678"
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">อีเมล</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-control rounded-3"
            placeholder="you@email.com"
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">เวลาเปิดทำการ</label>
          <input
            type="text"
            name="open_hours"
            value={formData.open_hours}
            onChange={handleChange}
            className="form-control rounded-3"
            placeholder="จันทร์ - ศุกร์ เวลา 08.00 - 17.00 น."
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">ลิงก์แผนที่ (Google Maps)</label>
          <input
            type="text"
            name="map_url"
            value={formData.map_url}
            onChange={handleChange}
            className="form-control rounded-3"
            placeholder="https://goo.gl/maps/..."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn w-100 fw-bold"
          style={{ background: '#16a34a', color: '#fff', fontSize: 18 }}
        >
          {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
        </button>
      </form>
    </div>
  );
}
