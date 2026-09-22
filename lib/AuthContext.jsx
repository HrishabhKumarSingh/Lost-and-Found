'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import api from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const response = await api.login(email, password);
    const { jwt_token, user: userData } = response.data;
    localStorage.setItem('token', jwt_token);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(jwt_token);
    setUser(userData);
    router.push('/feed');
    return response;
  }, [router]);

  const logout = useCallback(async () => {
    try {
      await api.signout();
    } catch (e) {
      // ignore signout API errors
    }
    localStorage.clear();
    setToken(null);
    setUser(null);
    router.push('/login');
  }, [router]);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
