import React from 'react';
import { MapPin, ShieldCheck, Heart, Lock, Clock } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { WhatsAppIcon } from './WhatsAppIcon';

interface FooterProps {
  onSelectCategory: (cat: string) => void;
  onOpenAdmin: () => void;
  onOpenOrders: () => void;
  onOpenGateway?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenAdmin,
  onOpenOrders,
  onOpenGateway,
}) => {
  const categories = [
    'Silk Sarees',
    'Pattu Sarees',
    'Designer Sarees',
    'Luxury Handbags',
    'Bridal Clutches & Potlis',
    'Bridal Jewellery Sets',
    'Temple & Kundan Jewellery',
    'New Arrivals',
  ];

  return (
    <footer className="bg-[#08080a] border-t border-zinc-800 text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          {/* Brand Col */}
          <div className="lg:col-span-5 space-y-4">
            <BrandLogo size="lg" align="left" showQuote={true} onClick={onOpenGateway} />
            <p className="text-zinc-400 text-xs leading-relaxed max-w-sm">
              Munnu Collections brings traditional Indian elegance into modern fashion. Explore handcrafted Kanchipuram silk sarees, designer party & bridal handbags, and regal kundan jewellery sets.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-[#d4af37]/30 text-zinc-300 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>100% Authentic Sarees, Bags & Jewellery Guaranteed</span>
              </div>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif-luxury text-sm font-bold text-zinc-200 uppercase tracking-wider">
              Boutique Collections
            </h4>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      onSelectCategory(cat);
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    className="hover:text-[#fceda6] transition-colors"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Support & Contact */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-serif-luxury text-sm font-bold text-zinc-200 uppercase tracking-wider">
              Customer Support & Boutique
            </h4>
            <div className="space-y-2.5">
              <a
                href="https://wa.me/919030782430"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/90 border border-emerald-500/40 text-emerald-300 hover:border-emerald-400 hover:bg-zinc-800/90 transition-all shadow-md group"
              >
                <div className="p-2 rounded-lg bg-emerald-950/80 border border-emerald-500/30 group-hover:scale-105 transition-transform">
                  <WhatsAppIcon className="w-5 h-5 fill-emerald-400" />
                </div>
                <div>
                  <p className="font-bold text-xs text-white">Chat on WhatsApp</p>
                  <p className="text-[10px] text-emerald-400/90">Instant boutique support & order inquiries</p>
                </div>
              </a>

              <div className="flex items-start gap-2.5 text-zinc-400 pt-1">
                <Clock className="w-4 h-4 text-[#d4af37] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-zinc-300 font-semibold">Boutique Hours</p>
                  <p className="text-[10px] text-zinc-500">Mon - Sun: 9:00 AM - 9:00 PM IST</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-zinc-400">
                <MapPin className="w-4 h-4 text-[#d4af37] flex-shrink-0" />
                <span>Pan-India Doorstep Delivery</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenOrders}
                className="text-xs text-[#d4af37] hover:underline font-semibold"
              >
                Track Your Saree Order Status →
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <p>© {new Date().getFullYear()} MUNNU COLLECTIONS. All rights reserved.</p>

          <div className="flex items-center gap-4">
            <button
              id="footer-admin-portal-btn"
              onClick={onOpenAdmin}
              className="hover:text-amber-300 flex items-center gap-1 transition-colors"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Management</span>
            </button>
            <span>•</span>
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-[#e83e8c] inline" /> for Ethnic Fashion Lovers
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
