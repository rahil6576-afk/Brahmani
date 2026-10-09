'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from './ThemeProvider';

export default function PowerPulse({ className = '' }: { className?: string }) {
  const { isNight, reducedMotion } = useTheme();

  if (reducedMotion) return null;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none relative flex items-center overflow-hidden h-4 select-none ${className}`}
    >
      {/* Background conduit line */}
      <div
        className={`w-full h-[1px] transition-colors duration-500 ${
          isNight ? 'bg-[#1C252E]' : 'bg-[#DDDCD4]'
        }`}
      />

      {/* Traveling energy photon packet */}
      <motion.div
        className="absolute top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#FFC107] to-transparent shadow-[0_0_8px_#FFC107]"
        style={{ width: '120px' }}
        animate={{
          left: ['-140px', 'calc(100% + 140px)'],
        }}
        transition={{
          duration: 6.5,
          repeat: Infinity,
          ease: 'easeInOut',
          repeatDelay: 2.2,
        }}
      />
    </div>
  );
}
