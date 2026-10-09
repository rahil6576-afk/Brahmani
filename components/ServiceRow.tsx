'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { ServiceItem } from '@/lib/constants';
import { useTheme } from './ThemeProvider';

interface ServiceRowProps {
  service: ServiceItem;
  index: number;
}

export default function ServiceRow({ service, index }: ServiceRowProps) {
  const { theme } = useTheme();
  const isNight = theme === 'night';
  const containerRef = useRef<HTMLDivElement>(null);
  const isImageRight = index % 2 === 1;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <div
      id={service.id}
      ref={containerRef}
      className={`relative py-16 sm:py-24 border-b overflow-hidden transition-colors duration-700 ${
        isNight
          ? 'bg-[#0A0D0F] border-[#1A2228]'
          : 'bg-[#F4F3EF] border-[#E0DDD4]'
      }`}
    >
      {/* Background subtle grid */}
      <div className="absolute inset-0 bg-tech-grid opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          className={`grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center ${
            isImageRight ? '' : 'lg:flex-row-reverse'
          }`}
        >
          {/* Content Column (6 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 45 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2, margin: "0px 0px -50px 0px" }}
            transition={{ duration: 0.7, ease: [0.21, 1, 0.36, 1] }}
            className={`lg:col-span-6 flex flex-col space-y-6 ${
              isImageRight ? 'lg:order-1' : 'lg:order-2'
            }`}
          >
            {/* Top row with large number & technical tag */}
            <div
              className={`flex items-center gap-4 border-b pb-4 ${
                isNight ? 'border-[#222B32]' : 'border-[#E2DFD6]'
              }`}
            >
              <span className="font-mono text-5xl sm:text-6xl font-extrabold text-[#FFC107] tracking-tighter">
                {service.number}
              </span>
              <div className="flex flex-col font-mono text-xs">
                <span
                  className={`uppercase tracking-widest font-semibold ${
                    isNight ? 'text-[#A5ACB2]' : 'text-[#3B4752]'
                  }`}
                >
                  DIVISION 0{service.number}
                </span>
                <span className={`text-[10px] ${isNight ? 'text-[#59646E]' : 'text-[#7D8893]'}`}>
                  STANDARD: IEC / IS COMPLIANT
                </span>
              </div>
            </div>

            {/* Title */}
            <div>
              <span
                className={`text-xs font-mono tracking-widest uppercase mb-1 block ${
                  isNight ? 'text-[#7C8894]' : 'text-[#6C7985]'
                }`}
              >
                {service.tagline}
              </span>
              <h3
                className={`text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase tracking-tight transition-colors duration-500 ${
                  isNight ? 'text-[#F5F5F2]' : 'text-[#11161A]'
                }`}
              >
                {service.title}
              </h3>
            </div>

            {/* Description */}
            <p
              className={`text-sm sm:text-base leading-relaxed transition-colors duration-500 ${
                isNight ? 'text-[#8E97A0]' : 'text-[#525E6B]'
              }`}
            >
              {service.description}
            </p>

            {/* Features Bullet List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {service.features.map((feat) => (
                <div
                  key={feat}
                  className={`flex items-center gap-2 text-xs ${
                    isNight ? 'text-[#ECEBE6]' : 'text-[#232B32]'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#FFC107] shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* Technical Specifications Bar */}
            <div
              className={`border p-4 grid grid-cols-2 gap-4 transition-colors ${
                isNight
                  ? 'bg-[#10161B] border-[#202932]'
                  : 'bg-[#FFFFFF] border-[#DEDBD2]'
              }`}
            >
              {service.specs.map((spec, idx) => (
                <div key={`${service.id || service.title}-spec-${idx}-${spec.label}`} className="flex flex-col">
                  <span
                    className={`text-[10px] font-mono tracking-widest uppercase ${
                      isNight ? 'text-[#66727D]' : 'text-[#76828E]'
                    }`}
                  >
                    {spec.label}
                  </span>
                  <span className="text-xs font-semibold text-[#FFC107] font-mono mt-0.5">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Learn More & Request Site Survey Buttons */}
            <div className="pt-3 flex flex-col xs:flex-row items-stretch xs:items-center gap-3 sm:gap-4">
              <Link
                href={`/contact?service=${encodeURIComponent(service.title)}`}
                className="w-full xs:w-auto group inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-bold tracking-widest text-[#0A0D0F] bg-[#FFC107] hover:bg-[#E6A900] uppercase transition-all shadow-[0_0_15px_-4px_rgba(255,193,7,0.35)]"
              >
                <span>REQUEST SITE SURVEY</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/products"
                className={`w-full xs:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 text-xs font-semibold tracking-wider border uppercase transition-colors ${
                  isNight
                    ? 'text-[#A5ACB2] hover:text-[#F5F5F2] border-[#222B32] hover:border-[#FFC107]/40'
                    : 'text-[#4A5560] hover:text-[#11161A] border-[#D8D5CB] hover:border-[#FFC107]'
                }`}
              >
                <span>VIEW HARDWARE</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#FFC107]" />
              </Link>
            </div>
          </motion.div>

          {/* Image Column with Parallax (6 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 45, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2, margin: "0px 0px -50px 0px" }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.21, 1, 0.36, 1] }}
            className={`lg:col-span-6 relative ${
              isImageRight ? 'lg:order-2' : 'lg:order-1'
            }`}
          >
            <div
              className={`relative h-[260px] xs:h-[320px] sm:h-[440px] lg:h-[480px] w-full overflow-hidden border group ${
                isNight ? 'border-[#222B32]' : 'border-[#DEDCD4]'
              }`}
            >
              <motion.div style={{ y: imgY }} className="absolute inset-0 h-[116%] -top-[8%] w-full">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.04]"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </motion.div>

              <div
                className={`absolute inset-0 pointer-events-none ${
                  isNight
                    ? 'bg-gradient-to-t from-[#0A0D0F]/40 via-transparent to-transparent'
                    : 'bg-gradient-to-t from-[#F4F3EF]/30 via-transparent to-transparent'
                }`}
              />

              <div
                className={`absolute top-3 left-3 text-[10px] font-mono px-2.5 py-1 border ${
                  isNight
                    ? 'text-[#8C98A4] bg-[#0A0D0F]/85 border-[#222B32]'
                    : 'text-[#4B5661] bg-[#FFFFFF]/90 border-[#DEDCD4]'
                }`}
              >
                SEC.REF // 0{service.number}
              </div>
              <div
                className={`absolute bottom-3 right-3 text-[10px] font-mono px-2.5 py-1 border flex items-center gap-1.5 ${
                  isNight
                    ? 'text-[#FFC107] bg-[#0A0D0F]/85 border-[#222B32]'
                    : 'text-[#E6A900] bg-[#FFFFFF]/90 border-[#DEDCD4]'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFC107]" />
                <span>INSPECTION VERIFIED</span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FFC107] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left shadow-[0_0_8px_#FFC107]" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
