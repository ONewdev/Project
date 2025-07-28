import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';
import { FaEdit, FaTrash, FaTimes } from 'react-icons/fa';

function Category() {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [form, setForm] = useState({ category_name: '' });
  const host = import.meta.env.VITE_HOST;

  useEffect(() => {
    fetch(`${host}/api/categories`)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(() => setCategories([]));
  }, [host]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = () => {
    setEditCategory(null);
    setForm({ category_name: '' });
    setShowModal(true);
  };

  const handleEdit = (id) => {
    const category = categories.find((c) => c.category_id === id);
    setEditCategory(category);
    setForm({ category_name: category.category_name });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'ลบหมวดหมู่?',
      text: 'คุณต้องการลบหมวดหมู่นี้หรือไม่',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ใช่, ลบเลย',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#16a34a',
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${host}/api/categories/${id}`, { method: 'DELETE' })
          .then((res) => res.json())
          .then(() => {
            setCategories((prev) => prev.filter((a) => a.category_id !== id));
            Swal.fire('ลบแล้ว!', '', 'success');
          });
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editCategory) {
      // update
      fetch(`${host}/api/categories/${editCategory.category_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
        .then((res) => res.json())
        .then((data) => {
          setCategories((prev) => prev.map((a) => (a.category_id === editCategory.category_id ? { ...a, ...form } : a)));
          setShowModal(false);
          Swal.fire('สำเร็จ', 'อัปเดตข้อมูลหมวดหมู่แล้ว', 'success');
        });
    } else {
      // create
      fetch(`${host}/api/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
        .then((res) => res.json())
        .then((data) => {
          setCategories((prev) => [...prev, data]);
          setShowModal(false);
          Swal.fire('สำเร็จ', 'เพิ่มหมวดหมู่แล้ว', 'success');
        });
    }
  };

  // DataTable columns
  const columns = [
    { name: 'ชื่อหมวดหมู่', selector: (row) => row.category_name },
    {
      name: 'Actions',
      cell: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(row.category_id)}
            className="px-2 py-1 text-blue-600 border border-blue-300 rounded hover:bg-blue-50 transition-colors"
            title="Edit"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => handleDelete(row.category_id)}
            className="px-2 py-1 text-red-600 border border-red-300 rounded hover:bg-red-50 transition-colors"
            title="Delete"
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto mt-8 pl-24">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">จัดการหมวดหมู่สินค้า</h2>
        <button onClick={handleAdd} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          + เพิ่มหมวดหมู่
        </button>
      </div>
      {categories.length > 0 ? (
        <DataTable columns={columns} data={categories} pagination />
      ) : (
        <p className="text-gray-500">ไม่มีข้อมูล</p>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setShowModal(false)}
          ></div>

          {/* Modal */}
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">{editCategory ? 'แก้ไขหมวดหมู่' : 'เพิ่มหมวดหมู่'}</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ชื่อหมวดหมู่
                  </label>
                  <input
                    name="category_name"
                    value={form.category_name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                {/* เพิ่มฟิลด์อื่นๆ ได้ตามต้องการ */}
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 p-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
                >
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Category