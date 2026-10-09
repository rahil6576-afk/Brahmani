'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Sun, Cpu, ShieldCheck, Wrench, Gauge } from 'lucide-react';
import { ServiceItem } from '@/lib/constants';
import { useTheme } from './ThemeProvider';

const ICON_MAP: Record<string, React.ElementType> = {
  zap: Zap,
  sun: Sun,
  cpu: Cpu,
  'shield-check': ShieldCheck,
  wrench: Wrench,
  gauge: Gauge,
};

interface ServiceCardProps {
  service: ServiceItem;
  index: number;
}

export default function ServiceCard({ service, index }: ServiceCardProps) {
  const { theme } = useTheme();
  const isNight = theme === 'night';
  const [isHovered, setIsHovered] = useState(false);
  const Icon = ICON_MAP[service.icon] || Zap;

  return (
    <motion.div
      initial={{ opacity: 0, y: 45, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2, margin: "0px 0px -40px 0px" }}
      transition={{
        duration: 0.65,
        delay: index * 0.12,
        ease: [0.21, 1, 0.36, 1],
      }}
      className="h-full"
    >
      <Link
        href={`/services#${service.id}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        data-cursor="image"
        className={`group relative block overflow-hidden transition-colors duration-500 h-[380px] sm:h-[420px] flex flex-col justify-between p-6 sm:p-8 border ${
          isNight
            ? 'bg-[#0F1418] border-[#1E2730] hover:border-[#FFC107]/40'
            : 'bg-[#FFFFFF] border-[#E2E0D8] hover:border-[#FFC107]/50 shadow-sm'
        }`}
      >
      {/* 1. Image reveals behind content on hover */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            scale: isHovered ? 1.05 : 1,
            opacity: isHovered ? (isNight ? 0.72 : 0.85) : (isNight ? 0.38 : 0.68),
          }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full h-full"
        >
          <Image
            src={service.image}
            alt={service.title}
            fill
            className="object-cover object-center filter contrast-[1.08] saturate-[1.1]"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </motion.div>
        {/* Readability gradient over the image - keeping photo crisp while guaranteeing text contrast */}
        <div
          className={`absolute inset-0 ${
            isNight
              ? 'bg-gradient-to-t from-[#0F1418] via-[#0F1418]/65 to-transparent'
              : 'bg-gradient-to-t from-white/90 via-white/60 to-white/20'
          }`}
        />
      </div>

      {/* 2. Top Bar: Big Number & Industrial Icon */}
      <div
        className={`relative z-10 flex items-center justify-between border-b pb-5 ${
          isNight ? 'border-[#222B34]' : 'border-[#DCD8CD]'
        }`}
      >
        <span
          className={`font-mono text-3xl sm:text-4xl font-extrabold tracking-tighter transition-colors duration-300 ${
            isNight
              ? 'text-[#5C6670] group-hover:text-[#FFC107]'
              : 'text-[#2D3A47] group-hover:text-[#B28200]'
          }`}
        >
          {service.number}
        </span>
        <div
          className={`w-10 h-10 rounded-none border flex items-center justify-center text-[#FFC107] transition-colors duration-300 ${
            isNight
              ? 'bg-[#161D24] border-[#26313C] group-hover:border-[#FFC107]/50 group-hover:bg-[#FFC107]/10'
              : 'bg-white border-[#CCC8BD] group-hover:border-[#FFC107] group-hover:bg-[#FFF8E1] text-[#B28200] shadow-xs'
          }`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {/* 3. Middle: Title & Description */}
      <div className="relative z-10 my-auto py-4">
        <div
          className={`text-[11px] font-mono tracking-widest uppercase mb-1.5 font-bold ${
            isNight ? 'text-[#798590]' : 'text-[#2B3744]'
          }`}
        >
          {service.tagline}
        </div>
        <h3
          className={`text-xl sm:text-2xl font-bold tracking-tight uppercase transition-colors duration-300 ${
            isNight
              ? 'text-[#F5F5F2] group-hover:text-white'
              : 'text-[#0E1318] group-hover:text-black'
          }`}
        >
          {service.title}
        </h3>
        <p
          className={`mt-3 text-xs sm:text-sm leading-relaxed line-clamp-3 font-normal ${
            isNight ? 'text-[#8A949D]' : 'text-[#1F2933]'
          }`}
        >
          {service.description}
        </p>

        {/* Engineering Technical Specs HUD revealed on hover */}
        <div className={`mt-4 pt-3 border-t ${isNight ? 'border-[#1E262E]/60' : 'border-[#DDD8CD]'}`}>
          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
            {service.specs.map((sp, idx) => (
              <div
                key={`${service.id || service.title}-spec-${idx}-${sp.label}`}
                className={`p-1.5 border transition-all duration-300 ${
                  isHovered
                    ? isNight
                      ? 'bg-[#141B22]/95 border-[#FFC107]/50 shadow-[0_0_8px_rgba(255,193,7,0.15)]'
                      : 'bg-white border-[#B28200]/70 shadow-sm'
                    : isNight
                    ? 'bg-[#12181E]/60 border-[#1E262E]'
                    : 'bg-white/90 border-[#D4D0C5]'
                }`}
              >
                <span
                  className={`block uppercase text-[8px] truncate font-bold ${
                    isNight ? 'text-[#6A7682]' : 'text-[#3E4D5D]'
                  }`}
                >
                  {sp.label}
                </span>
                <span className={`block font-bold truncate mt-0.5 ${
                  isNight ? 'text-[#FFC107]' : 'text-[#B28200]'
                }`}>
                  {sp.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Bottom Action & Animated Yellow Line */}
      <div
        className={`relative z-10 pt-4 border-t flex items-center justify-between ${
          isNight ? 'border-[#1F2730]' : 'border-[#DCD8CD]'
        }`}
      >
        <span
          className={`text-xs font-bold tracking-wider uppercase transition-colors duration-300 font-mono ${
            isNight
              ? 'text-[#A5ACB2] group-hover:text-[#FFC107]'
              : 'text-[#1F2933] group-hover:text-[#B28200]'
          }`}
        >
          EXPLORE CAPABILITIES
        </span>

        <div className={`flex items-center ${isNight ? 'text-[#FFC107]' : 'text-[#B28200]'}`}>
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" />
        </div>
      </div>

      {/* Expanding yellow line along the bottom border */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden pointer-events-none ${
          isNight ? 'bg-[#222B34]' : 'bg-[#E0DDD5]'
        }`}
      >
        <motion.div
          animate={{
            scaleX: isHovered ? 1 : 0,
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="w-full h-full bg-[#FFC107] shadow-[0_0_8px_#FFC107] origin-left"
        />
      </div>
    </Link>
  </motion.div>
  );
}
