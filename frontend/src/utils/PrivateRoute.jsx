import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function PrivateRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // ตรวจสอบ token ทุกครั้งที่ path เปลี่ยน
    const checkAuth = async () => {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        setIsAuthenticated(false);
        return;
      }
      try {
        const res = await fetch(`${import.meta.env.VITE_HOST}/api/admin/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setIsAuthenticated(res.ok);
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
    // ฟัง event userChanged เพื่อ force re-check auth หลัง login/logout
    window.addEventListener('userChanged', checkAuth);
    return () => window.removeEventListener('userChanged', checkAuth);
  }, [location.pathname]);

  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // ถ้าไม่ auth ให้ redirect ไป login และจำ path เดิมไว้ (state)
  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/admin/login" replace state={{ from: location }} />
  );
}
