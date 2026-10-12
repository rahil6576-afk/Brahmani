'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTheme } from './ThemeProvider';
import { useContent } from '@/lib/contentContext';

interface HeroVideoProps {
  posterImage?: string;
  children: React.ReactNode;
  heightClass?: string;
  themeContextLabel?: string;
  useVideo?: boolean;
}

export default function HeroVideo({
  posterImage = "/images/hero-solar-sunrise.jpg",
  children,
  heightClass = "min-h-[75vh] lg:min-h-[85vh]",
  useVideo = true,
}: HeroVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const nightVideoRef = useRef<HTMLVideoElement>(null);
  const dayVideoRef = useRef<HTMLVideoElement>(null);

  const { content } = useContent();
  const heroVideoNightSrc = content?.brand?.heroVideoNight || '/videos/hero-night.mp4';
  const heroVideoDaySrc = content?.brand?.heroVideoDay || '/videos/hero-day.mp4';
  const heroPosterSrc = content?.brand?.heroPoster || posterImage;

  const { theme, pullProgress, isDragging, themeProgress, reducedMotion } = useTheme();
  const isNight = theme === 'night';

  // Smart video performance: lazy-load day video only when needed or idle
  const [dayVideoLoaded, setDayVideoLoaded] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMobileDevice(window.innerWidth < 768);
    }
  }, []);

  // Preload day video when user starts dragging or after an idle grace period (desktop only)
  useEffect(() => {
    if (!useVideo || dayVideoLoaded) return;

    if (isDragging || theme === 'day' || themeProgress > 0.08) {
      setDayVideoLoaded(true);
      return;
    }

    // On desktop, lazily schedule day video load during browser idle
    if (typeof window !== 'undefined' && !isMobileDevice) {
      const timer = setTimeout(() => {
        setDayVideoLoaded(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [useVideo, dayVideoLoaded, isDragging, theme, themeProgress, isMobileDevice]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);
  const opacityFade = useTransform(scrollYProgress, [0, 0.85], [1, 0.25]);

  // Crossfade opacity managed smoothly via CSS transitions
  const nightOpacity = isNight ? 1 : 0;
  const dayOpacity = isNight ? 0 : 1;

  // Video performance optimization: Pause inactive video stream after crossfade completes
  useEffect(() => {
    if (!useVideo) return;

    let timer: NodeJS.Timeout | null = null;

    if (isNight) {
      if (nightVideoRef.current && nightVideoRef.current.paused) {
        nightVideoRef.current.play().catch(() => {});
      }
      timer = setTimeout(() => {
        if (dayVideoRef.current && !dayVideoRef.current.paused) {
          dayVideoRef.current.pause();
        }
      }, 750);
    } else {
      if (dayVideoRef.current && dayVideoLoaded && dayVideoRef.current.paused) {
        dayVideoRef.current.play().catch(() => {});
      }
      timer = setTimeout(() => {
        if (nightVideoRef.current && !nightVideoRef.current.paused) {
          nightVideoRef.current.pause();
        }
      }, 750);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [useVideo, isNight, dayVideoLoaded]);

  return (
    <section
      ref={containerRef}
      className={`relative w-full ${heightClass} flex items-center overflow-hidden pt-20 transition-colors duration-700 ${
        isNight ? 'bg-[#080B0D]' : 'bg-[#F4F3EF]'
      }`}
    >
      {/* 1. BACKGROUND LAYERS: DUAL VIDEO CROSSFADE OR PAGE-SPECIFIC CINEMATIC PHOTO */}
      <motion.div
        style={{ y: isMobileDevice ? '0%' : bgY }}
        className="absolute inset-0 w-full h-[120%] -top-[10%] select-none pointer-events-none"
      >
        {useVideo ? (
          <>
            {/* NIGHT VIDEO LAYER: Space-age electrical grid infrastructure */}
            <div
              className="absolute inset-0 w-full h-full transition-opacity duration-700 ease-out"
              style={{ opacity: nightOpacity }}
            >
              {/* Subtle slow camera movement on desktop, static on mobile for maximum battery & FPS */}
              <motion.div
                animate={
                  reducedMotion || isMobileDevice
                    ? { scale: 1 }
                    : { scale: [1, 1.035, 1] }
                }
                transition={{
                  duration: 22,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-full h-full relative"
              >
                <video
                  ref={nightVideoRef}
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster={heroPosterSrc}
                  preload="metadata"
                  className="w-full h-full object-cover object-center filter brightness-[0.96] contrast-[1.12]"
                >
                  <source src={heroVideoNightSrc} type="video/mp4" />
                </video>
              </motion.div>
            </div>

            {/* DAY VIDEO / POSTER LAYER: Sunny high-yield solar park footage */}
            <div
              className="absolute inset-0 w-full h-full transition-opacity duration-700 ease-out"
              style={{ opacity: dayOpacity }}
            >
              {dayVideoLoaded ? (
                <motion.div
                  animate={
                    reducedMotion || isMobileDevice
                      ? { scale: 1 }
                      : { scale: [1, 1.03, 1] }
                  }
                  transition={{
                    duration: 24,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-full h-full relative"
                >
                  <video
                    ref={dayVideoRef}
                    autoPlay
                    muted
                    loop
                    playsInline
                    poster={heroPosterSrc}
                    preload="metadata"
                    className="w-full h-full object-cover object-center filter brightness-[1.04] contrast-[1.04] saturate-[1.05]"
                  >
                    <source src={heroVideoDaySrc} type="video/mp4" />
                  </video>
                </motion.div>
              ) : (
                <div className="relative w-full h-full">
                  <Image
                    src={heroPosterSrc}
                    alt="Solar infrastructure daylight"
                    fill
                    priority={false}
                    className="object-cover object-center filter brightness-[1.04] contrast-[1.04]"
                    sizes="100vw"
                  />
                </div>
              )}
            </div>
          </>
        ) : (
          /* PAGE-SPECIFIC CINEMATIC PHOTOGRAPHIC HERO (Services / Products / Contact) */
          <motion.div
            animate={
              reducedMotion
                ? { scale: 1 }
                : { scale: [1, 1.03, 1] }
            }
            transition={{
              duration: 24,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-full h-full relative"
          >
            <Image
              src={posterImage}
              alt="Brahmani Engineering Infrastructure"
              fill
              priority
              className={`object-cover object-center transition-all duration-700 ${
                isNight
                  ? 'filter brightness-[0.88] contrast-[1.14]'
                  : 'filter brightness-[1.02] contrast-[1.04]'
              }`}
              sizes="100vw"
            />
          </motion.div>
        )}
      </motion.div>

      {/* 2. CINEMATIC GRADIENTS & READABILITY VIGNETTES */}
      {/* Night Cinematic Vignette (darker edges & warm lamp integration) */}
      <div
        className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-700"
        style={{
          opacity: nightOpacity,
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(8,11,13,0.35) 0%, rgba(8,11,13,0.78) 75%, rgba(6,8,10,0.95) 100%)",
        }}
      />

      {/* Night Text Readability Linear Left Mask */}
      <div
        className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-700"
        style={{
          opacity: nightOpacity,
          background:
            "linear-gradient(90deg, rgba(8,11,13,0.85) 0%, rgba(8,11,13,0.55) 45%, rgba(8,11,13,0.15) 75%, transparent 100%)",
        }}
      />

      {/* Day Sunlight Bloom & Clean Readability Overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-700"
        style={{
          opacity: dayOpacity,
          background:
            "linear-gradient(90deg, rgba(244,243,239,0.88) 0%, rgba(244,243,239,0.56) 42%, rgba(244,243,239,0.18) 78%, transparent 100%)",
        }}
      />

      {/* Vertical edge seam blending gradients */}
      <div
        className={`absolute inset-0 pointer-events-none z-10 transition-colors duration-700 ${
          isNight
            ? 'bg-gradient-to-t from-[#080B0D] via-transparent to-[#080B0D]/40'
            : 'bg-gradient-to-t from-[#F4F3EF] via-transparent to-[#F4F3EF]/30'
        }`}
      />

      {/* Engineering technical grid lines */}
      <div
        className={`absolute inset-0 bg-tech-grid pointer-events-none z-10 transition-opacity duration-500 ${
          isNight ? 'opacity-15' : 'opacity-10'
        }`}
      />

      {/* 3. SUBTLE ANIMATED ELECTRICAL CONDUIT LINE (Phase 9 & 10) */}
      <div className="absolute left-0 top-0 bottom-0 w-[2.5px] z-20 overflow-hidden pointer-events-none">
        <div
          className={`w-full h-full transition-colors duration-500 ${
            isNight ? 'bg-[#182128]' : 'bg-[#DCDAD2]'
          }`}
        />
        <motion.div
          className="absolute left-0 w-full h-52 bg-gradient-to-b from-transparent via-[#FFC107] to-transparent shadow-[0_0_14px_#FFC107]"
          animate={
            reducedMotion
              ? {}
              : {
                  top: ["-30%", "130%"],
                }
          }
          transition={{
            duration: 5.5,
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 0.8,
          }}
        />
      </div>

      {/* Horizontal bottom circuit demarcation line */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-[1px] z-20 transition-colors duration-500 ${
          isNight ? 'bg-[#1C252E]' : 'bg-[#DDDCD4]'
        }`}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-transparent via-[#FFC107] to-transparent"
          animate={
            reducedMotion
              ? {}
              : {
                  x: ["-100%", "200%"],
                }
          }
          transition={{
            duration: 7,
            ease: "linear",
            repeat: Infinity,
          }}
          style={{ width: "30%" }}
        />
      </div>

      {/* 4. FOREGROUND HERO CONTENT WITH PARALLAX */}
      <motion.div
        style={{ y: contentY, opacity: opacityFade }}
        className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 sm:py-20"
      >
        {children}
      </motion.div>
    </section>
  );
}
