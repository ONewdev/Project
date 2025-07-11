import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function PrivateRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    // เช็ค auth จาก cookie โดยเรียก backend endpoint ที่ตรวจสอบ JWT admin
    fetch(`${import.meta.env.VITE_HOST}/api/admin/me`, {
      credentials: 'include',
    })
      .then(res => res.ok)
      .then(auth => setIsAuthenticated(auth))
      .catch(() => setIsAuthenticated(false));
  }, []);

  if (isAuthenticated === null) return null; // หรือ loading spinner
  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />;
}
