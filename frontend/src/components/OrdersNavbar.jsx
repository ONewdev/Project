import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'ทั้งหมด', path: '/users/orders' },
  { label: 'ที่ต้องชำระ', path: '/users/pending' },
  { label: 'ที่ต้องจัดส่ง', path: '/users/confirmed' },
  { label: 'ที่ต้องรับ', path: '/users/shipped' },
  { label: 'สำเร็จแล้ว', path: '/users/delivered' },
  { label: 'ยกเลิก', path: '/users/cancelled' },
];

function OrdersNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="mb-6 flex flex-wrap gap-2 justify-center">
      {navItems.map(item => (
        <button
          key={item.path}
          className={`px-4 py-2 rounded-full font-semibold border transition-colors duration-150 ${location.pathname === item.path ? 'bg-green-600 text-white border-green-600' : 'bg-white text-green-700 border-green-200 hover:bg-green-50'}`}
          onClick={() => navigate(item.path)}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}

export default OrdersNavbar;
