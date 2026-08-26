import React from 'react';
import { ShoppingBag, Eye, Star, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onQuickBuy?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onQuickBuy,
}) => {
  const { addItem } = useCart();
  const mainImage = product.images[0] || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500"><rect width="400" height="500" fill="%231a1a24"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23d4af37" font-family="serif" font-size="20">Munnu Saree</text></svg>';
  
  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 3;

  return (
    <motion.div
      id={`product-card-${product.id}`}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="group relative flex flex-col bg-[#121216] border border-zinc-800/80 hover:border-[#d4af37]/60 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-[#d4af37]/10 transition-all duration-300"
    >
      {/* Image Banner Container */}
      <div
        className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-950 cursor-pointer"
        onClick={() => onSelect(product)}
      >
        <img
          src={mainImage}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-108"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isNewArrival && (
            <span className="inline-flex items-center gap-1 bg-[#e83e8c] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
              <Zap className="w-2.5 h-2.5 fill-white" /> New
            </span>
          )}
          {product.isFeatured && (
            <span className="inline-flex items-center gap-1 bg-gradient-to-r from-[#d4af37] to-[#aa820a] text-black text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
              <Star className="w-2.5 h-2.5 fill-black" /> Featured
            </span>
          )}
        </div>

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-3 right-3 z-10 bg-black/75 border border-[#d4af37]/50 text-[#fceda6] text-[11px] font-bold px-2 py-0.5 rounded-lg shadow-md backdrop-blur-sm">
            {discountPercent}% OFF
          </div>
        )}

        {/* Stock Status Chip */}
        <div className="absolute bottom-3 left-3 z-10">
          {isOutOfStock ? (
            <span className="bg-rose-900/90 border border-rose-500/50 text-rose-200 text-[10px] font-semibold px-2 py-0.5 rounded-md backdrop-blur-md">
              Sold Out
            </span>
          ) : isLowStock ? (
            <span className="bg-amber-950/90 border border-amber-500/50 text-amber-300 text-[10px] font-semibold px-2 py-0.5 rounded-md backdrop-blur-md animate-pulse">
              Only {product.stock} left
            </span>
          ) : (
            <span className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-medium px-2 py-0.5 rounded-md backdrop-blur-md">
              In Stock
            </span>
          )}
        </div>

        {/* Quick View Button Hover Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-[2px] z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            className="flex items-center gap-1.5 bg-black/80 hover:bg-black text-amber-200 border border-[#d4af37]/60 text-xs font-semibold px-4 py-2 rounded-xl shadow-lg transition-transform transform translate-y-2 group-hover:translate-y-0"
          >
            <Eye className="w-3.5 h-3.5" />
            Quick View
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
          {/* Category */}
          <div className="flex items-center justify-between mb-1 text-[11px] text-zinc-400">
            <span className="text-[#e83e8c] font-medium uppercase tracking-wider">{product.category}</span>
            {product.rating && (
              <span className="flex items-center gap-0.5 text-amber-300">
                <Star className="w-3 h-3 fill-amber-300" />
                <span>{product.rating.toFixed(1)}</span>
                <span className="text-zinc-500 text-[10px]">({product.reviewsCount})</span>
              </span>
            )}
          </div>

          {/* Saree Name */}
          <h3
            onClick={() => onSelect(product)}
            className="font-serif-luxury text-base sm:text-lg font-semibold text-zinc-100 group-hover:text-amber-200 transition-colors line-clamp-2 cursor-pointer leading-snug"
          >
            {product.name}
          </h3>

          {/* Fabric subtitle */}
          <p className="text-xs text-zinc-400 mt-1 line-clamp-1">
            {product.fabric}
          </p>
        </div>

        {/* Price and Actions */}
        <div className="mt-4 pt-3 border-t border-zinc-800/80">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="font-cinzel text-lg sm:text-xl font-bold text-[#fceda6]">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-zinc-500 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              id={`add-to-cart-btn-${product.id}`}
              type="button"
              disabled={isOutOfStock}
              onClick={() => addItem(product, 1)}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold bg-zinc-800/90 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Add to Cart</span>
            </button>

            <button
              id={`buy-now-btn-${product.id}`}
              type="button"
              disabled={isOutOfStock}
              onClick={() => {
                if (onQuickBuy) {
                  onQuickBuy(product);
                } else {
                  addItem(product, 1);
                }
              }}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#d4af37] to-[#aa820a] hover:brightness-110 text-black shadow-md shadow-[#d4af37]/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
