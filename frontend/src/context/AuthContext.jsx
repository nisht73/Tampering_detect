import React, { createContext, useState, useEffect, useContext } from 'react';
import { login as apiLogin, register as apiRegister, getMe } from '../services/api';
import { toast } from 'sonner';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await getMe();
          setUser(res.data.data);
        } catch (error) {
          console.error("Auth validation failed", error);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await apiLogin(email, password);
      const { token, ...userData } = res.data.data;
      localStorage.setItem('token', token);
      setToken(token);
      setUser(userData);
      toast.success('Welcome back!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await apiRegister(name, email, password);
      const { token, ...userData } = res.data.data;
      localStorage.setItem('token', token);
      setToken(token);
      setUser(userData);
      toast.success('Account created successfully');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    toast.info('Logged out');
    window.location.href = '/login';
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    register,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export { AuthContext };
