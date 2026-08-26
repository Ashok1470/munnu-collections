import React, { useState, useRef } from 'react';
import { useBranding } from '../../context/BrandingContext';
import { BrandLogo } from '../BrandLogo';
import {
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Trash2,
  Sliders,
  ExternalLink,
  ShieldCheck,
  Palette,
  Eye,
} from 'lucide-react';

interface AdminBrandingProps {
  onCloseModal?: () => void;
}

export const AdminBranding: React.FC<AdminBrandingProps> = ({ onCloseModal }) => {
  const { branding, updateBranding, updateLogo, resetLogo } = useBranding();

  const [brandName, setBrandName] = useState(branding.brandName || 'MUNNU');
  const [brandSubname, setBrandSubname] = useState(branding.brandSubname || 'COLLECTIONS');
  const [tagline, setTagline] = useState(branding.tagline || 'Exclusive Saree Boutique');
  const [quote, setQuote] = useState(branding.quote || '“Style Speaks Louder Than Words”');
  const [logoUrl, setLogoUrl] = useState(branding.logoUrl || '');
  const [logoShape, setLogoShape] = useState<'circle' | 'rounded' | 'square'>(branding.logoShape || 'circle');
  const [logoGlow, setLogoGlow] = useState<boolean>(branding.logoGlow !== false);

  const [previewImage, setPreviewImage] = useState<string>(branding.logoUrl || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const shapeClass =
    logoShape === 'circle'
      ? 'rounded-full'
      : logoShape === 'square'
      ? 'rounded-md'
      : 'rounded-2xl';

  const fileInputRef = useRef<HTMLInputElement | null>(null);


  // Official Brand Logo Option
  const PRESET_LOGOS = [
    {
      id: 'official-uploaded',
      name: 'Official Munnu Luxury Gold & Pink Emblem Vector',
      url: '/munnu-logo.svg',
      shape: 'circle' as const,
    },
  ];

  // Handle local file upload (converts to Base64 Data URI)
  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, WebP, SVG).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setPreviewImage(result);
        setLogoUrl(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await updateBranding({
        brandName: brandName.trim(),
        brandSubname: brandSubname.trim(),
        tagline: tagline.trim(),
        quote: quote.trim(),
        logoUrl: previewImage,
        logoShape,
        logoGlow,
      });

      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        if (onCloseModal) onCloseModal();
      }, 1500);
    } catch (err) {
      console.error('Failed to save branding:', err);
      alert('Failed to save store logo. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefault = async () => {
    if (window.confirm('Reset logo to the default handcrafted Munnu Collections royal vector emblem?')) {
      setPreviewImage('');
      setLogoUrl('');
      setLogoShape('circle');
      await resetLogo();
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Palette className="w-4 h-4 text-[#d4af37]" />
            <span className="text-xs uppercase tracking-widest text-[#e83e8c] font-bold">
              Brand Identity & Logo
            </span>
          </div>
          <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white">
            Store Logo & Branding Studio
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Upload your custom logo image or change the store's luxury emblem and signature typography.
          </p>
        </div>

        {saveSuccess && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold animate-pulse">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Logo & Branding Saved Live!</span>
          </div>
        )}
      </div>

      {/* Live Preview Panel */}
      <div className="rounded-2xl bg-gradient-to-r from-zinc-950 via-[#131118] to-zinc-950 border border-[#d4af37]/30 p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Eye className="w-4 h-4 text-[#d4af37]" />
              <span className="text-xs uppercase tracking-widest text-amber-300 font-bold">
                Real-Time Live Store Preview
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              This is how your brand logo will appear to customers in the Navbar, mobile app bar, checkout, and footer.
            </p>
          </div>

          {/* Rendered Live Brand Logos */}
          <div className="flex flex-wrap items-center justify-center gap-6 p-4 rounded-xl bg-black/60 border border-zinc-800">
            {/* Full size */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Navbar / Header</span>
              <BrandLogo size="md" customLogoUrl={previewImage} showQuote={false} />
            </div>

            <div className="h-10 w-[1px] bg-zinc-800 hidden sm:block" />

            {/* With Quote */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Footer / Welcome</span>
              <BrandLogo size="lg" customLogoUrl={previewImage} showQuote={true} />
            </div>

            <div className="h-10 w-[1px] bg-zinc-800 hidden sm:block" />

            {/* Badge Icon */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Mobile Icon</span>
              <BrandLogo size="md" variant="badge" customLogoUrl={previewImage} />
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Step 1: Upload Your Image */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-luxury text-lg font-bold text-white flex items-center gap-2">
              <Upload className="w-5 h-5 text-[#d4af37]" />
              <span>1. Upload Logo Picture</span>
            </h3>
            {previewImage && (
              <button
                type="button"
                onClick={handleResetToDefault}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-medium hover:underline"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Custom Picture</span>
              </button>
            )}
          </div>

          {/* Drag & Drop Box */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer rounded-2xl border-2 border-dashed transition-all p-8 flex flex-col items-center justify-center text-center gap-4 ${
              dragOver
                ? 'border-[#d4af37] bg-[#d4af37]/10'
                : previewImage
                ? 'border-zinc-700 bg-zinc-950/80 hover:border-[#d4af37]/70'
                : 'border-zinc-800 bg-zinc-950 hover:border-zinc-600'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileInputChange}
            />

            {previewImage ? (
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className={`w-24 h-24 overflow-hidden ${shapeClass} p-1 border-2 border-[#d4af37] shadow-xl bg-black`}>
                  <img
                    src={previewImage}
                    alt="Logo Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center sm:text-left space-y-1">
                  <p className="text-sm font-bold text-zinc-100 flex items-center justify-center sm:justify-start gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Custom Picture Loaded
                  </p>
                  <p className="text-xs text-zinc-400">Click or drag a new image here to replace.</p>
                  <span className="inline-block mt-2 px-3 py-1 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs font-semibold text-zinc-200">
                    Change Picture
                  </span>
                </div>
              </div>
            ) : (
              <>
                <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#d4af37] shadow-lg">
                  <Upload className="w-7 h-7 animate-bounce" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-zinc-200">
                    Click to browse or Drag & Drop your logo picture here
                  </p>
                  <p className="text-xs text-zinc-500">
                    Supports PNG, JPG, JPEG, SVG, WebP (Transparent PNG recommended)
                  </p>
                </div>
                <button
                  type="button"
                  className="py-2 px-5 rounded-xl text-xs font-bold bg-[#d4af37] hover:bg-[#c29d2b] text-black transition-all shadow-md shadow-[#d4af37]/20 uppercase tracking-wider"
                >
                  Choose Picture from Computer / Phone
                </button>
              </>
            )}
          </div>

          {/* Or Paste Image URL */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-semibold text-zinc-400">
              Or Paste an Image Web URL:
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://example.com/my-saree-logo.png"
                value={logoUrl.startsWith('data:') ? '' : logoUrl}
                onChange={(e) => {
                  setLogoUrl(e.target.value);
                  setPreviewImage(e.target.value);
                }}
                className="flex-1 bg-zinc-950 border border-zinc-800 focus:border-[#d4af37] rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:outline-none"
              />
              {logoUrl && (
                <button
                  type="button"
                  onClick={() => {
                    setLogoUrl('');
                    setPreviewImage('');
                  }}
                  className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Step 2: Framing & Shape Customization */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-5">
          <h3 className="font-serif-luxury text-lg font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#d4af37]" />
            <span>2. Logo Framing & Shape</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => setLogoShape('circle')}
              className={`p-4 rounded-xl border text-center transition-all flex flex-col items-center gap-2 ${
                logoShape === 'circle'
                  ? 'border-[#d4af37] bg-[#d4af37]/10 shadow-lg shadow-[#d4af37]/10'
                  : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
              }`}
            >
              <div className="w-10 h-10 rounded-full border-2 border-[#d4af37] bg-zinc-900 flex items-center justify-center text-xs font-bold text-[#d4af37]">
                O
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-200">Royal Circle</p>
                <p className="text-[10px] text-zinc-500">Traditional round medallion</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setLogoShape('rounded')}
              className={`p-4 rounded-xl border text-center transition-all flex flex-col items-center gap-2 ${
                logoShape === 'rounded'
                  ? 'border-[#d4af37] bg-[#d4af37]/10 shadow-lg shadow-[#d4af37]/10'
                  : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
              }`}
            >
              <div className="w-10 h-10 rounded-2xl border-2 border-[#d4af37] bg-zinc-900 flex items-center justify-center text-xs font-bold text-[#d4af37]">
                [ ]
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-200">Smooth Rounded</p>
                <p className="text-[10px] text-zinc-500">Luxury modern curved frame</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setLogoShape('square')}
              className={`p-4 rounded-xl border text-center transition-all flex flex-col items-center gap-2 ${
                logoShape === 'square'
                  ? 'border-[#d4af37] bg-[#d4af37]/10 shadow-lg shadow-[#d4af37]/10'
                  : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
              }`}
            >
              <div className="w-10 h-10 rounded-md border-2 border-[#d4af37] bg-zinc-900 flex items-center justify-center text-xs font-bold text-[#d4af37]">
                #
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-200">Modern Square</p>
                <p className="text-[10px] text-zinc-500">Sharp boutique aesthetic</p>
              </div>
            </button>
          </div>
        </div>

        {/* Step 3: Brand Text & Typography */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-5">
          <h3 className="font-serif-luxury text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#d4af37]" />
            <span>3. Brand Name & Signature Quote</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400">
                Primary Brand Title (Gold Accent):
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="MUNNU"
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#d4af37] rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400">
                Secondary Brand Title (Pink Accent):
              </label>
              <input
                type="text"
                value={brandSubname}
                onChange={(e) => setBrandSubname(e.target.value)}
                placeholder="COLLECTIONS"
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#d4af37] rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-zinc-400">
                Signature Boutique Quote:
              </label>
              <input
                type="text"
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                placeholder="“Style Speaks Louder Than Words”"
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#d4af37] rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-zinc-400">
                Tagline / Subtext:
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Exclusive Saree Boutique"
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#d4af37] rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-zinc-800">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="w-full sm:w-auto py-3 px-6 rounded-xl font-bold text-xs bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 transition-all uppercase tracking-wider"
          >
            Reset to Default Vector Logo
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto py-3.5 px-8 rounded-xl font-bold text-xs bg-gradient-to-r from-[#d4af37] via-[#f1cf68] to-[#aa820a] hover:from-[#c29d2b] hover:to-[#916b09] text-black shadow-lg shadow-[#d4af37]/30 transition-all uppercase tracking-wider flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Applying Logo to Store...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Save & Apply Logo Live</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
