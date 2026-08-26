import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../context/CartContext';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
  onExploreProducts: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  onProceedToCheckout,
  onExploreProducts,
}) => {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice, totalItems } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeCart}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-screen max-w-md bg-[#0f0f13] border-l border-[#d4af37]/30 text-zinc-100 flex flex-col shadow-2xl"
        >
          {/* Header */}
          <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/80">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#fceda6]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif-luxury text-lg font-bold text-zinc-100">Your Shopping Cart</h3>
                <p className="text-xs text-zinc-400">{totalItems} {totalItems === 1 ? 'item' : 'items'} selected</p>
              </div>
            </div>
            <button
              id="cart-drawer-close-btn"
              onClick={closeCart}
              className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-20 h-20 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <div>
                  <h4 className="font-serif-luxury text-xl font-bold text-zinc-200">Your Cart is Empty</h4>
                  <p className="text-xs text-zinc-400 mt-1 max-w-xs">
                    Discover our breathtaking royal pure silk, pattu, and designer sarees to add to your wardrobe.
                  </p>
                </div>
                <button
                  id="cart-explore-btn"
                  onClick={() => {
                    closeCart();
                    onExploreProducts();
                  }}
                  className="py-2.5 px-6 rounded-xl text-xs font-bold bg-gradient-to-r from-[#d4af37] to-[#aa820a] text-black shadow-lg shadow-[#d4af37]/20 uppercase tracking-wider hover:brightness-110 transition-all"
                >
                  Explore Sarees
                </button>
              </div>
            ) : (
              <AnimatePresence>
                {items.map((item) => {
                  const subtotal = item.product.price * item.quantity;
                  const img = item.product.images[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85';

                  return (
                    <motion.div
                      key={item.product.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex gap-3.5 p-3.5 bg-zinc-900/80 border border-zinc-800 rounded-2xl relative group"
                    >
                      {/* Image */}
                      <div className="w-20 h-24 rounded-xl overflow-hidden bg-black border border-zinc-800 flex-shrink-0">
                        <img src={img} alt={item.product.name} className="w-full h-full object-cover object-top" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h5 className="font-serif-luxury text-sm font-semibold text-zinc-100 line-clamp-1">
                              {item.product.name}
                            </h5>
                            <button
                              id={`remove-cart-item-${item.product.id}`}
                              onClick={() => removeItem(item.product.id)}
                              className="text-zinc-500 hover:text-rose-400 p-1 transition-colors"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-[11px] text-[#e83e8c] font-medium">{item.product.category}</p>
                          <p className="text-xs font-semibold text-[#fceda6] mt-0.5">
                            ₹{item.product.price.toLocaleString('en-IN')}
                          </p>
                        </div>

                        {/* Quantity and Subtotal */}
                        <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80">
                          <div className="flex items-center border border-zinc-700 bg-zinc-950 rounded-lg overflow-hidden">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="p-1 px-2 text-zinc-400 hover:text-white hover:bg-zinc-800"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2.5 text-xs font-bold text-zinc-200">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="p-1 px-2 text-zinc-400 hover:text-white hover:bg-zinc-800"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="text-xs font-bold text-zinc-200">
                            Subtotal: ₹{subtotal.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>

          {/* Footer Checkout Calculation */}
          {items.length > 0 && (
            <div className="p-5 border-t border-zinc-800 bg-zinc-950/90 space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="text-zinc-200 font-semibold">₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Estimated Delivery</span>
                  <span className="text-emerald-400 font-semibold">FREE (Special Boutique Offer)</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-zinc-100 pt-2 border-t border-zinc-800">
                  <span>Total Amount</span>
                  <span className="font-cinzel text-lg text-[#fceda6]">₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                id="cart-proceed-checkout-btn"
                onClick={() => {
                  closeCart();
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-[#d4af37] via-[#f1d06e] to-[#aa820a] hover:brightness-110 text-black shadow-lg shadow-[#d4af37]/25 flex items-center justify-center gap-2 uppercase tracking-wider transition-all"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-500">
                <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>100% Authentic Handcrafted Sarees Guarantee</span>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
