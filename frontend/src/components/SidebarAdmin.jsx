import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaBars } from 'react-icons/fa';
import Swal from 'sweetalert2';

const menuItems = [
  { to: '/admin/dashboard', icon: '📈', label: 'Dashboard' },
  { to: '/admin/admins', icon: '🧑‍💼', label: 'จัดการแอดมิน' }, // เพิ่มหน้าแอดมิน
  { to: '/admin/customers', icon: '👥', label: 'จัดการข้อมูลสมาชิก' },
  { to: '/admin/products', icon: '📦', label: 'จัดการสินค้า/บริการ' },
  { to: '/admin/categories', icon: '🗂️', label: 'จัดการหมวดหมู่สินค้า' }, // เพิ่มหมวดหมู่สินค้า
  { to: '/admin/orders', icon: '🛒', label: 'จัดการคำสั่งซื้อ' },
  { to: '/admin/contact', icon: '📞', label: 'ข้อมูลร้านค้า' },
  { to: '/admin/stock', icon: '📦', label: 'สต็อกวัสดุ' },
  { to: '/admin/sales', icon: '💰', label: 'จัดการข้อมูลการขาย' },
  { to: '/admin/finance', icon: '💳', label: 'ฐานการเงิน' }, // เพิ่มฐานการเงิน
  { to: '/admin/quotation', icon: '📝', label: 'ใบเสนอราคา' },
  { to: '/admin/report', icon: '📄', label: 'ออกรายงาน' },
  { to: '/admin/withdraw', icon: '📤', label: 'เบิกวัสดุ' },
  { to: '/admin/setting', icon: '⚙️', label: 'ตั้งค่า' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!document.getElementById('kanit-font')) {
      const link = document.createElement('link');
      link.id = 'kanit-font';
      link.href = 'https://fonts.googleapis.com/css2?family=Kanit:wght@400;500;600;700&display=swap';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: 'คุณแน่ใจหรือไม่?',
      text: 'คุณต้องการออกจากระบบหรือไม่',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#16a34a',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ใช่, ออกจากระบบ',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token');
        Swal.fire({
          icon: 'success',
          title: 'ออกจากระบบแล้ว',
          showConfirmButton: false,
          timer: 1500,
          confirmButtonColor: '#16a34a'
        }).then(() => {
          navigate('/admin/login');
        });
      }
    });
  };

  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <div
      className="vh-100 p-3 d-flex flex-column"
      style={{
        width: collapsed ? '70px' : '250px',
        transition: 'width 0.3s',
        position: 'fixed',
        background: 'linear-gradient(180deg, #22c55e 0%, #16a34a 100%)',
        color: '#fff',
        fontFamily: "'Kanit', sans-serif"
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        {!collapsed && <h5 style={{ fontWeight: 700, letterSpacing: 1 }}>Admin Panel</h5>}
        <button onClick={toggleSidebar} className="btn btn-sm btn-outline-light border-0">
          <FaBars />
        </button>
      </div>
      <ul className="nav flex-column">
        {menuItems.map((item, idx) => (
          <li className="nav-item" key={idx}>
            <Link
              to={item.to}
              className="nav-link text-white sidebar-link"
              style={{ fontWeight: 500 }}
            >
              {item.icon} {!collapsed && item.label}
            </Link>
          </li>
        ))}
        <li className="nav-item">
          <button
            onClick={handleLogout}
            className="btn btn-link nav-link text-white text-start sidebar-link"
            style={{ fontWeight: 500 }}
          >
            🔓 {!collapsed && 'ออกจากระบบ'}
          </button>
        </li>
      </ul>
      <style>{`
        .sidebar-link:hover, .sidebar-link:focus {
          background: rgba(255,255,255,0.18);
          color: #fff !important;
          border-radius: 8px;
          text-decoration: none;
        }
      `}</style>
    </div>
  );
}
