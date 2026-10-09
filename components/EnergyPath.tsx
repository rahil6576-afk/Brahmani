'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from './ThemeProvider';

interface EnergyPathProps {
  className?: string;
  variant?: 'horizontal' | 'stepped' | 'corner';
  width?: number;
  height?: number;
}

export default function EnergyPath({
  className = '',
  variant = 'stepped',
  width = 320,
  height = 48,
}: EnergyPathProps) {
  const { isNight, reducedMotion } = useTheme();

  // Subtle path definitions
  let d = 'M 0 24 L 320 24';
  if (variant === 'stepped') {
    d = 'M 0 12 L 140 12 L 180 36 L 320 36';
  } else if (variant === 'corner') {
    d = 'M 0 8 L 220 8 L 220 40 L 320 40';
  }

  const baseStroke = isNight ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';

  return (
    <div className={`relative overflow-visible pointer-events-none select-none ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        {/* Static infrastructure base track */}
        <path
          d={d}
          stroke={baseStroke}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeDasharray="4 4"
        />

        {/* Traveling energy photon pulse */}
        {!reducedMotion && (
          <>
            <motion.path
              d={d}
              stroke="#FFC107"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="40 280"
              initial={{ strokeDashoffset: 320 }}
              animate={{ strokeDashoffset: -320 }}
              transition={{
                duration: 4.8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                filter: 'drop-shadow(0 0 4px #FFC107)',
              }}
            />
            {/* Terminal node spark */}
            <circle cx="0" cy="12" r="2" fill="#FFC107" opacity="0.6" />
            <circle cx="320" cy="36" r="2" fill="#FFC107" opacity="0.8" />
          </>
        )}
      </svg>
    </div>
  );
}
