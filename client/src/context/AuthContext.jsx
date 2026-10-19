import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [workerProfile, setWorkerProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.success && res.user) {
        setUser(res.user);
        setWorkerProfile(res.workerProfile || null);
      } else {
        setUser(null);
        setWorkerProfile(null);
      }
    } catch (err) {
      setUser(null);
      setWorkerProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.success) {
      setUser(res.user);
      setWorkerProfile(res.workerProfile || null);
    }
    return res;
  };

  const register = async (data) => {
    const res = await api.post('/auth/register', data);
    if (res.success) {
      setUser(res.user);
      setWorkerProfile(res.workerProfile || null);
    }
    return res;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout', {});
    } finally {
      setUser(null);
      setWorkerProfile(null);
    }
  };

  const quickDemoLogin = async (type) => {
    const accounts = {
      customer: { email: 'ananya.customer@skilldost.demo', password: 'demo123' },
      customer2: { email: 'vikram.customer@skilldost.demo', password: 'demo123' },
      worker: { email: 'ramesh.electrician@skilldost.demo', password: 'demo123' },
      worker2: { email: 'lakshmi.cleaning@skilldost.demo', password: 'demo123' },
      admin: { email: 'admin@skilldost.demo', password: 'admin123' },
    };

    const target = accounts[type] || accounts.customer;
    return login(target.email, target.password);
  };

  const refreshUser = async () => {
    await fetchCurrentUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        workerProfile,
        isLoading,
        isAuthenticated: !!user,
        isWorker: user?.role === 'worker',
        isAdmin: user?.role === 'admin',
        isCustomer: user?.role === 'customer',
        login,
        register,
        logout,
        quickDemoLogin,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
