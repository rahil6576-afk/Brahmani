'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Download, ShieldCheck } from 'lucide-react';
import HeroVideo from '@/components/HeroVideo';
import SectionHeading from '@/components/SectionHeading';
import FeaturedProduct from '@/components/FeaturedProduct';
import ProductGrid from '@/components/ProductGrid';
import PageTransition from '@/components/PageTransition';
import { useTheme } from '@/components/ThemeProvider';

export default function ProductsPage() {
  const { theme } = useTheme();
  const isNight = theme === 'night';

  return (
    <PageTransition>
      {/* 1. PRODUCTS HERO SYSTEM */}
      <HeroVideo
        posterImage="/images/hero-products.jpg"
        heightClass="min-h-[75vh] lg:min-h-[82vh]"
        useVideo={false}
      >
        <div className="max-w-4xl flex flex-col items-start pt-8 pb-12">
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`inline-flex items-center gap-2.5 px-3.5 py-1.5 border text-[11px] sm:text-xs font-mono font-bold tracking-[0.22em] uppercase mb-6 backdrop-blur-md transition-colors ${
              isNight
                ? 'bg-[#121920]/90 border-[#242E38] text-[#FFC107]'
                : 'bg-[#FFFFFF]/90 border-[#DEDCD4] text-[#E6A900]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#FFC107] animate-pulse" />
            <span>OUR PRODUCTS</span>
          </motion.div>

          {/* MAIN EDITORIAL HEADLINE WITH CONTRASTING WEIGHTS (Phase 19):
              "POWER. PRECISION." (refined font-light)
              "PERFORMANCE." (bold font-black) */}
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className={`text-3xl xs:text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[0.98] sm:leading-[0.95] uppercase transition-colors duration-500 ${
              isNight ? 'text-[#F5F5F2]' : 'text-[#11161A]'
            }`}
          >
            <span className="font-light block">POWER. PRECISION.</span>
            <span className="font-black text-[#FFC107] drop-shadow-[0_0_35px_rgba(255,193,7,0.45)]">
              PERFORMANCE.
            </span>
          </motion.h1>

          {/* DESCRIPTION */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className={`mt-4 sm:mt-6 text-sm sm:text-lg md:text-xl max-w-2xl leading-relaxed font-normal transition-colors duration-500 ${
              isNight ? 'text-[#A5ACB2]' : 'text-[#4A5560]'
            }`}
          >
            Premium electrical and solar products built for reliability, efficiency and a sustainable tomorrow. 
            All components are factory tested, Type-Test certified, and backed by comprehensive warranties.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-8 flex flex-col xs:flex-row flex-wrap items-stretch xs:items-center gap-3 sm:gap-4 w-full sm:w-auto"
          >
            <a
              href="#catalog"
              className="w-full xs:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 sm:py-4 bg-[#FFC107] hover:bg-[#E6A900] text-[#0A0D0F] text-xs font-bold tracking-widest uppercase transition-all shadow-[0_0_20px_-3px_rgba(255,193,7,0.4)]"
            >
              <span>BROWSE CATALOG</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="/images/brahmani.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full xs:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3.5 sm:py-4 border text-xs font-mono font-semibold tracking-wider uppercase transition-colors ${
                isNight
                  ? 'bg-[#10161C] border-[#232C35] hover:border-[#FFC107]/50 text-[#F5F5F2]'
                  : 'bg-[#FFFFFF] border-[#DEDCD4] hover:border-[#FFC107] text-[#11161A]'
              }`}
            >
              <Download className="w-3.5 h-3.5 text-[#FFC107]" />
              <span>DOWNLOAD SPEC BROCHURE</span>
            </a>
          </motion.div>
        </div>
      </HeroVideo>

      {/* 2. FEATURED PRODUCT: LARGE SPLIT-SCREEN FEATURE */}
      <FeaturedProduct />

      {/* 3. PRODUCT CATEGORIES & COMPREHENSIVE CATALOG */}
      <section
        id="catalog"
        className={`relative w-full py-20 sm:py-28 overflow-hidden transition-colors duration-700 ${
          isNight ? 'bg-[#0A0D0F]' : 'bg-[#F4F3EF]'
        }`}
      >
        <div className="absolute inset-0 bg-tech-grid opacity-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionHeading
            tag="CERTIFIED HARDWARE"
            title="ENGINEERED PRODUCT"
            highlight="PORTFOLIO."
            subtitle="Explore our verified range of photovoltaic arrays, power inverters, industrial switchgear, armored cables, LED luminaires, and automation panels."
            className="mb-12"
          />

          <ProductGrid />
        </div>
      </section>

      {/* 4. QUALITY GUARANTEE & TESTING STANDARDS */}
      <section
        className={`relative w-full border-t py-16 transition-colors duration-700 ${
          isNight
            ? 'bg-[#0D1217] border-[#1E262E]'
            : 'bg-[#FFFFFF] border-[#E0DDD4]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`flex flex-col md:flex-row items-center justify-between gap-8 border p-8 transition-colors ${
              isNight
                ? 'bg-[#11171E] border-[#222C36]'
                : 'bg-[#F9F8F5] border-[#E2E0D8]'
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 border flex items-center justify-center text-[#FFC107] shrink-0 ${
                  isNight
                    ? 'bg-[#17212B] border-[#FFC107]/40'
                    : 'bg-[#FFFFFF] border-[#FFC107]/60'
                }`}
              >
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4
                  className={`text-lg font-bold uppercase tracking-wide ${
                    isNight ? 'text-[#F5F5F2]' : 'text-[#11161A]'
                  }`}
                >
                  RIGOROUS FACTORY ACCEPTANCE TESTING (FAT)
                </h4>
                <p
                  className={`text-xs sm:text-sm mt-1 max-w-xl ${
                    isNight ? 'text-[#8E97A0]' : 'text-[#55626F]'
                  }`}
                >
                  Every product shipped undergoes insulation resistance testing, temperature rise simulation, and harmonic validation before site delivery.
                </p>
              </div>
            </div>

            <Link
              href="/contact#quote"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#FFC107] hover:bg-[#E6A900] text-[#0A0D0F] text-xs font-bold tracking-widest uppercase transition-all shrink-0 shadow-[0_0_15px_-4px_rgba(255,193,7,0.4)]"
            >
              <span>REQUEST BULK RFQ</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
