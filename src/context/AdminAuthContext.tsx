import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AdminNotification, Order } from '../types';
import { api } from '../services/api';

interface AdminAuthContextType {
  admin: { name: string; mobile: string; role: string } | null;
  token: string | null;
  isAdminAuthenticated: boolean;
  adminLogin: (mobile: string, password: string) => Promise<void>;
  adminLogout: () => void;
  notifications: AdminNotification[];
  unreadNotificationsCount: number;
  latestOrderAlert: { order: Order; notification: AdminNotification } | null;
  dismissLatestOrderAlert: () => void;
  fetchNotifications: () => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<{ name: string; mobile: string; role: string } | null>(() => {
    try {
      const saved = localStorage.getItem('munnu_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('munnu_admin_token');
  });

  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState<number>(0);
  const [latestOrderAlert, setLatestOrderAlert] = useState<{ order: Order; notification: AdminNotification } | null>(null);

  const fetchNotifications = useCallback(async () => {
    if (!token) return;
    try {
      const res = await api.adminGetNotifications(token);
      if (res && Array.isArray(res.notifications)) {
        setNotifications(res.notifications);
        setUnreadNotificationsCount(res.unreadCount || 0);
      }
    } catch (e: any) {
      if (e?.status === 401 || e?.status === 403 || e?.message?.includes('Unauthorized') || e?.message?.includes('Invalid')) {
        // Invalid or expired token, clear smoothly
        setToken(null);
        setAdmin(null);
        localStorage.removeItem('munnu_admin_token');
        localStorage.removeItem('munnu_admin_user');
      }
    }
  }, [token]);

  useEffect(() => {
    if (admin) {
      localStorage.setItem('munnu_admin_user', JSON.stringify(admin));
    } else {
      localStorage.removeItem('munnu_admin_user');
    }
  }, [admin]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('munnu_admin_token', token);
      fetchNotifications();
    } else {
      localStorage.removeItem('munnu_admin_token');
    }
  }, [token, fetchNotifications]);

  // Real-time SSE Connection for instant order notification without page refresh
  useEffect(() => {
    if (!token) return;

    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/admin/notifications/stream');

      eventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'NEW_ORDER') {
            const { order, notification } = payload.data;
            setNotifications(prev => [notification, ...prev]);
            setUnreadNotificationsCount(prev => prev + 1);
            setLatestOrderAlert({ order, notification });

            // Optional subtle audio notification ding
            try {
              const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
              const osc = audioCtx.createOscillator();
              const gain = audioCtx.createGain();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
              osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1); // A5
              gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
              gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
              osc.connect(gain);
              gain.connect(audioCtx.destination);
              osc.start();
              osc.stop(audioCtx.currentTime + 0.4);
            } catch {
              // Audio may require user interaction first
            }
          } else if (payload.type === 'ORDER_STATUS_UPDATED') {
            fetchNotifications();
          }
        } catch (e) {
          console.error('Error parsing SSE data', e);
        }
      };

      eventSource.onerror = () => {
        // SSE error - fallback to light polling
      };
    } catch (e) {
      console.error('SSE initialization error', e);
    }

    // Light polling fallback every 15s
    const pollInterval = setInterval(() => {
      fetchNotifications();
    }, 15000);

    return () => {
      if (eventSource) eventSource.close();
      clearInterval(pollInterval);
    };
  }, [token, fetchNotifications]);

  const adminLogin = async (mobile: string, password: string) => {
    const res = await api.adminLogin({ mobile, password });
    setAdmin(res.admin);
    setToken(res.token);
  };

  const adminLogout = () => {
    setAdmin(null);
    setToken(null);
    setNotifications([]);
    setUnreadNotificationsCount(0);
    setLatestOrderAlert(null);
    localStorage.removeItem('munnu_admin_user');
    localStorage.removeItem('munnu_admin_token');
  };

  const markNotificationAsRead = async (id: string) => {
    if (!token) return;
    await api.adminMarkNotificationRead(id, token);
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadNotificationsCount(prev => Math.max(0, prev - 1));
  };

  const markAllNotificationsAsRead = async () => {
    if (!token) return;
    await api.adminMarkAllNotificationsRead(token);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadNotificationsCount(0);
  };

  const dismissLatestOrderAlert = () => {
    setLatestOrderAlert(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        token,
        isAdminAuthenticated: !!token,
        adminLogin,
        adminLogout,
        notifications,
        unreadNotificationsCount,
        latestOrderAlert,
        dismissLatestOrderAlert,
        fetchNotifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  return context;
};
