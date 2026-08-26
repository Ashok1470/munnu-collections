import React, { useState } from 'react';
import { LayoutDashboard, Package, PlusCircle, ShoppingBag, Users, Bell, LogOut, Store, Menu, X, ShieldCheck, Palette } from 'lucide-react';
import { BrandLogo } from '../BrandLogo';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { AdminDashboard } from './AdminDashboard';
import { AdminProducts } from './AdminProducts';
import { AdminOrders } from './AdminOrders';
import { AdminCustomers } from './AdminCustomers';
import { AdminNotifications } from './AdminNotifications';
import { AdminBranding } from './AdminBranding';

interface AdminLayoutProps {
  onBackToStore: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onBackToStore }) => {
  const { adminLogout, unreadNotificationsCount } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'add-product' | 'orders' | 'customers' | 'notifications' | 'branding'>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'branding', label: 'Store Logo & Branding', icon: Palette },
    { id: 'products', label: 'Products Catalog', icon: Package },
    { id: 'add-product', label: 'Add Saree', icon: PlusCircle },
    { id: 'orders', label: 'Orders Management', icon: ShoppingBag },
    { id: 'customers', label: 'Customer Base', icon: Users },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : null,
    },
  ];


  const handleNavClick = (tab: any) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0d] text-zinc-100 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-zinc-950 border-b border-zinc-800 sticky top-0 z-30">
        <BrandLogo size="sm" variant="badge" />
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('notifications')}
            className="relative p-2 text-zinc-300 hover:text-white"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#d4af37]" />
            )}
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-zinc-300 hover:text-white"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Admin Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0d0d10] border-r border-zinc-800/80 p-5 flex flex-col justify-between transform transition-transform duration-300 md:translate-x-0 md:static ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6">
          {/* Logo & Admin Status */}
          <div className="space-y-3">
            <BrandLogo size="md" showQuote={false} />
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-[#d4af37]/30 text-xs">
              <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
              <span className="text-[#fceda6] font-bold">Admin Portal</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 pt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  id={`admin-nav-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#d4af37] to-[#aa820a] text-black font-bold shadow-md shadow-[#d4af37]/20'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive ? 'bg-black text-amber-300' : 'bg-[#e83e8c] text-white animate-pulse'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-zinc-800/80 space-y-2">
          <button
            onClick={onBackToStore}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-zinc-300 hover:bg-zinc-900 transition-colors"
          >
            <Store className="w-4 h-4 text-[#d4af37]" />
            <span>Switch to Customer Store</span>
          </button>

          <button
            onClick={adminLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Admin Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Canvas */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {activeTab === 'dashboard' && <AdminDashboard onNavigate={(tab) => setActiveTab(tab)} />}
        {activeTab === 'branding' && <AdminBranding />}
        {activeTab === 'products' && <AdminProducts initialAddNew={false} />}
        {activeTab === 'add-product' && <AdminProducts initialAddNew={true} />}
        {activeTab === 'orders' && <AdminOrders />}
        {activeTab === 'customers' && <AdminCustomers />}
        {activeTab === 'notifications' && <AdminNotifications />}
      </main>

    </div>
  );
};
