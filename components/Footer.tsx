'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Phone, Mail, MapPin, ArrowRight, ShieldCheck, Lock } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useContent } from '@/lib/contentContext';
import { NAV_ITEMS } from '@/lib/constants';

export default function Footer() {
  const pathname = usePathname();
  const { theme } = useTheme();
  const { content } = useContent();
  const BRAND = content?.brand;
  const isNight = theme === 'night';

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer
      className={`relative border-t pt-16 pb-12 overflow-hidden transition-colors duration-700 ${
        isNight
          ? 'bg-[#07090B] border-[#1C242C] text-[#8E97A0]'
          : 'bg-[#EBE9E1] border-[#DCDAD0] text-[#55616C]'
      }`}
    >
      {/* Background Engineering Accents */}
      <div className="absolute inset-0 bg-tech-grid opacity-15 pointer-events-none" />
      
      {/* Top subtle energy conduit glow line */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#FFC107]/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 pb-14 border-b ${
            isNight ? 'border-[#182027]' : 'border-[#DDDCD0]'
          }`}
        >
          {/* Column 1: Brand & Identity (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col space-y-5">
            <Link href="/" className="inline-block relative h-11 w-44 sm:h-14 sm:w-56">
              <Image
                src={isNight ? BRAND.logoHorizontal : "/images/brahmani-logo-horizontal-day.png"}
                alt="BRAHMANI - Powering Tomorrow"
                fill
                className="object-contain object-left transition-opacity duration-500"
                sizes="(max-width: 640px) 180px, 230px"
              />
            </Link>

            <p className={`text-sm leading-relaxed max-w-sm ${isNight ? 'text-[#737A80]' : 'text-[#616E7A]'}`}>
              Advanced Electrical &amp; Solar Solutions for a Smarter, Cleaner Future. 
              Engineering excellence across utility solar, industrial distribution, and automated switchgear.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
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
              {/* TODO_VERIFY: Confirm registered ISO certification credentials prior to live deployment */}
              <div className={`flex items-center gap-1 text-xs font-mono ${isNight ? 'text-[#737A80]' : 'text-[#505D68]'}`}>
                <ShieldCheck className="w-3.5 h-3.5 text-[#FFC107]" />
                <span>ISO 9001:2015</span>
              </div>
            </div>
          </div>

          {/* Column 2: Navigation Links (2 Cols) */}
          <div className="lg:col-span-2 flex flex-col space-y-4">
            <h4
              className={`text-xs font-bold tracking-[0.2em] uppercase font-mono border-l-2 border-[#FFC107] pl-2.5 ${
                isNight ? 'text-[#F5F5F2]' : 'text-[#11161A]'
              }`}
            >
              NAVIGATION
            </h4>
            <ul className="space-y-2.5 text-sm">
              {NAV_ITEMS.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className="hover:text-[#FFC107] transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-[#FFC107] transition-opacity" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Core Services (3 Cols) */}
          <div className="lg:col-span-3 flex flex-col space-y-4">
            <h4
              className={`text-xs font-bold tracking-[0.2em] uppercase font-mono border-l-2 border-[#FFC107] pl-2.5 ${
                isNight ? 'text-[#F5F5F2]' : 'text-[#11161A]'
              }`}
            >
              SOLUTIONS
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/services#electrical-systems" className="hover:text-[#FFC107] transition-colors">
                  Electrical Systems (HT / LT)
                </Link>
              </li>
              <li>
                <Link href="/services#solar-solutions" className="hover:text-[#FFC107] transition-colors">
                  Solar Energy Solutions (MW Scale)
                </Link>
              </li>
              <li>
                <Link href="/services#industrial-power" className="hover:text-[#FFC107] transition-colors">
                  Industrial Power &amp; MCC Panels
                </Link>
              </li>
              <li>
                <Link href="/services#electrical-installation" className="hover:text-[#FFC107] transition-colors">
                  Turnkey Electrical Installation
                </Link>
              </li>
              <li>
                <Link href="/services#maintenance-support" className="hover:text-[#FFC107] transition-colors">
                  Preventive Maintenance &amp; AMC
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Operations (3 Cols) */}
          <div className="lg:col-span-3 flex flex-col space-y-4">
            <h4
              className={`text-xs font-bold tracking-[0.2em] uppercase font-mono border-l-2 border-[#FFC107] pl-2.5 ${
                isNight ? 'text-[#F5F5F2]' : 'text-[#11161A]'
              }`}
            >
              OPERATIONS
            </h4>
            <div className="space-y-3.5 text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#FFC107] shrink-0 mt-0.5" />
                <span className={`text-xs leading-relaxed ${isNight ? 'text-[#8E97A0]' : 'text-[#505D68]'}`}>
                  {BRAND.contact.address}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#FFC107] shrink-0" />
                <a href={`tel:${BRAND.contact.phone.replace(/\s+/g, '')}`} className="text-xs hover:text-[#FFC107] transition-colors">
                  {BRAND.contact.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#FFC107] shrink-0" />
                <a href={`mailto:${BRAND.contact.email}`} className="text-xs hover:text-[#FFC107] transition-colors">
                  {BRAND.contact.email}
                </a>
              </div>
              <div className={`text-[11px] font-mono pt-1 ${isNight ? 'text-[#616B74]' : 'text-[#7D8893]'}`}>
                HOURS: {BRAND.contact.hours}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright */}
        <div
          className={`pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs ${
            isNight ? 'text-[#5D666F]' : 'text-[#75808B]'
          }`}
        >
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#FFC107]" />
            <span>&copy; 2026 {BRAND.name}. All Rights Reserved.</span>
          </div>

          <div className="flex items-center gap-6 font-mono text-[11px]">
            <span className={isNight ? 'text-[#8E97A0]' : 'text-[#3E4A55]'}>POWERING TOMORROW</span>
            <span className="hidden md:inline">|</span>
            <span className="hidden md:inline">IEC 61439 &amp; IS SPECIFIED</span>
            <span className="hidden md:inline">|</span>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-[#FFC107]/70 hover:text-[#FFC107] transition-colors"
            >
              <Lock className="w-3 h-3" />
              <span>ADMIN PORTAL</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
