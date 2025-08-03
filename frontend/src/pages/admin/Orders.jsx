import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

export default function AdminOrders() {
  const host = import.meta.env.VITE_HOST;
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetch(`${host}/api/orders`)
      .then((res) => res.json())
      .then((data) => {
        console.log('orders:', data); // debug log
        setOrders(data);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleAction = async (id, action) => {
    let confirmText = '', successText = '', method = 'PUT';
    if (action === 'approve') {
      confirmText = 'คุณต้องการอนุมัติคำสั่งซื้อนี้ใช่ไหม?';
      successText = 'อนุมัติคำสั่งซื้อเรียบร้อยแล้ว';
    } else if (action === 'ship') {
      confirmText = 'คุณต้องการยืนยันการจัดส่งหรือไม่?';
      successText = 'ยืนยันการจัดส่งเรียบร้อยแล้ว';
    } else if (action === 'receive') {
      confirmText = 'คุณต้องการยืนยันการรับสินค้าหรือไม่?';
      successText = 'ยืนยันการรับสินค้าเรียบร้อยแล้ว';
    }

    const result = await Swal.fire({
      title: 'ยืนยันการทำรายการ',
      text: confirmText,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก',
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`${host}/api/orders/${id}/${action}`, {
          method,
        });
        if (res.ok) {
          const updated = await res.json();
          setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
          Swal.fire('สำเร็จ', successText, 'success');
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  

  const getStatusColor = (status) => {
    const map = {
      pending: 'text-yellow-600 bg-yellow-100',
      approved: 'text-blue-600 bg-blue-100',
      shipped: 'text-purple-600 bg-purple-100',
      received: 'text-green-600 bg-green-100',
      cancelled: 'text-red-600 bg-red-100',
      
      processing: 'text-orange-600 bg-orange-100',
      completed: 'text-green-700 bg-green-200',
    };
    return `px-2 py-1 rounded text-sm font-medium ${map[status] || 'bg-gray-100 text-gray-600'}`;
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

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">จัดการคำสั่งซื้อ</h1>

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

      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">#</th>
            <th className="border px-4 py-2">ลูกค้า</th>
            <th className="border px-4 py-2">สินค้า</th>
            <th className="border px-4 py-2">ยอดรวม</th>
           
            <th className="border px-4 py-2">ที่อยู่จัดส่ง</th>
            <th className="border px-4 py-2">วันที่สั่งซื้อ</th>
            <th className="border px-4 py-2">สถานะ</th>
            <th className="border px-4 py-2">การจัดการ</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order, index) => (
            <tr key={order.id}>
              <td className="border px-4 py-2 text-center">{index + 1}</td>
              <td className="border px-4 py-2">{order.customer_name}</td>
              <td className="border px-4 py-2">
                {order.items && order.items.length > 0 ? (
                  <ul className="list-disc pl-4">
                    {order.items.map((item, idx) => (
                      <li key={item.id ? `item-${item.id}` : `idx-${idx}`}>
                        {item.product_name} <span className="text-xs text-gray-500">x{item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                ) : <span className="text-gray-400">-</span>}
              </td>
              <td className="border px-4 py-2">{order.total_price !== undefined && order.total_price !== null && !isNaN(Number(order.total_price)) ? `฿${Number(order.total_price).toLocaleString('th-TH', { minimumFractionDigits: 2 })}` : '-'}</td>
              <td className="border px-4 py-2">{order.shipping_address}</td>
              <td className="border px-4 py-2">{new Date(order.created_at).toLocaleDateString('th-TH')}</td>
              <td className="border px-4 py-2">
                <span className={getStatusColor(order.status)}>{statusMapping[order.status] || order.status}</span>
              </td>
              <td className="border px-4 py-2 space-x-1">
                {/* ปุ่ม action ตามสถานะ */}
                {order.status === 'pending' && (
                  <button
                    onClick={() => handleAction(order.id, 'approve')}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                  >อนุมัติ</button>
                )}
                {order.status === 'approved' && (
                  <button
                    onClick={() => handleAction(order.id, 'ship')}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-2 py-1 rounded"
                  >จัดส่ง</button>
                )}
                {order.status === 'shipped' && (
                  <button
                    onClick={() => handleAction(order.id, 'receive')}
                    className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
                  >ยืนยันรับ</button>
                )}
                {/* เพิ่มปุ่มยกเลิก ถ้าต้องการ */}
                {['pending', 'approved'].includes(order.status) && (
                  <button
                    onClick={() => handleAction(order.id, 'cancel')}
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                  >ยกเลิก</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
