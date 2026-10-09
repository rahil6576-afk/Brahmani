'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useSpring } from 'framer-motion';
import { useTheme } from './ThemeProvider';

interface InteractivePanelImageProps {
  src: string;
  alt: string;
  className?: string;
  isSolar?: boolean;
}

export default function InteractivePanelImage({
  src,
  alt,
  className = '',
  isSolar = false,
}: InteractivePanelImageProps) {
  const { reducedMotion } = useTheme();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Springs for 3D perspective tilt
  const springConfig = { stiffness: 320, damping: 25 };
  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Subtle max tilt of +/- 7 degrees
    const rX = -((y - centerY) / centerY) * 7;
    const rY = ((x - centerX) / centerX) * 7;

    rotateX.set(rX);
    rotateY.set(rY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-cursor="image"
      className={`relative overflow-hidden [perspective:900px] select-none ${className}`}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative w-full h-full will-change-transform"
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover object-center filter contrast-[1.06] transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 50vw"
        />

        {/* Subtle yellow solar light sweep traveling across the panel on hover */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={false}
          animate={
            isHovered && !reducedMotion
              ? {
                  x: ['-100%', '200%'],
                  opacity: [0, 0.85, 0],
                }
              : { opacity: 0 }
          }
          transition={{
            duration: 0.9,
            ease: 'easeInOut',
          }}
          style={{
            background:
              'linear-gradient(115deg, transparent 20%, rgba(255, 193, 7, 0.25) 45%, rgba(255, 255, 255, 0.45) 50%, rgba(255, 193, 7, 0.15) 55%, transparent 80%)',
          }}
        />
      </motion.div>
    </div>
  );
}
