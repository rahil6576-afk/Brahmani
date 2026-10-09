'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Wrench, Gauge, ChevronRight } from 'lucide-react';
import HeroVideo from '@/components/HeroVideo';
import StatStrip from '@/components/StatStrip';
import SectionHeading from '@/components/SectionHeading';
import ServiceCard from '@/components/ServiceCard';
import ParallaxSection from '@/components/ParallaxSection';
import PageTransition from '@/components/PageTransition';
import SelectedProjects from '@/components/SelectedProjects';
import HowWeWork from '@/components/HowWeWork';
import PowerStatus from '@/components/PowerStatus';
import MagneticButton from '@/components/MagneticButton';
import EnergyPath from '@/components/EnergyPath';
import { useTheme } from '@/components/ThemeProvider';
import { useContent } from '@/lib/contentContext';
import { HOME_SERVICES } from '@/lib/constants';

export default function HomePage() {
  const { theme, isNight } = useTheme();
  const { content } = useContent();
  const brand = content?.brand;
  const homeServices = content?.services?.filter((s: any) => s.isHome !== false).slice(0, 4) || HOME_SERVICES;

  return (
    <PageTransition>
      {/* 1. CINEMATIC HERO SYSTEM WITH DUAL DAY/NIGHT VIDEO CROSSFADE */}
      <HeroVideo
        posterImage="/images/hero-solar-sunrise.jpg"
        heightClass="min-h-[82vh] lg:min-h-[88vh]"
      >
        <div className="max-w-4xl flex flex-col items-start pt-6 pb-12">
          
          {/* Top telemetry and company identity badges */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className={`inline-flex items-center gap-2.5 px-3.5 py-1.5 border text-[11px] sm:text-xs font-mono font-bold tracking-[0.2em] uppercase backdrop-blur-md transition-colors duration-500 ${
                isNight
                  ? 'bg-[#121920]/90 border-[#242E38] text-[#FFC107]'
                  : 'bg-[#FFFFFF]/90 border-[#DEDCD4] text-[#E6A900]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#FFC107] animate-pulse" />
              <span>BRAHMANI ELECTRICAL &amp; SOLAR</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="hidden sm:block"
            >
              <PowerStatus />
            </motion.div>
          </div>

          {/* Optional Admin Announcement Bar */}
          {content?.settings?.announcementActive && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 px-3.5 py-1.5 bg-[#FFC107]/10 border border-[#FFC107]/30 text-[#FFC107] text-[11px] font-mono tracking-wider flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFC107] animate-ping" />
              <span>{content.settings.announcementText}</span>
            </motion.div>
          )}

          {/* MAIN EDITORIAL HEADLINE WITH CONTRASTING WEIGHTS: */}
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className={`text-3xl xs:text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[0.98] sm:leading-[0.96] uppercase transition-colors duration-500 ${
              isNight ? 'text-[#F5F5F2]' : 'text-[#11161A]'
            }`}
          >
            <span className="font-light block">{brand?.heroPrefix || 'POWERING'}</span>
            <span className="font-black text-[#FFC107] drop-shadow-[0_0_35px_rgba(255,193,7,0.45)]">
              {brand?.heroHighlight || 'TOMORROW.'}
            </span>
          </motion.h1>

          {/* EDITORIAL DESCRIPTION */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className={`mt-4 sm:mt-6 text-sm sm:text-lg md:text-xl max-w-2xl leading-relaxed font-normal transition-colors duration-500 ${
              isNight ? 'text-[#A5ACB2]' : 'text-[#4A5560]'
            }`}
          >
            {brand?.heroDescription || 'Precision electrical infrastructure, utility-scale commercial solar arrays, and certified industrial switchgear engineered for long-term operational resilience.'}
          </motion.p>

          {/* PRIMARY BUTTONS WITH MAGNETIC CTA (Phase 12) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-8 flex flex-col xs:flex-row flex-wrap items-stretch xs:items-center gap-3 sm:gap-4 w-full sm:w-auto"
          >
            <MagneticButton strength={10} className="w-full xs:w-auto">
              <Link
                href="/services"
                className="group w-full xs:w-auto inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 bg-[#FFC107] hover:bg-[#E6A900] text-[#0A0D0F] text-xs font-bold tracking-widest uppercase transition-all shadow-[0_0_20px_-3px_rgba(255,193,7,0.45)] text-center"
              >
                <span>EXPLORE SERVICES</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </MagneticButton>

            <Link
              href="/products"
              className={`group w-full xs:w-auto inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 sm:py-4 border text-xs font-mono font-semibold tracking-wider uppercase transition-all backdrop-blur-sm text-center ${
                isNight
                  ? 'bg-[#11171E]/90 hover:bg-[#18212A] text-[#F5F5F2] hover:text-[#FFC107] border-[#26313C] hover:border-[#FFC107]/50'
                  : 'bg-[#FFFFFF]/90 hover:bg-[#F2F0E8] text-[#11161A] hover:text-[#000] border-[#DCDAD0] hover:border-[#FFC107]'
              }`}
            >
              <span>VIEW HARDWARE CATALOG</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#FFC107] transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </HeroVideo>

      {/* 2. TECHNICAL STATISTICS STRIP IMMEDIATELY BELOW HERO */}
      <StatStrip />

      {/* 3. HOME — SERVICES SECTION */}
      <section
        className={`relative w-full py-20 sm:py-28 overflow-hidden transition-colors duration-700 ${
          isNight ? 'bg-[#0A0D0F]' : 'bg-[#F4F3EF]'
        }`}
      >
        <div className="absolute inset-0 bg-tech-grid opacity-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
            <SectionHeading
              tag="CORE DISCIPLINES"
              title="POWERING EVERY"
              highlight="POSSIBILITY."
              subtitle="Brahmani delivers turnkey electrical and solar solutions with licensed site engineering supervision."
            />
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-xs font-mono font-semibold tracking-widest text-[#FFC107] hover:underline uppercase self-start lg:self-end"
            >
              <span>VIEW ALL 6 DISCIPLINES</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Four Editorial Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {homeServices.map((service: any, idx: number) => (
              <ServiceCard key={service.id} service={service} index={idx} />
            ))}
          </div>
        </div>

        {/* Subtle Energy Flow Conduit Connecting Disciplines to Projects */}
        <div className="hidden md:flex justify-center pt-10 pb-2">
          <EnergyPath variant="stepped" width={400} height={40} className="opacity-70" />
        </div>
      </section>

      {/* 4. SELECTED PROJECTS SHOWCASE (Phase 16) */}
      <SelectedProjects />

      {/* 5. PARALLAX FEATURE: CLEAN ENERGY. STRONGER TOMORROW. */}
      <ParallaxSection />

      {/* 6. HOW WE WORK: 4-STAGE METHODOLOGY WITH PROGRESSIVE SCROLL ENERGY LINE (Phase 17) */}
      <HowWeWork />

      {/* 7. ENGINEERING ASSURANCE & METHODOLOGY STRIP */}
      <section
        className={`relative w-full border-b py-16 sm:py-20 transition-colors duration-700 ${
          isNight
            ? 'bg-[#0E1318] border-[#1E2730]'
            : 'bg-[#FFFFFF] border-[#E2E0D8]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2, margin: "0px 0px -40px 0px" }}
              transition={{ duration: 0.6, delay: 0 }}
              className={`p-6 border flex flex-col space-y-3 transition-colors duration-500 ${
                isNight
                  ? 'bg-[#11171E] border-[#202933]'
                  : 'bg-[#F9F8F5] border-[#E5E3DB]'
              }`}
            >
              <div
                className={`w-10 h-10 border flex items-center justify-center text-[#FFC107] ${
                  isNight
                    ? 'bg-[#161F27] border-[#283542]'
                    : 'bg-[#FFFFFF] border-[#DDDCD4]'
                }`}
              >
                <Shield className="w-5 h-5" />
              </div>
              <h4
                className={`text-base font-bold uppercase tracking-wide ${
                  isNight ? 'text-[#F5F5F2]' : 'text-[#11161A]'
                }`}
              >
                IEC &amp; IS SPECIFIED
              </h4>
              <p
                className={`text-xs leading-relaxed ${
                  isNight ? 'text-[#8E97A0]' : 'text-[#5C6671]'
                }`}
              >
                All switchgear, solar arrays, and cable containment are engineered in full alignment with international safety and durability codes.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2, margin: "0px 0px -40px 0px" }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className={`p-6 border flex flex-col space-y-3 transition-colors duration-500 ${
                isNight
                  ? 'bg-[#11171E] border-[#202933]'
                  : 'bg-[#F9F8F5] border-[#E5E3DB]'
              }`}
            >
              <div
                className={`w-10 h-10 border flex items-center justify-center text-[#FFC107] ${
                  isNight
                    ? 'bg-[#161F27] border-[#283542]'
                    : 'bg-[#FFFFFF] border-[#DDDCD4]'
                }`}
              >
                <Wrench className="w-5 h-5" />
              </div>
              <h4
                className={`text-base font-bold uppercase tracking-wide ${
                  isNight ? 'text-[#F5F5F2]' : 'text-[#11161A]'
                }`}
              >
                NAMED SITE ENGINEERS
              </h4>
              <p
                className={`text-xs leading-relaxed ${
                  isNight ? 'text-[#8E97A0]' : 'text-[#5C6671]'
                }`}
              >
                Single point of accountability. The licensed electrical engineers who design your quote are the ones on site supervising commissioning.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2, margin: "0px 0px -40px 0px" }}
              transition={{ duration: 0.6, delay: 0.24 }}
              className={`p-6 border flex flex-col space-y-3 transition-colors duration-500 ${
                isNight
                  ? 'bg-[#11171E] border-[#202933]'
                  : 'bg-[#F9F8F5] border-[#E5E3DB]'
              }`}
            >
              <div
                className={`w-10 h-10 border flex items-center justify-center text-[#FFC107] ${
                  isNight
                    ? 'bg-[#161F27] border-[#283542]'
                    : 'bg-[#FFFFFF] border-[#DDDCD4]'
                }`}
              >
                <Gauge className="w-5 h-5" />
              </div>
              <h4
                className={`text-base font-bold uppercase tracking-wide ${
                  isNight ? 'text-[#F5F5F2]' : 'text-[#11161A]'
                }`}
              >
                PREDICTIVE THERMOGRAPHY
              </h4>
              <p
                className={`text-xs leading-relaxed ${
                  isNight ? 'text-[#8E97A0]' : 'text-[#5C6671]'
                }`}
              >
                Our ongoing maintenance protocols utilize advanced thermal cameras to detect micro-resistance faults before any disruption occurs.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 8. CALL TO ACTION STRIP */}
      <section
        className={`relative w-full py-20 text-center transition-colors duration-700 ${
          isNight ? 'bg-[#0A0D0F]' : 'bg-[#F4F3EF]'
        }`}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25, margin: "0px 0px -40px 0px" }}
          transition={{ duration: 0.7, ease: [0.21, 1, 0.36, 1] }}
          className="max-w-4xl mx-auto px-4 sm:px-6"
        >
          <div
            className={`inline-block px-3 py-1 border text-[10px] font-mono font-bold tracking-widest text-[#FFC107] uppercase mb-4 ${
              isNight
                ? 'bg-[#141B21] border-[#232C35]'
                : 'bg-[#FFFFFF] border-[#DEDCD4]'
            }`}
          >
            INITIATE PROJECT
          </div>
          <h2
            className={`text-3xl sm:text-5xl font-extrabold uppercase tracking-tight ${
              isNight ? 'text-[#F5F5F2]' : 'text-[#11161A]'
            }`}
          >
            READY TO POWER YOUR FACILITY?
          </h2>
          <p
            className={`mt-4 text-sm sm:text-base max-w-xl mx-auto leading-relaxed ${
              isNight ? 'text-[#8E97A0]' : 'text-[#5C6671]'
            }`}
          >
            Schedule a comprehensive site survey with Brahmani engineers in Ahmedabad or request an immediate equipment datasheet.
          </p>
          <div className="mt-8 flex flex-col xs:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
            <MagneticButton className="w-full xs:w-auto">
              <Link
                href="/contact"
                className="w-full xs:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-[#FFC107] hover:bg-[#E6A900] text-[#0A0D0F] text-xs font-bold tracking-widest uppercase transition-all shadow-[0_0_20px_-3px_rgba(255,193,7,0.4)]"
              >
                <span>REQUEST SITE SURVEY</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </MagneticButton>
            <Link
              href="/products"
              className={`w-full xs:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3.5 sm:py-4 border text-xs font-mono font-semibold tracking-wider uppercase transition-colors ${
                isNight
                  ? 'bg-[#11171E] hover:bg-[#18212A] text-[#F5F5F2] border-[#26313C]'
                  : 'bg-[#FFFFFF] hover:bg-[#F2F0E8] text-[#11161A] border-[#DCDAD0]'
              }`}
            >
              <span>EXPLORE HARDWARE</span>
            </Link>
          </div>
        </motion.div>
      </section>
    </PageTransition>
  );
}
