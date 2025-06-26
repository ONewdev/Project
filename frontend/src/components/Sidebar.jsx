import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaBars } from 'react-icons/fa';
import Swal from 'sweetalert2';

export default function Sidebar() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

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

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // Google Fonts
  if (!document.getElementById('kanit-font')) {
    const link = document.createElement('link');
    link.id = 'kanit-font';
    link.href = 'https://fonts.googleapis.com/css2?family=Kanit:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }

  return (
    <div
      className={`vh-100 p-3 d-flex flex-column`}
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
        {!collapsed && <h5 style={{ fontWeight: 700, letterSpacing: 1 }}>Admin</h5>}
        <button onClick={toggleSidebar} className="btn btn-sm btn-outline-light border-0">
          <FaBars />
        </button>
      </div>

      <ul className="nav flex-column">
        <li className="nav-item">
          <Link to="/admin/dashboard" className="nav-link text-white" style={{ fontWeight: 500 }}>
            📈 {!collapsed && 'Dashboard'}
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/orders" className="nav-link text-white" style={{ fontWeight: 500 }}>
            🛒 {!collapsed && 'Orders'}
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/customers" className="nav-link text-white" style={{ fontWeight: 500 }}>
            👥 {!collapsed && 'Customers'}
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/products" className="nav-link text-white" style={{ fontWeight: 500 }}>
            📦 {!collapsed && 'Products'}
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/contact" className="nav-link text-white" style={{ fontWeight: 500 }}>
            📞 {!collapsed && 'Contact'}
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/setting" className="nav-link text-white" style={{ fontWeight: 500 }}>
            ⚙️ {!collapsed && 'Setting'}
          </Link>
        </li>
        <li className="nav-item">
          <button onClick={handleLogout} className="btn btn-link nav-link text-white text-start" style={{ fontWeight: 500 }}>
            🔓 {!collapsed && 'Logout'}
          </button>
        </li>
      </ul>
    </div>
  );
}
