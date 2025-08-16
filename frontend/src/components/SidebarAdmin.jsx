import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaBars, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import Swal from 'sweetalert2';

export default function SidebarAdmin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [openDropdown, setOpenDropdown] = useState({
    users: false,
    products: false,
    orders: false,
  });

  useEffect(() => {
    if (!document.getElementById('kanit-font')) {
      const link = document.createElement('link');
      link.id = 'kanit-font';
      link.href =
        'https://fonts.googleapis.com/css2?family=Kanit:wght@400;500;600;700&display=swap';
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
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('admin_token');
        Swal.fire({
          icon: 'success',
          title: 'ออกจากระบบแล้ว',
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          navigate('/admin/login');
        });
      }
    });
  };

  const toggleSidebar = () => setCollapsed(!collapsed);
  const isActive = (path) => location.pathname === path;

  const DropdownToggle = ({ label, icon, name }) => (
    <button
      className={`btn btn-toggle align-items-center w-100 text-start ${openDropdown[name] ? 'active' : ''}`}
      onClick={() => setOpenDropdown((prev) => ({ ...prev, [name]: !prev[name] }))}
    >
      {icon} {!collapsed && label}
      {!collapsed && (
        <span style={{ float: 'right', transition: 'transform 0.3s', transform: openDropdown[name] ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          <FaChevronDown size={12} />
        </span>
      )}
    </button>
  );

  return (
    <div
      className="vh-100 p-3 d-flex flex-column"
      style={{
        width: collapsed ? '70px' : '250px',
        transition: 'width 0.3s',
        position: 'fixed',
        background: 'linear-gradient(180deg, #22c55e 0%, #16a34a 100%)',
        color: '#fff',
        fontFamily: "'Kanit', sans-serif",
        overflowY: 'auto',
        height: '100vh',
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        {!collapsed && <h5 style={{ fontWeight: 700 }}>Admin Panel</h5>}
        <button onClick={toggleSidebar} className="btn btn-sm btn-outline-light border-0">
          <FaBars />
        </button>
      </div>

      <ul className="nav flex-column">
        {/* Dashboard */}
        <li className="nav-item">
          <Link
            to="/admin/dashboard"
            className={`nav-link text-white ${isActive('/admin/dashboard') ? 'active' : ''}`}
          >
            📈 {!collapsed && 'สถิติ'}
          </Link>
        </li>

        {/* ผู้ใช้งาน */}
        <li className="nav-item">
          <DropdownToggle label="ผู้ใช้งาน" icon="👥" name="users" />
          {openDropdown.users && (
            <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
              <li>
                <Link to="/admin/admins" className={`nav-link text-white ps-4 ${isActive('/admin/admins') ? 'active' : ''}`}>
                  🧑‍💼 แอดมิน
                </Link>
              </li>
              <li>
                <Link to="/admin/customers" className={`nav-link text-white ps-4 ${isActive('/admin/customers') ? 'active' : ''}`}>
                  👥 สมาชิก
                </Link>
              </li>
              <li>
                <Link to="/admin/chat" className={`nav-link text-white ps-4 ${isActive('/admin/chat') ? 'active' : ''}`}>
                  💬 ข้อความลูกค้า
                </Link>
              </li>
              <li>
                <Link to="/admin/inbox" className={`nav-link text-white ps-4 ${isActive('/admin/inbox') ? 'active' : ''}`}>
                  📥 กล่องข้อความ
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* สินค้า */}
        <li className="nav-item">
          <DropdownToggle label="สินค้า & หมวดหมู่" icon="📦" name="products" />
          {openDropdown.products && (
            <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
              <li>
                <Link to="/admin/products" className={`nav-link text-white ps-4 ${isActive('/admin/products') ? 'active' : ''}`}>
                  📦 สินค้า/บริการ
                </Link>
              </li>
              <li>
                <Link to="/admin/categories" className={`nav-link text-white ps-4 ${isActive('/admin/categories') ? 'active' : ''}`}>
                  🗂️ หมวดหมู่สินค้า
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* คำสั่งซื้อ */}
        <li className="nav-item">
          <DropdownToggle label="คำสั่งซื้อ" icon="🛒" name="orders" />
          {openDropdown.orders && (
            <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
              <li>
                <Link to="/admin/orders" className={`nav-link text-white ps-4 ${isActive('/admin/orders') ? 'active' : ''}`}>
                  🛒 จัดการคำสั่งซื้อ
                </Link>
              </li>
              <li>
                <Link to="/admin/payment-check" className={`nav-link text-white ps-4 ${isActive('/admin/payment-check') ? 'active' : ''}`}>
                  💳 ตรวจสอบการชำระเงิน
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* อื่นๆ */}
        <li className="nav-item">
          <Link to="/admin/contact" className={`nav-link text-white ${isActive('/admin/contact') ? 'active' : ''}`}>
            📞 {!collapsed && 'ข้อมูลร้านค้า'}
          </Link>
        </li>

        {/* Logout */}
        <li className="nav-item mt-3">
          <button onClick={handleLogout} className="btn btn-link nav-link text-white text-start">
            🔓 {!collapsed && 'ออกจากระบบ'}
          </button>
        </li>
      </ul>

      <style>{`
        .btn-toggle {
    background: transparent;
    border: none;
    color: white;
    font-weight: 500;
  }
  .btn-toggle:hover,
  .btn-toggle.active {
    background: rgba(255,255,255,0.18);
    border-radius: 8px;
    font-weight: 600;
  }
  /* ลิงก์หลัก */
  
  .nav-link.active {
    background: rgba(255,255,255,0.25);
    border-radius: 8px;
    font-weight: 600;
    color: white !important;
  }
  /* ลิงก์ในหัวข้อย่อย */
  .btn-toggle-nav .nav-link {
    color: white;
  }
  
  .btn-toggle-nav .nav-link.active {
    background: rgba(255,255,255,0.6);
    color: black !important;
    font-weight: 600;
  }
      `}</style>
    </div>
  );
}
