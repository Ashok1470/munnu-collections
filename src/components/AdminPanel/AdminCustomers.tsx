import React, { useState, useEffect } from 'react';
import { Search, Users, Phone, Calendar, ShoppingBag, DollarSign, MessageCircle } from 'lucide-react';
import { CustomerStats } from '../../types';
import { api } from '../../services/api';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const AdminCustomers: React.FC = () => {
  const { token } = useAdminAuth();
  const [customers, setCustomers] = useState<CustomerStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCustomers = async (search?: string) => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await api.adminGetCustomers(token, search);
      setCustomers(res.customers);
    } catch (err) {
      console.error('Failed to load customers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers(searchQuery);
  }, [token]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCustomers(searchQuery);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-zinc-100">
            Registered Customer Base
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            View registered shopper profiles, order history count, and lifetime value
          </p>
        </div>

        <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center gap-3">
          <Users className="w-5 h-5 text-[#d4af37]" />
          <div>
            <span className="text-[10px] uppercase text-zinc-400 font-bold">Total Accounts</span>
            <p className="font-cinzel text-lg font-bold text-white">{customers.length}</p>
          </div>
        </div>
      </div>

      {/* Search Toolbar */}
      <form onSubmit={handleSearch} className="bg-[#121216] border border-zinc-800 p-4 rounded-2xl flex gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search customers by Full Name or Mobile Number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#d4af37] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="py-2.5 px-6 rounded-xl text-xs font-bold bg-[#d4af37] text-black hover:brightness-110 uppercase tracking-wider"
        >
          Search
        </button>
      </form>

      {/* Customers Table / Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : customers.length === 0 ? (
        <div className="text-center py-16 bg-[#121216] border border-zinc-800 rounded-3xl p-6">
          <p className="text-zinc-400 text-sm">No registered customers match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customers.map((c) => (
            <div
              key={c.id}
              className="bg-[#121216] border border-zinc-800 hover:border-[#d4af37]/50 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-serif-luxury text-lg font-bold text-zinc-100">{c.fullName}</h4>
                    <p className="text-xs text-[#d4af37] font-semibold flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3" />
                      <span>{c.mobile}</span>
                    </p>
                  </div>
                  <a
                    href={`https://wa.me/91${c.mobile.replace(/\D/g, '')}?text=${encodeURIComponent(
                      `Hello ${c.fullName}, thank you for choosing Munnu Collections.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-400 rounded-xl text-xs"
                    title="WhatsApp Chat"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-800 space-y-2 text-xs text-zinc-300">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Registered On:</span>
                    <span>{new Date(c.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Total Orders Placed:</span>
                    <span className="font-bold text-white">{c.ordersCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Total Purchases Value:</span>
                    <span className="font-cinzel font-bold text-[#fceda6]">
                      ₹{c.totalSpent.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {c.recentOrders.length > 0 && (
                <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800/80 text-[11px] space-y-1">
                  <span className="text-[10px] uppercase font-bold text-zinc-500">Recent Order:</span>
                  <div className="flex justify-between items-center text-zinc-300">
                    <span className="font-cinzel text-amber-200">#{c.recentOrders[0].id}</span>
                    <span className="text-emerald-400 font-semibold">{c.recentOrders[0].status}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
