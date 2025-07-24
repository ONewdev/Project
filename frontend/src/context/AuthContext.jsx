
import React, { createContext, useContext, useState, useEffect } from 'react';


const AuthContext = createContext();

export function AuthProvider({ children }) {

  // ใช้ localStorage แทน fetch
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  });
  const [admin, setAdmin] = useState(() => {
    const a = localStorage.getItem('admin_user');
    return a ? JSON.parse(a) : null;
  });

  useEffect(() => {
    // sync user/admin เมื่อมีการเปลี่ยนแปลง localStorage (เช่น login/logout)
    const handleUserChanged = () => {
      const u = localStorage.getItem('user');
      setUser(u ? JSON.parse(u) : null);
      const a = localStorage.getItem('admin_user');
      setAdmin(a ? JSON.parse(a) : null);
    };
    window.addEventListener('userChanged', handleUserChanged);
    return () => window.removeEventListener('userChanged', handleUserChanged);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, admin, setAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
