import React, { useState } from 'react';

function Payments() {
  const [form, setForm] = useState({
    order_number: '',
    amount: '',
    payment_slip: null,
    note: ''
  });
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const host = import.meta.env.VITE_HOST;

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'payment_slip' && files.length > 0) {
      setForm((prev) => ({ ...prev, payment_slip: files[0] }));
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
      formData.append('order_number', form.order_number);
      formData.append('amount', form.amount);
      if (form.payment_slip) {
        formData.append('payment_slip', form.payment_slip);
      }
      formData.append('note', form.note);

      const res = await fetch(`${host}/api/customers/payments`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMsg('แจ้งชำระเงินสำเร็จ');
        setForm({
          order_number: '',
          amount: '',
          payment_slip: null,
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
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-1">เลขที่ออเดอร์</label>
          <input
            type="text"
            name="order_number"
            value={form.order_number}
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
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">สลิปการโอนเงิน</label>
          <input
            type="file"
            name="payment_slip"
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