import React, { createContext, useContext, useState, useEffect } from 'react';
import { base44 } from '../api/base44Client';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (token) {
        const userData = await base44.auth.me();
        setUser(userData);
      }
    } catch (error) {
      // Token is invalid, clear it
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    const data = await base44.auth.login(username, password);
    const userData = await base44.auth.me();
    setUser(userData);
    return data;
  };

  const register = async (userData) => {
    const data = await base44.auth.register(userData);
    // Auto login after registration
    await login(userData.username, userData.password);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  const updateUser = async (userData) => {
    const updatedUser = await base44.auth.updateMe(userData);
    setUser(updatedUser);
    return updatedUser;
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};