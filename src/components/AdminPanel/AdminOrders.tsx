import React, { useState, useEffect } from 'react';
import { Search, MapPin, Phone, Calendar, Package, RefreshCw, CheckCircle2, ChevronDown, MessageCircle } from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { api } from '../../services/api';
import { useAdminAuth } from '../../context/AdminAuthContext';

const STATUS_OPTIONS: OrderStatus[] = [
  'Pending',
  'Confirmed',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
];

export const AdminOrders: React.FC = () => {
  const { token } = useAdminAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await api.adminGetOrders(token, {
        status: statusFilter === 'All' ? undefined : statusFilter,
        search: searchQuery || undefined,
      });
      setOrders(res.orders);
    } catch (err) {
      console.error('Error fetching admin orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    if (!token) return;
    try {
      setUpdatingId(orderId);
      await api.adminUpdateOrderStatus(orderId, newStatus, token);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      console.error('Failed to update status', err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-zinc-100">
            Customer Orders Management
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Track fulfillment lifecycle, delivery addresses, and customer communications
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="p-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-[#121216] border border-zinc-800 p-4 rounded-2xl flex flex-col sm:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by Order ID, name, mobile..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#d4af37] rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
          />
        </form>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            onClick={() => setStatusFilter('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
              statusFilter === 'All' ? 'bg-[#d4af37] text-black font-bold' : 'bg-zinc-800 text-zinc-300'
            }`}
          >
            All Orders ({orders.length})
          </button>
          {STATUS_OPTIONS.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
                statusFilter === st ? 'bg-[#d4af37] text-black font-bold' : 'bg-zinc-800 text-zinc-300'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-[#121216] border border-zinc-800 rounded-3xl p-6">
          <Package className="w-12 h-12 text-zinc-600 mx-auto mb-2" />
          <p className="text-zinc-400 text-sm">No customer orders found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isUpdating = updatingId === order.id;

            return (
              <div
                key={order.id}
                className="bg-[#121216] border border-zinc-800 rounded-2xl p-5 shadow-lg space-y-4"
              >
                {/* Header Row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-cinzel text-lg font-bold text-[#d4af37]">
                      #{order.id}
                    </span>
                    <span className="text-xs text-zinc-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(order.createdAt).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-400">Order Status:</span>
                    <select
                      value={order.status}
                      disabled={isUpdating}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none transition-colors ${
                        order.status === 'Delivered'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                          : order.status === 'Shipped'
                          ? 'bg-indigo-950 text-indigo-300 border-indigo-500/50'
                          : order.status === 'Pending'
                          ? 'bg-amber-950 text-amber-300 border-amber-500/50'
                          : 'bg-zinc-900 text-zinc-200 border-zinc-700'
                      }`}
                    >
                      {STATUS_OPTIONS.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                  {/* Saree Products list */}
                  <div className="md:col-span-7 space-y-2.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Ordered Sarees ({order.items.length})
                    </h4>
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-2 bg-zinc-950 rounded-xl border border-zinc-800/80">
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-14 h-16 object-cover object-top rounded-lg bg-black flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-serif-luxury text-sm font-semibold text-zinc-100 truncate">
                              {item.productName}
                            </p>
                            <p className="text-xs text-[#e83e8c] font-medium">{item.category}</p>
                            <p className="text-xs text-zinc-400">
                              Qty: <strong className="text-zinc-200">{item.quantity}</strong> × ₹{item.price.toLocaleString('en-IN')}
                            </p>
                          </div>
                          <span className="font-cinzel text-sm font-bold text-[#fceda6] mr-2">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-2 text-sm font-bold">
                      <span className="text-zinc-400">Total Order Value:</span>
                      <span className="font-cinzel text-lg text-[#fceda6]">
                        ₹{order.totalAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Customer and Delivery Address Details */}
                  <div className="md:col-span-5 bg-zinc-950/80 border border-zinc-800/90 rounded-xl p-4 flex flex-col justify-between">
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                        <span className="text-amber-200 font-bold uppercase tracking-wider">Customer & Delivery</span>
                        <a
                          href={`https://wa.me/91${order.customerMobile.replace(/\D/g, '')}?text=${encodeURIComponent(
                            `Hello ${order.customerName}, this is Munnu Collections regarding your Saree Order #${order.id}.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-emerald-400 hover:underline"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp Customer</span>
                        </a>
                      </div>

                      <div className="space-y-1 text-zinc-300">
                        <p className="font-bold text-zinc-100 text-sm">{order.customerName}</p>
                        <p className="text-zinc-400 flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-[#d4af37]" />
                          <span>{order.customerMobile}</span>
                          {order.deliveryAddress.altMobile && (
                            <span>(Alt: {order.deliveryAddress.altMobile})</span>
                          )}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-zinc-800/80 space-y-1 text-zinc-300">
                        <div className="flex items-center gap-1 text-zinc-400 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                          <span>Full Shipping Address:</span>
                        </div>
                        <p className="text-zinc-200">
                          {order.deliveryAddress.houseNumber}, {order.deliveryAddress.street}
                        </p>
                        <p className="text-zinc-200">
                          {order.deliveryAddress.colonyArea}
                          {order.deliveryAddress.landmark && ` (Landmark: ${order.deliveryAddress.landmark})`}
                        </p>
                        <p className="text-zinc-200">
                          {order.deliveryAddress.city}, {order.deliveryAddress.district}, {order.deliveryAddress.state} -{' '}
                          <strong className="text-amber-300">{order.deliveryAddress.pincode}</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
