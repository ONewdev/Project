import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const host = import.meta.env.VITE_HOST;

function Payments() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const orderIdFromQuery = queryParams.get('order_id');
  const [form, setForm] = useState({
    order_id: orderIdFromQuery || '',
    amount: '',
    image: null,
    note: ''
  });
  const [orderDetail, setOrderDetail] = useState(null);

  // เมื่อ orderDetail เปลี่ยน ให้เติม amount อัตโนมัติ
  useEffect(() => {
    if (orderDetail && orderDetail.total_price !== undefined && orderDetail.total_price !== null) {
      setForm((prev) => ({ ...prev, amount: String(orderDetail.total_price) }));
    }
  }, [orderDetail]);
  // ดึงข้อมูล order ถ้ามี order_id ใน query
  useEffect(() => {
    if (orderIdFromQuery) {
      fetch(`${host}/api/orders/${orderIdFromQuery}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => setOrderDetail(data))
        .catch(() => setOrderDetail(null));
    }
  }, [orderIdFromQuery, host]);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // ดึง customer_id จาก localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files.length > 0) {
      setForm((prev) => ({ ...prev, image: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const formData = new FormData();
      formData.append('customer_id', user.id);
      formData.append('order_id', form.order_id);
      formData.append('amount', form.amount);
      if (form.image) {
        formData.append('proof_image', form.image);
      }
      // หมายเหตุ (ถ้ามี) - ไม่บังคับ
      if (form.note) {
        formData.append('note', form.note);
      }

      const res = await fetch(`${host}/api/payments`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMsg('แจ้งชำระเงินสำเร็จ');
        setTimeout(() => {
          navigate('/users/orders');
        }, 1200);
        setForm({
          order_id: '',
          amount: '',
          image: null,
          note: ''
        });
      } else {
        setErrorMsg(data.message || 'เกิดข้อผิดพลาด');
      }
    } catch (err) {
      setErrorMsg('เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white rounded-xl shadow p-8">
      <h2 className="text-2xl font-bold mb-6 text-green-700">แจ้งชำระเงิน</h2>
      {/* QR Code สำหรับโอนเงิน */}
      <div className="mb-6 flex flex-col items-center">
        <img
          src='/images/qr-payment.png'
          alt="QR Code สำหรับโอนเงิน"
          className="w-48 h-48 object-contain border rounded shadow mb-2"
          onError={e => { e.target.style.display = 'none'; }}
        />
        <div className="text-gray-500 text-sm">สแกนเพื่อโอนเงินผ่าน Mobile Banking</div>
      </div>
      {/* แสดงรายละเอียด order ถ้ามี */}
      {orderDetail && (
        <div className="mb-6 p-4 bg-gray-50 rounded border">
          <div className="font-semibold mb-2">รายละเอียดคำสั่งซื้อ</div>
          {orderDetail.items && orderDetail.items.length > 0 ? (
            <ul className="mb-2">
              {orderDetail.items.map((item, idx) => (
                <li key={item.id || idx} className="mb-1">
                  <span className="font-medium">{item.product_name}</span>
                  {item.quantity && (
                    <span> x {item.quantity}</span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div>ไม่พบรายการสินค้าในออเดอร์นี้</div>
          )}
          <div>ยอดรวม: ฿{orderDetail.total_price ? parseFloat(orderDetail.total_price).toLocaleString() : '-'}</div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-1">เลขที่ออเดอร์</label>
          <input
            type="text"
            name="order_id"
            value={form.order_id}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">จำนวนเงินที่โอน (บาท)</label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400"
            required
            min="0"
            step="0.01"
            readOnly={!!orderDetail && (orderDetail.total_price !== undefined && orderDetail.total_price !== null && Number(orderDetail.total_price) > 0)}
            placeholder={orderDetail && orderDetail.total_price !== undefined && orderDetail.total_price !== null && Number(orderDetail.total_price) > 0 ? `฿${Number(orderDetail.total_price).toLocaleString('th-TH', { minimumFractionDigits: 2 })}` : ''}
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">สลิปการโอนเงิน</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">หมายเหตุ (ถ้ามี)</label>
          <textarea
            name="note"
            value={form.note}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400"
            rows={2}
          />
        </div>
        {successMsg && <div className="text-green-600">{successMsg}</div>}
        {errorMsg && <div className="text-red-600">{errorMsg}</div>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-200 shadow"
        >
          {loading ? 'กำลังส่งข้อมูล...' : 'แจ้งชำระเงิน'}
        </button>
      </form>
    </div>
  );
}

export default Payments;