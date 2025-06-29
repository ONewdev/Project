import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { ShoppingCart, Menu, X, ArrowRight, UserCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
 // Assuming you have a CSS file for additional styles

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const host = import.meta.env.VITE_HOST;
  const navigate = useNavigate();

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
  
  // Fetch user info from cookie-auth endpoint
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${host}/api/customers/me`, {
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  // Re-fetch user after login/logout navigation or route change
  useEffect(() => {
    const handleUserChange = () => {
      fetch(`${host}/api/customers/me`, { credentials: 'include' })
        .then(res => res.ok ? res.json() : Promise.reject())
        .then(data => setUser(data.user))
        .catch(() => setUser(null));
    };
    window.addEventListener('userChanged', handleUserChange);
    // Listen to route changes (popstate for browser navigation)
    window.addEventListener('popstate', handleUserChange);
    // Also check on hashchange (for SPA navigation)
    window.addEventListener('hashchange', handleUserChange);
    return () => {
      window.removeEventListener('userChanged', handleUserChange);
      window.removeEventListener('popstate', handleUserChange);
      window.removeEventListener('hashchange', handleUserChange);
    };
  }, [host]);

  return (
    <header
      className="bg-white/80 backdrop-blur-md shadow-xl sticky top-0 z-50  border border-gray-200"
      style={{ fontFamily: "'Prompt', 'Kanit', sans-serif" }}
    >  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            {user ? (
              <div className="relative">
                {/* ไอคอนโปรไฟล์ */}
                <button
                  className="p-2 rounded-full hover:bg-gray-100 transition"
                  title="เมนูสมาชิก"
                  onClick={() => setIsMenuOpen(isMenuOpen === 'user' ? false : 'user')}
                  aria-haspopup="true"
                  aria-expanded={isMenuOpen === 'user'}
                >
                  <UserCircle className="w-7 h-7 text-green-700" />
                </button>
                {/* Dropdown เมนู */}
                {isMenuOpen === 'user' && (
                  <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md z-10 animate-fade-in border border-gray-100">
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        navigate('/users/profile'); // เปลี่ยนเส้นทางไปยังโปรไฟล์ของผู้ใช้
                      }}
                      className="block w-full text-left px-4 py-2 text-green-600 hover:bg-gray-100"
                    >
                      โปรไฟล์ของฉัน
                    </button>
                    <button
                      onClick={async () => {
                        await fetch(`${host}/api/customers/logout`, { method: 'POST', credentials: 'include' });
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
            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 text-gray-700 hover:text-green-600 transition duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
       {isMenuOpen && (
  <div className="md:hidden border-t border-gray-200 py-4 bg-white rounded-b-2xl shadow-md">
    <div className="flex flex-col space-y-3">
      {[
        { to: "/home", label: "หน้าแรก" },
        { to: "/products", label: "สินค้า" },
        { to: "/contact", label: "ติดต่อเรา" },
      ].map(({ to, label }) => (
        <Link
          key={to}
          to={to}
          onClick={() => setIsMenuOpen(false)} // ปิดเมนูเมื่อคลิก
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
            onClick={async () => {
              await fetch(`${host}/api/customers/logout`, { method: 'POST', credentials: 'include' });
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
    </header>

  );
}