'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { useTheme } from './ThemeProvider';
import { playCordTensionSound, playSwitchClick, playPowerSurgeSound } from '@/lib/audio';

const DEFAULT_THRESHOLD = 125;
const MAX_LATERAL_BEND = 28; // Max horizontal bend in px

export default function ThemeLamp() {
  const {
    theme,
    toggleTheme,
    setPullProgress,
    setIsDragging,
    reducedMotion,
  } = useTheme();

  const isNight = theme === 'night';
  const [isPointerDown, setIsPointerDown] = useState(false);
  const [dragYState, setDragYState] = useState(0);
  const [threshold, setThreshold] = useState(DEFAULT_THRESHOLD);

  useEffect(() => {
    const updateThreshold = () => {
      setThreshold(window.innerWidth < 768 ? 75 : DEFAULT_THRESHOLD);
    };
    updateThreshold();
    window.addEventListener('resize', updateThreshold);
    return () => window.removeEventListener('resize', updateThreshold);
  }, []);

  const startPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastPosRef = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });
  const velXRef = useRef<number>(0);
  const tensionSoundPlayedRef = useRef(false);

  // Springs for realistic physical inertia and elasticity
  // 1. Vertical cord stretch
  const cordSpringY = useSpring(0, { stiffness: 420, damping: 26, mass: 0.75 });
  // 2. Lateral cable bend (spring interpolation for path curve)
  const cordSpringX = useSpring(0, { stiffness: 320, damping: 20, mass: 0.65 });
  // 3. Directional lamp fixture swing (pendulum rocking with natural underdamped harmonic oscillation)
  const lampSwingSpring = useSpring(0, { stiffness: 85, damping: 7.2, mass: 1.25 });

  // Update cord spring coordinates
  const [lateralX, setLateralX] = useState(0);

  // Sync state to springs
  useEffect(() => {
    cordSpringX.set(lateralX);
  }, [lateralX, cordSpringX]);

  // Derived intensity of lamp bulb (1 = night bright, 0 = day off, dims when pulling in night)
  const dragFraction = Math.min(1, Math.max(0, dragYState / threshold));
  const lampBulbIntensity = isNight
    ? Math.max(0.1, 1 - dragFraction * 0.9)
    : Math.min(0.9, dragFraction * 0.9);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    setIsPointerDown(true);
    setIsDragging(true);
    tensionSoundPlayedRef.current = false;
    startPosRef.current = { x: e.clientX, y: e.clientY };
    lastPosRef.current = { x: e.clientX, y: e.clientY, time: performance.now() };
    velXRef.current = 0;
  };

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isPointerDown) return;

      const now = performance.now();
      const dt = Math.max(1, now - lastPosRef.current.time);
      const instantVx = (e.clientX - lastPosRef.current.x) / dt;
      velXRef.current = velXRef.current * 0.6 + instantVx * 0.4;
      lastPosRef.current = { x: e.clientX, y: e.clientY, time: now };

      const deltaY = Math.max(0, e.clientY - startPosRef.current.y);
      const deltaX = e.clientX - startPosRef.current.x;

      // Soft damping resistance after passing threshold
      const dampedDeltaY =
        deltaY > threshold
          ? threshold + (deltaY - threshold) * 0.18
          : deltaY;

      // Clamped smooth lateral displacement (cable bends toward pull)
      const clampedDeltaX = Math.max(-MAX_LATERAL_BEND, Math.min(MAX_LATERAL_BEND, deltaX * 0.45));

      setDragYState(dampedDeltaY);
      setLateralX(clampedDeltaX);
      cordSpringY.set(dampedDeltaY);

      const prog = Math.min(1, dampedDeltaY / threshold);

      // Play soft tension friction sound on initial pull
      if (prog > 0.12 && !tensionSoundPlayedRef.current) {
        tensionSoundPlayedRef.current = true;
        if (!reducedMotion) playCordTensionSound();
      }

      // Directional tilt of lamp while cord is being pulled laterally
      // Pull left (negative deltaX) -> tilt lamp left; Pull right -> tilt right
      const pullTilt = (clampedDeltaX / MAX_LATERAL_BEND) * 5 + (prog * (clampedDeltaX >= 0 ? 1.6 : -1.6));
      lampSwingSpring.set(pullTilt);
    },
    [isPointerDown, reducedMotion, cordSpringY, lampSwingSpring, threshold]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!isPointerDown) return;
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
      setIsPointerDown(false);
      setIsDragging(false);

      const thresholdReached = dragYState >= threshold * 0.85;

      if (thresholdReached) {
        if (!reducedMotion) {
          playSwitchClick();
          // Power surge sound as theme changes
          setTimeout(() => {
            playPowerSurgeSound(!isNight);
          }, 35);
        }
        toggleTheme();
      }

      // Physical Pendulum Release Swing:
      // When released from lateral displacement, the lamp fixture swings across equilibrium to the opposite side,
      // oscillates back and forth with diminishing amplitude (underdamped harmonic motion), and settles.
      if (!reducedMotion) {
        const releaseDir = lateralX !== 0 ? (lateralX > 0 ? 1 : -1) : (velXRef.current > 0 ? 1 : -1);
        const impulseMagnitude = Math.min(10, Math.abs(lateralX) * 0.35 + Math.abs(velXRef.current) * 5.5);
        
        // Push in opposite direction and let the underdamped spring naturally oscillate and settle to 0
        lampSwingSpring.set(-releaseDir * impulseMagnitude);
        // Animate naturally to rest at 0
        requestAnimationFrame(() => {
          lampSwingSpring.set(0);
        });
      } else {
        lampSwingSpring.set(0);
      }

      // Snap back cord
      setDragYState(0);
      setLateralX(0);
      cordSpringY.set(0);
      cordSpringX.set(0);
      setPullProgress(0);
    },
    [isPointerDown, dragYState, lateralX, isNight, reducedMotion, toggleTheme, setIsDragging, setPullProgress, cordSpringY, cordSpringX, lampSwingSpring]
  );

  // Accessible click / keyboard toggle
  const handleAccessibleClick = () => {
    if (!reducedMotion) {
      playSwitchClick();
      playPowerSurgeSound(!isNight);
    }
    toggleTheme();
  };

  // SVG Cable Coordinates:
  // Cord starts from lamp bottom collar (x=28, y=0), curves via control point with inertia, ends at handle (x=28+lateralX, y=endY)
  const baseCordLen = 30;
  const currentDragY = dragYState;
  const endX = 28 + lateralX;
  const endY = baseCordLen + currentDragY * 0.42;
  // Non-linear bending: control point deflects slightly more to create realistic cable sag/arc
  const ctrlX = 28 + lateralX * 0.55;
  const ctrlY = endY * 0.52;
  const cablePath = `M 28 0 Q ${ctrlX.toFixed(1)} ${ctrlY.toFixed(1)} ${endX.toFixed(1)} ${endY.toFixed(1)}`;

  return (
    <div className="relative flex flex-col items-center select-none" style={{ zIndex: 60 }}>
      {/* 1. Main Suspension Cable from Ceiling/Navbar top */}
      <div className="w-[2px] h-6 sm:h-7 bg-gradient-to-b from-[#2E3740] via-[#1B2329] to-[#12181E]" />

      {/* 2. Metal Lamp Housing with directional spring pendulum swing */}
      <motion.div
        style={{
          rotate: lampSwingSpring,
          y: useTransform(cordSpringY, [0, DEFAULT_THRESHOLD], [0, 6]),
        }}
        className="relative flex flex-col items-center origin-top transition-transform"
      >
        {/* Ceiling socket / industrial collar */}
        <div className="w-5 h-2 bg-[#2E3740] border border-[#3E4A55] rounded-t-sm shadow-md" />

        {/* Industrial Flared Metal Shade */}
        <div className="relative">
          <svg
            width="58"
            height="27"
            viewBox="0 0 58 27"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="filter drop-shadow-md"
          >
            {/* Dark industrial metal shade */}
            <path
              d="M29 2C20 2 15 10 3 23C1.5 24.5 0.5 26 0.5 26.5H57.5C57.5 26 56.5 24.5 55 23C43 10 38 2 29 2Z"
              fill={isNight ? '#131A21' : '#2A343D'}
              stroke="#3D4B57"
              strokeWidth="1.2"
            />
            {/* Reflector rim band */}
            <path
              d="M4 25.5H54"
              stroke={lampBulbIntensity > 0.25 ? '#FFC107' : '#4A5865'}
              strokeWidth="1.6"
              strokeLinecap="round"
              className="transition-colors duration-300"
            />
          </svg>

          {/* Lamp shade top heat cooling vents */}
          <div className="absolute top-1 left-1/2 -translate-x-1/2 flex gap-1">
            <span className="w-1 h-1 bg-[#0A0D0F] rounded-full" />
            <span className="w-1 h-1 bg-[#0A0D0F] rounded-full" />
            <span className="w-1 h-1 bg-[#0A0D0F] rounded-full" />
          </div>
        </div>

        {/* 3. Bulb Assembly */}
        <div className="relative -mt-1 flex items-center justify-center">
          <motion.div
            animate={{
              scale: lampBulbIntensity > 0.3 ? [1, 1.025, 1] : 1,
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative w-5 h-5 rounded-full flex items-center justify-center transition-colors duration-200"
            style={{
              backgroundColor:
                lampBulbIntensity > 0.2
                  ? `rgba(255, 235, 150, ${0.35 + lampBulbIntensity * 0.65})`
                  : '#28323B',
              boxShadow:
                lampBulbIntensity > 0.15
                  ? `0 0 ${16 * lampBulbIntensity}px ${6 * lampBulbIntensity}px #FFC107, 0 0 ${38 * lampBulbIntensity}px ${14 * lampBulbIntensity}px rgba(255,193,7,0.45)`
                  : 'none',
              border: '1px solid rgba(255,193,7,0.3)',
            }}
          >
            {/* Glowing Edison Filament spark when lit */}
            {lampBulbIntensity > 0.2 && (
              <div
                className="w-2 h-2 rounded-full bg-white shadow-[0_0_6px_#FFF]"
                style={{ opacity: lampBulbIntensity }}
              />
            )}
          </motion.div>
        </div>

        {/* 4. Realistic Radial Bloom & Environmental Downward Light Cone */}
        {lampBulbIntensity > 0.05 && (
          <>
            {/* Soft radial glow around fixture */}
            <div
              className="absolute -top-7 w-40 h-40 rounded-full pointer-events-none -z-10 transition-opacity duration-200"
              style={{
                opacity: lampBulbIntensity * 0.85,
                background:
                  'radial-gradient(circle, rgba(255, 193, 7, 0.48) 0%, rgba(255, 193, 7, 0.14) 55%, transparent 75%)',
                filter: 'blur(9px)',
              }}
            />

            {/* Downward light cone illuminating navigation and top hero */}
            <div
              className="absolute top-8 w-88 h-104 pointer-events-none origin-top -z-10 transition-opacity duration-200"
              style={{
                opacity: lampBulbIntensity * 0.72,
                clipPath: 'polygon(36% 0%, 64% 0%, 100% 100%, 0% 100%)',
                background:
                  'linear-gradient(180deg, rgba(255, 193, 7, 0.44) 0%, rgba(255, 193, 7, 0.16) 42%, rgba(255, 193, 7, 0.03) 78%, transparent 100%)',
                filter: 'blur(7px)',
              }}
            />
          </>
        )}

        {/* 5. PHYSICAL PULL CORD (SVG CABLE WITH INERTIA & LATERAL BEND) */}
        <div className="relative flex flex-col items-center mt-0.5">
          {/* Static fixture nipple */}
          <div className="w-[1.5px] h-2 bg-[#4A5560]" />

          {/* Draggable interactive area with exact coordinate pinning */}
          <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            data-cursor="lamp"
            className="relative cursor-grab active:cursor-grabbing touch-none group w-14 select-none"
            style={{ height: `${endY + 36}px` }}
            title={isNight ? 'Pull down to illuminate day mode' : 'Pull down to power night mode'}
            role="button"
            tabIndex={0}
            aria-label={isNight ? 'Turn lamp off - switch to day mode' : 'Turn lamp on - switch to night mode'}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleAccessibleClick();
              }
            }}
          >
            {/* SVG Cable for smooth non-linear bending */}
            <svg
              width="56"
              height={endY + 4}
              className="absolute top-0 left-0 overflow-visible pointer-events-none"
            >
              {/* Cable stroke with realistic depth gradient */}
              <defs>
                <linearGradient id="cableGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#4F5D6B" />
                  <stop offset="60%" stopColor="#8796A5" />
                  <stop offset="100%" stopColor="#D5DEE5" />
                </linearGradient>
              </defs>
              <path
                d={cablePath}
                stroke="url(#cableGrad)"
                strokeWidth="1.8"
                strokeLinecap="round"
                fill="none"
              />
            </svg>

            {/* Industrial Brass / Anodized Pull Knob Handle - locked directly to end of cable */}
            <div
              style={{
                transform: `translate(${lateralX}px, ${endY}px)`,
              }}
              className={`absolute top-0 left-1/2 -ml-[7px] w-3.5 h-6 rounded-xs border transition-colors duration-150 flex flex-col items-center justify-center shadow-lg pointer-events-none ${
                isPointerDown
                  ? 'bg-[#FFC107] border-[#FFF] scale-105 shadow-[0_0_12px_#FFC107]'
                  : 'bg-[#29333D] group-hover:bg-[#3D4C5A] border-[#4E5D6C] group-hover:border-[#FFC107]/80'
              }`}
            >
              {/* Knurled grip ridges */}
              <div className="w-2 h-[1px] bg-[#6B7B8B] mb-0.5" />
              <div className="w-2 h-[1px] bg-[#6B7B8B] mb-0.5" />
              <div className="w-2 h-[1px] bg-[#6B7B8B]" />
            </div>

            {/* Micro instruction badge on hover / drag / mobile hint */}
            <div
              style={{
                transform: `translate(${lateralX}px, ${endY + 28}px)`,
              }}
              className={`absolute top-0 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-mono tracking-widest px-2 py-0.5 pointer-events-none transition-all duration-200 border ${
                isPointerDown
                  ? 'bg-[#FFC107] text-[#0A0D0F] border-[#FFC107] opacity-100'
                  : 'bg-[#0E1419]/90 text-[#A5ACB2] border-[#222B34] opacity-0 group-hover:opacity-100'
              }`}
            >
              {isPointerDown
                ? dragYState >= threshold * 0.85
                  ? 'RELEASE TO SWITCH'
                  : 'PULL DOWN'
                : isNight
                ? 'PULL FOR DAY'
                : 'PULL FOR NIGHT'}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
