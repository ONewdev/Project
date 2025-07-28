import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const host = import.meta.env.VITE_HOST;
  
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shipping_address: '',
    phone: '',
    note: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // ดึงข้อมูลตะกร้าจาก localStorage
    const cartKey = `cart_${user.id}`;
    const savedCart = JSON.parse(localStorage.getItem(cartKey)) || [];
    
    if (savedCart.length === 0) {
      navigate('/products');
      return;
    }

    setCart(savedCart);
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRemoveItem = (productId) => {
    const updatedCart = cart.filter(item => item.id !== productId);
    setCart(updatedCart);
    
    const cartKey = `cart_${user.id}`;
    localStorage.setItem(cartKey, JSON.stringify(updatedCart));
  };

  const handleUpdateQuantity = (productId, type) => {
    const updatedCart = cart.map(item => {
      if (item.id === productId) {
        let newQty = item.quantity;
        if (type === 'inc') newQty += 1;
        if (type === 'dec') newQty = Math.max(1, newQty - 1);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    
    setCart(updatedCart);
    const cartKey = `cart_${user.id}`;
    localStorage.setItem(cartKey, JSON.stringify(updatedCart));
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    
    if (!formData.shipping_address || !formData.phone) {
      alert('กรุณากรอกข้อมูลที่จำเป็น');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        customer_id: user.id,
        items: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity
        })),
        shipping_address: formData.shipping_address,
        phone: formData.phone,
        note: formData.note
      };

      const response = await fetch(`${host}/api/orders/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(orderData)
      });

      const result = await response.json();

      if (response.ok) {
        // ลบตะกร้าหลังจากสั่งซื้อสำเร็จ
        const cartKey = `cart_${user.id}`;
        localStorage.removeItem(cartKey);
        
        alert('สั่งซื้อสำเร็จ! คำสั่งซื้อของคุณได้รับการยืนยันแล้ว');
        navigate('/users/orders');
      } else {
        alert(result.message || 'เกิดข้อผิดพลาดในการสั่งซื้อ');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">ยืนยันการสั่งซื้อ</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* รายการสินค้า */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">รายการสินค้า</h2>
            
            {cart.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 p-4 border-b last:border-b-0">
                <img
                  src={`${host}${item.image_url}` || '/images/no-image.png'}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-green-600 font-semibold">
                    ฿{parseFloat(item.price).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleUpdateQuantity(item.id, 'dec')}
                    className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQuantity(item.id, 'inc')}
                    className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  ลบ
                </button>
              </div>
            ))}
            
            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between text-lg font-semibold">
                <span>ยอดรวม:</span>
                <span className="text-green-600">฿{calculateTotal().toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* ฟอร์มข้อมูลการจัดส่ง */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">ข้อมูลการจัดส่ง</h2>
            
            <form onSubmit={handleSubmitOrder} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ที่อยู่จัดส่ง *
                </label>
                <textarea
                  name="shipping_address"
                  value={formData.shipping_address}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="กรอกที่อยู่จัดส่ง"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  เบอร์โทรศัพท์ *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="081-234-5678"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  หมายเหตุ (ถ้ามี)
                </label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="หมายเหตุเพิ่มเติม"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading || cart.length === 0}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? 'กำลังประมวลผล...' : 'ยืนยันการสั่งซื้อ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout; 