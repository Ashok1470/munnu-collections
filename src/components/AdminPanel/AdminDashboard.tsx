import React, { useEffect, useState } from 'react';
import { DollarSign, ShoppingBag, Users, Package, Clock, Truck, CheckCircle2, TrendingUp, ArrowRight } from 'lucide-react';
import { AdminDashboardStats, Order } from '../../types';
import { api } from '../../services/api';
import { useAdminAuth } from '../../context/AdminAuthContext';

interface AdminDashboardProps {
  onNavigate: (tab: 'products' | 'orders' | 'customers' | 'add-product') => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { token } = useAdminAuth();
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    const loadStats = async () => {
      try {
        const res = await api.adminGetStats(token);
        setStats(res.stats);
      } catch (err) {
        console.error('Error fetching admin dashboard stats', err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, [token]);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: `₹${stats.totalSales.toLocaleString('en-IN')}`,
      icon: DollarSign,
      color: 'from-amber-500/20 to-yellow-600/10',
      textColor: 'text-[#fceda6]',
      borderColor: 'border-[#d4af37]/40',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: 'from-pink-500/20 to-rose-600/10',
      textColor: 'text-pink-300',
      borderColor: 'border-pink-500/30',
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: Clock,
      color: 'from-amber-600/20 to-amber-700/10',
      textColor: 'text-amber-300',
      borderColor: 'border-amber-500/40',
      highlight: stats.pendingOrders > 0,
    },
    {
      title: 'Registered Customers',
      value: stats.totalCustomers,
      icon: Users,
      color: 'from-blue-500/20 to-cyan-600/10',
      textColor: 'text-blue-300',
      borderColor: 'border-blue-500/30',
    },
    {
      title: 'Total Sarees in Catalog',
      value: stats.totalProducts,
      icon: Package,
      color: 'from-purple-500/20 to-indigo-600/10',
      textColor: 'text-purple-300',
      borderColor: 'border-purple-500/30',
    },
    {
      title: 'Delivered Orders',
      value: stats.deliveredOrders,
      icon: CheckCircle2,
      color: 'from-emerald-500/20 to-green-600/10',
      textColor: 'text-emerald-300',
      borderColor: 'border-emerald-500/30',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Heading & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-zinc-100">
            Store Performance Overview
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Real-time sales, order fulfillment, and boutique catalog metrics
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('add-product')}
            className="py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-[#d4af37] to-[#aa820a] hover:brightness-110 text-black shadow-md shadow-[#d4af37]/20 uppercase tracking-wider transition-all"
          >
            + Add New Saree
          </button>
          <button
            onClick={() => onNavigate('orders')}
            className="py-2.5 px-4 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-all"
          >
            Manage Orders
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className={`p-5 rounded-2xl bg-gradient-to-br ${card.color} bg-[#121216] border ${card.borderColor} flex items-center justify-between shadow-lg relative overflow-hidden`}
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">{card.title}</p>
                <p className={`font-cinzel text-2xl sm:text-3xl font-bold mt-1 ${card.textColor}`}>
                  {card.value}
                </p>
              </div>
              <div className={`p-3 rounded-2xl bg-black/40 border ${card.borderColor} ${card.textColor}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders Section */}
      <div className="bg-[#121216] border border-zinc-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div>
            <h3 className="font-serif-luxury text-xl font-bold text-zinc-100">Recent Customer Orders</h3>
            <p className="text-xs text-zinc-400">Latest transactions received across India</p>
          </div>
          <button
            onClick={() => onNavigate('orders')}
            className="text-xs text-[#d4af37] font-semibold hover:underline flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {stats.recentOrders.length === 0 ? (
          <p className="text-sm text-zinc-400 text-center py-8">No orders received yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-zinc-400 border-b border-zinc-800 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="pb-3 font-semibold">Order ID</th>
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Saree Items</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {stats.recentOrders.map((order: Order) => (
                  <tr key={order.id} className="hover:bg-zinc-850/50 transition-colors">
                    <td className="py-3 font-cinzel font-bold text-[#fceda6]">#{order.id}</td>
                    <td className="py-3">
                      <div className="font-medium text-zinc-100">{order.customerName}</div>
                      <div className="text-[10px] text-zinc-400">{order.customerMobile}</div>
                    </td>
                    <td className="py-3 max-w-xs truncate text-zinc-200">
                      {order.items.map((i) => `${i.productName} (x${i.quantity})`).join(', ')}
                    </td>
                    <td className="py-3 font-cinzel font-bold text-white">
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 text-zinc-400">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          order.status === 'Delivered'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                            : order.status === 'Shipped'
                            ? 'bg-indigo-950 text-indigo-300 border border-indigo-500/30'
                            : order.status === 'Pending'
                            ? 'bg-amber-950 text-amber-300 border border-amber-500/30'
                            : 'bg-zinc-800 text-zinc-300'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
