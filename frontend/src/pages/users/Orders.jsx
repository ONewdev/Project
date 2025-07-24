import React, { useEffect, useState } from 'react';

function Orders() {
  const host = import.meta.env.VITE_HOST;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ดึงข้อมูลออเดอร์ของลูกค้าจาก backend (แก้ endpoint ตามจริง)
    fetch(`${host}/api/customers/orders`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [host]);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-6 text-green-700">รายการสั่งซื้อของฉัน</h2>
      {loading ? (
        <div className="text-center text-gray-500 py-12">กำลังโหลด...</div>
      ) : orders.length === 0 ? (
        <div className="text-center text-gray-400 py-12">ยังไม่มีรายการสั่งซื้อ</div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl shadow p-6"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                <div>
                  <span className="font-semibold text-gray-800">เลขที่ออเดอร์:</span>{' '}
                  <span className="text-green-700">{order.order_number || order.id}</span>
                </div>
                <div className="text-sm text-gray-500">
                  {order.created_at ? new Date(order.created_at).toLocaleString('th-TH') : ''}
                </div>
              </div>
              <div className="mb-2">
                <span className="font-semibold text-gray-800">สถานะ:</span>{' '}
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  order.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-700'
                    : order.status === 'success'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {order.status === 'pending'
                    ? 'รอดำเนินการ'
                    : order.status === 'success'
                    ? 'สำเร็จ'
                    : order.status || '-'}
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm mt-2">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-2 py-1 text-left">สินค้า</th>
                      <th className="px-2 py-1 text-left">จำนวน</th>
                      <th className="px-2 py-1 text-left">ราคา</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(order.items || []).map((item) => (
                      <tr key={item.product_id}>
                        <td className="px-2 py-1">{item.product_name}</td>
                        <td className="px-2 py-1">{item.quantity}</td>
                        <td className="px-2 py-1">
                          ฿{Number(item.price).toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="text-right mt-4 font-bold text-green-700">
                ยอดรวม: ฿{Number(order.total_price).toLocaleString('th-TH', { minimumFractionDigits: 2 })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;