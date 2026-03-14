import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    try {
      const stored = localStorage.getItem('sarkarsetuAdmin');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('sarkarsetuUser');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  const login = (adminData, token) => {
    localStorage.setItem('sarkarsetuAdminToken', token);
    localStorage.setItem('sarkarsetuAdmin', JSON.stringify(adminData));
    setAdmin(adminData);
  };

  const logout = () => {
    localStorage.removeItem('sarkarsetuAdminToken');
    localStorage.removeItem('sarkarsetuAdmin');
    setAdmin(null);
  };

  const userLogin = (userData, token) => {
    localStorage.setItem('sarkarsetuUserToken', token);
    localStorage.setItem('sarkarsetuUser', JSON.stringify(userData));
    setUser(userData);
  };

  const userLogout = () => {
    localStorage.removeItem('sarkarsetuUserToken');
    localStorage.removeItem('sarkarsetuUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      admin, login, logout, isAuthenticated: !!admin,
      user, userLogin, userLogout, isUserAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
