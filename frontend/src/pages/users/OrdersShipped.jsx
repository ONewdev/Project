import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import OrdersNavbar from '../../components/OrdersNavbar';

function OrdersShipped() {
  const host = import.meta.env.VITE_HOST;
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${host}/api/orders/customer/${user.id}`, { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          setOrders(data.filter(o => o.status === 'shipped'));
        } else {
          setOrders([]);
        }
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user, host, navigate]);

  if (loading) return <div className="text-center py-8">กำลังโหลด...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <OrdersNavbar />
        <h1 className="text-2xl font-bold mb-6">ออเดอร์ที่ต้องรับ</h1>
        {orders.length === 0 ? (
          <div className="p-6 text-center text-gray-500">ยังไม่มีออเดอร์ที่ต้องรับ</div>
        ) : (
          <div className="divide-y">
            {orders.map(order => (
              <div key={order.id} className="p-4 border rounded-lg mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">รหัสออเดอร์: #{String(order.id).padStart(4, '0')}</span>
                  <span className="font-semibold text-lg">฿{Number(order.total_price).toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
                </div>
                <button
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs"
                  onClick={() => {/* TODO: ยืนยันรับสินค้า */}}
                >
                  ยืนยันรับสินค้า
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrdersShipped;
