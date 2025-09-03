import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';

function Material() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [viewMode, setViewMode] = useState('table'); // 'table' หรือ 'card'
  const [materials, setMaterials] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMaterial, setEditMaterial] = useState(null);
  const [form, setForm] = useState({ code: '', name: '', quantity: '', unit: '', price: '', image: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const host = import.meta.env.VITE_HOST;

  useEffect(() => {
    fetchMaterials();
  }, [host]);

  const fetchMaterials = () => {
    fetch(`${host}/api/materials`)
      .then(res => res.json())
      .then(data => setMaterials(data))
      .catch(() => setMaterials([]));
  };

  // ฟังก์ชันสร้าง code อัตโนมัติ
  const generateAutoCode = () => {
    if (materials.length === 0) {
      return 'MAT001';
    }
    
    // หา code ที่มีอยู่แล้วและแยกตัวเลขออกมา
    const existingCodes = materials.map(m => m.code);
    const numericCodes = existingCodes
      .filter(code => code && code.match(/^MAT\d+$/))
      .map(code => parseInt(code.replace('MAT', '')))
      .sort((a, b) => a - b);
    
    if (numericCodes.length === 0) {
      return 'MAT001';
    }
    
    // หาเลขที่ขาดหายไปหรือเลขถัดไป
    let nextNumber = 1;
    for (let i = 0; i < numericCodes.length; i++) {
      if (numericCodes[i] !== nextNumber) {
        break;
      }
      nextNumber++;
    }
    
    // สร้าง code ใหม่
    return `MAT${nextNumber.toString().padStart(3, '0')}`;
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // สร้าง preview
      const reader = new FileReader();
      reader.onload = ev => {
        setImagePreview(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = () => {
    setEditMaterial(null);
    // สร้าง code อัตโนมัติเมื่อเพิ่มวัสดุใหม่
    const autoCode = generateAutoCode();
    setForm({ 
      code: autoCode, 
      name: '', 
      quantity: '', 
      unit: '', 
      price: '', 
      image: '' 
    });
    setSelectedFile(null);
    setImagePreview('');
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
    setSelectedFile(null);
    setImagePreview(material.image ? `${host}${material.image}` : '');
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

    // สร้าง FormData สำหรับส่งไฟล์
    const formData = new FormData();
    formData.append('code', form.code);
    formData.append('name', form.name);
    formData.append('quantity', form.quantity);
    formData.append('unit', form.unit);
    formData.append('price', form.price);
    
    // เพิ่มไฟล์รูปภาพถ้ามี
    if (selectedFile) {
      formData.append('image', selectedFile);
    }

    if (editMaterial) {
      // update - ใช้ PUT method
      fetch(`${host}/api/materials/${editMaterial.id}`, {
        method: 'PUT',
        body: formData,
      })
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          setMaterials(prev => prev.map(s => s.id === editMaterial.id ? data : s));
          setShowModal(false);
          Swal.fire('สำเร็จ', 'อัปเดตข้อมูลวัสดุแล้ว', 'success');
        })
        .catch(error => {
          console.error('Error updating material:', error);
          Swal.fire('ผิดพลาด', 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล', 'error');
        });
    } else {
      // add - ใช้ POST method
      fetch(`${host}/api/materials`, {
        method: 'POST',
        body: formData,
      })
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          setMaterials(prev => [...prev, data]);
          setShowModal(false);
          Swal.fire('สำเร็จ', 'เพิ่มวัสดุแล้ว', 'success');
        })
        .catch(error => {
          console.error('Error adding material:', error);
          Swal.fire('ผิดพลาด', 'เกิดข้อผิดพลาดในการเพิ่มข้อมูล', 'error');
        });
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    // ถ้าเป็น URL เต็มแล้ว ให้ใช้เลย
    if (imagePath.startsWith('http')) return imagePath;
    // ถ้าเป็น path ในระบบ ให้ต่อกับ host
    return `${host}${imagePath}`;
  };

  return (
    <div className="container mx-auto mt-8 pl-24">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">จัดการวัสดุ</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'table' ? 'card' : 'table')}
            className={`px-4 py-2 rounded ${viewMode === 'card' ? 'bg-green-700 text-white' : 'bg-gray-200 text-green-700'} hover:bg-green-600 hover:text-white`}
          >
            {viewMode === 'table' ? 'แสดงแบบการ์ด' : 'แสดงแบบตาราง'}
          </button>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            + เพิ่มวัสดุ
          </button>
        </div>
      </div>
      {viewMode === 'table' ? (
        <div className="overflow-x-auto">
          <DataTable
            columns={[
              { name: 'รหัส', selector: row => row.code, sortable: true, cell: row => <span className="font-mono">{row.code}</span> },
              { name: 'ชื่อวัสดุ', selector: row => row.name, sortable: true },
              { name: 'จำนวน', selector: row => row.quantity, sortable: true },
              { name: 'หน่วย', selector: row => row.unit, sortable: true },
              { name: 'ราคา', selector: row => row.price, sortable: true },
              {
                name: 'รูปภาพ',
                cell: row => row.image ? (
                  <img
                    src={getImageUrl(row.image)}
                    alt={row.name}
                    className="w-12 h-12 object-cover rounded shadow"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs">ไม่มีรูป</div>
                ),
              },
              {
                name: 'จัดการ',
                cell: row => (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(row)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >แก้ไข</button>
                    <button
                      onClick={() => handleDelete(row.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >ลบ</button>
                  </div>
                ),
              },
            ]}
            data={materials}
            pagination
            highlightOnHover
            striped
            noDataComponent={<div className="text-gray-500 py-4">ไม่มีข้อมูล</div>}
          />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {materials.length === 0 ? (
              <div className="col-span-full text-center py-8 text-gray-500">ไม่มีข้อมูล</div>
            ) : (
              materials
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map(material => (
                  <div key={material.id} className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
                    {material.image ? (
                      <img
                        src={getImageUrl(material.image)}
                        alt={material.name}
                        className="w-24 h-24 object-cover rounded mb-3"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs mb-3">
                        ไม่มีรูป
                      </div>
                    )}
                    <div className="font-bold text-green-700 mb-1">{material.name}</div>
                    <div className="text-sm text-gray-600 mb-1">รหัส: {material.code}</div>
                    <div className="text-sm text-gray-600 mb-1">จำนวน: {material.quantity} </div>
                    <div className="text-sm text-gray-600 mb-1">หน่วย: {material.unit}</div>
                    <div className="text-sm text-gray-600 mb-1">ราคา: {material.price}</div>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleEdit(material)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                      >แก้ไข</button>
                      <button
                        onClick={() => handleDelete(material.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                      >ลบ</button>
                    </div>
                  </div>
                ))
            )}
          </div>
          {/* Pagination */}
          {materials.length > itemsPerPage && (
            <div className="flex justify-center items-center mt-6 gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-400' : 'bg-green-600 text-white hover:bg-green-700'}`}
              >ก่อนหน้า</button>
              <span className="px-2">หน้า {currentPage} / {Math.ceil(materials.length / itemsPerPage)}</span>
              <button
                onClick={() => setCurrentPage(p => Math.min(Math.ceil(materials.length / itemsPerPage), p + 1))}
                disabled={currentPage === Math.ceil(materials.length / itemsPerPage)}
                className={`px-3 py-1 rounded ${currentPage === Math.ceil(materials.length / itemsPerPage) ? 'bg-gray-200 text-gray-400' : 'bg-green-600 text-white hover:bg-green-700'}`}
              >ถัดไป</button>
            </div>
          )}
        </>
      )}

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
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono ${
                    editMaterial ? 'bg-gray-100' : 'bg-green-50'
                  }`}
                  readOnly={!editMaterial} // ไม่ให้แก้ไข code เมื่อเพิ่มใหม่
                  placeholder="รหัสจะถูกสร้างอัตโนมัติ"
                />
                {!editMaterial && (
                  <p className="text-xs text-green-600 mt-1">
                    รหัสถูกสร้างอัตโนมัติ: {form.code}
                  </p>
                )}
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
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {/* แสดงรูป preview */}
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded shadow"
                    />
                    <p className="text-xs text-gray-500 mt-1">รูปภาพที่เลือก</p>
                  </div>
                )}
                {/* แสดงรูปเดิมถ้าเป็นการแก้ไข */}
                {editMaterial && editMaterial.image && !imagePreview && (
                  <div className="mt-2">
                    <img
                      src={getImageUrl(editMaterial.image)}
                      alt="รูปเดิม"
                      className="w-20 h-20 object-cover rounded shadow"
                    />
                    <p className="text-xs text-gray-500 mt-1">รูปภาพปัจจุบัน</p>
                  </div>
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