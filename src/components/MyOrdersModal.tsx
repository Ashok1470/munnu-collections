import React, { useState, useEffect } from 'react';
import { X, Package, Clock, Truck, CheckCircle2, AlertTriangle, MapPin, ChevronRight, Phone } from 'lucide-react';
import { motion } from 'motion/react';
import { Order, OrderStatus } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { WhatsAppIcon } from './WhatsAppIcon';

interface MyOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MyOrdersModal: React.FC<MyOrdersModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [lookupPhone, setLookupPhone] = useState(user?.mobile || '');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (user?.mobile) {
        setLookupPhone(user.mobile);
        fetchCustomerOrders(user.mobile, user.id);
      }
    }
  }, [isOpen, user]);

  const fetchCustomerOrders = async (mobile: string, custId?: string) => {
    if (!mobile && !custId) return;
    setLoading(true);
    try {
      const res = await api.getMyOrders({ mobile, customerId: custId });
      setOrders(res.orders);
      if (res.orders.length > 0) {
        setSelectedOrder(res.orders[0]);
      } else {
        setSelectedOrder(null);
      }
    } catch (err) {
      console.error('Failed to load customer orders', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = lookupPhone.trim().replace(/\D/g, '');
    if (clean.length >= 10) {
      fetchCustomerOrders(clean);
    }
  };

  if (!isOpen) return null;

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return <span className="bg-amber-950/80 border border-amber-500/50 text-amber-300 text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</span>;
      case 'Confirmed':
        return <span className="bg-blue-950/80 border border-blue-500/50 text-blue-300 text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Confirmed</span>;
      case 'Processing':
        return <span className="bg-purple-950/80 border border-purple-500/50 text-purple-300 text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1"><Package className="w-3 h-3" /> Processing</span>;
      case 'Shipped':
        return <span className="bg-indigo-950/80 border border-indigo-500/50 text-indigo-300 text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1"><Truck className="w-3 h-3" /> Shipped</span>;
      case 'Delivered':
        return <span className="bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Delivered</span>;
      case 'Cancelled':
        return <span className="bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Cancelled</span>;
      default:
        return <span className="bg-zinc-800 text-zinc-300 text-xs px-2.5 py-1 rounded-full">{status}</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-4xl bg-[#0f0f14] border border-[#d4af37]/35 rounded-3xl overflow-hidden shadow-2xl text-zinc-100 my-auto max-h-[88vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#fceda6]">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-luxury text-lg font-bold text-zinc-100">My Orders & Shipments</h3>
              <p className="text-xs text-zinc-400">Track and view your previous saree purchases</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            aria-label="Close orders modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {/* Guest lookup bar if not logged in */}
          {!user && (
            <form onSubmit={handlePhoneSearch} className="mb-6 p-4 bg-zinc-950 border border-zinc-800 rounded-2xl flex flex-col sm:flex-row gap-3 items-center">
              <div className="flex-1 w-full relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="tel"
                  required
                  placeholder="Enter 10-digit mobile number used during order"
                  value={lookupPhone}
                  onChange={(e) => setLookupPhone(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#d4af37] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto py-2.5 px-5 rounded-xl text-xs font-bold bg-[#d4af37] text-black hover:brightness-110 uppercase tracking-wider whitespace-nowrap"
              >
                Track Orders
              </button>
            </form>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 px-4 space-y-3">
              <Package className="w-12 h-12 text-zinc-600 mx-auto" />
              <h4 className="font-serif-luxury text-xl font-bold text-zinc-200">No Orders Found</h4>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                {user
                  ? "You haven't placed any saree orders yet. Browse our royal collections to place your first order."
                  : 'No orders linked to this mobile number. Please check the number or place an order.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Order List */}
              <div className="lg:col-span-5 space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      selectedOrder?.id === order.id
                        ? 'bg-zinc-900 border-[#d4af37] shadow-lg shadow-[#d4af37]/10'
                        : 'bg-zinc-950/80 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="font-cinzel text-xs font-bold text-[#fceda6]">
                        #{order.id}
                      </span>
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="font-serif-luxury text-sm font-semibold text-zinc-200 line-clamp-1">
                      {order.items.map((i) => i.productName).join(', ')}
                    </p>
                    <div className="flex items-center justify-between text-xs text-zinc-400 mt-2 pt-2 border-t border-zinc-800/80">
                      <span>{new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span className="font-bold text-[#fceda6]">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Selected Order Detailed View */}
              {selectedOrder && (
                <div className="lg:col-span-7 bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-5">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-zinc-500">Selected Order</span>
                      <h4 className="font-cinzel text-lg font-black text-[#d4af37]">#{selectedOrder.id}</h4>
                    </div>
                    {getStatusBadge(selectedOrder.status)}
                  </div>

                  {/* Products */}
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                      Items Ordered ({selectedOrder.items.length})
                    </h5>
                    <div className="space-y-2.5">
                      {selectedOrder.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-2.5 bg-zinc-900/70 border border-zinc-800/80 rounded-xl">
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-12 h-14 object-cover object-top rounded-lg bg-black flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-serif-luxury text-sm font-semibold text-zinc-100 truncate">
                              {item.productName}
                            </p>
                            <p className="text-xs text-zinc-400">
                              Qty: <strong className="text-zinc-200">{item.quantity}</strong> × ₹{item.price.toLocaleString('en-IN')}
                            </p>
                          </div>
                          <span className="font-cinzel text-sm font-bold text-[#fceda6]">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Details */}
                  <div className="p-3.5 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-1 text-xs">
                    <div className="flex items-center gap-1.5 text-amber-200 font-semibold mb-1">
                      <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>Shipping Address:</span>
                    </div>
                    <p className="text-zinc-200 font-bold">{selectedOrder.customerName} ({selectedOrder.customerMobile})</p>
                    <p className="text-zinc-300">
                      {selectedOrder.deliveryAddress.houseNumber}, {selectedOrder.deliveryAddress.street}, {selectedOrder.deliveryAddress.colonyArea}
                    </p>
                    <p className="text-zinc-300">
                      {selectedOrder.deliveryAddress.city}, {selectedOrder.deliveryAddress.district}, {selectedOrder.deliveryAddress.state} - {selectedOrder.deliveryAddress.pincode}
                    </p>
                  </div>

                  {/* WhatsApp Support Query for this order */}
                  <div className="pt-2">
                    <a
                      href={`https://wa.me/919030782430?text=${encodeURIComponent(
                        `Hello Munnu Collections, I am inquiring about my Order #${selectedOrder.id} placed on ${new Date(
                          selectedOrder.createdAt
                        ).toLocaleDateString()}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-600/40 flex items-center justify-center gap-2 transition-colors"
                    >
                      <WhatsAppIcon className="w-4 h-4 fill-emerald-400" />
                      <span>Track / Inquire via WhatsApp</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
