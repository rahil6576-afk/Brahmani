'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useTheme } from './ThemeProvider';

export default function LightEnvironment() {
  const pathname = usePathname();
  const { themeProgress, pullProgress, isNight, isDragging } = useTheme();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  // Lamp illumination intensity:
  // In pure night (themeProgress = 0): lamp is lit at 100%.
  // If dragging in night: dims down smoothly as pulled (1 -> 0.15).
  // In day mode: lamp is off (0 intensity).
  const lampIntensity = isNight
    ? Math.max(0, 1 - (isDragging ? pullProgress * 0.85 : themeProgress * 1.5))
    : 0;

  // Sunrise Stage (Phase 5):
  // 0.0 - 0.40: Deep charcoal / starlight night
  // 0.40 - 0.70: Warm golden/amber sunrise horizon glow
  // 0.70 - 0.90: Soft morning cream illumination
  // 0.90 - 1.00: Full architectural daylight
  const amberOpacity = Math.max(
    0,
    Math.min(0.65, (themeProgress - 0.25) * 1.8) * (1 - Math.max(0, (themeProgress - 0.78) * 4.5))
  );

  const creamOpacity = Math.max(0, Math.min(1, (themeProgress - 0.6) * 2.5));

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30 overflow-hidden select-none"
    >
      {/* 1. CINEMATIC SUNRISE ATMOSPHERE LAYERS */}
      {/* Warm Amber Sunrise Horizon Layer (Phase 5) */}
      <div
        className="absolute inset-0 transition-opacity duration-300 ease-out"
        style={{
          opacity: amberOpacity,
          background:
            'radial-gradient(circle at 50% 120%, rgba(255, 170, 40, 0.45) 0%, rgba(230, 120, 20, 0.22) 40%, rgba(18, 14, 10, 0.0) 80%)',
          mixBlendMode: 'screen',
        }}
      />

      {/* Soft Morning Cream Wash Layer */}
      <div
        className="absolute inset-0 transition-opacity duration-500 ease-out"
        style={{
          opacity: creamOpacity * 0.45,
          background:
            'linear-gradient(180deg, rgba(255, 252, 245, 0.3) 0%, rgba(244, 243, 239, 0.5) 60%, transparent 100%)',
        }}
      />

      {/* 2. PHYSICAL LAMP ILLUMINATION ON NAVBAR & TOP HERO (Optimized for desktop) */}
      {/* Subtle warm wash centered beneath the hanging lamp location */}
      <div
        className={`hidden sm:block absolute top-0 left-0 w-[480px] h-[360px] pointer-events-none transition-opacity duration-500 ease-out ${
          isNight ? 'opacity-75' : 'opacity-0'
        }`}
        style={{
          background:
            'radial-gradient(ellipse at 88px 36px, rgba(255, 193, 7, 0.32) 0%, rgba(255, 180, 0, 0.12) 38%, rgba(255, 193, 7, 0.03) 65%, transparent 80%)',
          filter: 'blur(16px)',
          mixBlendMode: 'screen',
        }}
      />

      {/* Gentle ambient ceiling reflection along the navbar rail */}
      <div
        className={`absolute top-0 left-0 right-0 h-24 pointer-events-none transition-opacity duration-500 ease-out ${
          isNight ? 'opacity-45' : 'opacity-0'
        }`}
        style={{
          background:
            'linear-gradient(90deg, rgba(255, 193, 7, 0.22) 0%, rgba(255, 193, 7, 0.06) 24%, transparent 60%)',
        }}
      />

      {/* Ambient downward throw illuminating the top hero area (Desktop only for max mobile FPS) */}
      <div
        className={`hidden md:block absolute top-16 left-0 w-[640px] h-[480px] pointer-events-none transition-opacity duration-500 ease-out ${
          isNight ? 'opacity-55' : 'opacity-0'
        }`}
        style={{
          background:
            'radial-gradient(circle at 100px 60px, rgba(255, 200, 50, 0.16) 0%, rgba(255, 180, 20, 0.05) 45%, transparent 75%)',
          filter: 'blur(28px)',
        }}
      />

      {/* 3. CINEMATIC ULTRA-FINE FILM GRAIN (Desktop only: SVG feTurbulence is bypassed on mobile for butter-smooth Android scrolling) */}
      <div
        className="hidden md:block absolute inset-0 pointer-events-none opacity-[0.032]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          mixBlendMode: 'overlay',
        }}
      />
    </div>
  );
}
