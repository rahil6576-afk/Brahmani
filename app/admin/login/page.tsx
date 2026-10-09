'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, Lock, User, ArrowRight, CheckCircle2, AlertCircle, KeyRound, Sparkles, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

export default function AdminLoginPage() {
  const router = useRouter();
  const { theme, isNight, toggleTheme } = useTheme();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Check if already authenticated
    try {
      const token = localStorage.getItem('brahmani_admin_auth');
      if (token === 'authenticated') {
        router.replace('/admin');
      }
    } catch {}
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
        localStorage.setItem('brahmani_admin_auth', 'authenticated');
        localStorage.setItem('brahmani_admin_user', JSON.stringify(data.user));
        setTimeout(() => {
          router.replace('/admin');
        }, 300);
      } else {
        setError(data.error || 'Invalid credentials. Please verify your details.');
      }
    } catch {
      // Fallback local check
      if (
        (username === 'admin' || username === 'brahmani') &&
        (password === 'admin123' || password === 'brahmani' || password === 'admin@2025')
      ) {
        setSuccess(true);
        localStorage.setItem('brahmani_admin_auth', 'authenticated');
        setTimeout(() => {
          router.replace('/admin');
        }, 300);
      } else {
        setError('Authentication server error. Check credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setUsername('admin');
    setPassword('admin123');
    setError('');
  };

  return (
    <div
      className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-white)] flex items-center justify-center p-4 relative overflow-hidden font-segoe-admin transition-colors duration-300"
      style={{
        fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif",
        fontWeight: 400,
      }}
    >
      {/* Top Bar Navigation / Theme Toggle */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <button
          onClick={toggleTheme}
          type="button"
          title={`Switch to ${isNight ? 'Day' : 'Night'} Mode`}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 border text-xs font-mono font-semibold transition-all cursor-pointer ${
            isNight
              ? 'bg-[#141C25]/90 hover:bg-[#1C2734] border-[#243242] text-[#FFC107]'
              : 'bg-[#EDECE6]/90 hover:bg-[#E2E0D8] border-[#D5D2C7] text-[#9E7400]'
          }`}
        >
          {isNight ? (
            <>
              <Sun className="w-3.5 h-3.5 text-[#FFC107]" />
              <span>DAY MODE</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-[#11161A]" />
              <span>NIGHT MODE</span>
            </>
          )}
        </button>

        <Link
          href="/"
          className={`inline-flex items-center gap-1 px-3 py-1.5 border text-xs font-mono transition-all ${
            isNight
              ? 'bg-[#141C25]/90 hover:bg-[#1C2734] border-[#243242] text-[#8A97A6] hover:text-white'
              : 'bg-[#EDECE6]/90 hover:bg-[#E2E0D8] border-[#D5D2C7] text-[#4F5A67] hover:text-[#11161A]'
          }`}
        >
          <span>RETURN TO SITE</span>
        </Link>
      </div>

      {/* Background Engineering Grids & Glowing Accents */}
      <div className="absolute inset-0 bg-tech-grid opacity-20 pointer-events-none" />
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-[#FFC107]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-[#FF9800]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Electrical Top Conduit Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FFC107] to-transparent shadow-[0_0_15px_rgba(255,193,7,0.7)]" />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Card Enclosure */}
        <div className={`${isNight ? 'bg-[#0D1217]/95 border-[#202A36]' : 'bg-[#FFFFFF]/95 border-[#E2E0D8]'} border backdrop-blur-xl shadow-2xl overflow-hidden relative transition-colors duration-300`}>
          
          {/* Header Accent Strip */}
          <div className="px-8 pt-8 pb-6 border-b border-[#1A232E] relative">
            <div className="flex items-center justify-between mb-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#FFC107]/10 border border-[#FFC107]/30 text-[#FFC107] text-[10px] font-mono tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFC107] animate-pulse" />
                <span>RESTRICTED ACCESS</span>
              </div>
              <span className="text-[10px] font-mono text-[#6A7684]">v2.4 TELEMETRY</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 bg-[#141B23] border border-[#24303F] flex items-center justify-center p-1.5 shadow-inner">
                <Image
                  src="/images/brahmani-mark-dark.png"
                  alt="Brahmani Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight text-white uppercase flex items-center gap-1.5">
                  BRAHMANI <span className="text-[#FFC107] font-light">ADMIN</span>
                </h1>
                <p className="text-xs text-[#8A95A1] font-mono">Control Center &amp; Section CMS</p>
              </div>
            </div>
          </div>

          {/* Form Area */}
          <form onSubmit={handleLogin} className="p-8 space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-3 bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2.5"
              >
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-3 bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2.5"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Authentication verified. Redirecting to workspace...</span>
              </motion.div>
            )}

            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono tracking-wider text-[#A5B0BC] uppercase">
                Admin Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#637180] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Enter administrator username"
                  className="w-full bg-[#121922] border border-[#243140] focus:border-[#FFC107] focus:ring-1 focus:ring-[#FFC107] text-white text-xs pl-10 pr-3.5 py-3 outline-none transition-all placeholder-[#4C5866] font-mono"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono tracking-wider text-[#A5B0BC] uppercase">
                Security Passcode
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#637180] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter administrator password"
                  className="w-full bg-[#121922] border border-[#243140] focus:border-[#FFC107] focus:ring-1 focus:ring-[#FFC107] text-white text-xs pl-10 pr-3.5 py-3 outline-none transition-all placeholder-[#4C5866] font-mono"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || success}
              className="w-full py-3.5 px-4 bg-[#FFC107] hover:bg-[#E6A900] text-[#0A0D0F] font-bold text-xs tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(255,193,7,0.35)] flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-[#0A0D0F] border-t-transparent rounded-full animate-spin" />
                  <span>AUTHENTICATING...</span>
                </>
              ) : success ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>ACCESS GRANTED</span>
                </>
              ) : (
                <>
                  <span>AUTHENTICATE &amp; ENTER</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>

            {/* One-Click Quick Login Preset */}
            <div className="pt-2">
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="w-full py-2.5 px-3 bg-[#16202A] hover:bg-[#1C2836] border border-[#273545] hover:border-[#FFC107]/40 text-[#9DAAB8] hover:text-[#FFC107] text-[11px] font-mono transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FFC107]" />
                <span>Fill Default Credentials (admin / admin123)</span>
              </button>
            </div>
          </form>

          {/* Footer Bar */}
          <div className="px-8 py-4 bg-[#0A0E13] border-t border-[#18212B] flex items-center justify-between text-[11px] text-[#63707E] font-mono">
            <Link href="/" className="hover:text-[#FFC107] transition-colors flex items-center gap-1">
              &larr; Return to Live Site
            </Link>
            <span>BRAHMANI ELECTRICAL</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
