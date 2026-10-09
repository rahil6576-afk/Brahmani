'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from './ThemeProvider';

interface HangingLampProps {
  isActive: boolean;
  isHovered: boolean;
}

export default function HangingLamp({ isActive, isHovered }: HangingLampProps) {
  const { theme } = useTheme();
  const isNight = theme === 'night';
  const isIlluminated = isActive || isHovered;

  return (
    <div className="relative flex flex-col items-center pointer-events-none select-none h-11 w-16">
      {/* 1. Suspension Cable */}
      <div
        className={`w-[1.5px] h-3.5 transition-colors duration-300 ${
          isNight
            ? 'bg-gradient-to-b from-[#3A454F] via-[#2A333B] to-[#1E252B]'
            : 'bg-gradient-to-b from-[#A5ACB2] via-[#8E97A0] to-[#737A80]'
        }`}
      />

      {/* 2. Lamp Fixture & Bulb Assembly with Framer Motion Swing Physics */}
      <motion.div
        className="relative flex flex-col items-center origin-top"
        animate={
          isHovered
            ? { rotate: [0, -3.2, 2.8, -1.5, 0] }
            : isActive
            ? { rotate: [0, -1, 1, 0] }
            : { rotate: 0 }
        }
        transition={
          isHovered
            ? { duration: 1.6, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }
            : isActive
            ? { duration: 4, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }
            : { duration: 0.4 }
        }
      >
        {/* Metal ceiling cap / strain relief collar */}
        <div
          className={`w-2.5 h-1 border rounded-t-sm transition-colors duration-300 ${
            isNight
              ? 'bg-[#2C353D] border-[#3E4A54]/60'
              : 'bg-[#C2C9D0] border-[#9AA5AF]'
          }`}
        />

        {/* Industrial Bell / Flared Shade */}
        <svg
          width="18"
          height="10"
          viewBox="0 0 18 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-colors duration-300"
        >
          {/* Outer metal shade */}
          <path
            d="M9 0.5C6 0.5 5 3.5 2 7C1.2 8 0.5 8.8 0.5 9.5H17.5C17.5 8.8 16.8 8 16 7C13 3.5 12 0.5 9 0.5Z"
            fill={isNight ? "#1E262C" : "#D4D9DE"}
            stroke={isNight ? "#3C4852" : "#98A2AB"}
            strokeWidth="0.8"
          />
          {/* Inner reflective rim highlight */}
          <path
            d="M2.5 8.8H15.5"
            stroke={isIlluminated ? "#FFC107" : isNight ? "#4A5661" : "#A6B0B8"}
            strokeWidth="0.8"
            strokeLinecap="round"
            className="transition-colors duration-300"
          />
        </svg>

        {/* Bulb element */}
        <div className="relative -mt-[1px] flex items-center justify-center">
          <div
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              isIlluminated
                ? "bg-[#FFF0B3] shadow-[0_0_12px_3px_#FFC107,0_0_20px_6px_rgba(255,193,7,0.45)]"
                : isNight
                ? "bg-[#2A343D] border border-[#3E4A54]/70"
                : "bg-[#CCD3D9] border border-[#A2ADB7]"
            }`}
          >
            {isIlluminated && (
              <div className="w-1 h-1 bg-white rounded-full mx-auto mt-[2px] opacity-90 shadow-[0_0_4px_#FFF]" />
            )}
          </div>
        </div>

        {/* 3. Soft Radial Light Bloom */}
        <motion.div
          initial={false}
          animate={{
            opacity: isHovered ? 0.95 : isActive ? 0.75 : 0,
            scale: isHovered ? 1.2 : isActive ? 1 : 0.8,
          }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="absolute -top-1 w-12 h-12 rounded-full pointer-events-none -z-10"
          style={{
            background:
              "radial-gradient(circle, rgba(255, 193, 7, 0.45) 0%, rgba(255, 193, 7, 0.12) 50%, transparent 70%)",
            filter: "blur(4px)",
          }}
        />

        {/* 4. Downward Light Cone */}
        <motion.div
          initial={false}
          animate={{
            opacity: isHovered ? 0.85 : isActive ? 0.6 : 0,
            scaleY: isHovered ? 1.08 : isActive ? 1 : 0.7,
            scaleX: isHovered ? 1.15 : isActive ? 1 : 0.8,
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="absolute top-4 w-28 h-16 pointer-events-none origin-top -z-10"
          style={{
            clipPath: "polygon(42% 0%, 58% 0%, 100% 100%, 0% 100%)",
            background:
              "linear-gradient(180deg, rgba(255, 193, 7, 0.35) 0%, rgba(255, 193, 7, 0.12) 55%, transparent 100%)",
            filter: "blur(2.5px)",
          }}
        />
      </motion.div>
    </div>
  );
}
