'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Phone, Mail } from 'lucide-react';
import HeroVideo from '@/components/HeroVideo';
import ContactForm from '@/components/ContactForm';
import PageTransition from '@/components/PageTransition';
import { useTheme } from '@/components/ThemeProvider';
import { useContent } from '@/lib/contentContext';

export default function ContactPage() {
  const { theme } = useTheme();
  const { content } = useContent();
  const isNight = theme === 'night';
  const brand = content?.brand;

  useEffect(() => {
    const scrollToForm = () => {
      if (typeof window !== 'undefined') {
        const hash = window.location.hash;
        if (hash === '#quote' || hash === '#form' || hash === '#quote-form' || hash === '#inquiry-form') {
          const el = document.getElementById('quote') || document.getElementById('quote-form');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }
    };

    // Slight delay to allow DOM and PageTransition animations to mount
    const timer = setTimeout(scrollToForm, 180);
    window.addEventListener('hashchange', scrollToForm);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('hashchange', scrollToForm);
    };
  }, []);

  return (
    <PageTransition>
      {/* 1. CONTACT HERO SYSTEM */}
      <HeroVideo
        posterImage="/images/hero-contact.jpg"
        heightClass="min-h-[70vh] lg:min-h-[78vh]"
        useVideo={false}
      >
        <div className="max-w-4xl flex flex-col items-start pt-8 pb-12">
          {/* Eyebrow badge */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className={`inline-flex items-center gap-2.5 px-3.5 py-1.5 border text-[11px] sm:text-xs font-mono font-bold tracking-[0.22em] uppercase backdrop-blur-md transition-colors ${
                isNight
                  ? 'bg-[#121920]/90 border-[#242E38] text-[#FFC107]'
                  : 'bg-[#FFFFFF]/90 border-[#DEDCD4] text-[#E6A900]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#FFC107] animate-pulse" />
              <span>GET IN TOUCH</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 border text-[11px] sm:text-xs font-mono font-bold tracking-[0.12em] uppercase backdrop-blur-md transition-colors ${
                isNight
                  ? 'bg-[#182129]/90 border-[#FFC107]/40 text-[#FFC107] shadow-[0_0_16px_rgba(255,193,7,0.15)]'
                  : 'bg-[#FFF9E6]/95 border-[#FFC107]/60 text-[#A07400] shadow-xs'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#FFC107]" />
              <span>{brand?.govtApproved || 'GOVERNMENT APPROVED ELECTRICAL CONTRACTOR'}</span>
            </motion.div>
          </div>

          {/* MAIN EDITORIAL HEADLINE WITH CONTRASTING WEIGHTS (Phase 19):
              "LET'S POWER YOUR" (font-light)
              "NEXT PROJECT." (font-black) */}
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className={`text-3xl xs:text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[0.98] sm:leading-[0.95] uppercase transition-colors duration-500 ${
              isNight ? 'text-[#F5F5F2]' : 'text-[#11161A]'
            }`}
          >
            <span className="font-light block">LET&apos;S POWER YOUR</span>
            <span className="font-black text-[#FFC107] drop-shadow-[0_0_35px_rgba(255,193,7,0.45)]">
              NEXT PROJECT.
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
            Talk to our experts for tailored electrical and solar solutions that fit your needs. 
            Connect with our engineering office in Ahmedabad for project feasibility surveys and technical evaluations.
          </motion.p>
        </div>
      </HeroVideo>

      {/* 2. CONTACT TWO-COLUMN INTERACTIVE WORKBENCH */}
      <section
        id="quote"
        className={`relative w-full py-20 sm:py-28 overflow-hidden scroll-mt-24 transition-colors duration-700 ${
          isNight ? 'bg-[#0A0D0F]' : 'bg-[#F4F3EF]'
        }`}
      >
        <div className="absolute inset-0 bg-tech-grid opacity-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ContactForm />
        </div>
      </section>

      {/* 3. EMERGENCY SLA PROTOCOL BANNER */}
      <section
        className={`relative w-full border-t py-12 transition-colors duration-700 ${
          isNight
            ? 'bg-[#0D1217] border-[#1E262E]'
            : 'bg-[#FFFFFF] border-[#E0DDD4]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
            <div
              className={`border p-4 flex items-center justify-between transition-colors ${
                isNight
                  ? 'bg-[#10161C] border-[#202932]'
                  : 'bg-[#F9F8F5] border-[#E2DFD6]'
              }`}
            >
              <span className={`uppercase ${isNight ? 'text-[#6D7884]' : 'text-[#7A8793]'}`}>
                RESPONSE SLA
              </span>
              <span className="text-[#FFC107] font-bold">&lt; 24 HOURS QUOTE</span>
            </div>
            <div
              className={`border p-4 flex items-center justify-between transition-colors ${
                isNight
                  ? 'bg-[#10161C] border-[#202932]'
                  : 'bg-[#F9F8F5] border-[#E2DFD6]'
              }`}
            >
              <span className={`uppercase ${isNight ? 'text-[#6D7884]' : 'text-[#7A8793]'}`}>
                EMERGENCY LINE
              </span>
              <div className="flex flex-col items-end gap-0.5">
                <a
                  href={`tel:${(brand?.contact?.phone || '+91 63560 66265').replace(/[^0-9+]/g, '')}`}
                  className="font-bold text-[#FFC107] hover:underline"
                >
                  {brand?.contact?.phone || '+91 63560 66265'}
                </a>
                <a
                  href={`tel:${(brand?.contact?.phoneMobile || '+91 88665 53646').replace(/[^0-9+]/g, '')}`}
                  className={`text-[11px] font-semibold hover:text-[#FFC107] ${isNight ? 'text-[#A0ACB8]' : 'text-[#505D68]'}`}
                >
                  {brand?.contact?.phoneMobile || '+91 88665 53646'}
                </a>
              </div>
            </div>
            <div
              className={`border p-4 flex items-center justify-between transition-colors ${
                isNight
                  ? 'bg-[#10161C] border-[#202932]'
                  : 'bg-[#F9F8F5] border-[#E2DFD6]'
              }`}
            >
              <span className={`uppercase ${isNight ? 'text-[#6D7884]' : 'text-[#7A8793]'}`}>
                HQ JURISDICTION
              </span>
              <span className={`font-bold ${isNight ? 'text-[#F5F5F2]' : 'text-[#11161A]'}`}>
                AHMEDABAD, GUJARAT
              </span>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
