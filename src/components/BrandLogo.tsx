import React, { useState } from 'react';
import { useBranding } from '../context/BrandingContext';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showQuote?: boolean;
  align?: 'left' | 'center' | 'right';
  className?: string;
  variant?: 'full' | 'compact' | 'badge' | 'emblem-only';
  customLogoUrl?: string;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showQuote = false,
  align = 'left',
  className = '',
  variant = 'full',
  customLogoUrl,
  onClick,
}) => {
  const { branding } = useBranding();
  const [imageError, setImageError] = useState(false);

  // Default to our handcrafted official logo vector matching user upload
  const activeLogoUrl = customLogoUrl || branding?.logoUrl || '/munnu-logo.svg';

  const sizeMap = {
    sm: {
      badge: 'w-9 h-9 text-xs',
      imgSize: 'w-9 h-9',
      title: 'text-sm font-bold tracking-wider',
      quote: 'text-[9px]',
      iconSize: 18,
    },
    md: {
      badge: 'w-12 h-12 text-sm',
      imgSize: 'w-12 h-12',
      title: 'text-base sm:text-lg font-extrabold tracking-widest',
      quote: 'text-[10px] sm:text-xs',
      iconSize: 24,
    },
    lg: {
      badge: 'w-16 h-16 text-lg',
      imgSize: 'w-16 h-16',
      title: 'text-xl sm:text-2xl font-black tracking-[0.2em]',
      quote: 'text-xs sm:text-sm',
      iconSize: 36,
    },
    xl: {
      badge: 'w-24 h-24 text-2xl',
      imgSize: 'w-24 h-24',
      title: 'text-2xl sm:text-3xl font-black tracking-[0.25em]',
      quote: 'text-sm sm:text-base',
      iconSize: 48,
    },
  };

  const currentSize = sizeMap[size];
  const alignClass = align === 'center' ? 'items-center text-center' : align === 'right' ? 'items-end text-right' : 'items-start text-left';

  const shapeClass =
    branding?.logoShape === 'rounded'
      ? 'rounded-2xl'
      : branding?.logoShape === 'square'
      ? 'rounded-md'
      : 'rounded-full';

  const innerShapeClass =
    branding?.logoShape === 'rounded'
      ? 'rounded-[14px]'
      : branding?.logoShape === 'square'
      ? 'rounded-sm'
      : 'rounded-full';

  // Emblem only or Badge variant
  if (variant === 'badge' || variant === 'emblem-only') {
    return (
      <div
        onClick={onClick}
        className={`relative inline-flex items-center justify-center ${shapeClass} bg-gradient-to-br from-[#d4af37] via-[#e83e8c] to-[#997010] p-[1.5px] shadow-lg shadow-[#d4af37]/20 group ${className} ${onClick ? 'cursor-pointer hover:scale-105 transition-transform' : ''}`}
      >
        <div className={`${currentSize.badge} ${innerShapeClass} bg-[#09090b] flex items-center justify-center relative overflow-hidden`}>
          <img
            src={activeLogoUrl}
            alt={branding?.brandName || 'Munnu Collections'}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover relative z-10"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`inline-flex flex-row items-center gap-3.5 ${alignClass} ${className} ${onClick ? 'cursor-pointer hover:opacity-95 transition-opacity' : ''}`}
    >
      {/* Brand Icon Emblem matching user's official uploaded logo */}
      <div className="relative flex-shrink-0 group">
        <div className={`relative inline-flex items-center justify-center ${shapeClass} bg-gradient-to-br from-[#ffe28a] via-[#e83e8c] to-[#d4af37] p-[1.5px] shadow-xl shadow-black/80 ring-1 ring-[#d4af37]/30 group-hover:scale-105 transition-all duration-300`}>
          <div className={`${currentSize.badge} ${innerShapeClass} bg-[#09090b] flex items-center justify-center relative overflow-hidden`}>
            <img
              src={activeLogoUrl}
              alt={branding?.brandName || 'Munnu Collections'}
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover relative z-10 drop-shadow-[0_2px_8px_rgba(212,175,55,0.4)]"
            />
          </div>
        </div>
      </div>

      {/* Typography Section */}
      <div className={`flex flex-col ${alignClass}`}>
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-cinzel ${currentSize.title} bg-gradient-to-r from-[#FFF5C8] via-[#D4AF37] to-[#F1B94A] bg-clip-text text-transparent uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]`}>
            {branding?.brandName || 'MUNNU'}
          </span>
          <span className={`font-cinzel ${currentSize.title} bg-gradient-to-r from-[#FFB8D2] via-[#E83E8C] to-[#FFAEC9] bg-clip-text text-transparent uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]`}>
            {branding?.brandSubname || 'COLLECTIONS'}
          </span>
        </div>

        {showQuote ? (
          <p className={`font-serif-luxury italic ${currentSize.quote} text-amber-200/90 tracking-wide mt-1`}>
            {branding?.quote || '“Style Speaks Louder Than Words”'}
          </p>
        ) : (
          <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-400 font-medium mt-0.5">
            {branding?.tagline || 'Exclusive Saree Boutique'}
          </p>
        )}
      </div>
    </div>
  );
};
