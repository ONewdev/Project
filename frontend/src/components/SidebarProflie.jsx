
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaBars } from 'react-icons/fa';
import Swal from 'sweetalert2';

const menuItems = [
  { to: '/users/profile', icon: '👤', label: 'โปรไฟล์ของฉัน' },
  { to: '/users/favorite', icon: '❤️', label: 'รายการโปรด' },
  { to: '/users/orders', icon: '🛒', label: 'คำสั่งซื้อของฉัน' },
  { to: '/users/payments', icon: '💳', label: 'การชำระเงิน' },
  { to: '/users/notifications', icon: '🔔', label: 'แจ้งเตือน' },
];

export default function SidebarProflie() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState({ name: 'Guest', email: '', profile_picture: '' });

  useEffect(() => {
    if (!document.getElementById('kanit-font')) {
      const link = document.createElement('link');
      link.id = 'kanit-font';
      link.href = 'https://fonts.googleapis.com/css2?family=Kanit:wght@400;500;600;700&display=swap';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    // ดึง user จาก cookie auth (Navbar จะ sync state ให้ ถ้าใช้ global context สามารถปรับได้)
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
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
        // เรียก logout backend (cookie auth)
        fetch(`${import.meta.env.VITE_HOST}/api/customers/logout`, { method: 'POST', credentials: 'include' })
          .finally(() => {
            localStorage.removeItem('user');
            Swal.fire({
              icon: 'success',
              title: 'ออกจากระบบแล้ว',
              showConfirmButton: false,
              timer: 1200,
              confirmButtonColor: '#16a34a'
            }).then(() => {
              window.dispatchEvent(new Event('userChanged'));
              navigate('/home');
            });
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
        background: 'linear-gradient(180deg, #bbf7d0 0%, #22c55e 100%)',
        color: '#166534',
        fontFamily: "'Kanit', sans-serif"
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        {!collapsed && <h5 style={{ fontWeight: 700, letterSpacing: 1 }}>User Menu</h5>}
        <button onClick={toggleSidebar} className="btn btn-sm btn-outline-success border-0">
          <FaBars />
        </button>
      </div>
      <div className="d-flex flex-column align-items-center mb-4">
        <img
          src={user.profile_picture || '/images/no-image.png'}
          alt="Profile"
          className="rounded-circle mb-2"
          style={{ width: 60, height: 60, objectFit: 'cover', border: '2px solid #22c55e' }}
        />
        {!collapsed && <>
          <div style={{ fontWeight: 600 }}>{user.name}</div>
          <div style={{ fontSize: 13 }}>{user.email}</div>
        </>}
      </div>
      <ul className="nav flex-column mb-3">
        <li className="nav-item">
          <Link to="/" className="nav-link sidebar-link text-success" style={{ fontWeight: 500 }}>
            🏠 {!collapsed && 'กลับหน้าแรก'}
          </Link>
        </li>
        {menuItems.map((item, idx) => (
          <li className="nav-item" key={idx}>
            <Link
              to={item.to}
              className="nav-link sidebar-link text-success"
              style={{ fontWeight: 500 }}
            >
              {item.icon} {!collapsed && item.label}
            </Link>
          </li>
        ))}
        <li className="nav-item">
          <button
            onClick={handleLogout}
            className="btn btn-link nav-link text-success text-start sidebar-link"
            style={{ fontWeight: 500 }}
          >
            🔓 {!collapsed && 'ออกจากระบบ'}
          </button>
        </li>
      </ul>
      <style>{`
        .sidebar-link:hover, .sidebar-link:focus {
          background: rgba(34,197,94,0.12);
          color: #166534 !important;
          border-radius: 8px;
          text-decoration: none;
        }
      `}</style>
    </div>
  );
}