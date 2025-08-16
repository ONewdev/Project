
import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';
import { FaCheck, FaBan, FaEdit, FaTrash, FaTimes, FaShippingFast } from 'react-icons/fa';

function Orders() {
  const host = import.meta.env.VITE_HOST;
  const [orders, setOrders] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editOrder, setEditOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetch(`${host}/api/orders`)
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error('Fetch error:', err));
  }, []);


  const handleStatusChange = (id, status) => {
    const statusText = statusMapping[status] || status;
    const order = orders.find(o => o.id === id);
    Swal.fire({
      title: 'ยืนยันการเปลี่ยนแปลงสถานะ',
      text: `คุณต้องการเปลี่ยนสถานะเป็น "${statusText}" สำหรับ Order #${id} หรือไม่?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'ใช่, เปลี่ยนแปลง',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${host}/api/orders/${id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
        })
          .then((res) => res.json())
          .then(() => {
            setOrders((prev) =>
              prev.map((order) =>
                order.id === id ? { ...order, status } : order
              )
            );
            Swal.fire('สำเร็จ!', `สถานะของ Order #${id} ถูกเปลี่ยนเป็น ${statusText}`, 'success');
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
      text: 'คุณต้องการลบคำสั่งซื้อรายการนี้หรือไม่',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ใช่, ลบเลย',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${host}/api/orders/${id}`, {
          method: 'DELETE',
        })
          .then((res) => res.json())
          .then(() => {
            setOrders((prev) => prev.filter((o) => o.id !== id));
            Swal.fire('ลบแล้ว!', 'คำสั่งซื้อถูกลบเรียบร้อยแล้ว', 'success');
          })
          .catch(() => {
            Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถลบคำสั่งซื้อได้', 'error');
          });
      }
    });
  };

  const handleEdit = (id) => {
    const order = orders.find((o) => o.id === id);
    setEditOrder({ ...order });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditOrder((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    // สามารถเพิ่ม field ที่ต้องการอัปเดตได้
    const { status, shipping_address } = editOrder;
    const updateData = { status, shipping_address };
    fetch(`${host}/api/orders/${editOrder.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    })
      .then((res) => res.json())
      .then(() => {
        Swal.fire('สำเร็จ', 'อัปเดตข้อมูลคำสั่งซื้อแล้ว', 'success');
        setOrders((prev) =>
          prev.map((o) => (o.id === editOrder.id ? editOrder : o))
        );
        setShowEditModal(false);
      })
      .catch(() =>
        Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถอัปเดตได้', 'error')
      );
  };

  

  const statusMapping = {
    pending: "รอดำเนินการ",
    approved: "อนุมัติแล้ว",
    shipped: "จัดส่งแล้ว",
    received: "รับสินค้าแล้ว",
    processing: "กำลังจัดส่ง",
    completed: "สำเร็จแล้ว",
    cancelled: "ยกเลิก"
  };

  const filteredOrders = filterStatus === 'all'
    ? orders
    : orders.filter((order) => order.status === filterStatus);

  const columns = [
    { name: '#', cell: (row, idx) => idx + 1, width: '60px', center: true },
    { name: 'ลูกค้า', selector: (row) => row.customer_name },
    {
      name: 'สินค้า',
      cell: (row) =>
        row.items && row.items.length > 0 ? (
          <ul className="list-disc pl-4">
            {row.items.map((item, idx) => (
              <li key={item.id ? `item-${item.id}` : `idx-${idx}`}>{item.product_name} <span className="text-xs text-gray-500">x{item.quantity}</span></li>
            ))}
          </ul>
        ) : <span className="text-gray-400">-</span>,
    },
    {
      name: 'ยอดรวม',
      selector: (row) => row.total_price !== undefined && row.total_price !== null && !isNaN(Number(row.total_price)) ? `฿${Number(row.total_price).toLocaleString('th-TH', { minimumFractionDigits: 2 })}` : '-',
    },
    { name: 'ที่อยู่จัดส่ง', selector: (row) => row.shipping_address },
    {
      name: 'วันที่สั่งซื้อ',
      selector: (row) => new Date(row.created_at).toLocaleString('th-TH'),
    },
    {
      name: 'สถานะ',
      cell: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.status === 'pending'
              ? 'bg-yellow-100 text-yellow-800'
              : row.status === 'approved'
              ? 'bg-blue-100 text-blue-800'
              : row.status === 'shipped'
              ? 'bg-purple-100 text-purple-800'
              : row.status === 'received'
              ? 'bg-green-100 text-green-800'
              : row.status === 'cancelled'
              ? 'bg-red-100 text-red-800'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {statusMapping[row.status] || row.status}
        </span>
      ),
    },
    {
      name: 'การจัดการ',
      cell: (row) => (
        <div className="flex gap-2">
          {row.status === 'pending' ? (
            <button
              onClick={() => handleStatusChange(row.id, 'approved')}
              className="px-2 py-1 text-blue-600 border border-blue-300 rounded hover:bg-blue-50 transition-colors"
              title="อนุมัติ"
            >
              <FaCheck />
            </button>
          ) : row.status === 'approved' ? (
            <button
              onClick={() => handleStatusChange(row.id, 'shipped')}
              className="px-2 py-1 text-purple-600 border border-purple-300 rounded hover:bg-purple-50 transition-colors"
              title="จัดส่ง"
            >
              <FaShippingFast />
            </button>
          ) : row.status === 'shipped' ? (
            <button
              onClick={() => handleStatusChange(row.id, 'received')}
              className="px-2 py-1 text-green-600 border border-green-300 rounded hover:bg-green-50 transition-colors"
              title="รับสินค้า"
            >
              <FaCheck />
            </button>
          ) : null}
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
    },
  ];

  return (
    <div className="container mx-auto mt-8 pl-24">
      <h2 className="text-2xl font-bold mb-6">Order List</h2>
      <div className="mb-4">
        <label className="mr-2">กรองสถานะ:</label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border rounded p-1"
        >
          <option value="all">ทั้งหมด</option>
          {Object.entries(statusMapping).map(([key, value]) => (
            <option key={key} value={key}>{value}</option>
          ))}
        </select>
      </div>
      {filteredOrders.length > 0 ? (
        <DataTable columns={columns} data={filteredOrders} pagination />
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
              <h3 className="text-lg font-semibold">แก้ไขข้อมูลคำสั่งซื้อ</h3>
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
                    สถานะ
                  </label>
                  <select
                    name="status"
                    value={editOrder?.status || 'pending'}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {Object.entries(statusMapping).map(([key, value]) => (
                      <option key={key} value={key}>{value}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ที่อยู่จัดส่ง
                  </label>
                  <input
                    name="shipping_address"
                    value={editOrder?.shipping_address || ''}
                    onChange={handleEditChange}
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
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

export default Orders;
