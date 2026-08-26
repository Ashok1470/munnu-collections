import React, { createContext, useContext, useState, useEffect } from 'react';
import { StoreBranding } from '../types';
import { api } from '../services/api';

const DEFAULT_BRANDING: StoreBranding = {
  brandName: 'MUNNU',
  brandSubname: 'COLLECTIONS',
  tagline: 'Exclusive Saree Boutique',
  quote: '“Style Speaks Louder Than Words”',
  logoUrl: '/munnu-logo.svg',
  logoShape: 'circle',
  logoGlow: true,
  contactPhone: '+91 9030782430',
  whatsappNumber: '+91 9030782430',
};

interface BrandingContextType {
  branding: StoreBranding;
  loading: boolean;
  updateBranding: (newBranding: Partial<StoreBranding>) => Promise<void>;
  updateLogo: (logoUrlOrDataUri: string, shape?: 'circle' | 'rounded' | 'square') => Promise<void>;
  resetLogo: () => Promise<void>;
  refreshBranding: () => Promise<void>;
}

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

export const BrandingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [branding, setBranding] = useState<StoreBranding>(DEFAULT_BRANDING);
  const [loading, setLoading] = useState(true);

  const fetchBranding = async () => {
    try {
      setLoading(true);
      const data = await api.getBranding();
      if (data) {
        setBranding({ ...DEFAULT_BRANDING, ...data });
      }
    } catch (err) {
      console.warn('Failed to load store branding, using defaults:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranding();

    // Listen for live SSE branding updates if available
    const eventSource = new EventSource('/api/admin/notifications/stream');
    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === 'BRANDING_UPDATED' && payload.data) {
          setBranding((prev) => ({ ...prev, ...payload.data }));
        }
      } catch (e) {
        // Ignore non-json messages
      }
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const getAdminToken = () => {
    return localStorage.getItem('munnu_admin_token') || undefined;
  };

  const updateBranding = async (newBranding: Partial<StoreBranding>) => {
    const updated = { ...branding, ...newBranding };
    setBranding(updated);
    await api.saveBranding(updated, getAdminToken());
  };

  const updateLogo = async (logoUrlOrDataUri: string, shape: 'circle' | 'rounded' | 'square' = branding.logoShape || 'circle') => {
    const updated: StoreBranding = {
      ...branding,
      logoUrl: logoUrlOrDataUri,
      logoShape: shape,
    };
    setBranding(updated);
    await api.saveBranding(updated, getAdminToken());
  };

  const resetLogo = async () => {
    const updated: StoreBranding = {
      ...branding,
      logoUrl: '',
    };
    setBranding(updated);
    await api.saveBranding(updated, getAdminToken());
  };

  return (
    <BrandingContext.Provider
      value={{
        branding,
        loading,
        updateBranding,
        updateLogo,
        resetLogo,
        refreshBranding: fetchBranding,
      }}
    >
      {children}
    </BrandingContext.Provider>
  );
};

export const useBranding = () => {
  const context = useContext(BrandingContext);
  if (!context) {
    throw new Error('useBranding must be used within a BrandingProvider');
  }
  return context;
};
