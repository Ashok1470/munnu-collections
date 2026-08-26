import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, MapPin, Phone, User, Home, ArrowLeft, ArrowRight, ShieldCheck, Sparkles, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { CartItem, DeliveryAddress, Order, Product } from '../types';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import { BrandLogo } from './BrandLogo';
import { WhatsAppIcon } from './WhatsAppIcon';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  directBuyItem?: { product: Product; quantity: number } | null;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  directBuyItem,
  onOrderSuccess,
}) => {
  const { user } = useAuth();
  const { items: cartItems, clearCart } = useCart();

  // Step state: 'form' -> 'review' -> 'success'
  const [step, setStep] = useState<'form' | 'review' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Checkout Items (either direct Buy Now single item or entire Cart)
  const orderItems: Array<{
    productId: string;
    productName: string;
    productImage: string;
    category: string;
    price: number;
    quantity: number;
  }> = directBuyItem
    ? [
        {
          productId: directBuyItem.product.id,
          productName: directBuyItem.product.name,
          productImage: directBuyItem.product.images[0] || '',
          category: directBuyItem.product.category,
          price: directBuyItem.product.price,
          quantity: directBuyItem.quantity,
        },
      ]
    : cartItems.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.images[0] || '',
        category: item.product.category,
        price: item.product.price,
        quantity: item.quantity,
      }));

  const totalAmount = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  // Address Form State
  const [address, setAddress] = useState<DeliveryAddress>({
    fullName: user?.fullName || '',
    mobile: user?.mobile || '',
    altMobile: '',
    houseNumber: '',
    street: '',
    colonyArea: '',
    landmark: '',
    city: '',
    district: '',
    state: 'Telangana',
    pincode: '',
  });

  useEffect(() => {
    if (user) {
      setAddress((prev) => ({
        ...prev,
        fullName: prev.fullName || user.fullName,
        mobile: prev.mobile || user.mobile,
      }));
    }
  }, [user]);

  if (!isOpen) return null;

  const handleInputChange = (field: keyof DeliveryAddress, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!address.fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    const cleanPhone = address.mobile.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit delivery mobile number.');
      return;
    }
    if (!address.houseNumber.trim() || !address.street.trim() || !address.colonyArea.trim()) {
      setErrorMessage('Please fill in House No., Street, and Colony/Area.');
      return;
    }
    if (!address.city.trim() || !address.district.trim() || !address.pincode.trim()) {
      setErrorMessage('Please fill in City, District, and Pincode.');
      return;
    }

    setStep('review');
  };

  const handleConfirmOrder = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const res = await api.placeOrder({
        customerId: user?.id,
        customerName: address.fullName,
        customerMobile: address.mobile,
        items: orderItems,
        deliveryAddress: address,
      });

      setPlacedOrder(res.order);
      setStep('success');
      onOrderSuccess(res.order);

      // Trigger Celebration Confetti
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#E83E8C', '#FFF', '#F1D06E'],
      });

      if (!directBuyItem) {
        clearCart();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to confirm order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const whatsappOrderQuery = placedOrder
    ? encodeURIComponent(
        `Hello Munnu Collections, I just placed order #${placedOrder.id} for ₹${placedOrder.totalAmount}. Please confirm my shipment details.`
      )
    : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-3xl bg-[#0f0f14] border border-[#d4af37]/40 rounded-3xl overflow-hidden shadow-2xl text-zinc-100 my-auto max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" variant="badge" />
            <div>
              <h3 className="font-serif-luxury text-lg font-bold text-zinc-100">
                {step === 'form' ? 'Delivery Address' : step === 'review' ? 'Review & Confirm Order' : 'Order Placed'}
              </h3>
              <p className="text-xs text-[#d4af37]">Munnu Collections Secure Checkout</p>
            </div>
          </div>
          {step !== 'success' && (
            <button
              onClick={onClose}
              className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              aria-label="Close checkout"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {errorMessage && (
            <div className="p-3 bg-red-950/50 border border-red-500/40 text-red-300 text-xs rounded-xl">
              {errorMessage}
            </div>
          )}

          {/* STEP 1: ADDRESS FORM */}
          {step === 'form' && (
            <form id="checkout-address-form" onSubmit={handleProceedToReview} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="text"
                      required
                      placeholder="Receiver's Full Name"
                      value={address.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#d4af37] rounded-xl pl-10 pr-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                    Mobile Number <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="10-digit mobile number"
                      value={address.mobile}
                      onChange={(e) => handleInputChange('mobile', e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#d4af37] rounded-xl pl-10 pr-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                    Alternative Mobile (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="Alternative contact number"
                      value={address.altMobile}
                      onChange={(e) => handleInputChange('altMobile', e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#d4af37] rounded-xl pl-10 pr-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                    House / Flat / Door No. <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Home className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Flat 301, Plot 45"
                      value={address.houseNumber}
                      onChange={(e) => handleInputChange('houseNumber', e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#d4af37] rounded-xl pl-10 pr-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                    Street / Road <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MG Road, Main Bazaar"
                    value={address.street}
                    onChange={(e) => handleInputChange('street', e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#d4af37] rounded-xl px-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                    Colony / Area / Locality <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jubilee Hills, Banjara Colony"
                    value={address.colonyArea}
                    onChange={(e) => handleInputChange('colonyArea', e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#d4af37] rounded-xl px-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Opposite Shiva Temple"
                    value={address.landmark}
                    onChange={(e) => handleInputChange('landmark', e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#d4af37] rounded-xl px-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                    City / Town <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hyderabad"
                    value={address.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#d4af37] rounded-xl px-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                    District <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hyderabad / Ranga Reddy"
                    value={address.district}
                    onChange={(e) => handleInputChange('district', e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#d4af37] rounded-xl px-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                    State <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Telangana / Andhra Pradesh"
                    value={address.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#d4af37] rounded-xl px-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                    Pincode <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="6-digit Postal Pincode"
                    value={address.pincode}
                    onChange={(e) => handleInputChange('pincode', e.target.value.replace(/\D/g, ''))}
                    className="w-full sm:w-1/2 bg-zinc-900 border border-zinc-800 focus:border-[#d4af37] rounded-xl px-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Order Items Preview snippet */}
              <div className="mt-4 p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Items to Order ({orderItems.length})
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-300">
                    {orderItems.map((i) => `${i.productName} (x${i.quantity})`).join(', ')}
                  </span>
                  <span className="font-cinzel font-bold text-[#fceda6] ml-2 flex-shrink-0">
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="py-3 px-6 rounded-xl text-sm font-bold bg-gradient-to-r from-[#d4af37] to-[#aa820a] hover:brightness-110 text-black shadow-lg shadow-[#d4af37]/20 flex items-center gap-2 uppercase tracking-wider transition-all"
                >
                  <span>Review Order Summary</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: REVIEW ORDER SUMMARY */}
          {step === 'review' && (
            <div className="space-y-6">
              <div className="bg-zinc-950 border border-[#d4af37]/30 rounded-2xl p-4 sm:p-5">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-200">
                    <MapPin className="w-4 h-4 text-[#d4af37]" />
                    <span>Delivery Address</span>
                  </div>
                  <button
                    onClick={() => setStep('form')}
                    className="text-xs text-[#e83e8c] hover:underline font-semibold"
                  >
                    Edit Address
                  </button>
                </div>
                <div className="text-sm space-y-1 text-zinc-200">
                  <p className="font-bold text-zinc-100">{address.fullName}</p>
                  <p className="text-xs text-zinc-400">
                    Mobile: <span className="text-zinc-200">{address.mobile}</span>
                    {address.altMobile && ` | Alt: ${address.altMobile}`}
                  </p>
                  <p className="text-xs text-zinc-300">
                    {address.houseNumber}, {address.street}, {address.colonyArea}
                    {address.landmark && `, Landmark: ${address.landmark}`}
                  </p>
                  <p className="text-xs text-zinc-300">
                    {address.city}, {address.district}, {address.state} - <span className="font-bold text-amber-200">{address.pincode}</span>
                  </p>
                </div>
              </div>

              {/* Items List in Summary */}
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 sm:p-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                  Order Items Breakdown
                </h4>
                <div className="space-y-3 divide-y divide-zinc-800/60">
                  {orderItems.map((item) => (
                    <div key={item.productId} className="pt-3 first:pt-0 flex items-center gap-3">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-14 h-16 object-cover object-top rounded-lg border border-zinc-800 bg-black flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h5 className="font-serif-luxury text-sm font-semibold text-zinc-100 truncate">
                          {item.productName}
                        </h5>
                        <p className="text-xs text-zinc-400">
                          Qty: <span className="text-zinc-200 font-bold">{item.quantity}</span> × ₹{item.price.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <span className="font-cinzel text-sm font-bold text-[#fceda6]">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-zinc-800 space-y-1.5 text-xs">
                  <div className="flex justify-between text-zinc-400">
                    <span>Subtotal</span>
                    <span className="text-zinc-200">₹{totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Delivery Charges</span>
                    <span className="text-emerald-400 font-semibold">FREE (Boutique Complimentary)</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-zinc-100 pt-2 border-t border-zinc-800">
                    <span>Final Amount Payable</span>
                    <span className="font-cinzel text-xl text-[#fceda6]">₹{totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Confirm Order Buttons */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="py-2.5 px-4 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Address</span>
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={handleConfirmOrder}
                  className="py-3 px-8 rounded-xl text-sm font-bold bg-gradient-to-r from-[#d4af37] via-[#f1d06e] to-[#aa820a] hover:brightness-110 text-black shadow-xl shadow-[#d4af37]/30 flex items-center gap-2 uppercase tracking-wider transition-all"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 fill-black" />
                      <span>Confirm & Place Order</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: ORDER SUCCESS CELEBRATION */}
          {step === 'success' && placedOrder && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center p-4 sm:p-6 space-y-4"
            >
              <div className="w-20 h-20 rounded-full bg-emerald-950/80 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-900/40">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#fceda6]">
                  “Your order has been placed successfully!”
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 mt-1.5">
                  Thank you for shopping with <span className="font-bold text-[#e83e8c]">Munnu Collections</span>. Our team is preparing your sarees with regal care.
                </p>
              </div>

              {/* Order ID Badge */}
              <div className="p-4 rounded-2xl bg-zinc-950 border border-[#d4af37]/40 w-full max-w-md">
                <p className="text-xs uppercase tracking-widest text-zinc-400">Order Identification Number</p>
                <p className="font-cinzel text-xl sm:text-2xl font-black text-[#d4af37] tracking-wider mt-0.5">
                  #{placedOrder.id}
                </p>
                <div className="mt-3 pt-3 border-t border-zinc-800 flex justify-between text-xs text-zinc-300">
                  <span>Customer: <strong className="text-white">{placedOrder.customerName}</strong></span>
                  <span>Amount: <strong className="text-[#fceda6]">₹{placedOrder.totalAmount.toLocaleString('en-IN')}</strong></span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md pt-2">
                <a
                  href={`https://wa.me/919030782430?text=${whatsappOrderQuery}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/40 flex items-center justify-center gap-2 transition-all"
                >
                  <WhatsAppIcon className="w-4 h-4 fill-white" />
                  <span>WhatsApp Order Confirmation</span>
                </a>

                <button
                  onClick={onClose}
                  className="py-3 px-6 rounded-xl text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 transition-all uppercase tracking-wider"
                >
                  Continue Shopping
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
