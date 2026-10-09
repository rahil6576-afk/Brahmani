'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import HangingLamp from './HangingLamp';
import ThemeLamp from './ThemeLamp';
import { useTheme } from './ThemeProvider';
import { useContent } from '@/lib/contentContext';
import { NAV_ITEMS } from '@/lib/constants';
import MagneticButton from './MagneticButton';
import PowerPulse from './PowerPulse';

export default function Navbar() {
  const pathname = usePathname();
  const { theme, isNight, themeProgress, pullProgress } = useTheme();
  const { content } = useContent();
  const BRAND = content?.brand;

  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-700 backdrop-blur-md ${
        isNight
          ? 'bg-[#080B0D]/90 border-b border-[#1E262E]'
          : 'bg-[#F4F3EF]/92 border-b border-[#E2E0D8]'
      }`}
    >
      {/* Dynamic warm illumination wash radiating from the lamp onto the navbar rail */}
      <div
        className={`absolute top-0 left-0 w-[420px] h-full pointer-events-none transition-opacity duration-500 ease-out ${
          isNight ? 'opacity-80' : 'opacity-0'
        }`}
        style={{
          background:
            'radial-gradient(ellipse at 48px 30px, rgba(255, 193, 7, 0.32) 0%, rgba(255, 180, 0, 0.12) 48%, rgba(255, 193, 7, 0.02) 75%, transparent 100%)',
          filter: 'blur(10px)',
        }}
      />

      {/* Top micro-conduit yellow line with subtle electrical power pulse */}
      <div className="relative h-[2px] w-full bg-gradient-to-r from-transparent via-[#FFC107]/45 to-transparent overflow-hidden">
        <PowerPulse className="absolute inset-0 h-[2px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Architectural desktop height (100-112px / h-24 lg:h-26) */}
        <div className="flex items-center justify-between h-18 xs:h-20 md:h-24 lg:h-26">
          
          {/* LEFT: Signature Architectural Hanging Lamp + Brahmani Brand Logo */}
          <div className="flex items-center gap-2 xs:gap-3 sm:gap-5 min-w-0">
            {/* The signature hanging lamp suspended directly from the ceiling with architectural extension */}
            <div className="flex items-center justify-center shrink-0 -mt-1 lg:mt-0">
              <ThemeLamp />
            </div>

            <Link
              href="/"
              className="group flex items-center gap-2 sm:gap-3.5 focus:outline-none shrink"
              aria-label="BRAHMANI - Powering Tomorrow"
            >
              <div className="relative h-9 w-32 xs:h-11 xs:w-40 sm:h-14 sm:w-56 transition-transform duration-300 group-hover:scale-[1.02]">
                <Image
                  src={isNight ? BRAND.logoHorizontal : "/images/brahmani-logo-horizontal-day.png"}
                  alt="BRAHMANI - Powering Tomorrow"
                  fill
                  priority
                  className="object-contain object-left transition-opacity duration-500"
                  sizes="(max-width: 480px) 130px, (max-width: 640px) 160px, 230px"
                />
              </div>

              {/* Technical coordinate accent */}
              <div
                className={`hidden xl:flex flex-col text-[10px] tracking-widest border-l pl-3 py-0.5 font-mono transition-colors duration-500 ${
                  isNight
                    ? 'text-[#556069] border-[#222B32]'
                    : 'text-[#85909A] border-[#D8D6CE]'
                }`}
              >
                <span className={isNight ? 'text-[#84909A]' : 'text-[#3E4852]'}>SYS.ID 01</span>
                <span>23.0225° N, 72.5714° E</span>
              </div>
            </Link>
          </div>

          {/* RIGHT: Navigation + Magnetic CTA */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-6">
            
            {/* Desktop Navigation with individual Hanging Lamps */}
            <nav className="flex items-center space-x-1 lg:space-x-3">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.path;
                const isHovered = hoveredPath === item.path;

                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className="relative flex flex-col items-center pt-1 group cursor-pointer focus:outline-none"
                    onMouseEnter={() => setHoveredPath(item.path)}
                    onMouseLeave={() => setHoveredPath(null)}
                  >
                    {/* Hanging Lamp placed above the navigation label */}
                    <div className="h-9 flex items-center justify-center">
                      <HangingLamp isActive={isActive} isHovered={isHovered} />
                    </div>

                    {/* Navigation Link Label */}
                    <span
                      className={`relative px-3.5 py-1.5 text-xs lg:text-[13px] font-semibold tracking-[0.14em] uppercase transition-colors duration-300 ${
                        isActive
                          ? "text-[#FFC107] drop-shadow-[0_0_10px_rgba(255,193,7,0.35)]"
                          : isHovered
                          ? isNight
                            ? "text-[#F5F5F2]"
                            : "text-[#11161A]"
                          : isNight
                          ? "text-[#8E97A0]"
                          : "text-[#5D6771]"
                      }`}
                    >
                      {item.name}

                      {/* Underline Interaction */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            layoutId="nav-active-underline"
                            className="absolute -bottom-1 left-2 right-2 h-[2px] bg-[#FFC107] shadow-[0_0_8px_#FFC107]"
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          />
                        )}
                      </AnimatePresence>

                      {/* Hover expand underline */}
                      {!isActive && isHovered && (
                        <motion.div
                          initial={{ scaleX: 0, opacity: 0 }}
                          animate={{ scaleX: 1, opacity: 1 }}
                          exit={{ scaleX: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="absolute -bottom-1 left-2 right-2 h-[1.5px] bg-[#FFC107]/70 origin-center"
                        />
                      )}
                    </span>
                  </Link>
                );
              })}
            </nav>

            {/* Quick Consultation Magnetic CTA */}
            <div className="pl-2">
              <MagneticButton strength={8}>
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold tracking-wider text-[#0A0D0F] bg-[#FFC107] hover:bg-[#E6A900] transition-all duration-200 shadow-[0_0_15px_-3px_rgba(255,193,7,0.4)]"
                >
                  <span>GET QUOTE</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </MagneticButton>
            </div>
          </div>

          {/* MOBILE: Actions & Hamburger Button */}
          <div className="flex md:hidden items-center gap-1.5 xs:gap-2 shrink-0">
            <Link
              href="/contact"
              className="px-2 py-1 xs:px-2.5 xs:py-1.5 text-[10px] xs:text-[11px] font-bold tracking-wider text-[#0A0D0F] bg-[#FFC107] hover:bg-[#E6A900] transition-colors rounded-none"
            >
              QUOTE
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-1.5 xs:p-2 focus:outline-none border transition-colors ${
                isNight
                  ? 'text-[#8E97A0] hover:text-[#FFC107] border-[#222B32]'
                  : 'text-[#4A5560] hover:text-[#FFC107] border-[#D5D2C8]'
              }`}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 top-18 xs:top-20 bg-black/60 backdrop-blur-xs z-[-1] md:hidden"
            />
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className={`md:hidden px-6 py-6 overflow-hidden border-b transition-colors duration-500 ${
                isNight
                  ? 'bg-[#0D1216] border-[#222B32]'
                  : 'bg-[#F9F8F5] border-[#E0DED5]'
              }`}
            >
              <div className="flex flex-col space-y-4">
                {NAV_ITEMS.map((item) => {
                  const isActive = pathname === item.path;

                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between border-b pb-3 group cursor-pointer ${
                        isNight ? 'border-[#1A2228]' : 'border-[#E5E3DB]'
                      }`}
                    >
                      <span
                        className={`text-sm font-semibold tracking-widest uppercase transition-colors ${
                          isActive
                            ? "text-[#FFC107]"
                            : isNight
                            ? "text-[#ECEBE6] group-hover:text-[#FFC107]"
                            : "text-[#11161A] group-hover:text-[#FFC107]"
                        }`}
                      >
                        {item.name}
                      </span>

                      <div className="h-8 flex items-center cursor-pointer">
                        <HangingLamp isActive={isActive} isHovered={false} />
                      </div>
                    </Link>
                  );
                })}

                {/* Quick Mobile Action CTA */}
                <div className="pt-2 grid grid-cols-2 gap-2">
                  <Link
                    href="/contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2.5 text-center text-xs font-bold font-mono tracking-wider text-[#0A0D0F] bg-[#FFC107] uppercase shadow-sm"
                  >
                    GET QUOTE →
                  </Link>
                  <a
                    href="tel:+917948902811"
                    className={`px-3 py-2.5 text-center text-xs font-mono font-bold tracking-wider border uppercase transition-colors ${
                      isNight
                        ? 'border-[#26313C] text-[#F5F5F2] hover:border-[#FFC107]'
                        : 'border-[#D5D2C8] text-[#11161A] hover:border-[#FFC107]'
                    }`}
                  >
                    CALL US
                  </a>
                </div>

                <div className="pt-2 text-xs flex justify-between items-center text-[#737A80] border-t border-[#1A2228]">
                  <span>Ahmedabad, Gujarat</span>
                  <span className="text-[#FFC107] font-semibold">+91 79 4890 2811</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
