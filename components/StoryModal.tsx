'use client';

import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, ShieldCheck, Zap, Award, CheckCircle } from 'lucide-react';

interface StoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StoryModal({ isOpen, onClose }: StoryModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#06080A]/90 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 24 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[#0D1217] border border-[#232C35] shadow-2xl z-10 my-auto"
        >
          {/* Top Yellow Bar */}
          <div className="h-[2px] w-full bg-[#FFC107] shadow-[0_0_10px_#FFC107] sticky top-0 z-30" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 bg-[#141B22]/90 border border-[#2A3540] text-[#A5ACB2] hover:text-[#FFC107] hover:border-[#FFC107]/50 transition-colors"
            aria-label="Close documentary player"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Video / Visual Header */}
          <div className="relative h-[260px] sm:h-[380px] w-full bg-[#080B0D] overflow-hidden">
            <Image
              src="/images/hero-solar-sunrise.jpg"
              alt="Brahmani Engineering Documentary"
              fill
              className="object-cover object-center filter brightness-[0.75]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D1217] via-transparent to-[#0A0D0F]/70" />

            {/* Cinematic Center Play Indicator */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="w-16 h-16 rounded-full bg-[#FFC107] text-[#0A0D0F] flex items-center justify-center shadow-[0_0_25px_#FFC107] pl-1">
                <Play className="w-7 h-7 fill-current" />
              </div>
              <span className="mt-3 text-xs font-mono font-bold tracking-widest text-[#F5F5F2] uppercase bg-[#0A0D0F]/80 px-3 py-1 border border-[#232C35]">
                BRAND DOCUMENTARY • RUNTIME 02:14
              </span>
            </div>
          </div>

          {/* Story Narrative & Technical Credentials */}
          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#FFC107] uppercase tracking-wider mb-2">
                <Zap className="w-3.5 h-3.5" />
                <span>BRAHMANI POWER SYSTEMS — FOUNDING VISION</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#F5F5F2] uppercase tracking-tight">
                ENGINEERED FOR THE NEXT CENTURY
              </h3>
              <p className="mt-3 text-sm text-[#8E97A0] leading-relaxed">
                Founded with a relentless commitment to precision, BRAHMANI bridges utility-scale renewable generation with heavy industrial power distribution. From our state-of-the-art engineering hub in Ahmedabad to installations across 500+ commercial sites, every circuit is architected for zero downtime, verified safety, and uncompromising energy yield.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 border-y border-[#1E2730] py-4 text-center font-mono">
              <div>
                <span className="text-xl sm:text-2xl font-bold text-[#FFC107] block">12 MW+</span>
                <span className="text-[10px] text-[#69747F] uppercase tracking-wider">Installed Solar</span>
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-bold text-[#FFC107] block">500+</span>
                <span className="text-[10px] text-[#69747F] uppercase tracking-wider">Turnkey Projects</span>
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-bold text-[#FFC107] block">99.8%</span>
                <span className="text-[10px] text-[#69747F] uppercase tracking-wider">Grid Reliability</span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-mono text-[#737E88]">
                POWERING TOMORROW.
              </span>
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-[#FFC107] hover:bg-[#E6A900] text-[#0A0D0F] font-bold text-xs font-mono uppercase transition-colors"
              >
                CLOSE FILM
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
