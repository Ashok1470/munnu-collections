import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Truck, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { BrandLogo } from './BrandLogo';
import { WhatsAppIcon } from './WhatsAppIcon';

interface HeroSectionProps {
  onExploreClick: () => void;
  onSelectCategory: (cat: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreClick,
  onSelectCategory,
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0e0e12] via-[#09090b] to-[#0a0a0c] pt-6 pb-14 border-b border-zinc-800/80">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#d4af37]/15 via-[#e83e8c]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#e83e8c]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text Narrative */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top Brand Crown Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900/90 border border-[#d4af37]/40 shadow-lg text-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="gold-gradient-text font-bold uppercase tracking-widest text-[11px]">
                Sarees • Handbags • Royal Jewellery
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-3"
            >
              <h1 className="font-cinzel text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                MUNNU <span className="pink-gold-gradient-text">COLLECTIONS</span>
              </h1>
              
              <div className="p-3 sm:p-4 rounded-2xl bg-zinc-950/80 border border-[#d4af37]/30 max-w-xl mx-auto lg:mx-0 shadow-xl">
                <p className="font-serif-luxury text-xl sm:text-2xl lg:text-3xl italic text-[#fceda6] font-semibold tracking-wide">
                  “Style Speaks Louder Than Words”
                </p>
                <p className="text-xs text-zinc-400 mt-1">
                  Discover authentic Kanchipuram & Designer Sarees, luxury bridal Handbags & Clutches, and royal Kundan & Temple Jewellery.
                </p>
              </div>
            </motion.div>

            {/* Category Direct Jump Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18 }}
              className="flex items-center justify-center lg:justify-start gap-2 flex-wrap"
            >
              <button
                onClick={() => onSelectCategory('Silk Sarees')}
                className="px-3.5 py-1.5 rounded-full bg-zinc-900 hover:bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#fceda6] text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <span>🥻 Sarees</span>
              </button>
              <button
                onClick={() => onSelectCategory('Luxury Handbags')}
                className="px-3.5 py-1.5 rounded-full bg-zinc-900 hover:bg-[#e83e8c]/20 border border-[#e83e8c]/40 text-[#ffb8d2] text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <span>👜 Handbags</span>
              </button>
              <button
                onClick={() => onSelectCategory('Bridal Jewellery Sets')}
                className="px-3.5 py-1.5 rounded-full bg-zinc-900 hover:bg-amber-600/20 border border-amber-500/40 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <span>💎 Jewellery</span>
              </button>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-1"
            >
              <button
                id="hero-explore-collection-btn"
                onClick={onExploreClick}
                className="w-full sm:w-auto py-3.5 px-8 rounded-2xl font-extrabold text-xs sm:text-sm uppercase tracking-wider bg-gradient-to-r from-[#d4af37] via-[#f1d06e] to-[#aa820a] hover:brightness-110 text-black shadow-xl shadow-[#d4af37]/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
              >
                <span>Explore Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="https://wa.me/919030782430?text=Hello%20Munnu%20Collections%2C%20I%20am%20interested%20in%20your%20Sarees%2C%20Handbags%20and%20Jewellery%20collection."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto py-3.5 px-6 rounded-2xl font-bold text-xs sm:text-sm bg-zinc-900/90 hover:bg-zinc-800 text-emerald-300 border border-emerald-500/40 flex items-center justify-center gap-2 transition-all"
              >
                <WhatsAppIcon className="w-4 h-4 fill-emerald-400" />
                <span>WhatsApp Assistant</span>
              </a>
            </motion.div>

            {/* Highlights Strip */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-zinc-800/80 max-w-lg mx-auto lg:mx-0 text-left">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/30 text-[#fceda6]">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-zinc-200">100% Pure Zari</p>
                  <p className="text-[9px] text-zinc-400">Certified Weaves</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#e83e8c]/15 border border-[#e83e8c]/30 text-[#ffb8d2]">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-zinc-200">Free Delivery</p>
                  <p className="text-[9px] text-zinc-400">All Over India</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300">
                  <Star className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-zinc-200">4.9 ★ Rated</p>
                  <p className="text-[9px] text-zinc-400">By 5,000+ Women</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Visual Montage */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-sm sm:max-w-md">
              {/* Central Glowing Card */}
              <div className="relative rounded-3xl overflow-hidden border-2 border-[#d4af37]/40 bg-zinc-950 shadow-2xl shadow-black p-4 group">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-b from-[#1c1815] via-[#121218] to-[#0a0a0e] flex flex-col items-center justify-center p-6 text-center border border-[#d4af37]/20">
                  {/* Decorative luxury pattern elements */}
                  <div className="w-28 h-28 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/40 flex items-center justify-center mb-6 shadow-inner shadow-[#d4af37]/20">
                    <BrandLogo size="lg" showQuote={false} align="center" className="mx-auto" />
                  </div>

                  <p className="font-cinzel text-xl sm:text-2xl font-black text-[#fceda6] tracking-wider mb-2">
                    MUNNU COLLECTIONS
                  </p>
                  <p className="font-serif-luxury text-base italic text-[#d4af37] font-semibold mb-4">
                    “Style Speaks Louder Than Words”
                  </p>
                  <p className="text-xs text-zinc-300 max-w-xs leading-relaxed">
                    Exquisite handloom & designer boutique sarees curated personally by Munnu Collections.
                  </p>

                  {/* Floating Overlay Badge at Bottom */}
                  <div className="mt-8 w-full p-3.5 rounded-2xl bg-black/70 backdrop-blur-md border border-[#d4af37]/30 text-center">
                    <p className="text-[11px] uppercase tracking-widest text-[#fceda6] font-bold">
                      Direct Boutique Purchases
                    </p>
                    <p className="text-[10px] text-zinc-400 mt-0.5">
                      Fast Delivery Across India • Cash On Delivery Available
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Mini Card Badge */}
              <div className="absolute -top-4 -left-4 p-3 bg-zinc-900/95 border border-[#d4af37]/50 rounded-2xl shadow-xl backdrop-blur-md flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#e83e8c] text-white flex items-center justify-center font-bold text-xs">
                  MC
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-100">Festive Bridal Drop</p>
                  <p className="text-[10px] text-emerald-400 font-semibold">New Sarees In Stock</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
