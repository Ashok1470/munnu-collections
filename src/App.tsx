import React, { useState, useEffect } from 'react';
import {
  AuthProvider,
  useAuth,
} from './context/AuthContext';
import {
  CartProvider,
  useCart,
} from './context/CartContext';
import {
  AdminAuthProvider,
  useAdminAuth,
} from './context/AdminAuthContext';
import {
  BrandingProvider,
} from './context/BrandingContext';

import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AuthModal } from './components/AuthModal';
import { MyOrdersModal } from './components/MyOrdersModal';
import { WhatsAppSupportButton } from './components/WhatsAppSupportButton';
import { Footer } from './components/Footer';
import { WhatsAppIcon } from './components/WhatsAppIcon';
import { WelcomeGateway } from './components/WelcomeGateway';

// Admin Components
import { AdminLayout } from './components/AdminPanel/AdminLayout';
import { AdminLoginModal } from './components/AdminPanel/AdminLoginModal';
import { AdminLiveOrderAlertBanner } from './components/AdminPanel/AdminNotifications';


import { Product, ProductCategory, DepartmentType } from './types';
import { api } from './services/api';
import {
  Filter,
  Sparkles,
  ArrowUpDown,
  Search,
  CheckCircle2,
  Package,
  Layers,
} from 'lucide-react';
import { getProductDepartment, getDepartmentLabel, ALL_CATEGORIES } from './utils/productHelpers';

