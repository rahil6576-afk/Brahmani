'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { CheckCircle2, Zap, Users, Award } from 'lucide-react';
import { STATISTICS } from '@/lib/constants';
import { useTheme } from './ThemeProvider';
import { useContent } from '@/lib/contentContext';

function CounterNumber({ targetValue, suffix }: { targetValue: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const duration = 1800;
    const stepTime = 32;
    const steps = Math.floor(duration / stepTime);
    const increment = targetValue / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setCount(targetValue);
        clearInterval(timer);
      } else {
        start += increment;
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isInView, targetValue]);

  return (
    <span ref={ref} className="font-mono tracking-tight">
      {count}
      <span className="text-[#FFC107] font-semibold">{suffix}</span>
    </span>
  );
}

const STAT_ICONS = [CheckCircle2, Zap, Users, Award];

export default function StatStrip() {
  const { theme } = useTheme();
  const { content } = useContent();
  const stats = content?.statistics?.length ? content.statistics : STATISTICS;
  const isNight = theme === 'night';

  return (
    <section
      className={`relative w-full border-y py-8 lg:py-10 transition-colors duration-700 ${
        isNight
          ? 'bg-[#0D1217] border-[#1E262E]'
          : 'bg-[#FFFFFF] border-[#E0DDD4]'
      }`}
    >
      {/* Background Micro Grid */}
      <div className="absolute inset-0 bg-tech-grid opacity-15 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          className={`grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x ${
            isNight ? 'divide-[#222B34]' : 'divide-[#E8E6DE]'
          }`}
        >
          {stats.map((stat, idx) => {
            const Icon = STAT_ICONS[idx % STAT_ICONS.length];

            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 32, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.25, margin: "0px 0px -30px 0px" }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.21, 1, 0.36, 1] }}
                className="flex flex-col px-3 sm:px-6 lg:px-8 group"
              >
                {/* Small technical header with icon */}
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-3.5 h-3.5 text-[#FFC107] shrink-0" />
                  <span
                    className={`text-[10px] sm:text-[11px] font-mono tracking-widest uppercase ${
                      isNight ? 'text-[#737A80]' : 'text-[#848F9A]'
                    }`}
                  >
                    SYS.METRIC 0{idx + 1}
                  </span>
                </div>

                {/* Large Number with Count-Up Animation */}
                <div
                  className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-none mb-2 ${
                    isNight ? 'text-[#F5F5F2]' : 'text-[#11161A]'
                  }`}
                >
                  <CounterNumber targetValue={stat.value} suffix={stat.suffix} />
                </div>

                {/* Small Technical Label */}
                <div
                  className={`text-xs sm:text-sm font-semibold tracking-wider uppercase ${
                    isNight ? 'text-[#A5ACB2]' : 'text-[#48535D]'
                  }`}
                >
                  {stat.label}
                </div>

                {/* Descriptive subtext */}
                <div
                  className={`text-[11px] mt-1 leading-snug line-clamp-1 ${
                    isNight ? 'text-[#5A646D]' : 'text-[#7A8692]'
                  }`}
                >
                  {stat.description}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
