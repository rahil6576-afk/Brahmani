'use client';

import React, { useRef, useState } from 'react';
import { motion, useSpring } from 'framer-motion';
import { useTheme } from './ThemeProvider';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  strength?: number; // max offset in px (5 - 12px)
}

export default function MagneticButton({
  children,
  className = '',
  onClick,
  strength = 9,
}: MagneticButtonProps) {
  const { reducedMotion } = useTheme();
  const ref = useRef<HTMLDivElement>(null);

  const springConfig = { stiffness: 280, damping: 20, mass: 0.5 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();

    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const deltaX = (clientX - centerX) / (width / 2);
    const deltaY = (clientY - centerY) / (height / 2);

    x.set(deltaX * strength);
    y.set(deltaY * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}
