'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export default function ParallaxSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isNight = theme === 'night';

  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth < 768);
    }
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], isMobile ? ["-4%", "4%"] : ["-12%", "12%"]);
  const textY = useTransform(scrollYProgress, [0, 1], isMobile ? ["4%", "-4%"] : ["24%", "-24%"]);

  return (
    <section
      ref={containerRef}
      className={`relative w-full min-h-[60vh] sm:min-h-[75vh] py-16 sm:py-24 flex items-center justify-center overflow-hidden border-y transition-colors duration-700 ${
        isNight
          ? 'bg-[#0A0D0F] border-[#1E262E]'
          : 'bg-[#F4F3EF] border-[#E0DDD4]'
      }`}
    >
      {/* 1. Full-width visual background with slower parallax */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 w-full h-[115%] -top-[7%] pointer-events-none select-none"
      >
        <Image
          src="/images/parallax-clean-energy.jpg"
          alt="Clean Energy - Stronger Tomorrow"
          fill
          priority
          className={`object-cover object-center filter ${
            isNight
              ? 'brightness-[0.88] contrast-[1.08]'
              : 'brightness-[0.98] contrast-[1.02]'
          }`}
          sizes="100vw"
        />
      </motion.div>

      {/* 2. Cinematic Gradients */}
      <div
        className={`absolute inset-0 pointer-events-none z-10 transition-colors duration-700 ${
          isNight
            ? 'bg-gradient-to-t from-[#0A0D0F]/80 via-transparent to-[#0A0D0F]/80'
            : 'bg-gradient-to-t from-[#F4F3EF]/70 via-transparent to-[#F4F3EF]/70'
        }`}
      />
      <div
        className={`absolute inset-0 pointer-events-none z-10 ${
          isNight ? 'bg-[#0A0D0F]/20' : 'bg-[#F4F3EF]/10'
        }`}
      />

      {/* Technical Grid overlay */}
      <div className="absolute inset-0 bg-tech-grid opacity-20 pointer-events-none z-10" />

      {/* 3. Subtle Animated Yellow Electrical Line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] z-20 overflow-hidden pointer-events-none">
        <div
          className={`w-full h-full ${
            isNight ? 'bg-[#1A2228]' : 'bg-[#DDDCD4]'
          }`}
        />
        <motion.div
          className="absolute top-0 h-full w-48 bg-gradient-to-r from-transparent via-[#FFC107] to-transparent shadow-[0_0_12px_#FFC107]"
          animate={{
            left: ["-10%", "110%"],
          }}
          transition={{
            duration: 5,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
      </div>

      {/* 4. Foreground Content */}
      <motion.div
        style={{ y: textY }}
        className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center"
      >
        {/* Eyebrow */}
        <div
          className={`inline-flex items-center gap-2 px-3.5 py-1 border text-[11px] font-mono font-bold tracking-[0.22em] text-[#FFC107] uppercase mb-6 backdrop-blur-sm ${
            isNight
              ? 'bg-[#0A0D0F]/80 border-[#2B3540]'
              : 'bg-[#FFFFFF]/85 border-[#D5D2C8]'
          }`}
        >
          <Sun className="w-3.5 h-3.5" />
          <span>RENEWABLE INFRASTRUCTURE</span>
        </div>

        {/* Headline */}
        <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-[#F5F5F2] tracking-tighter uppercase leading-[0.95] drop-shadow-2xl">
          CLEAN ENERGY.<br />
          <span className="text-[#FFC107] drop-shadow-[0_0_35px_rgba(255,193,7,0.45)]">
            STRONGER TOMORROW.
          </span>
        </h2>

        <p className="mt-6 text-sm sm:text-base md:text-lg text-[#D0D6DC] max-w-2xl leading-relaxed font-medium drop-shadow-md">
          Pioneering multi-megawatt solar generation and intelligent high-voltage infrastructure to power industrial progress sustainably.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/services"
            className="group inline-flex items-center gap-2 px-7 py-3.5 bg-[#FFC107] hover:bg-[#E6A900] text-[#0A0D0F] text-xs font-bold tracking-widest uppercase transition-all shadow-[0_0_25px_-4px_rgba(255,193,7,0.45)]"
          >
            <span>DISCOVER OUR CAPABILITIES</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/contact#quote"
            className={`inline-flex items-center gap-2 px-6 py-3.5 backdrop-blur-md border text-xs font-mono font-semibold tracking-wider uppercase transition-colors ${
              isNight
                ? 'bg-[#0A0D0F]/80 border-[#2B3540] hover:border-[#FFC107]/50 text-[#F5F5F2]'
                : 'bg-[#FFFFFF]/90 border-[#D5D2C8] hover:border-[#FFC107] text-[#11161A]'
            }`}
          >
            <span>TALK TO AN ENGINEER</span>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
