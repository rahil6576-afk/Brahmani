'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ArrowRight, ShieldCheck, Lock, X, FileText, CheckCircle2 } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useContent } from '@/lib/contentContext';
import { BRAND as FALLBACK_BRAND } from '@/lib/constants';
import CircuitTreeAnimation from '@/components/CircuitTreeAnimation';

export default function Footer() {
  const pathname = usePathname();
  const { theme } = useTheme();
  const { content } = useContent();
  const BRAND = content?.brand || FALLBACK_BRAND;
  const isNight = theme === 'night';

  const [modalType, setModalType] = useState<'privacy' | 'terms' | null>(null);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer
      className={`relative pt-12 sm:pt-16 pb-4 sm:pb-8 overflow-hidden transition-colors duration-700 border-t ${
        isNight
          ? 'bg-[#07090C] border-[#18202A] text-[#8E97A0]'
          : 'bg-[#ECE9E1] border-[#DDD9CE] text-[#55616C]'
      }`}
    >
      {/* Background Engineering Grid Accent */}
      <div className="absolute inset-0 bg-tech-grid opacity-10 pointer-events-none" />

      {/* Top subtle golden conduit glow line */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#FFC107]/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ==================================================================== */}
        {/* 1. TOP BANNER / CTA CARD: "Turn India's Sun into Your Daily Savings" */}
        {/* ==================================================================== */}
        <div
          className={`relative rounded-2xl sm:rounded-3xl p-6 xs:p-7 sm:p-10 md:p-12 mb-10 sm:mb-16 overflow-hidden border transition-all duration-500 ${
            isNight
              ? 'bg-gradient-to-br from-[#0F151C] via-[#111A24] to-[#0D141C] border-[#222E3C] shadow-[0_12px_40px_rgba(0,0,0,0.45)]'
              : 'bg-[#121921] text-[#F5F5F2] border-[#24303E] shadow-[0_12px_35px_rgba(0,0,0,0.18)]'
          }`}
        >
          {/* Subtle energy grid pattern in banner */}
          <div className="absolute inset-0 bg-tech-grid opacity-15 pointer-events-none" />
          
          {/* Radial ambient gold energy aura (hidden on small mobile to reduce fill rate) */}
          <div className="hidden sm:block absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#FFC107]/10 blur-3xl pointer-events-none" />
          <div className="hidden sm:block absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-[#FFC107]/5 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 lg:gap-10">
            {/* Left: Headline & Pitch */}
            <div className="flex-1 max-w-xl text-center lg:text-left">
              <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.18]">
                Turn India&apos;s Sun <br className="hidden sm:inline" />
                into Your{' '}
                <span className="text-[#FFC107] drop-shadow-[0_0_24px_rgba(255,193,7,0.4)]">
                  Daily Savings.
                </span>
              </h2>
              <p className="mt-3 text-xs xs:text-sm sm:text-base text-[#9DA9B6] max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Pioneering high-efficiency solar installations and engineered electrical solutions tailored for commercial enterprises, industrial plants, and homes across India.
              </p>
            </div>

            {/* Center: Large Focal Animated Golden Circuit Tree */}
            <div className="shrink-0 flex items-center justify-center py-1 sm:py-2 lg:py-0">
              <CircuitTreeAnimation className="w-32 h-32 xs:w-40 xs:h-40 sm:w-48 sm:h-48 md:w-52 md:h-52 lg:w-60 lg:h-60" />
            </div>

            {/* Right: High-visibility CTA Pill Button */}
            <div className="shrink-0 flex items-center justify-center lg:justify-end w-full lg:w-auto">
              <Link
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 sm:px-8 sm:py-4 rounded-full bg-[#FFC107] text-[#0A0D0F] font-bold text-sm sm:text-base tracking-wide transition-all duration-300 hover:bg-[#FFD54F] hover:shadow-[0_0_32px_rgba(255,193,7,0.6)] hover:scale-[1.03] active:scale-[0.98] group whitespace-nowrap"
              >
                <span>Get in Touch</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* 2. NAVIGATION COLUMNS SECTION                                        */}
        {/* ==================================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12">
          {/* Column 1: Brand & Identity (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col space-y-4">
            <Link href="/" className="inline-block relative h-11 w-44 sm:h-12 sm:w-52">
              <Image
                src={isNight ? BRAND.logoHorizontal : "/images/brahmani-logo-horizontal-day.png"}
                alt="BRAHMANI - Powering Tomorrow"
                fill
                className="object-contain object-left transition-opacity duration-500"
                sizes="(max-width: 640px) 180px, 220px"
              />
            </Link>

            <p className={`text-sm leading-relaxed max-w-sm ${isNight ? 'text-[#8E97A0]' : 'text-[#505D68]'}`}>
              Advanced Electrical &amp; Solar Solutions for a Smarter, Cleaner Future. 
              Engineering excellence across utility solar, industrial distribution, and automated switchgear.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div
                className={`flex items-center gap-2 text-xs font-mono px-3 py-1.5 border transition-colors ${
                  isNight
                    ? 'text-[#A5ACB2] bg-[#11171D] border-[#222B32]'
                    : 'text-[#3E4953] bg-[#FFFFFF] border-[#D6D3C9]'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#FFC107] animate-pulse" />
                <span>GRID DISPATCH ACTIVE</span>
              </div>
              <div className={`flex items-center gap-1.5 text-xs font-mono ${isNight ? 'text-[#7A838C]' : 'text-[#505D68]'}`}>
                <ShieldCheck className="w-3.5 h-3.5 text-[#FFC107]" />
                <span>ISO 9001:2015</span>
              </div>
            </div>
          </div>

          {/* Column 2: About Us (2 or 3 Cols) */}
          <div className="lg:col-span-2 flex flex-col space-y-3.5">
            <h4
              className={`text-sm font-bold tracking-wider font-sans ${
                isNight ? 'text-[#F5F5F2]' : 'text-[#11161A]'
              }`}
            >
              About Us
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/services#about"
                  className="hover:text-[#FFC107] transition-colors duration-200"
                >
                  Our Company
                </Link>
              </li>
              <li>
                <Link
                  href="/services#certifications"
                  className="hover:text-[#FFC107] transition-colors duration-200"
                >
                  Our Certifications
                </Link>
              </li>
              <li>
                <Link
                  href="/services#engineering"
                  className="hover:text-[#FFC107] transition-colors duration-200"
                >
                  Corporate Governance
                </Link>
              </li>
              <li>
                <Link
                  href="/services#why-brahmani"
                  className="hover:text-[#FFC107] transition-colors duration-200"
                >
                  Why Brahmani
                </Link>
              </li>
              <li>
                <Link
                  href="/contact#careers"
                  className="hover:text-[#FFC107] transition-colors duration-200"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Who We Serve (3 Cols) */}
          <div className="lg:col-span-3 flex flex-col space-y-3.5">
            <h4
              className={`text-sm font-bold tracking-wider font-sans ${
                isNight ? 'text-[#F5F5F2]' : 'text-[#11161A]'
              }`}
            >
              Who We Serve
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/services#residential"
                  className="hover:text-[#FFC107] transition-colors duration-200"
                >
                  Residential
                </Link>
              </li>
              <li>
                <Link
                  href="/services#commercial"
                  className="hover:text-[#FFC107] transition-colors duration-200"
                >
                  Commercial
                </Link>
              </li>
              <li>
                <Link
                  href="/services#industrial"
                  className="hover:text-[#FFC107] transition-colors duration-200"
                >
                  Industrial
                </Link>
              </li>
              <li>
                <Link
                  href="/services#utility"
                  className="hover:text-[#FFC107] transition-colors duration-200"
                >
                  Utility &amp; Solar Parks
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Our Products (3 Cols) */}
          <div className="lg:col-span-3 flex flex-col space-y-3.5">
            <h4
              className={`text-sm font-bold tracking-wider font-sans ${
                isNight ? 'text-[#F5F5F2]' : 'text-[#11161A]'
              }`}
            >
              Our Products
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/products"
                  className="hover:text-[#FFC107] transition-colors duration-200"
                >
                  Solar Panels
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="hover:text-[#FFC107] transition-colors duration-200"
                >
                  Solar Inverters
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="hover:text-[#FFC107] transition-colors duration-200"
                >
                  Energy Storage Systems
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="hover:text-[#FFC107] transition-colors duration-200"
                >
                  Switchgear &amp; Distribution
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="hover:text-[#FFC107] transition-colors duration-200"
                >
                  Cables &amp; Wiring
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* 3. DIVIDER & BOTTOM HORIZONTAL BAR (COPYRIGHT / LEGAL)               */}
        {/* ==================================================================== */}
        <div
          className={`pt-6 pb-4 border-t flex flex-col md:flex-row items-center justify-between gap-4 text-xs ${
            isNight ? 'border-[#1A232E] text-[#6E7882]' : 'border-[#DDD8CE] text-[#636F7B]'
          }`}
        >
          {/* Left: Copyright */}
          <div className="flex items-center gap-2">
            <span>&copy; {new Date().getFullYear()} {BRAND.name}.</span>
          </div>

          {/* Center: All Rights Reserved */}
          <div className="text-center">
            <span>All Rights Reserved.</span>
          </div>

          {/* Right: Privacy Policy | Terms & Conditions (+ subtle Admin link) */}
          <div className="flex items-center gap-3 sm:gap-4 font-mono text-[11px]">
            <button
              onClick={() => setModalType('privacy')}
              className="hover:text-[#FFC107] transition-colors underline-offset-4 hover:underline"
            >
              Privacy Policy
            </button>
            <span>|</span>
            <button
              onClick={() => setModalType('terms')}
              className="hover:text-[#FFC107] transition-colors underline-offset-4 hover:underline"
            >
              Terms &amp; Conditions
            </button>
            <span className="hidden sm:inline">|</span>
            <Link
              href="/admin"
              className="hidden sm:inline-flex items-center gap-1 opacity-70 hover:opacity-100 hover:text-[#FFC107] transition-all"
              title="Admin Console"
            >
              <Lock className="w-3 h-3" />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 4. GIANT ARCHITECTURAL WATERMARK: "BRAHMANI"                         */}
      {/* ==================================================================== */}
      <div className="w-full overflow-hidden select-none pointer-events-none mt-2 sm:mt-4 px-2 sm:px-6 relative z-10">
        <div className="max-w-[1700px] mx-auto w-full">
          <svg
            viewBox="0 0 1000 120"
            className="w-full h-auto block"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            <text
              x="50%"
              y="60%"
              textAnchor="middle"
              dominantBaseline="middle"
              className={`font-black uppercase transition-colors duration-700 ${
                isNight
                  ? 'fill-white/[0.06] drop-shadow-[0_1px_1px_rgba(255,255,255,0.02)]'
                  : 'fill-[#11161A]/[0.06]'
              }`}
              style={{
                fontSize: '136px',
                fontWeight: 900,
                fontFamily: 'var(--font-manrope), -apple-system, BlinkMacSystemFont, sans-serif',
                letterSpacing: '-0.02em',
              }}
            >
              BRAHMANI
            </text>
          </svg>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 5. PRIVACY POLICY & TERMS MODAL                                      */}
      {/* ==================================================================== */}
      {modalType && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setModalType(null)}
        >
          <div
            className={`relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl p-6 sm:p-8 border shadow-2xl ${
              isNight
                ? 'bg-[#0E141B] border-[#222E3C] text-[#D8E0E8]'
                : 'bg-white border-[#D6D3C9] text-[#222B32]'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-inherit">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-[#FFC107]" />
                <h3 className="text-lg sm:text-xl font-bold">
                  {modalType === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions'}
                </h3>
              </div>
              <button
                onClick={() => setModalType(null)}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="pt-5 space-y-4 text-sm leading-relaxed">
              {modalType === 'privacy' ? (
                <>
                  <p>
                    <strong>Brahmani Electrical &amp; Solar</strong> values your trust and is dedicated to securing the privacy of our clients, partners, and site visitors.
                  </p>
                  <div>
                    <h5 className="font-semibold text-base mb-1 text-[#FFC107]">1. Information We Collect</h5>
                    <p className="opacity-90">
                      We collect inquiry details submitted through our contact and quote forms, including names, organization details, contact numbers, email addresses, and technical project requirements.
                    </p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-base mb-1 text-[#FFC107]">2. How We Use Information</h5>
                    <p className="opacity-90">
                      Your information is strictly used to evaluate engineering parameters, prepare customized solar and electrical proposals, and fulfill service agreements. We do not sell or lease personal data.
                    </p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-base mb-1 text-[#FFC107]">3. Data Protection</h5>
                    <p className="opacity-90">
                      All communication and inquiry data are stored on secure servers with encrypted access protocols conforming to international data security standards.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <p>
                    By engaging with <strong>Brahmani Electrical &amp; Solar</strong> or accessing this site, you agree to comply with our commercial terms and operational standards.
                  </p>
                  <div>
                    <h5 className="font-semibold text-base mb-1 text-[#FFC107]">1. Engineering &amp; Specifications</h5>
                    <p className="opacity-90">
                      All solar panel outputs, transformer capacities, and switchgear ratings are subject to certified type tests, site survey parameters, and local DISCOM grid interconnection regulations.
                    </p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-base mb-1 text-[#FFC107]">2. Warranties &amp; AMC</h5>
                    <p className="opacity-90">
                      Product warranties are guaranteed by original equipment manufacturers (OEMs) and Brahmani service commitments under signed Annual Maintenance Contracts (AMC).
                    </p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-base mb-1 text-[#FFC107]">3. Intellectual Property</h5>
                    <p className="opacity-90">
                      All diagrams, single-line schematics, product designs, and corporate logos displayed on this portal remain the exclusive property of Brahmani.
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="mt-6 pt-4 border-t border-inherit flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-[#FFC107]">
                <CheckCircle2 className="w-4 h-4" />
                <span>Verified Compliance Document</span>
              </div>
              <button
                onClick={() => setModalType(null)}
                className="px-5 py-2 text-xs font-bold rounded-lg bg-[#FFC107] text-[#0A0D0F] hover:bg-[#FFD54F] transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
