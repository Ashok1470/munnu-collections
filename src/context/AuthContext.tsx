import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (mobile: string, password: string) => Promise<void>;
  register: (fullName: string, mobile: string, password: string, confirmPassword?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('munnu_customer_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('munnu_customer_token');
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('munnu_customer_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('munnu_customer_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('munnu_customer_token', token);
    } else {
      localStorage.removeItem('munnu_customer_token');
    }
  }, [token]);

  const login = async (mobile: string, password: string) => {
    const res = await api.login({ mobile, password });
    setUser(res.user);
    setToken(res.token);
  };

  const register = async (fullName: string, mobile: string, password: string, confirmPassword?: string) => {
    const res = await api.register({ fullName, mobile, password, confirmPassword });
    setUser(res.user);
    setToken(res.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('munnu_customer_user');
    localStorage.removeItem('munnu_customer_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