const CATEGORIES: Array<'All' | ProductCategory> = [
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

function StoreContent() {
  const { user, isAuthenticated } = useAuth();
  const { isCartOpen, setIsCartOpen } = useCart();
  const { isAdminAuthenticated } = useAdminAuth();

  // Mode: gateway (logo first with login, admin panel, register), customer store, or admin layout view
  const [viewMode, setViewMode] = useState<'gateway' | 'store' | 'admin'>('gateway');

  // Product Catalog State
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'newest'>('featured');

  // Modals State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'login' | 'register' }>({
    isOpen: false,
    mode: 'login',
  });
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [checkoutState, setCheckoutState] = useState<{
    isOpen: boolean;
    directBuyItem: { product: Product; quantity: number } | null;
  }>({
    isOpen: false,
    directBuyItem: null,
  });

  // Guard: Only registered customers and authenticated admin can see the sarees
  useEffect(() => {
    if (!isAuthenticated && !isAdminAuthenticated && viewMode === 'store') {
      setViewMode('gateway');
    }
  }, [isAuthenticated, isAdminAuthenticated, viewMode]);

  // Load products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.getProducts({
        category: selectedCategory === 'All' ? undefined : selectedCategory,
        search: searchQuery || undefined,
      });
      setProducts(res.products);
    } catch (err) {
      console.error('Failed to load sarees', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery]);

  // Sorting
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  const handleQuickBuy = (product: Product) => {
    setCheckoutState({
      isOpen: true,
      directBuyItem: { product, quantity: 1 },
    });
  };

  const handleCheckoutFromCart = () => {
    setIsCartOpen(false);
    setCheckoutState({
      isOpen: true,
      directBuyItem: null,
    });
  };

  const handleOpenAdminPortal = () => {
    if (isAdminAuthenticated) {
      setViewMode('admin');
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const handleEnterStore = () => {
    if (isAuthenticated || isAdminAuthenticated) {
      setViewMode('store');
    } else {
      setAuthModal({ isOpen: true, mode: 'login' });
    }
  };

  // If viewing admin portal
  if (viewMode === 'admin' && isAdminAuthenticated) {
    return (
      <>
        <AdminLiveOrderAlertBanner />
        <AdminLayout onBackToStore={() => setViewMode('store')} />
      </>
    );
  }

  // If viewing initial welcome gateway (Logo comes first, then Login, Admin Panel, Register)
  if (viewMode === 'gateway') {
    return (
      <>
        {isAdminAuthenticated && <AdminLiveOrderAlertBanner />}
        <WelcomeGateway
          onEnterStore={handleEnterStore}
          onOpenLogin={() => setAuthModal({ isOpen: true, mode: 'login' })}
          onOpenRegister={() => setAuthModal({ isOpen: true, mode: 'register' })}
          onOpenAdmin={handleOpenAdminPortal}
          onOpenOrders={() => setIsOrdersModalOpen(true)}
        />

        {/* Customer Login / Register Auth Modal */}
        <AuthModal
          isOpen={authModal.isOpen}
          mode={authModal.mode}
          onClose={() => setAuthModal({ isOpen: false, mode: 'login' })}
          onSwitchMode={(mode) => setAuthModal({ isOpen: true, mode })}
          onSuccess={() => {
            setViewMode('store');
          }}
        />

        {/* Customer Order History Modal */}
        <MyOrdersModal
          isOpen={isOrdersModalOpen}
          onClose={() => setIsOrdersModalOpen(false)}
        />

        {/* Admin Login Modal */}
        <AdminLoginModal
          isOpen={isAdminLoginOpen}
          onClose={() => setIsAdminLoginOpen(false)}
          onSuccess={() => {
            setViewMode('admin');
          }}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-zinc-100 flex flex-col font-sans selection:bg-[#d4af37]/30 selection:text-[#fceda6]">
      {/* Live Admin Alert Banner (if admin is logged in and browsing store) */}
      {isAdminAuthenticated && <AdminLiveOrderAlertBanner />}

      {/* Header & Navigation */}
      <Navbar
        onOpenAuth={(mode) => setAuthModal({ isOpen: true, mode })}
        onOpenOrders={() => setIsOrdersModalOpen(true)}
        onOpenAdmin={handleOpenAdminPortal}
        onOpenGateway={() => setViewMode('gateway')}
        searchValue={searchQuery}
        onSearchChange={(val) => setSearchQuery(val)}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
      />


      {/* Hero Welcome Showcase */}
      <HeroSection
        onExploreClick={() => {
          const catalogEl = document.getElementById('saree-catalog-section');
          if (catalogEl) {
            catalogEl.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          const catalogEl = document.getElementById('saree-catalog-section');
          if (catalogEl) {
            catalogEl.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />

      {/* Main Catalog Section */}
      <main id="saree-catalog-section" className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        {/* Section Title & Filter Toolbar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-800 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-[#d4af37]" />
              <span className="text-xs uppercase tracking-widest text-[#e83e8c] font-bold">
                {selectedCategory === 'All'
                  ? 'Luxury Sarees • Handbags • Royal Jewellery'
                  : getDepartmentLabel(getProductDepartment(selectedCategory))}
              </span>
            </div>
            <h2 className="font-serif-luxury text-2xl sm:text-4xl font-bold text-white">
              {selectedCategory === 'All' ? 'Boutique Luxury Collections' : selectedCategory}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Showing {sortedProducts.length} handcrafted festive sarees, designer handbags & royal jewellery items
            </p>
          </div>

          {/* Sort Controls & Department Selector */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="text-zinc-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-zinc-200 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="featured" className="bg-zinc-900 text-zinc-200">Featured & Popular</option>
                <option value="price-low" className="bg-zinc-900 text-zinc-200">Price: Low to High</option>
                <option value="price-high" className="bg-zinc-900 text-zinc-200">Price: High to Low</option>
                <option value="newest" className="bg-zinc-900 text-zinc-200">New Arrivals</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quick Department Switcher Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { label: '✨ All Collections', filter: 'All' },
            { label: '🥻 Silk & Designer Sarees', filter: 'Silk Sarees' },
            { label: '👜 Handbags & Clutches', filter: 'Luxury Handbags' },
            { label: '💎 Royal & Bridal Jewellery', filter: 'Bridal Jewellery Sets' },
            { label: '🔥 New Arrivals', filter: 'New Arrivals' },
          ].map((tab) => (
            <button
              key={tab.label}
              onClick={() => setSelectedCategory(tab.filter)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === tab.filter
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#aa820a] text-black shadow-md shadow-[#d4af37]/20'
                  : 'bg-zinc-900/90 text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-10 h-10 border-3 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
            <p className="font-serif-luxury italic text-[#fceda6] text-sm">
              Loading luxury collection from Munnu Collections...
            </p>
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="text-center py-20 bg-[#121216]/60 border border-zinc-800 rounded-3xl p-8 space-y-4 max-w-md mx-auto">
            <Package className="w-12 h-12 text-zinc-600 mx-auto" />
            <h3 className="font-serif-luxury text-xl font-bold text-zinc-200">No Products Found</h3>
            <p className="text-xs text-zinc-400">
              No items match "{searchQuery || selectedCategory}". Try clearing your search or switching categories.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="py-2 px-5 rounded-xl text-xs font-bold bg-[#d4af37] text-black uppercase tracking-wider"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={(p) => setSelectedProduct(p)}
                onQuickBuy={(p) => handleQuickBuy(p)}
              />
            ))}
          </div>
        )}

        {/* Boutique Quality Assurance Banner */}
        <div className="mt-16 rounded-3xl bg-gradient-to-r from-zinc-950 via-[#18140c] to-zinc-950 border border-[#d4af37]/40 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="space-y-2 max-w-xl">
              <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">
                Authentic Craftsmanship & Elegance
              </span>
              <h3 className="font-cinzel text-2xl sm:text-3xl font-black text-white">
                Sarees, Handbags & Royal Jewellery
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300">
                Pure handloom silk sarees, exquisitely embroidered bridal clutches & handbags, certified gold-plated kundan jewellery, and direct WhatsApp personal shopping.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <a
                href="https://wa.me/919030782430?text=Hello%20Munnu%20Collections%2C%20I%20would%20like%20to%20know%20more%20about%20your%20Sarees%2C%20Handbags%20and%20Jewellery."
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-6 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/40 uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2"
              >
                <WhatsAppIcon className="w-4 h-4 fill-white" />
                <span>Chat on WhatsApp</span>
              </a>
              <button
                onClick={() => setIsOrdersModalOpen(true)}
                className="py-3 px-6 rounded-xl font-bold text-xs bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 uppercase tracking-wider transition-all whitespace-nowrap"
              >
                Track Previous Order
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          const catalogEl = document.getElementById('saree-catalog-section');
          if (catalogEl) {
            catalogEl.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        onOpenAdmin={handleOpenAdminPortal}
        onOpenOrders={() => setIsOrdersModalOpen(true)}
        onOpenGateway={() => {
          setViewMode('gateway');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Floating WhatsApp Support Button */}
      <WhatsAppSupportButton />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        onBuyNow={(product, qty) => {
          setSelectedProduct(null);
          setCheckoutState({
            isOpen: true,
            directBuyItem: { product, quantity: qty },
          });
        }}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToCheckout={handleCheckoutFromCart}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={checkoutState.isOpen}
        onClose={() => setCheckoutState({ isOpen: false, directBuyItem: null })}
        directBuyItem={checkoutState.directBuyItem}
        onOrderSuccess={(order) => {
          console.log('Order successfully placed:', order);
        }}
      />

      {/* Customer Login / Register Auth Modal */}
      <AuthModal
        isOpen={authModal.isOpen}
        mode={authModal.mode}
        onClose={() => setAuthModal({ isOpen: false, mode: 'login' })}
        onSwitchMode={(mode) => setAuthModal({ isOpen: true, mode })}
        onSuccess={() => {
          setViewMode('store');
        }}
      />

      {/* Customer Order History Modal */}
      <MyOrdersModal
        isOpen={isOrdersModalOpen}
        onClose={() => setIsOrdersModalOpen(false)}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={() => {
          setViewMode('admin');
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <BrandingProvider>
      <AuthProvider>
        <CartProvider>
          <AdminAuthProvider>
            <StoreContent />
          </AdminAuthProvider>
        </CartProvider>
      </AuthProvider>
    </BrandingProvider>
  );
}

