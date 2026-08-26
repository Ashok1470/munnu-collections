import React, { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { WhatsAppIcon } from './WhatsAppIcon';

interface WhatsAppSupportButtonProps {
  productContext?: string;
  className?: string;
}

export const WhatsAppSupportButton: React.FC<WhatsAppSupportButtonProps> = ({
  productContext,
  className = '',
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const phoneNumber = '919030782430';
  
  const defaultMessage = productContext
    ? `Hello Munnu Collections, I need help regarding the product: "${productContext}".`
    : `Hello Munnu Collections, I need help regarding your saree collections.`;

  const encodedMessage = encodeURIComponent(defaultMessage);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-end gap-3 ${className}`}>
      {/* Interactive Tooltip Card */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="hidden sm:flex flex-col bg-zinc-900/95 backdrop-blur-md border border-[#d4af37]/40 p-3.5 rounded-2xl shadow-2xl max-w-xs text-left relative"
          >
            <button
              onClick={() => setShowTooltip(false)}
              className="absolute top-2 right-2 text-zinc-400 hover:text-white p-1"
              aria-label="Close tooltip"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-xs font-semibold text-amber-200">Munnu Saree Support</p>
            </div>
            <p className="text-xs text-zinc-300">
              Need assistance with saree selection, pure silk certification, or custom blouse tailoring? Chat with us!
            </p>
            <div className="mt-2 pt-2 border-t border-zinc-800 flex items-center justify-between text-[11px]">
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <WhatsAppIcon className="w-3 h-3 fill-emerald-400" />
                <span>Online & Ready</span>
              </span>
              <span className="text-zinc-400">Instant Reply</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.a
        id="whatsapp-support-floating-btn"
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-500 to-green-400 text-white shadow-xl shadow-emerald-950/60 border-2 border-emerald-300/40 focus:outline-none focus:ring-4 focus:ring-emerald-500/30"
        title="Chat on WhatsApp"
      >
        {/* Pulse ring effect */}
        <span className="absolute -inset-1 rounded-full bg-emerald-400/30 animate-ping opacity-60 pointer-events-none" />
        
        {/* WhatsApp Logo Icon */}
        <WhatsAppIcon className="w-8 h-8 fill-white transition-transform group-hover:scale-110 duration-300" />

        {/* Small live badge indicator */}
        <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-400 border-2 border-zinc-950"></span>
        </span>
      </motion.a>
    </div>
  );
};
