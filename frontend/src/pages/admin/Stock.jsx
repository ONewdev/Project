import React from 'react'


import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

function Stock() {
  const [stocks, setStocks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editStock, setEditStock] = useState(null);
  const [form, setForm] = useState({ material_name: '', quantity: '', unit: '' });
  const host = import.meta.env.VITE_HOST;

  useEffect(() => {
    fetch(`${host}/api/stocks`)
      .then(res => res.json())
      .then(data => setStocks(data))
      .catch(() => setStocks([]));
  }, [host]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });


  const handleAdd = () => {
    setEditStock(null);
    setForm({ name: '', quantity: '' });
    setShowModal(true);
  };

  const handleEdit = stock => {
    setEditStock(stock);
    setForm({ name: stock.name, quantity: stock.quantity });
    setShowModal(true);
  };

  const handleDelete = id => {
    Swal.fire({
      title: 'ลบสต็อก?',
      text: 'คุณต้องการลบสต็อกนี้หรือไม่',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ใช่, ลบเลย',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#16a34a',
    }).then(result => {
      if (result.isConfirmed) {
        fetch(`${host}/api/stocks/${id}`, { method: 'DELETE' })
          .then(res => res.json())
          .then(() => {
            setStocks(prev => prev.filter(a => a.id !== id));
            Swal.fire('ลบแล้ว!', '', 'success');
          });
      }
    });
  };

  const handleSubmit = e => {
    const bodyData = {
      material_name: form.material_name,
      quantity: parseFloat(form.quantity),
      unit: form.unit,
    };

    if (editStock) {
      fetch(`${host}/api/stocks/${editStock.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      })
        .then(res => res.json())
        .then(data => {
          setStocks(prev => prev.map(s => s.id === editStock.id ? data : s));
          setShowModal(false);
          Swal.fire('สำเร็จ', 'อัปเดตข้อมูลสต็อกแล้ว', 'success');
        });
    } else {
      fetch(`${host}/api/stocks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      })
        .then(res => res.json())
        .then(data => {
          setStocks(prev => [...prev, data]);
          setShowModal(false);
          Swal.fire('สำเร็จ', 'เพิ่มสต็อกแล้ว', 'success');
        });
    }

  };

  return (
    <div className="container mx-auto mt-8 pl-24">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">จัดการสต็อก</h2>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          + เพิ่มสต็อก
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-green-100 text-green-800">
              <th className="py-2 px-4">ชื่อวัสดุ</th>
              <th className="py-2 px-4">จำนวน</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stocks.length === 0 ? (
              <tr><td colSpan={3} className="text-center py-4 text-gray-500">ไม่มีข้อมูล</td></tr>
            ) : (
              stocks.map(stock => (
                <tr key={stock.id} className="border-b">
                  <td className="py-2 px-4">{stock.material_name}</td>
                  <td className="py-2 px-4">{stock.quantity}</td>
                  <td className="py-2 px-4 flex gap-2">
                    <button
                      onClick={() => handleEdit(stock)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >แก้ไข</button>
                    <button
                      onClick={() => handleDelete(stock.id)}
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
              <h3 className="text-lg font-semibold">{editStock ? 'แก้ไขสต็อก' : 'เพิ่มสต็อก'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อวัสดุ</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">จำนวน</label>
                <input
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  type="number"
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

export default Stock