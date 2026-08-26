import React from 'react';
import { Bell, CheckCheck, Clock, ShoppingBag, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const AdminNotifications: React.FC = () => {
  const {
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useAdminAuth();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-zinc-100">
            Real-Time Order Notifications
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Instant live alerts triggered whenever customers submit new saree orders
          </p>
        </div>

        {unreadNotificationsCount > 0 && (
          <button
            onClick={markAllNotificationsAsRead}
            className="py-2.5 px-4 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-[#fceda6] border border-zinc-700 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* List */}
      {notifications.length === 0 ? (
        <div className="text-center py-16 bg-[#121216] border border-zinc-800 rounded-3xl p-6 space-y-3">
          <Bell className="w-12 h-12 text-zinc-600 mx-auto" />
          <h4 className="font-serif-luxury text-lg font-bold text-zinc-300">No Notifications Yet</h4>
          <p className="text-xs text-zinc-500">Live order notifications will appear here in real time.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => markNotificationAsRead(notif.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                notif.read
                  ? 'bg-[#121216]/60 border-zinc-800/60 opacity-70'
                  : 'bg-gradient-to-r from-zinc-900 to-[#181510] border-[#d4af37]/50 shadow-lg shadow-[#d4af37]/5'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`p-2.5 rounded-xl border mt-0.5 ${
                    notif.read
                      ? 'bg-zinc-800 border-zinc-700 text-zinc-400'
                      : 'bg-[#d4af37]/20 border-[#d4af37]/40 text-[#fceda6] animate-pulse'
                  }`}
                >
                  <ShoppingBag className="w-5 h-5" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-200">
                      New Order Received!
                    </span>
                    <span className="font-cinzel text-xs font-bold text-[#d4af37]">
                      #{notif.orderId}
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-zinc-100">
                    <span className="text-white">{notif.customerName}</span> ordered{' '}
                    <span className="text-zinc-300 font-normal">"{notif.productName}"</span>
                  </p>

                  <div className="flex items-center gap-3 text-xs text-zinc-400 pt-1">
                    <span>
                      Total Amount: <strong className="text-[#fceda6]">₹{notif.totalAmount.toLocaleString('en-IN')}</strong>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(notif.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })},{' '}
                      {new Date(notif.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>

              {!notif.read && (
                <span className="w-2.5 h-2.5 rounded-full bg-[#d4af37] flex-shrink-0 mt-2" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Global Floating Live Notification Banner for Admin
export const AdminLiveOrderAlertBanner: React.FC = () => {
  const { latestOrderAlert, dismissLatestOrderAlert } = useAdminAuth();

  if (!latestOrderAlert) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -40, scale: 0.95 }}
        className="fixed top-5 right-5 z-50 max-w-md w-full bg-gradient-to-r from-zinc-950 via-[#1c170d] to-zinc-950 border-2 border-[#d4af37] rounded-2xl p-4 shadow-2xl shadow-black text-zinc-100"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-[#d4af37] text-black animate-bounce mt-0.5">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-[#d4af37]">
                  New Order Received!
                </span>
                <span className="font-cinzel text-xs font-bold text-white">
                  #{latestOrderAlert.order.id}
                </span>
              </div>
              <p className="text-sm font-bold text-white mt-0.5">
                {latestOrderAlert.order.customerName}
              </p>
              <p className="text-xs text-zinc-300 line-clamp-1">
                {latestOrderAlert.order.items.map((i) => i.productName).join(', ')}
              </p>
              <p className="text-xs font-bold text-[#fceda6] mt-1">
                Amount: ₹{latestOrderAlert.order.totalAmount.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          <button
            onClick={dismissLatestOrderAlert}
            className="text-zinc-400 hover:text-white p-1"
            aria-label="Dismiss alert"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
