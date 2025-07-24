import React from 'react'


import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editOrder, setEditOrder] = useState(null);
  const [form, setForm] = useState({ customer: '', total: '', status: '' });
  const host = import.meta.env.VITE_HOST;

 useEffect(() => {
  fetch(`${host}/api/orders`)
    .then(res => res.json())
    .then(data => {
      console.log('🟢 orders data:', data); // ✅ log response
      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        console.error('❌ orders is not array:', data); // ✅ ตรวจจับข้อมูลผิดรูปแบบ
        setOrders([]);
      }
    })
    .catch(err => {
      console.error('❌ fetch error:', err); // ✅ จับ error เครือข่าย
    });
}, [host]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = () => {
    setEditOrder(null);
    setForm({ customer: '', total: '', status: '' });
    setShowModal(true);
  };

  const handleEdit = order => {
    setEditOrder(order);
    setForm({ customer: order.customer, total: order.total, status: order.status });
    setShowModal(true);
  };

  const handleDelete = id => {
    Swal.fire({
      title: 'ลบคำสั่งซื้อ?',
      text: 'คุณต้องการลบคำสั่งซื้อนี้หรือไม่',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ใช่, ลบเลย',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#16a34a',
    }).then(result => {
      if (result.isConfirmed) {
        fetch(`${host}/api/orders/${id}`, { method: 'DELETE' })
          .then(res => res.json())
          .then(() => {
            setOrders(prev => prev.filter(a => a.id !== id));
            Swal.fire('ลบแล้ว!', '', 'success');
          });
      }
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (editOrder) {
      // update
      fetch(`${host}/api/orders/${editOrder.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
        .then(res => res.json())
        .then(data => {
          setOrders(prev => prev.map(a => (a.id === editOrder.id ? { ...a, ...form } : a)));
          setShowModal(false);
          Swal.fire('สำเร็จ', 'อัปเดตข้อมูลคำสั่งซื้อแล้ว', 'success');
        });
    } else {
      // create
      fetch(`${host}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
        .then(res => res.json())
        .then(data => {
          setOrders(prev => [...prev, data]);
          setShowModal(false);
          Swal.fire('สำเร็จ', 'เพิ่มคำสั่งซื้อแล้ว', 'success');
        });
    }
  };

  return (
    <div className="container mx-auto mt-8 pl-24">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">จัดการคำสั่งซื้อ</h2>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          + เพิ่มคำสั่งซื้อ
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-green-100 text-green-800">
              <th className="py-2 px-4">ลูกค้า</th>
              <th className="py-2 px-4">ยอดรวม</th>
              <th className="py-2 px-4">สถานะ</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-4 text-gray-500">ไม่มีข้อมูล</td></tr>
            ) : (
              orders.map(order => (
                <tr key={order.id} className="border-b">
                  <td className="py-2 px-4">{order.customer_id}</td>
                  <td className="py-2 px-4">{order.total_price}</td>
                  <td className="py-2 px-4">{order.status}</td>
                  <td className="py-2 px-4 flex gap-2">
                    <button
                      onClick={() => handleEdit(order)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >แก้ไข</button>
                    <button
                      onClick={() => handleDelete(order.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >ลบ</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-40" onClick={() => setShowModal(false)}></div>
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">{editOrder ? 'แก้ไขคำสั่งซื้อ' : 'เพิ่มคำสั่งซื้อ'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ลูกค้า</label>
                <input
                  name="customer"
                  value={form.customer}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ยอดรวม</label>
                <input
                  name="total"
                  value={form.total}
                  onChange={handleChange}
                  type="number"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">สถานะ</label>
                <input
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">ยกเลิก</button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">บันทึก</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders
