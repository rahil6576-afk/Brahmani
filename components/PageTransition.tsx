'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from './ThemeProvider';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const { reducedMotion } = useTheme();

  return (
    <div className="relative w-full min-h-screen flex flex-col overflow-hidden">
      {/* Signature Energy Sweep Pulse across screen on mount */}
      {!reducedMotion && (
        <motion.div
          initial={{ left: '-20%', opacity: 1 }}
          animate={{ left: '120%', opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-none fixed top-0 h-[2px] w-[35vw] bg-gradient-to-r from-transparent via-[#FFC107] to-transparent shadow-[0_0_12px_#FFC107] z-50"
        />
      )}

      <motion.div
        initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
        className="w-full flex-1 flex flex-col"
      >
        {children}
      </motion.div>
    </div>
  );
}
