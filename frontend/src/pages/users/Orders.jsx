

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Orders() {
  const host = import.meta.env.VITE_HOST;
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);

  // ใช้ key ตาม user id
  const getCartKey = () => (user ? `cart_${user.id}` : 'cart_guest');

  // โหลดข้อมูลคำสั่งซื้อจาก backend
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch(`${host}/api/orders/customer/${user.id}`, {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          console.error('Failed to fetch orders');
          setOrders([]);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, host, navigate]);

  // โหลดข้อมูลตะกร้าจาก localStorage
  useEffect(() => {
    if (user) {
      const cartKey = getCartKey();
      const savedCart = JSON.parse(localStorage.getItem(cartKey)) || [];
      setCart(savedCart);
    }
  }, [user]);

  // ลบสินค้าออกจาก cart
  const handleRemoveItem = (productId) => {
    const cartKey = getCartKey();
    const currentCart = JSON.parse(localStorage.getItem(cartKey)) || [];
    const newCart = currentCart.filter((item) => (item.product_id || item.id) !== productId);
    localStorage.setItem(cartKey, JSON.stringify(newCart));
    setCart(newCart);
  };

  // เพิ่ม/ลดจำนวนสินค้า
  const handleUpdateQuantity = (productId, type) => {
    const cartKey = getCartKey();
    const currentCart = JSON.parse(localStorage.getItem(cartKey)) || [];
    const newCart = currentCart.map((item) => {
      if ((item.product_id || item.id) === productId) {
        let newQty = item.quantity;
        if (type === 'inc') newQty += 1;
        if (type === 'dec') newQty = Math.max(1, newQty - 1);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter((item) => item.quantity > 0);
    
    localStorage.setItem(cartKey, JSON.stringify(newCart));
    setCart(newCart);
  };

  // คำนวณยอดรวมของตะกร้า
  const calculateCartTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  // ไปหน้า Checkout
  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('ไม่มีสินค้าในตะกร้า');
      return;
    }
    navigate('/users/checkout');
  };

  // ล้างตะกร้า
  const handleClearCart = () => {
    const cartKey = getCartKey();
    localStorage.removeItem(cartKey);
    setCart([]);
  };

  // แสดงสถานะคำสั่งซื้อ
  const getStatusText = (status) => {
    const statusMap = {
      'pending': 'รอการยืนยัน',
      'confirmed': 'ยืนยันแล้ว',
      'processing': 'กำลังดำเนินการ',
      'shipped': 'จัดส่งแล้ว',
      'delivered': 'จัดส่งสำเร็จ',
      'cancelled': 'ยกเลิก'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'processing': 'bg-purple-100 text-purple-800',
      'shipped': 'bg-green-100 text-green-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  // จัดกลุ่มคำสั่งซื้อตามวันที่
  const groupOrdersByDate = (orders) => {
    const grouped = {};
    orders.forEach(order => {
      const date = new Date(order.created_at).toLocaleDateString('th-TH');
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(order);
    });
    return grouped;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">กำลังโหลด...</div>
        </div>
      </div>
    );
  }

  const groupedOrders = groupOrdersByDate(orders);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">คำสั่งซื้อของฉัน</h1>

        {/* ตะกร้าสินค้า */}
        {cart.length > 0 && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">ตะกร้าสินค้า</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-3 py-2 text-left">สินค้า</th>
                    <th className="px-3 py-2 text-center">จำนวน</th>
                    <th className="px-3 py-2 text-right">ราคา</th>
                    <th className="px-3 py-2 text-center">ลบ</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, idx) => (
                    <tr key={item.product_id || item.id || idx} className="border-b last:border-b-0">
                      <td className="px-3 py-2 align-middle">{item.product_name || item.name}</td>
                      <td className="px-3 py-2 align-middle">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-xs"
                            title="ลดจำนวน"
                            onClick={() => handleUpdateQuantity(item.product_id || item.id, 'dec')}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="mx-1 min-w-[24px] text-center">{item.quantity}</span>
                          <button
                            className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-xs"
                            title="เพิ่มจำนวน"
                            onClick={() => handleUpdateQuantity(item.product_id || item.id, 'inc')}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-3 py-2 align-middle text-right">
                        ฿{Number(item.price).toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-3 py-2 align-middle text-center">
                        <button
                          className="px-2 py-0.5 bg-red-100 text-red-600 rounded hover:bg-red-200 text-xs"
                          title="ลบสินค้า"
                          onClick={() => handleRemoveItem(item.product_id || item.id)}
                        >
                          ลบ
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-6 border-t bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-lg font-semibold">ยอดรวม: ฿{calculateCartTotal().toLocaleString()}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleClearCart}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    ล้างตะกร้า
                  </button>
                  <button
                    onClick={handleCheckout}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    สั่งซื้อ
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ประวัติคำสั่งซื้อ */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">ประวัติคำสั่งซื้อ</h2>
          </div>
          
          {orders.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              ยังไม่มีคำสั่งซื้อ
            </div>
          ) : (
            <div className="divide-y">
              {Object.entries(groupedOrders).map(([date, dateOrders]) => (
                <div key={date} className="p-6">
                  <h3 className="text-lg font-semibold mb-4">{date}</h3>
                  <div className="space-y-4">
                    {dateOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          {order.image_url && (
                            <img
                              src={`${host}${order.image_url}`}
                              alt={order.product_name}
                              className="w-16 h-16 object-cover rounded"
                            />
                          )}
                          <div>
                            <h4 className="font-medium">{order.product_name}</h4>
                            <p className="text-sm text-gray-500">จำนวน: {order.quantity}</p>
                            <p className="text-sm text-gray-500">คำสั่งซื้อ #{order.id}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">฿{parseFloat(order.total_price).toLocaleString()}</p>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Orders;