import React, { useState } from 'react';
import { X, ShoppingBag, Zap, Star, ShieldCheck, Truck, RefreshCw, CheckCircle2, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { WhatsAppIcon } from './WhatsAppIcon';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onBuyNow: (product: Product, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onBuyNow,
}) => {
  const { addItem } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  if (!isOpen || !product) return null;

  const images = product.images && product.images.length > 0
    ? product.images
    : ['data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500"><rect width="400" height="500" fill="%231a1a24"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23d4af37" font-family="serif" font-size="20">Munnu Saree</text></svg>'];

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  const handleBuyNow = () => {
    onBuyNow(product, quantity);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Munnu Collections, I am interested in purchasing: "${product.name}" (Price: ₹${product.price}). Is it available?`
  );
  const whatsappUrl = `https://wa.me/919030782430?text=${whatsappMessage}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-4xl bg-[#0f0f14] border border-[#d4af37]/35 rounded-3xl overflow-hidden shadow-2xl shadow-black text-zinc-100 my-auto"
      >
        {/* Close Button */}
        <button
          id="product-modal-close-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 hover:bg-black text-zinc-400 hover:text-white border border-zinc-700 transition-colors"
          aria-label="Close product details"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          {/* Images Section */}
          <div className="md:col-span-6 bg-zinc-950 p-4 sm:p-6 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-zinc-800">
            {/* Active Preview */}
            <div className="relative aspect-[3/4] w-full max-w-sm rounded-2xl overflow-hidden border border-zinc-800 bg-black shadow-inner">
              <img
                src={images[selectedImageIndex] || images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-top transition-all duration-500"
              />

              {discountPercent > 0 && (
                <div className="absolute top-3 left-3 bg-[#e83e8c] text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-md">
                  {discountPercent}% OFF
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="flex items-center gap-2 mt-4 overflow-x-auto max-w-full pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-16 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      selectedImageIndex === idx
                        ? 'border-[#d4af37] ring-2 ring-[#d4af37]/30 scale-105'
                        : 'border-zinc-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover object-top" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="md:col-span-6 p-5 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Category & Badge */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase font-bold tracking-widest text-[#e83e8c]">
                  {product.category}
                </span>
                {product.isFeatured && (
                  <span className="text-[10px] uppercase font-bold tracking-wider bg-[#d4af37]/15 text-[#fceda6] border border-[#d4af37]/30 px-2 py-0.5 rounded-full">
                    Exclusive Collection
                  </span>
                )}
              </div>

              {/* Title */}
              <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-zinc-100 leading-tight">
                {product.name}
              </h2>

              {/* Reviews & Rating */}
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1 text-amber-400 text-sm">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-zinc-600'
                      }`}
                    />
                  ))}
                  <span className="font-bold text-xs ml-1 text-zinc-200">
                    {(product.rating || 5.0).toFixed(1)}
                  </span>
                </div>
                <span className="text-xs text-zinc-500">• {product.reviewsCount || 28} Verified Customer Reviews</span>
              </div>

              {/* Price Block */}
              <div className="mt-5 p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-baseline justify-between">
                <div>
                  <div className="flex items-baseline gap-2.5">
                    <span className="font-cinzel text-2xl sm:text-3xl font-extrabold text-[#fceda6]">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-zinc-500 line-through">
                        ₹{product.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Inclusive of all taxes & free insured delivery</p>
                </div>

                {/* Stock Tag */}
                <div>
                  {isOutOfStock ? (
                    <span className="bg-rose-950 text-rose-300 border border-rose-600/50 text-xs px-3 py-1 rounded-full font-semibold">
                      Out of Stock
                    </span>
                  ) : product.stock <= 3 ? (
                    <span className="bg-amber-950 text-amber-300 border border-amber-600/50 text-xs px-3 py-1 rounded-full font-semibold animate-pulse">
                      Only {product.stock} Left!
                    </span>
                  ) : (
                    <span className="bg-emerald-950 text-emerald-300 border border-emerald-600/50 text-xs px-3 py-1 rounded-full font-semibold">
                      In Stock ({product.stock})
                    </span>
                  )}
                </div>
              </div>

              {/* Dynamic Specifications */}
              <div className="mt-5 space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between py-1.5 border-b border-zinc-800/80">
                  <span className="text-zinc-400">
                    {product.category.toLowerCase().includes('handbag') || product.category.toLowerCase().includes('clutch') || product.category.toLowerCase().includes('bag')
                      ? 'Material & Craft'
                      : product.category.toLowerCase().includes('jewel') || product.category.toLowerCase().includes('necklace') || product.category.toLowerCase().includes('earring')
                      ? 'Material & Plating'
                      : 'Fabric Composition'}
                  </span>
                  <span className="text-zinc-200 font-medium">{product.fabric}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-zinc-800/80">
                  <span className="text-zinc-400">
                    {product.category.toLowerCase().includes('handbag') || product.category.toLowerCase().includes('clutch') || product.category.toLowerCase().includes('bag')
                      ? 'Strap & Dust Bag'
                      : product.category.toLowerCase().includes('jewel') || product.category.toLowerCase().includes('necklace') || product.category.toLowerCase().includes('earring')
                      ? 'Velvet Box & Packaging'
                      : 'Blouse Piece'}
                  </span>
                  <span className="text-[#fceda6] font-medium">
                    {product.category.toLowerCase().includes('handbag') || product.category.toLowerCase().includes('clutch') || product.category.toLowerCase().includes('bag')
                      ? product.blouseIncluded ? 'Included (Shoulder Strap/Dust Bag)' : 'Standard'
                      : product.category.toLowerCase().includes('jewel') || product.category.toLowerCase().includes('necklace') || product.category.toLowerCase().includes('earring')
                      ? product.blouseIncluded ? 'Luxury Velvet Gift Box Included' : 'Standard Packaging'
                      : product.blouseIncluded ? 'Included (Unstitched)' : 'Not Included'}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-zinc-800/80">
                  <span className="text-zinc-400">
                    {product.category.toLowerCase().includes('handbag') || product.category.toLowerCase().includes('clutch') || product.category.toLowerCase().includes('bag')
                      ? 'Dimensions'
                      : product.category.toLowerCase().includes('jewel') || product.category.toLowerCase().includes('necklace') || product.category.toLowerCase().includes('earring')
                      ? 'Size & Fit'
                      : 'Saree Length'}
                  </span>
                  <span className="text-zinc-200 font-medium">{product.length}</span>
                </div>
              </div>

              {/* Description */}
              <div className="mt-4">
                <h4 className="text-xs uppercase font-bold tracking-wider text-zinc-400 mb-1">
                  Product Description
                </h4>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Quantity Selector */}
              {!isOutOfStock && (
                <div className="mt-5 flex items-center gap-4">
                  <span className="text-xs font-semibold uppercase text-zinc-400 tracking-wider">Quantity:</span>
                  <div className="flex items-center border border-zinc-700 bg-zinc-900 rounded-xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3.5 py-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 py-1.5 text-sm font-bold text-zinc-100">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                      className="px-3.5 py-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 pt-4 border-t border-zinc-800 space-y-3">
              {addedNotice && (
                <div className="flex items-center gap-2 p-2.5 bg-emerald-950/60 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Added {quantity} item(s) to your cart!</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  id="modal-add-to-cart-btn"
                  type="button"
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                  className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 flex items-center justify-center gap-2 disabled:opacity-40 transition-all"
                >
                  <ShoppingBag className="w-4 h-4 text-[#d4af37]" />
                  <span>Add to Cart</span>
                </button>

                <button
                  id="modal-buy-now-btn"
                  type="button"
                  disabled={isOutOfStock}
                  onClick={handleBuyNow}
                  className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-gradient-to-r from-[#d4af37] via-[#f1d06e] to-[#aa820a] hover:brightness-110 text-black shadow-lg shadow-[#d4af37]/25 flex items-center justify-center gap-2 disabled:opacity-40 transition-all"
                >
                  <Zap className="w-4 h-4 fill-black" />
                  <span>Buy Now</span>
                </button>
              </div>

              {/* WhatsApp Support Direct Button */}
              <a
                id="modal-whatsapp-support-btn"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-emerald-950/50 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-600/40 flex items-center justify-center gap-2 transition-colors"
              >
                <WhatsAppIcon className="w-4 h-4 fill-emerald-400" />
                <span>Inquire About This Saree on WhatsApp</span>
              </a>

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-[10px] text-zinc-400 text-center">
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
                  <span>100% Pure Handloom</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Truck className="w-4 h-4 text-[#e83e8c]" />
                  <span>Free Express Delivery</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <RefreshCw className="w-4 h-4 text-[#d4af37]" />
                  <span>Secure Quality Assured</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
