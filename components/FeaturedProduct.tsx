'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, CheckCircle2, Zap } from 'lucide-react';
import ProductModal from './ProductModal';
import { PRODUCTS_LIST } from '@/lib/constants';
import { useTheme } from './ThemeProvider';
import { useContent } from '@/lib/contentContext';

export default function FeaturedProduct() {
  const { theme } = useTheme();
  const { content } = useContent();
  const products = content?.products?.length ? content.products : PRODUCTS_LIST;
  const isNight = theme === 'night';
  const containerRef = useRef<HTMLDivElement>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const featuredProduct = products.find((p) => p.isFeatured) || products[0];

  const specsList = [
    { title: "Up to 22.8% Efficiency", desc: "N-Type TOPCon cell architecture" },
    { title: "25 Year Performance Warranty", desc: "Linear power degradation < 0.4%/yr" },
    { title: "Weatherproof", desc: "IP68 junction box & 3.2mm tempered glass" },
    { title: "High Durability", desc: "5400 Pa front load / 2400 Pa wind resistance" },
  ];

  return (
    <section
      ref={containerRef}
      className={`relative w-full border-y py-16 sm:py-24 overflow-hidden transition-colors duration-700 ${
        isNight
          ? 'bg-[#0D1217] border-[#1E262E]'
          : 'bg-[#FFFFFF] border-[#E0DDD4]'
      }`}
    >
      {/* Background Engineering Grid */}
      <div className="absolute inset-0 bg-tech-grid opacity-15 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT: Large solar panel visual */}
          <motion.div
            initial={{ opacity: 0, y: 45, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2, margin: "0px 0px -40px 0px" }}
            transition={{ duration: 0.7, ease: [0.21, 1, 0.36, 1] }}
            className="lg:col-span-6 relative"
          >
            <div
              className={`relative h-[280px] xs:h-[360px] sm:h-[480px] w-full border overflow-hidden group ${
                isNight
                  ? 'bg-[#080B0D] border-[#232C35]'
                  : 'bg-[#F2F1EB] border-[#DEDCD4]'
              }`}
            >
              <motion.div style={{ y: imgY }} className="absolute inset-0 h-[114%] -top-[7%] w-full">
                <Image
                  src="/images/product-solar-panel.jpg"
                  alt="Premium Solar Panels"
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </motion.div>

              <div
                className={`absolute inset-0 pointer-events-none ${
                  isNight
                    ? 'bg-gradient-to-t from-[#0A0D0F]/45 via-transparent to-transparent'
                    : 'bg-gradient-to-t from-[#FFFFFF]/35 via-transparent to-transparent'
                }`}
              />

              {/* Technical Badges */}
              <div
                className={`absolute top-4 left-4 flex items-center gap-2 border px-3 py-1 text-[11px] font-mono ${
                  isNight
                    ? 'bg-[#0A0D0F]/90 border-[#232C35] text-[#FFC107]'
                    : 'bg-[#FFFFFF]/95 border-[#D8D6CE] text-[#E6A900]'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>TOPCON BIFACIAL 580W</span>
              </div>

              <div
                className={`absolute bottom-4 left-4 right-4 flex items-center justify-between text-[10px] font-mono border px-3 py-2 ${
                  isNight
                    ? 'text-[#8C97A1] bg-[#0A0D0F]/90 border-[#232C35]'
                    : 'text-[#4A5561] bg-[#FFFFFF]/95 border-[#D8D6CE]'
                }`}
              >
                <span>SERIES: BRAHMANI ULTRA-V</span>
                <span className={isNight ? 'text-[#ECEBE6]' : 'text-[#11161A]'}>
                  ANTI-PID / LOW LID CERTIFIED
                </span>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Featured Product Information */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2, margin: "0px 0px -40px 0px" }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.21, 1, 0.36, 1] }}
            className="lg:col-span-6 flex flex-col space-y-6"
          >
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 border text-[11px] font-mono font-bold tracking-[0.2em] uppercase w-fit ${
                isNight
                  ? 'bg-[#141B22] border-[#232C35] text-[#FFC107]'
                  : 'bg-[#FFFFFF] border-[#DEDCD4] text-[#E6A900]'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFC107] animate-pulse" />
              <span>FEATURED PRODUCT</span>
            </div>

            <h2
              className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight leading-tight transition-colors duration-500 ${
                isNight ? 'text-[#F5F5F2]' : 'text-[#11161A]'
              }`}
            >
              PREMIUM SOLAR PANELS
            </h2>

            <p
              className={`text-sm sm:text-base leading-relaxed transition-colors duration-500 ${
                isNight ? 'text-[#8E97A0]' : 'text-[#55626F]'
              }`}
            >
              High-performance solar panels engineered for long life and maximum output. 
              Built with cutting-edge bifacial technology to harvest additional reflected irradiance from both sides, 
              delivering industry-leading yield in high-ambient temperature regions.
            </p>

            {/* Specifications list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {specsList.map((spec) => (
                <div
                  key={spec.title}
                  className={`border p-3.5 flex flex-col space-y-1 transition-colors ${
                    isNight
                      ? 'bg-[#10161C] border-[#1E262E]'
                      : 'bg-[#F8F7F3] border-[#E2E0D8]'
                  }`}
                >
                  <div
                    className={`flex items-center gap-2 text-xs font-bold uppercase ${
                      isNight ? 'text-[#F5F5F2]' : 'text-[#11161A]'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FFC107] shrink-0" />
                    <span>{spec.title}</span>
                  </div>
                  <span
                    className={`text-[11px] font-mono pl-5.5 ${
                      isNight ? 'text-[#717C87]' : 'text-[#7B8894]'
                    }`}
                  >
                    {spec.desc}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Button: VIEW DETAILS → */}
            <div className="pt-4 flex flex-col xs:flex-row items-stretch xs:items-center gap-3 sm:gap-4">
              <button
                onClick={() => setModalOpen(true)}
                className="w-full xs:w-auto group inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#FFC107] hover:bg-[#E6A900] text-[#0A0D0F] text-xs font-bold tracking-widest uppercase transition-all shadow-[0_0_20px_-4px_rgba(255,193,7,0.4)]"
              >
                <span>VIEW DETAILS</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <a
                href="/images/brahmani.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full xs:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 border text-xs font-mono font-semibold tracking-wider uppercase transition-colors ${
                  isNight
                    ? 'border-[#222B32] hover:border-[#FFC107]/40 text-[#A5ACB2] hover:text-[#F5F5F2]'
                    : 'border-[#D8D6CE] hover:border-[#FFC107] text-[#4A5661] hover:text-[#11161A]'
                }`}
              >
                <span>ENGINEERING SPEC</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      <ProductModal
        product={modalOpen ? featuredProduct : null}
        onClose={() => setModalOpen(false)}
      />
    </section>
  );
}
