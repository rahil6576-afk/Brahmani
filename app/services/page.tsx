'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import HeroVideo from '@/components/HeroVideo';
import SectionHeading from '@/components/SectionHeading';
import ServiceRow from '@/components/ServiceRow';
import PageTransition from '@/components/PageTransition';
import { useTheme } from '@/components/ThemeProvider';
import { useContent } from '@/lib/contentContext';
import { ALL_SERVICES } from '@/lib/constants';


export default function ServicesPage() {
  const { theme } = useTheme();
  const { content } = useContent();
  const services = content?.services?.length ? content.services : ALL_SERVICES;
  const isNight = theme === 'night';

  return (
    <PageTransition>
      {/* 1. SERVICES HERO SYSTEM */}
      <HeroVideo
        posterImage="/images/hero-engineer-panels.jpg"
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
            <span>OUR SERVICES</span>
          </motion.div>

          {/* MAIN EDITORIAL HEADLINE WITH CONTRASTING WEIGHTS (Phase 19):
              "ENGINEERED" (lighter)
              "TO POWER." (heavier) */}
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className={`text-3xl xs:text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[0.98] sm:leading-[0.95] uppercase transition-colors duration-500 ${
              isNight ? 'text-[#F5F5F2]' : 'text-[#11161A]'
            }`}
          >
            <span className="font-light block">ENGINEERED</span>
            <span className="font-black text-[#FFC107] drop-shadow-[0_0_35px_rgba(255,193,7,0.45)]">
              TO POWER.
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
            End-to-end electrical and solar solutions designed for safety, efficiency and long-term value. 
            From initial load surveys to full commissioning and life-cycle telemetry.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-8 flex flex-col xs:flex-row flex-wrap items-stretch xs:items-center gap-3 sm:gap-4 w-full sm:w-auto"
          >
            <a
              href="#electrical-systems"
              className="w-full xs:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 sm:py-4 bg-[#FFC107] hover:bg-[#E6A900] text-[#0A0D0F] text-xs font-bold tracking-widest uppercase transition-all shadow-[0_0_20px_-3px_rgba(255,193,7,0.4)]"
            >
              <span>EXPLORE DIVISIONS</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              href="/contact"
              className={`w-full xs:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3.5 sm:py-4 border text-xs font-mono font-semibold tracking-wider uppercase transition-colors ${
                isNight
                  ? 'bg-[#10161C] border-[#232C35] hover:border-[#FFC107]/50 text-[#F5F5F2]'
                  : 'bg-[#FFFFFF] border-[#DEDCD4] hover:border-[#FFC107] text-[#11161A]'
              }`}
            >
              <span>BOOK SITE AUDIT</span>
            </Link>
          </motion.div>
        </div>
      </HeroVideo>

      {/* 2. SERVICES CONTENT: SIX LARGE EDITORIAL SECTIONS */}
      <section
        className={`relative w-full transition-colors duration-700 ${
          isNight ? 'bg-[#0A0D0F]' : 'bg-[#F4F3EF]'
        }`}
      >
        {services.map((service, idx) => (
          <ServiceRow key={service.id} service={service} index={idx} />
        ))}
      </section>

    </PageTransition>
  );
}
