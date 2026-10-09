'use client';

import React from 'react';
import { useTheme } from './ThemeProvider';

export default function PowerStatus({ className = '' }: { className?: string }) {
  const { isNight, themeProgress } = useTheme();

  return (
    <div
      className={`border px-3.5 py-1.5 flex items-center gap-4 text-[10px] font-mono select-none transition-colors duration-500 ${
        isNight
          ? 'bg-[#0E1419]/90 border-[#202932] text-[#A5ACB2]'
          : 'bg-[#FFFFFF]/90 border-[#DDDCD4] text-[#3D4752]'
      } ${className}`}
    >
      {/* Pulse dot & indicator */}
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFC107] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FFC107]" />
        </span>
        <span className="font-bold tracking-wider uppercase text-[#FFC107]">
          SYSTEM TELEMETRY
        </span>
      </div>

      <div className="hidden sm:flex items-center gap-3 border-l border-[#242E38] pl-3">
        <span>GRID: <strong className={isNight ? 'text-[#F5F5F2]' : 'text-[#11161A]'}>ONLINE</strong></span>
        <span>•</span>
        <span>SOLAR: <strong className="text-[#FFC107]">ACTIVE</strong></span>
        <span>•</span>
        <span>INVERTERS: <strong className={isNight ? 'text-[#F5F5F2]' : 'text-[#11161A]'}>SYNCHRONIZED</strong></span>
      </div>

      {/* Honest verification label */}
      <div className="border-l border-[#242E38] pl-3 text-[9px] uppercase tracking-widest text-[#737F8C]">
        SIMULATION
      </div>
    </div>
  );
}
