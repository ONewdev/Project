import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  // ใช้ key ตาม user id หรือ guest
  const getCartKey = () => (user ? `cart_${user.id}` : 'cart_guest');

  // โหลดข้อมูลตะกร้าจาก localStorage
  useEffect(() => {
    const cartKey = getCartKey();
    const savedCart = JSON.parse(localStorage.getItem(cartKey)) || [];
    setCart(savedCart);
    window.dispatchEvent(new Event('cartUpdated'));
  }, [user]);

  // ลบสินค้าออกจาก cart
  const handleRemoveItem = (productId) => {
    const cartKey = getCartKey();
    const currentCart = JSON.parse(localStorage.getItem(cartKey)) || [];
    const newCart = currentCart.filter((item) => (item.product_id || item.id) !== productId);
    localStorage.setItem(cartKey, JSON.stringify(newCart));
    setCart(newCart);
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // เพิ่ม/ลด/ตั้งจำนวนสินค้า
  const handleUpdateQuantity = (productId, typeOrValue) => {
    const cartKey = getCartKey();
    const currentCart = JSON.parse(localStorage.getItem(cartKey)) || [];
    let newCart;
    if (typeof typeOrValue === 'number') {
      // กรณีกรอกเลขเอง
      newCart = currentCart.map((item) => {
        if ((item.product_id || item.id) === productId) {
          return { ...item, quantity: typeOrValue };
        }
        return item;
      }).filter((item) => item.quantity > 0);
    } else {
      // กรณีปุ่ม + -
      newCart = currentCart.map((item) => {
        if ((item.product_id || item.id) === productId) {
          let newQty = item.quantity;
          if (typeOrValue === 'inc') newQty += 1;
          if (typeOrValue === 'dec') newQty = Math.max(1, newQty - 1);
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter((item) => item.quantity > 0);
    }
    localStorage.setItem(cartKey, JSON.stringify(newCart));
    setCart(newCart);
    window.dispatchEvent(new Event('cartUpdated'));
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
    window.dispatchEvent(new Event('cartUpdated'));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">ตะกร้าสินค้า</h1>
        {cart.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            ไม่มีสินค้าในตะกร้า
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">รายการสินค้า</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-3 py-2 text-left">สินค้า</th>
                    <th className="px-3 py-2 text-center">จำนวน</th>
                    <th className="px-3 py-2 text-right">ราคา/หน่วย</th>
                    <th className="px-3 py-2 text-center">ลบ</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, idx) => (
                    <tr key={item.product_id || item.id || idx} className="border-b last:border-b-0">
                      <td className="px-3 py-2 align-middle">
                        {item.product_name || item.name}
                        {item.product_id && (
                          <button
                            className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs"
                            onClick={() => navigate(`/home/product/${item.product_id}`)}
                          >
                            ดูรายละเอียด
                          </button>
                        )}
                      </td>
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
                          <input
                            type="number"
                            min={1}
                            value={item.quantity}
                            className="mx-1 w-14 text-center border rounded"
                            onChange={e => {
                              const val = Math.max(1, Number(e.target.value));
                              handleUpdateQuantity(item.product_id || item.id, val);
                            }}
                          />
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
                        {item.price !== undefined && item.price !== null && !isNaN(Number(item.price))
                          ? `฿${Number(item.price).toLocaleString('th-TH', { minimumFractionDigits: 2 })}`
                          : '-'}
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
      </div>
    </div>
  );
}

export default Cart;
