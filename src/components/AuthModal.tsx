import React, { useState } from 'react';
import { X, Lock, Phone, User as UserIcon, ArrowRight, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BrandLogo } from './BrandLogo';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'login' | 'register';
  initialMode?: 'login' | 'register';
  onSwitchMode?: (mode: 'login' | 'register') => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  mode: propMode,
  initialMode = 'login',
  onSwitchMode,
  onSuccess,
}) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(propMode || initialMode);

  // Form State
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Sync mode whenever opened or changed from outside
  React.useEffect(() => {
    if (isOpen) {
      setMode(propMode || initialMode);
      setErrorMessage('');
      setSuccessMessage('');
    }
  }, [isOpen, propMode, initialMode]);

  // Switch mode helper
  const handleSwitchMode = (newMode: 'login' | 'register') => {
    setMode(newMode);
    if (onSwitchMode) onSwitchMode(newMode);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const cleanPhone = mobile.trim().replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (mode === 'register') {
      if (!fullName.trim()) {
        setErrorMessage('Please enter your full name.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Password and Confirm Password do not match.');
        return;
      }

      setLoading(true);
      try {
        await register(fullName, cleanPhone, password, confirmPassword);
        setSuccessMessage('Account registered successfully! Welcome to Munnu Collections.');
        setTimeout(() => {
          if (onSuccess) onSuccess();
          onClose();
        }, 1200);
      } catch (err: any) {
        setErrorMessage(err.message || 'Registration failed. Please check your details.');
      } finally {
        setLoading(false);
      }
    } else {
      if (!password) {
        setErrorMessage('Please enter your password.');
        return;
      }

      setLoading(true);
      try {
        await login(cleanPhone, password);
        setSuccessMessage('Logged in successfully!');
        setTimeout(() => {
          if (onSuccess) onSuccess();
          onClose();
        }, 1000);
      } catch (err: any) {
        setErrorMessage(err.message || 'Invalid mobile number or password.');
      } finally {
        setLoading(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.25 }}
        className="relative w-full max-w-md bg-[#0f0f13] border border-[#d4af37]/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black text-zinc-100 overflow-hidden"
      >
        {/* Decorative corner glows */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-[#e83e8c]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-[#d4af37]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          id="auth-modal-close-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo and Brand Heading */}
        <div className="flex flex-col items-center text-center mb-6 pt-1">
          <BrandLogo size="lg" showQuote align="center" className="mb-2" />
          <p className="text-xs text-zinc-400 mt-2">
            {mode === 'login' ? 'Welcome back! Sign in to access your saved sarees and orders.' : 'Create an account to experience bespoke luxury shopping.'}
          </p>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 p-1 bg-zinc-900/90 border border-zinc-800 rounded-xl mb-6">
          <button
            id="tab-login-btn"
            type="button"
            onClick={() => handleSwitchMode('login')}
            className={`py-2 text-sm font-semibold rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-gradient-to-r from-[#d4af37] to-[#b38b1f] text-black shadow-md'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Customer Login
          </button>
          <button
            id="tab-register-btn"
            type="button"
            onClick={() => handleSwitchMode('register')}
            className={`py-2 text-sm font-semibold rounded-lg transition-all ${
              mode === 'register'
                ? 'bg-gradient-to-r from-[#e83e8c] to-[#c2185b] text-white shadow-md'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            New Customer
          </button>
        </div>

        {/* Messages */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-start gap-2.5 p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs sm:text-sm mb-4"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" />
              <div>
                <span>{errorMessage}</span>
                {errorMessage.includes('already registered') && (
                  <button
                    type="button"
                    onClick={() => handleSwitchMode('login')}
                    className="block text-[#d4af37] font-semibold underline mt-1 text-xs"
                  >
                    Click here to Login
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm mb-4"
            >
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
              <span>{successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                Full Name <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  id="auth-fullname-input"
                  type="text"
                  required
                  placeholder="e.g. Sravanthi Reddy"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-zinc-900/90 border border-zinc-800 focus:border-[#d4af37] rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
              Mobile Number <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                id="auth-mobile-input"
                type="tel"
                required
                maxLength={10}
                placeholder="10-digit mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-zinc-900/90 border border-zinc-800 focus:border-[#d4af37] rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
              Password <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                id="auth-password-input"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-900/90 border border-zinc-800 focus:border-[#d4af37] rounded-xl pl-10 pr-10 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                Confirm Password <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  id="auth-confirm-password-input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-zinc-900/90 border border-zinc-800 focus:border-[#d4af37] rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

          <button
            id="auth-submit-btn"
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all mt-6 ${
              mode === 'login'
                ? 'bg-gradient-to-r from-[#d4af37] via-[#f1d06e] to-[#b38b1f] text-black hover:brightness-110 shadow-lg shadow-[#d4af37]/20'
                : 'bg-gradient-to-r from-[#e83e8c] via-[#ff6b9d] to-[#c2185b] text-white hover:brightness-110 shadow-lg shadow-[#e83e8c]/20'
            }`}
          >
            {loading ? (
              <span className="inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Hint */}
        <div className="mt-6 pt-4 border-t border-zinc-800/80 text-center">
          <p className="text-[11px] text-zinc-400">
            {mode === 'login' ? (
              <>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => handleSwitchMode('register')}
                  className="text-[#e83e8c] font-semibold hover:underline"
                >
                  Register Now
                </button>
              </>
            ) : (
              <>
                Already registered with Munnu Collections?{' '}
                <button
                  type="button"
                  onClick={() => handleSwitchMode('login')}
                  className="text-[#d4af37] font-semibold hover:underline"
                >
                  Log In
                </button>
              </>
            )}
          </p>
        </div>
      </motion.div>
    </div>
  );
};
