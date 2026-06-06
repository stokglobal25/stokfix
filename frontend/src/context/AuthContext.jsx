import { createContext, useContext, useState } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('stokfix_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const data = res.data;
      localStorage.setItem('stokfix_token', data.token);
      localStorage.setItem('stokfix_user', JSON.stringify(data));
      setUser(data);
      return { success: true, data };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Login gagal';
      return { success: false, error: msg };
    }
  };

  const register = async (email, password, name, role = 'kasir') => {
    try {
      const res = await api.post('/auth/register', { email, password, name, role });
      const data = res.data;
      localStorage.setItem('stokfix_token', data.token);
      localStorage.setItem('stokfix_user', JSON.stringify(data));
      setUser(data);
      return { success: true, data };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Registrasi gagal';
      return { success: false, error: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('stokfix_token');
    localStorage.removeItem('stokfix_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
