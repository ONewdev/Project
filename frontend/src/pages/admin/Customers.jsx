import React, { useEffect, useMemo, useState } from 'react';
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';
import { FaCheck, FaBan, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);
  const [search, setSearch] = useState('');
  const host = import.meta.env.VITE_HOST;

  useEffect(() => {
    fetch(`${host}/api/customers`)
      .then((res) => res.json())
      .then((data) => setCustomers(Array.isArray(data) ? data : (data?.data ?? [])))
      .catch((err) => console.error('Fetch error:', err));
  }, [host]);

  // กรองจากชื่อหรืออีเมล (ไม่สนตัวพิมพ์เล็กใหญ่)
  const filteredCustomers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter((c) =>
      (c.name ?? '').toLowerCase().includes(q) ||
      (c.email ?? '').toLowerCase().includes(q)
    );
  }, [customers, search]);

  const handleStatusChange = (id, status) => {
    const statusText = status === 'active' ? 'เปิดใช้งาน' : 'ปิดใช้งาน';
    const customer = customers.find((c) => c.id === id);

    Swal.fire({
      title: 'ยืนยันการเปลี่ยนแปลงสถานะ',
      text: `คุณต้องการ${statusText} ${customer?.name || 'ลูกค้า'} หรือไม่?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'ใช่, เปลี่ยนแปลง',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${host}/api/customers/${id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
        })
          .then((res) => res.json())
          .then(() => {
            setCustomers((prev) =>
              prev.map((c) => (c.id === id ? { ...c, status } : c))
            );
            Swal.fire('สำเร็จ!', `สถานะของ ${customer?.name || 'ลูกค้า'} ถูก${statusText}แล้ว`, 'success');
          })
          .catch((err) => {
            console.error('Status change error:', err);
            Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถเปลี่ยนแปลงสถานะได้', 'error');
          });
      }
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'คุณแน่ใจหรือไม่?',
      text: 'คุณต้องการลบลูกค้ารายนี้หรือไม่',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ใช่, ลบเลย',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${host}/api/customers/${id}`, { method: 'DELETE' })
          .then((res) => res.json())
          .then(() => {
            setCustomers((prev) => prev.filter((c) => c.id !== id));
            Swal.fire('ลบแล้ว!', 'ลูกค้าถูกลบเรียบร้อยแล้ว', 'success');
          })
          .catch(() => {
            Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถลบลูกค้าได้', 'error');
          });
      }
    });
  };

  const handleEdit = (id) => {
    const customer = customers.find((c) => c.id === id);
    setEditCustomer({ ...customer });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();

    const { email, name, status } = editCustomer;
    const updateData = { email, name, status };

    fetch(`${host}/api/customers/${editCustomer.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    })
      .then((res) => res.json())
      .then(() => {
        Swal.fire('สำเร็จ', 'อัปเดตข้อมูลลูกค้าแล้ว', 'success');
        setCustomers((prev) =>
          prev.map((c) => (c.id === editCustomer.id ? { ...c, ...updateData } : c))
        );
        setShowEditModal(false);
      })
      .catch(() => Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถอัปเดตได้', 'error'));
  };

  const safeDate = (d) => (d ? new Date(d).toLocaleString() : '-');

  const columns = [
    { name: 'Email', selector: (row) => row.email ?? '-' },
    { name: 'Name', selector: (row) => row.name ?? '-' },
    { name: 'Created At', selector: (row) => safeDate(row.created_at) },
    { name: 'Updated At', selector: (row) => safeDate(row.updated_at) },
    {
      name: 'Status',
      cell: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.status === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {row.status === 'active' ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
        </span>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: 'Profile Picture',
      cell: (row) =>
        row.profile_picture ? (
          <img
            src={`${host}${row.profile_picture}`}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          'N/A'
        ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div className="flex gap-2">
          {row.status === 'active' ? (
            <button
              onClick={() => handleStatusChange(row.id, 'inactive')}
              className="px-2 py-1 text-yellow-600 border border-yellow-300 rounded hover:bg-yellow-50 transition-colors"
              title="ปิดใช้งาน"
            >
              <FaBan />
            </button>
          ) : (
            <button
              onClick={() => handleStatusChange(row.id, 'active')}
              className="px-2 py-1 text-green-600 border border-green-300 rounded hover:bg-green-50 transition-colors"
              title="เปิดใช้งาน"
            >
              <FaCheck />
            </button>
          )}
          <button
            onClick={() => handleEdit(row.id)}
            className="px-2 py-1 text-blue-600 border border-blue-300 rounded hover:bg-blue-50 transition-colors"
            title="แก้ไข"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="px-2 py-1 text-red-600 border border-red-300 rounded hover:bg-red-50 transition-colors"
            title="ลบ"
          >
            <FaTrash />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <div className="container mx-auto mt-8 pl-24">
      {/* Header + Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <h2 className="text-2xl font-bold">รายชื่อสมาชิก</h2>

        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาชื่อหรืออีเมลลูกค้า…"
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 select-none">🔍</span>

          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="ล้างคำค้น"
              title="ล้างคำค้น"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {customers.length > 0 ? (
        filteredCustomers.length > 0 ? (
          <DataTable columns={columns} data={filteredCustomers} pagination />
        ) : (
          <p className="text-gray-500">ไม่พบผลลัพธ์ที่ตรงกับคำค้นหา</p>
        )
      ) : (
        <p className="text-gray-500">ไม่มีข้อมูล</p>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setShowEditModal(false)}
          ></div>

          {/* Modal */}
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">แก้ไขข้อมูลลูกค้า</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleEditSubmit}>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    name="email"
                    value={editCustomer?.email || ''}
                    onChange={handleEditChange}
                    type="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    name="name"
                    value={editCustomer?.name || ''}
                    onChange={handleEditChange}
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={editCustomer?.status || 'active'}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="active">เปิดใช้งาน</option>
                    <option value="inactive">ปิดใช้งาน</option>
                  </select>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 p-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                >
                  บันทึกการเปลี่ยนแปลง
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Customers;
