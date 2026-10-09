'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useTheme } from './ThemeProvider';

type CursorVariant = 'default' | 'link' | 'product' | 'image' | 'lamp';

export default function CustomCursor() {
  const pathname = usePathname();
  const { reducedMotion } = useTheme();
  const [enabled, setEnabled] = useState(false);
  const [variant, setVariant] = useState<CursorVariant>('default');
  const [cursorText, setCursorText] = useState('');

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);

  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const isVisible = useRef(false);

  useEffect(() => {
    // Disable on touch / coarse pointer devices or screens under 1024px or reduced motion
    if (typeof window === 'undefined') return;

    const isTouch =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches ||
      window.innerWidth < 1024;

    if (isTouch || reducedMotion) {
      setEnabled(false);
      return;
    }
    setEnabled(true);

    let animId: number;

    const onTouch = () => {
      setEnabled(false);
      isVisible.current = false;
      if (cursorDotRef.current) cursorDotRef.current.style.opacity = '0';
      if (cursorRingRef.current) cursorRingRef.current.style.opacity = '0';
    };

    window.addEventListener('touchstart', onTouch, { passive: true });

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible.current) {
        isVisible.current = true;
        if (cursorDotRef.current) cursorDotRef.current.style.opacity = '1';
        if (cursorRingRef.current) cursorRingRef.current.style.opacity = '1';
      }

      // Check hover targets
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorTarget = target.closest('[data-cursor]') as HTMLElement | null;
      if (cursorTarget) {
        const customType = cursorTarget.getAttribute('data-cursor') as CursorVariant;
        setVariant(customType || 'default');
        if (customType === 'lamp') setCursorText('PULL ↓');
        else if (customType === 'image') setCursorText('EXPLORE +');
        else setCursorText('');
        return;
      }

      // Interactive link/button check
      const isInteractive = target.closest('a, button, [role="button"], input, select');
      if (isInteractive) {
        setVariant('link');
        setCursorText('');
      } else {
        setVariant('default');
        setCursorText('');
      }
    };

    const onMouseLeave = () => {
      isVisible.current = false;
      if (cursorDotRef.current) cursorDotRef.current.style.opacity = '0';
      if (cursorRingRef.current) cursorRingRef.current.style.opacity = '0';
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);

    // Smooth physics trailing loop with requestAnimationFrame
    const updateCursor = () => {
      // Lerp ring towards dot
      const rx = ringPos.current.x;
      const ry = ringPos.current.y;
      const mx = mousePos.current.x;
      const my = mousePos.current.y;

      const nrx = rx + (mx - rx) * 0.22;
      const nry = ry + (my - ry) * 0.22;
      ringPos.current = { x: nrx, y: nry };

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      }
      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate3d(${nrx}px, ${nry}px, 0)`;
      }

      animId = requestAnimationFrame(updateCursor);
    };

    animId = requestAnimationFrame(updateCursor);

    return () => {
      window.removeEventListener('touchstart', onTouch);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, [reducedMotion]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      data-custom-cursor-root="true"
      className="pointer-events-none fixed inset-0 z-100 overflow-hidden select-none"
    >
      {/* 1. Precision Centered Dot */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 -ml-[3px] -mt-[3px] w-1.5 h-1.5 rounded-full bg-[#FFC107] opacity-0 transition-opacity duration-300 will-change-transform shadow-[0_0_6px_#FFC107]"
      />

      {/* 2. Responsive Ring & Interaction Badge */}
      <div
        ref={cursorRingRef}
        className={`fixed top-0 left-0 flex items-center justify-center opacity-0 transition-all duration-200 will-change-transform ${
          variant === 'default'
            ? '-ml-3 -mt-3 w-6 h-6 rounded-full border border-[#FFC107]/35 bg-transparent'
            : variant === 'link'
            ? '-ml-4 -mt-4 w-8 h-8 rounded-full border border-[#FFC107] bg-[#FFC107]/10 scale-105'
            : variant === 'product'
            ? '-ml-5 -mt-5 w-10 h-10 rounded-full border border-[#FFC107] bg-[#FFC107]/15 shadow-[0_0_12px_rgba(255,193,7,0.3)]'
            : variant === 'lamp'
            ? '-ml-6 -mt-6 w-12 h-12 rounded-full border border-[#FFC107] bg-[#0A0D0F]/90 text-[#FFC107]'
            : '-ml-8 -mt-8 w-16 h-16 rounded-full border border-[#FFC107] bg-[#0A0D0F]/90 text-[#FFC107]'
        }`}
      >
        {cursorText && (
          <span className="text-[9px] font-mono font-bold tracking-widest text-[#FFC107] whitespace-nowrap">
            {cursorText}
          </span>
        )}
      </div>
    </div>
  );
}
