import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function PrivateRouteUser() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_HOST}/api/customers/me`, {
      credentials: 'include',
    })
      .then(res => res.ok)
      .then(auth => setIsAuthenticated(auth))
      .catch(() => setIsAuthenticated(false));
  }, []);

  if (isAuthenticated === null) return null; // หรือ loading spinner
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
