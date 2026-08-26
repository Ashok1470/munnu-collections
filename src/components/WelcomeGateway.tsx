import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, UserCheck, UserPlus, ShoppingBag, ArrowRight, Lock, Package, CheckCircle2 } from 'lucide-react';
import { useBranding } from '../context/BrandingContext';
import { useAuth } from '../context/AuthContext';
import { useAdminAuth } from '../context/AdminAuthContext';
import { WhatsAppIcon } from './WhatsAppIcon';

interface WelcomeGatewayProps {
  onEnterStore: () => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onOpenAdmin: () => void;
  onOpenOrders: () => void;
}

export const WelcomeGateway: React.FC<WelcomeGatewayProps> = ({
  onEnterStore,
  onOpenLogin,
  onOpenRegister,
  onOpenAdmin,
  onOpenOrders,
}) => {
  const { branding } = useBranding();
  const { user, isAuthenticated } = useAuth();
  const { isAdminAuthenticated } = useAdminAuth();

  const logoUrl = branding?.logoUrl || '/munnu-logo.svg';
  const hasAccess = isAuthenticated || isAdminAuthenticated;

  return (
    <div className="relative min-h-screen bg-[#070509] text-zinc-100 flex flex-col justify-between overflow-x-hidden selection:bg-[#d4af37]/30 selection:text-[#f3e5ab]">
      {/* Background Ambience & Lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-to-b from-[#e83e8c]/20 via-[#d4af37]/15 to-transparent rounded-full blur-3xl opacity-70" />
        <div className="absolute -bottom-40 -left-20 w-[500px] h-[500px] bg-[#99004d]/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-20 w-[500px] h-[500px] bg-[#d4af37]/10 rounded-full blur-3xl" />
        {/* Subtle pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03]" />
      </div>

      {/* Top Header Bar (No Skip Button) */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between border-b border-zinc-800/40">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] uppercase tracking-widest text-zinc-400 font-semibold">
            Munnu Collections Official Boutique
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <a
            href="https://wa.me/919030782430"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 font-medium transition-colors"
            title="Chat on WhatsApp"
          >
            <WhatsAppIcon className="w-4 h-4 fill-emerald-400" />
            <span className="hidden sm:inline">WhatsApp Help</span>
          </a>

          {hasAccess && (
            <button
              onClick={onEnterStore}
              className="px-3.5 py-1.5 rounded-full bg-[#d4af37]/20 hover:bg-[#d4af37]/30 text-[#fceda6] border border-[#d4af37]/50 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <span>Go to Saree Catalog</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#d4af37]" />
            </button>
          )}
        </div>
      </header>

      {/* Center Welcome Gateway Card */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-4xl mx-auto w-full text-center">
        {/* 1. Grand Glowing Official Brand Logo (Come First) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-6 sm:mb-8 group"
        >
          {/* Outer Pulsing Neon Glow Ring */}
          <div className="absolute -inset-4 bg-gradient-to-r from-[#d4af37] via-[#e83e8c] to-[#d4af37] rounded-full blur-2xl opacity-40 group-hover:opacity-75 transition-opacity duration-700 animate-pulse" />

          {/* Luxury Frame Container */}
          <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 rounded-full p-2 bg-gradient-to-tr from-[#ffe28a] via-[#e83e8c] to-[#d4af37] shadow-[0_0_50px_rgba(232,62,140,0.3)] ring-2 ring-[#d4af37]/60">
            <div className="w-full h-full rounded-full bg-[#070509] overflow-hidden flex items-center justify-center p-1.5 shadow-inner">
              <img
                src={logoUrl}
                alt="Munnu Collections Official Logo"
                className="w-full h-full object-contain filter drop-shadow-[0_4px_20px_rgba(212,175,55,0.6)]"
              />
            </div>
          </div>
        </motion.div>

        {/* Brand Titles & Slogan */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-2 mb-8 max-w-2xl"
        >
          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
            <h1 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-[#FFF5C8] via-[#D4AF37] to-[#F1B94A] bg-clip-text text-transparent tracking-[0.15em] drop-shadow-md">
              {branding?.brandName || 'MUNNU'}
            </h1>
            <h1 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-[#FFB8D2] via-[#E83E8C] to-[#FFAEC9] bg-clip-text text-transparent tracking-[0.15em] drop-shadow-md">
              {branding?.brandSubname || 'COLLECTIONS'}
            </h1>
          </div>

          <p className="font-serif-luxury italic text-lg sm:text-xl text-amber-200/90 font-medium">
            {branding?.quote || '“Style Speaks Louder Than Words”'}
          </p>

          {/* Members Exclusive Notice */}
          <div className="pt-2 flex items-center justify-center">
            {hasAccess ? (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  {isAdminAuthenticated
                    ? 'Admin Access Granted: You have full store management controls.'
                    : `Welcome back, ${user?.fullName}! Saree catalog access active.`}
                </span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-950/40 border border-[#d4af37]/40 text-[#fceda6] text-xs font-medium">
                <Lock className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Exclusive Saree Catalog — Available to Registered Customers &amp; Members</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* 2. Primary Portals: Login, Admin Panel, and Register */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 w-full max-w-2xl"
        >
          {/* Card 1: Customer Login */}
          <button
            id="gateway-customer-login-btn"
            onClick={() => {
              if (isAuthenticated) {
                onEnterStore();
              } else {
                onOpenLogin();
              }
            }}
            className="group relative flex flex-col items-center p-5 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800/90 border border-zinc-800 hover:border-[#e83e8c]/60 shadow-lg hover:shadow-[#e83e8c]/20 transition-all duration-300 text-center"
          >
            <div className="w-12 h-12 rounded-xl bg-[#e83e8c]/15 border border-[#e83e8c]/40 flex items-center justify-center text-[#ff85c0] mb-3 group-hover:scale-110 transition-transform">
              <UserCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-white mb-1">Customer Login</h3>
            <p className="text-[11px] text-zinc-400 leading-snug">
              {isAuthenticated ? `Signed in as ${user?.fullName}` : 'Sign in with Mobile & Password to view sarees'}
            </p>
            <span className="mt-3 text-[11px] font-semibold text-[#ff85c0] group-hover:underline flex items-center gap-1">
              <span>{isAuthenticated ? 'Enter Saree Catalog' : 'Sign In'}</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </button>

          {/* Card 2: Admin Panel (Only Admin Can Change Everything) */}
          <button
            id="gateway-admin-panel-btn"
            onClick={onOpenAdmin}
            className="group relative flex flex-col items-center p-5 rounded-2xl bg-gradient-to-b from-amber-950/40 via-zinc-900/90 to-zinc-900/90 hover:from-amber-950/60 border border-[#d4af37]/40 hover:border-[#d4af37] shadow-lg hover:shadow-[#d4af37]/20 transition-all duration-300 text-center"
          >
            <div className="w-12 h-12 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/50 flex items-center justify-center text-[#fce07a] mb-3 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6 text-[#d4af37]" />
            </div>
            <div className="flex items-center gap-1 mb-1">
              <h3 className="font-bold text-sm text-amber-200">Admin Panel</h3>
              <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-[9px] font-bold text-amber-300 uppercase">
                Owner Only
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-snug">
              {isAdminAuthenticated ? 'Admin Dashboard Active' : 'Owner: Edit Sarees, Stock, Prices & Orders'}
            </p>
            <span className="mt-3 text-[11px] font-semibold text-amber-300 group-hover:underline flex items-center gap-1">
              <span>{isAdminAuthenticated ? 'Go to Admin Dashboard' : 'Admin Login'}</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </button>

          {/* Card 3: Register New Account */}
          <button
            id="gateway-register-btn"
            onClick={() => {
              if (isAuthenticated) {
                onEnterStore();
              } else {
                onOpenRegister();
              }
            }}
            className="group relative flex flex-col items-center p-5 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800/90 border border-zinc-800 hover:border-emerald-500/60 shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 text-center"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-110 transition-transform">
              <UserPlus className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-white mb-1">Register Member</h3>
            <p className="text-[11px] text-zinc-400 leading-snug">
              {isAuthenticated ? 'Active Member Account' : 'New customer? Create free account to see sarees'}
            </p>
            <span className="mt-3 text-[11px] font-semibold text-emerald-400 group-hover:underline flex items-center gap-1">
              <span>{isAuthenticated ? 'Browse Sarees' : 'Create Free Account'}</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </button>
        </motion.div>

        {/* 3. Enter Saree Boutique Button (Requires Login/Register) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-6 w-full max-w-2xl"
        >
          {hasAccess ? (
            <button
              id="gateway-enter-store-btn"
              onClick={onEnterStore}
              className="w-full py-4 px-8 rounded-2xl font-black text-sm uppercase tracking-widest bg-gradient-to-r from-[#e83e8c] via-[#d4af37] to-[#e83e8c] text-zinc-950 hover:text-black shadow-xl shadow-amber-950/40 hover:scale-[1.02] active:scale-[0.99] transition-all flex items-center justify-center gap-3 font-cinzel"
            >
              <ShoppingBag className="w-5 h-5 text-black" />
              <span>Enter Boutique &amp; Browse Saree Collections</span>
              <ArrowRight className="w-5 h-5 text-black" />
            </button>
          ) : (
            <div className="space-y-3">
              <button
                id="gateway-signin-to-view-btn"
                onClick={onOpenLogin}
                className="w-full py-4 px-8 rounded-2xl font-black text-sm uppercase tracking-widest bg-gradient-to-r from-[#e83e8c] via-[#d4af37] to-[#e83e8c] text-zinc-950 hover:text-black shadow-xl shadow-amber-950/40 hover:scale-[1.02] active:scale-[0.99] transition-all flex items-center justify-center gap-3 font-cinzel"
              >
                <Lock className="w-5 h-5 text-black" />
                <span>Customer Login to View Saree Collections</span>
                <ArrowRight className="w-5 h-5 text-black" />
              </button>

              <button
                id="gateway-quick-register-link"
                onClick={onOpenRegister}
                className="text-xs text-zinc-400 hover:text-[#fceda6] transition-colors"
              >
                Don't have an account yet? <span className="text-[#d4af37] font-semibold underline">Register here in 30 seconds</span> to view sarees
              </button>
            </div>
          )}

          {/* Quick secondary row: Track Orders & WhatsApp */}
          <div className="mt-5 flex items-center justify-center gap-6 text-xs text-zinc-400">
            <button
              onClick={onOpenOrders}
              className="hover:text-amber-200 flex items-center gap-1.5 transition-colors"
            >
              <Package className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Track Saree Orders</span>
            </button>
            <span>•</span>
            <a
              href="https://wa.me/919030782430"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 flex items-center gap-1.5 transition-colors"
            >
              <WhatsAppIcon className="w-3.5 h-3.5 fill-emerald-400" />
              <span>WhatsApp Boutique Support</span>
            </a>
          </div>
        </motion.div>
      </main>

      {/* Footer copyright */}
      <footer className="relative z-10 py-4 px-4 text-center text-[11px] text-zinc-500 border-t border-zinc-900">
        <p>© {new Date().getFullYear()} MUNNU COLLECTIONS — Pure Silk &amp; Handloom Luxury. All rights reserved.</p>
      </footer>
    </div>
  );
};
