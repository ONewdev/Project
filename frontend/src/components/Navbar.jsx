import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { ShoppingCart, UserCircle, Bell } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
// Assuming you have a CSS file for additional styles

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const host = import.meta.env.VITE_HOST;
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);


  // Load Google Fonts for Thai language support
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&family=Prompt:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  // อ่าน user จาก localStorage ทุกครั้งที่ mount หรือ userChanged
  useEffect(() => {
    const getUser = () => {
      const u = localStorage.getItem('user');
      setUser(u ? JSON.parse(u) : null);
    };
    getUser();
    window.addEventListener('userChanged', getUser);
    window.addEventListener('popstate', getUser);
    window.addEventListener('hashchange', getUser);
    return () => {
      window.removeEventListener('userChanged', getUser);
      window.removeEventListener('popstate', getUser);
      window.removeEventListener('hashchange', getUser);
    };
  }, [host]);

useEffect(() => {
  const updateCart = () => {
    let cartKey;
    if (user) {
      cartKey = `cart_${user.id}`;
    } else {
      cartKey = 'cart_guest';
    }
    const cartItems = JSON.parse(localStorage.getItem(cartKey)) || [];
    const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
    setCartCount(totalItems);
  };

  updateCart();
  window.addEventListener('cartUpdated', updateCart);
  window.addEventListener('storage', updateCart);

  return () => {
    window.removeEventListener('cartUpdated', updateCart);
    window.removeEventListener('storage', updateCart);
  };
}, [user]);

  return (
    <header
      className="bg-white/80 backdrop-blur-md shadow-xl sticky top-0 z-50  border border-gray-200"
      style={{ fontFamily: "'Prompt', 'Kanit', sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div className="flex items-center">
            <Link to="/home">
              <img
                src="../../public/images/655fc323-6c03-4394-ba95-5280da436298.jpg"
                alt="Logo"
                className="h-12 w-auto"
                style={{ maxHeight: '48px', objectFit: 'contain' }}
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {[
              { to: "/home", label: "หน้าแรก" },
              { to: "/products", label: "สินค้า" },
              { to: "/contact", label: "ติดต่อเรา" },
              ...(user ? [
                { to: "/users/favorite", label: "รายการโปรด" },
                { to: "/users/orders", label: "คำสั่งซื้อของฉัน" }
              ] : []),
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="font-semibold transition-colors duration-200"
                style={{ color: '#16a34a', fontFamily: "'Prompt', sans-serif", textDecoration: 'none' }}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center space-x-4">
            {/* Shopping Cart Icon: แสดงเฉพาะเมื่อ login */}
            {user && (
              <button
                className="p-2 rounded-full hover:bg-gray-100 transition relative"
                title="ตะกร้าสินค้า"
                onClick={() => navigate('/users/orders')}
                aria-label="ตะกร้าสินค้า"
              >
                <ShoppingCart className="w-7 h-7 text-green-700" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            )}
            {/* Bell Notification Icon: แสดงเฉพาะเมื่อ login */}
            {user && (
              <button
                className="p-2 rounded-full hover:bg-gray-100 transition relative"
                title="แจ้งเตือน"
                aria-label="แจ้งเตือน"
                style={{ position: 'relative' }}
                onClick={() => navigate('/users/notifications')}
              >
                <Bell className="w-7 h-7 text-green-700" />
                {/* สามารถเพิ่ม badge แจ้งเตือนได้ที่นี่ */}
              </button>
            )}
            {user ? (
              <div className="relative flex flex-col items-center">
                {/* ไอคอนโปรไฟล์ */}
                <button
                  className="p-2 rounded-full hover:bg-gray-100 transition"
                  title="เมนูสมาชิก"
                  onClick={() => setIsMenuOpen(isMenuOpen === 'user' ? false : 'user')}
                  aria-haspopup="true"
                  aria-expanded={isMenuOpen === 'user'}
                >
                  {user.profile_picture ? (
                    <img
                      src={`${host}${user.profile_picture}`}
                      alt="Profile"
                      className="w-7 h-7 rounded-full object-cover border-2 border-green-700"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                  ) : null}
                  <UserCircle className={`w-7 h-7 text-green-700 ${user.profile_picture ? 'hidden' : ''}`} />
                </button>
                {user?.name && (
                  <span className="text-xs mt-1 text-green-800 font-medium truncate max-w-[80px] text-center">
                    {user.name}
                  </span>
                )}
                {/* Dropdown เมนู */}
                {isMenuOpen === 'user' && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-10 animate-fade-in border border-gray-100">
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        navigate('/users/profile');
                      }}
                      className="block w-full text-left px-4 py-2 text-green-600 hover:bg-gray-100"
                    >
                      โปรไฟล์ของฉัน
                    </button>
                    <button
                      onClick={() => {
                        localStorage.removeItem('user');
                        localStorage.removeItem('token');
                        setUser(null);
                        setIsMenuOpen(false);
                        Swal.fire({
                          icon: 'success',
                          title: 'ออกจากระบบแล้ว',
                          showConfirmButton: false,
                          timer: 1200,
                          confirmButtonColor: '#16a34a'
                        }).then(() => {
                          window.dispatchEvent(new Event('userChanged'));
                          navigate('/home', { replace: true });
                        });
                      }}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      ออกจากระบบ
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex">
                <button
                  onClick={() => navigate('/login')}
                  className="px-5 py-2 text-white bg-green-600 hover:bg-green-700 rounded-full transition duration-200 font-semibold"
                  style={{ fontFamily: "'Prompt', sans-serif" }}
                >
                  เข้าสู่ระบบ
                </button>
              </div>
            )}

            {/* Mobile Navigation */}
            {isMenuOpen && (
              <div className="md:hidden border-t border-gray-200 py-4 bg-white rounded-b-2xl shadow-md">
                <div className="flex flex-col space-y-3">
                  {/* Shopping Cart Icon (Mobile): แสดงเฉพาะเมื่อ login */}
                  {user && (
                    <button
                      className="p-2 rounded-full hover:bg-gray-100 transition self-start"
                      title="ตะกร้าสินค้า"
                      onClick={() => {
                        setIsMenuOpen(false);
                        navigate('/users/orders');
                      }}
                      aria-label="ตะกร้าสินค้า"
                    >
                      <ShoppingCart className="w-7 h-7 text-green-700" />
                      {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                          {cartCount}
                        </span>
                      )}
                    </button>
                  )}
                  {/* Bell Notification Icon (Mobile): แสดงเฉพาะเมื่อ login */}
                  {user && (
                    <button
                      className="p-2 rounded-full hover:bg-gray-100 transition self-start"
                      title="แจ้งเตือน"
                      aria-label="แจ้งเตือน"
                      style={{ position: 'relative' }}
                    >
                      <Bell className="w-7 h-7 text-green-700" />
                    </button>
                  )}
                  {/* เมนูเฉพาะตอนล็อกอิน */}
                  {user && (
                    <>
                      <Link
                        to="/users/favorite"
                        onClick={() => setIsMenuOpen(false)}
                        className="font-semibold transition-colors duration-200 w-full text-left px-5 py-2"
                        style={{ color: '#ec4899', fontFamily: "'Prompt', sans-serif", textDecoration: 'none', borderRadius: '0.375rem' }}
                      >
                        รายการโปรด
                      </Link>
                      <Link
                        to="/users/orders"
                        onClick={() => setIsMenuOpen(false)}
                        className="font-semibold transition-colors duration-200 w-full text-left px-5 py-2"
                        style={{ color: '#2563eb', fontFamily: "'Prompt', sans-serif", textDecoration: 'none', borderRadius: '0.375rem' }}
                      >
                        คำสั่งซื้อของฉัน
                      </Link>
                      <Link
                        to="/users/payments"
                        onClick={() => setIsMenuOpen(false)}
                        className="font-semibold transition-colors duration-200 w-full text-left px-5 py-2"
                        style={{ color: '#6366f1', fontFamily: "'Prompt', sans-serif", textDecoration: 'none', borderRadius: '0.375rem' }}
                      >
                        การชำระเงิน
                      </Link>
                    </>
                  )}
                  {/* เมนูหลัก */}
                  {[
                    { to: "/home", label: "หน้าแรก" },
                    { to: "/products", label: "สินค้า" },
                    { to: "/contact", label: "ติดต่อเรา" },

                  ].map(({ to, label }) => (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setIsMenuOpen(false)}
                      className="font-semibold transition-colors duration-200"
                      style={{ color: '#16a34a', fontFamily: "'Prompt', sans-serif", textDecoration: 'none' }}
                    >
                      {label}
                    </Link>
                  ))}
                  <div className="pt-4 border-t border-gray-200">
                    {user ? (
                      <>
                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            navigate('/users/profile');
                          }}
                          className="w-full text-left px-5 py-2 text-green-700 hover:bg-gray-100 rounded-md font-semibold"
                        >
                          โปรไฟล์ของฉัน
                        </button>
                        <button
                          onClick={() => {
                            localStorage.removeItem('user');
                            localStorage.removeItem('token');
                            setUser(null);
                            setIsMenuOpen(false);
                            Swal.fire({
                              icon: 'success',
                              title: 'ออกจากระบบแล้ว',
                              showConfirmButton: false,
                              timer: 1200,
                              confirmButtonColor: '#16a34a'
                            }).then(() => {
                              window.dispatchEvent(new Event('userChanged'));
                              navigate('/home', { replace: true });
                            });
                          }}
                          className="w-full text-left px-5 py-2 text-red-600 hover:bg-gray-100 rounded-md font-semibold"
                        >
                          ออกจากระบบ
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          navigate('/login');
                        }}
                        className="w-full px-5 py-2 text-white bg-green-600 hover:bg-green-700 rounded-full transition duration-200 font-semibold"
                        style={{ fontFamily: "'Prompt', sans-serif" }}
                      >
                        เข้าสู่ระบบ
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
