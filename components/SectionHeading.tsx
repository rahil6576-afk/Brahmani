'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from './ThemeProvider';

interface SectionHeadingProps {
  tag?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

export default function SectionHeading({
  tag,
  title,
  highlight,
  subtitle,
  align = 'left',
  className = '',
}: SectionHeadingProps) {
  const { theme } = useTheme();
  const isNight = theme === 'night';
  const isCenter = align === 'center';

  return (
    <div className={`flex flex-col ${isCenter ? 'items-center text-center' : 'items-start text-left'} ${className}`}>
      {/* Small Eyebrow Label with Technical Accent */}
      {tag && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={`inline-flex items-center gap-2 px-3 py-1 border text-[11px] font-mono font-semibold tracking-[0.2em] uppercase mb-4 transition-colors ${
            isNight
              ? 'bg-[#141B22] border-[#232C35] text-[#FFC107]'
              : 'bg-[#FFFFFF] border-[#DEDCD4] text-[#E6A900]'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFC107] animate-pulse" />
          <span>{tag}</span>
        </motion.div>
      )}

      {/* Large Editorial Headline */}
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className={`text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight uppercase leading-[1.08] max-w-4xl transition-colors duration-500 ${
          isNight ? 'text-[#F5F5F2]' : 'text-[#11161A]'
        }`}
      >
        {title}{" "}
        {highlight && (
          <span className="text-[#FFC107] drop-shadow-[0_0_20px_rgba(255,193,7,0.3)]">
            {highlight}
          </span>
        )}
      </motion.h2>

      {/* Description text */}
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`mt-4 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl font-normal transition-colors duration-500 ${
            isNight ? 'text-[#8E97A0]' : 'text-[#55616D]'
          }`}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
