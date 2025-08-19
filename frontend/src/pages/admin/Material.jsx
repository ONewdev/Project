import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

function Material() {
  const [materials, setMaterials] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMaterial, setEditMaterial] = useState(null);
  const [form, setForm] = useState({ code: '', name: '', quantity: '', unit: '', price: '', image: '' });
  const host = import.meta.env.VITE_HOST;

  useEffect(() => {
    fetch(`${host}/api/materials`)
      .then(res => res.json())
      .then(data => setMaterials(data))
      .catch(() => setMaterials([]));
  }, [host]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = () => {
    setEditMaterial(null);
    setForm({ code: '', name: '', quantity: '', unit: '', price: '', image: '' });
    setShowModal(true);
  };

  const handleEdit = material => {
    setEditMaterial(material);
    setForm({
      code: material.code,
      name: material.name,
      quantity: material.quantity,
      unit: material.unit,
      price: material.price,
      image: material.image
    });
    setShowModal(true);
  };

  const handleDelete = id => {
    Swal.fire({
      title: 'ลบวัสดุ?',
      text: 'คุณต้องการลบวัสดุนี้หรือไม่',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ใช่, ลบเลย',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#16a34a',
    }).then(result => {
      if (result.isConfirmed) {
        fetch(`${host}/api/materials/${id}`, { method: 'DELETE' })
          .then(res => res.json())
          .then(() => {
            setMaterials(prev => prev.filter(a => a.id !== id));
            Swal.fire('ลบแล้ว!', '', 'success');
          });
      }
    });
  };

  const handleSubmit = e => {
    e.preventDefault();

    const bodyData = {
      code: form.code,
      name: form.name,
      quantity: parseFloat(form.quantity),
      unit: form.unit,
      price: parseFloat(form.price),
      image: form.image
    };

    if (editMaterial) {
      // update
      fetch(`${host}/api/materials/${editMaterial.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      })
        .then(res => res.json())
        .then(data => {
          setMaterials(prev => prev.map(s => s.id === editMaterial.id ? data : s));
          setShowModal(false);
          Swal.fire('สำเร็จ', 'อัปเดตข้อมูลวัสดุแล้ว', 'success');
        });
    } else {
      // add
      fetch(`${host}/api/materials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      })
        .then(res => res.json())
        .then(data => {
          setMaterials(prev => [...prev, data]);
          setShowModal(false);
          Swal.fire('สำเร็จ', 'เพิ่มวัสดุแล้ว', 'success');
        });
    }
  };

  return (
    <div className="container mx-auto mt-8 pl-24">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">จัดการวัสดุ</h2>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          + เพิ่มวัสดุ
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-green-100 text-green-800">
              <th className="py-2 px-4">รหัส</th>
              <th className="py-2 px-4">ชื่อวัสดุ</th>
              <th className="py-2 px-4">จำนวน</th>
              <th className="py-2 px-4">หน่วย</th>
              <th className="py-2 px-4">ราคา</th>
              <th className="py-2 px-4">รูปภาพ</th>
              <th className="py-2 px-4">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {materials.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-4 text-gray-500">ไม่มีข้อมูล</td></tr>
            ) : (
              materials.map(material => (
                <tr key={material.id} className="border-b">
                  <td className="py-2 px-4">{material.code}</td>
                  <td className="py-2 px-4">{material.name}</td>
                  <td className="py-2 px-4">{material.quantity}</td>
                  <td className="py-2 px-4">{material.unit}</td>
                  <td className="py-2 px-4">{material.price}</td>
                  <td className="py-2 px-4">
                    {material.image ? <img src={material.image} alt={material.name} className="w-16 h-16 object-cover"/> : '-'}
                  </td>
                  <td className="py-2 px-4 flex gap-2">
                    <button
                      onClick={() => handleEdit(material)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >แก้ไข</button>
                    <button
                      onClick={() => handleDelete(material.id)}
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
              <h3 className="text-lg font-semibold">{editMaterial ? 'แก้ไขวัสดุ' : 'เพิ่มวัสดุ'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">รหัสวัสดุ</label>
                <input
                  name="code"
                  value={form.code}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
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
              <div className="grid grid-cols-2 gap-4">
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">หน่วย</label>
                  <input
                    name="unit"
                    value={form.unit}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ราคา</label>
                <input
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  type="text"
                  required
                  placeholder="กรอกราคา เช่น 1200 หรือ ฿1200 หรือ 1,200.50"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">เลือกรูปภาพ</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = ev => {
                        setForm(prev => ({ ...prev, image: ev.target.result }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {form.image && (
                  <img
                    src={form.image}
                    alt="Preview"
                    className="mt-2 w-20 h-20 object-cover rounded shadow"
                  />
                )}
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

export default Material;
