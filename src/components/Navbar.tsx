import React, { useState } from 'react';
import { ShoppingBag, User, LogOut, Menu, X, ShieldCheck, Search, Package, Palette } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { WhatsAppIcon } from './WhatsAppIcon';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useBranding } from '../context/BrandingContext';

interface NavbarProps {
  onOpenAuth: (mode: 'login' | 'register') => void;
  onOpenOrders: () => void;
  onOpenAdmin: () => void;
  onOpenGateway?: () => void;
  onSearchChange?: (val: string) => void;
  searchValue?: string;
  selectedCategory?: string;
  onSelectCategory?: (cat: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  onOpenOrders,
  onOpenAdmin,
  onOpenGateway,
  onSearchChange,
  searchValue = '',
  selectedCategory = 'All',
  onSelectCategory,
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems, toggleCart } = useCart();
  const { isAdminAuthenticated } = useAdminAuth();
  const { branding } = useBranding();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const categories = [
    'All',
    'Silk Sarees',
    'Pattu Sarees',
    'Cotton Sarees',
    'Designer Sarees',
    'Luxury Handbags',
    'Bridal Clutches & Potlis',
    'Sling & Shoulder Bags',
    'Tote Bags',
    'Bridal Jewellery Sets',
    'Necklaces & Chokers',
    'Earrings & Jhumkas',
    'Bangles & Kadas',
    'Temple & Kundan Jewellery',
    'New Arrivals',
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0c0c10]/95 backdrop-blur-md border-b border-zinc-800/80">
      {/* Top micro banner */}
      <div className="bg-gradient-to-r from-zinc-950 via-[#18140c] to-zinc-950 border-b border-[#d4af37]/20 py-1.5 px-4 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px]">
          <p className="font-serif-luxury italic text-[#fceda6] hidden sm:block tracking-wider mx-auto sm:mx-0">
            {branding?.quote || '“Style Speaks Louder Than Words”'} — {branding?.tagline || 'Handcrafted Luxury Sarees, Handbags & Royal Jewellery'}
          </p>
          <div className="flex items-center gap-4 mx-auto sm:mx-0">
            <a
              href={`https://wa.me/${(branding?.whatsappNumber || '9030782430').replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 font-medium transition-colors"
              title="Chat on WhatsApp"
            >
              <WhatsAppIcon className="w-3.5 h-3.5 fill-emerald-400" />
              <span>WhatsApp Chat</span>
            </a>
            <button
              id="top-admin-portal-link"
              onClick={onOpenAdmin}
              className="text-xs text-amber-300/80 hover:text-amber-200 flex items-center gap-1 font-medium hover:underline"
            >
              <ShieldCheck className="w-3 h-3 text-[#d4af37]" />
              <span>{isAdminAuthenticated ? 'Admin Dashboard' : 'Admin Login'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Brand Logo (with tooltip & quick customizer) */}
          <div
            className="cursor-pointer flex items-center gap-2 group"
            onClick={() => {
              if (onOpenGateway) {
                onOpenGateway();
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            title="Munnu Collections Home & Welcome Portal"
          >
            <BrandLogo size="md" showQuote={false} />
          </div>


          {/* Desktop Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                id="desktop-search-input"
                type="text"
                placeholder="Search Sarees, Designer Handbags, Bridal Jewellery..."
                value={searchValue}
                onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                className="w-full bg-zinc-900/90 border border-zinc-800 focus:border-[#d4af37] rounded-full pl-10 pr-4 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Actions & Customer Profile */}
          <div className="flex items-center gap-3">
            {/* My Orders Button */}
            <button
              id="nav-my-orders-btn"
              onClick={onOpenOrders}
              className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-zinc-300 hover:text-[#fceda6] px-3 py-2 rounded-xl hover:bg-zinc-900 transition-colors"
            >
              <Package className="w-4 h-4 text-[#d4af37]" />
              <span>My Orders</span>
            </button>

            {/* Shopping Cart Button */}
            <button
              id="nav-cart-btn"
              onClick={toggleCart}
              className="relative p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 hover:border-[#d4af37]/60 text-zinc-200 hover:text-white transition-all shadow-md"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-[#d4af37]" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-[#e83e8c] to-[#c2185b] text-[10px] font-bold text-white shadow-lg animate-bounce">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Customer Account Button / Dropdown */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  id="nav-user-profile-btn"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-2 px-3 rounded-xl bg-zinc-900 border border-[#d4af37]/30 text-xs font-semibold text-zinc-200 hover:border-[#d4af37]"
                >
                  <div className="w-6 h-6 rounded-full bg-[#d4af37] text-black font-black flex items-center justify-center text-[10px]">
                    {user?.fullName?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden sm:inline max-w-[100px] truncate">{user?.fullName}</span>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#0f0f14] border border-zinc-800 rounded-2xl p-2 shadow-2xl z-50 space-y-1">
                    <div className="px-3 py-2 border-b border-zinc-800">
                      <p className="text-xs font-bold text-zinc-100">{user?.fullName}</p>
                      <p className="text-[10px] text-zinc-400">{user?.mobile}</p>
                    </div>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenOrders();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-xl"
                    >
                      <Package className="w-4 h-4 text-[#d4af37]" />
                      <span>Order History</span>
                    </button>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                        if (onOpenGateway) onOpenGateway();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-950/40 rounded-xl font-semibold"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="nav-login-btn"
                  onClick={() => onOpenAuth('login')}
                  className="py-2 px-3.5 rounded-xl text-xs font-bold text-zinc-200 hover:text-white hover:bg-zinc-900 transition-colors"
                >
                  Sign In
                </button>
                <button
                  id="nav-register-btn"
                  onClick={() => onOpenAuth('register')}
                  className="hidden sm:inline-flex py-2 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-[#d4af37] to-[#aa820a] hover:brightness-110 text-black shadow-md shadow-[#d4af37]/20 uppercase tracking-wider transition-all"
                >
                  Register
                </button>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden text-zinc-300 hover:text-white"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search & Categories bar */}
        <div className="lg:hidden pb-3">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search Sarees, Handbags & Jewellery..."
              value={searchValue}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#d4af37] rounded-full pl-10 pr-4 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Category Pills Strip */}
        <div className="flex items-center gap-2 overflow-x-auto py-2.5 border-t border-zinc-800/80 scrollbar-none text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory && onSelectCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#b38b1f] text-black font-bold shadow-sm'
                  : 'bg-zinc-900/80 text-zinc-300 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Slide Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-zinc-950 border-b border-zinc-800 p-5 space-y-4">
          <div className="space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenOrders();
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-zinc-900 text-xs font-semibold text-zinc-200"
            >
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-[#d4af37]" />
                <span>My Orders History</span>
              </div>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-zinc-900 text-xs font-semibold text-amber-200"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
                <span>Admin Management Panel</span>
              </div>
            </button>
          </div>

          {!isAuthenticated ? (
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth('login');
                }}
                className="py-2.5 text-center rounded-xl bg-zinc-900 text-xs font-bold text-zinc-200"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth('register');
                }}
                className="py-2.5 text-center rounded-xl bg-[#d4af37] text-xs font-bold text-black uppercase"
              >
                Register
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                logout();
                if (onOpenGateway) onOpenGateway();
              }}
              className="w-full py-2.5 text-center rounded-xl bg-rose-950/40 text-rose-300 border border-rose-500/30 text-xs font-semibold"
            >
              Sign Out ({user?.fullName})
            </button>
          )}
        </div>
      )}
    </header>
  );
};
