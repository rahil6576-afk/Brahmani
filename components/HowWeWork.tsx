'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ArrowRight, CheckCircle2, FileText, Cpu, Wrench, ShieldCheck } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { useTheme } from './ThemeProvider';
import MagneticButton from './MagneticButton';

const WORK_STEPS = [
  {
    step: '01',
    name: 'AUDIT',
    subtitle: 'Comprehensive Site Survey & Load Profiling',
    description:
      'We inspect your existing electrical infrastructure, measure maximum demand patterns, evaluate power factor, and conduct thermography inspections.',
    deliverables: ['Load Demand Report', 'Harmonic Distortion Spectrum', 'Rooftop Irradiance Scan'],
    icon: FileText,
  },
  {
    step: '02',
    name: 'DESIGN',
    subtitle: 'Detailed Engineering & Turnkey SLD Schematics',
    description:
      'Licensed electrical engineers develop Single Line Diagrams (SLD), structural solar wind-load calculations, switchgear layouts, and milestone Gantt charts.',
    deliverables: ['Type-Tested SLD Schematics', 'Fixed BOQ Turnkey Pricing', 'DISCOM Paperwork Preparation'],
    icon: Cpu,
  },
  {
    step: '03',
    name: 'INSTALL',
    subtitle: 'Precision Mechanical & Electrical Commissioning',
    description:
      'Certified technicians execute cable containment, torque-calibrated busway assembly, earthing pits, inverter mounting, and protection relay injection testing.',
    deliverables: ['Megger & Hi-Pot Test Logs', 'Substation Interconnection', 'Grid Net-Metering Sync'],
    icon: Wrench,
  },
  {
    step: '04',
    name: 'SUPPORT',
    subtitle: 'Lifecycle Telemetry & 24/7 SLA Operations',
    description:
      'Continuous performance monitoring, annual maintenance contracts (AMC), preventive infrared thermography scans, and guaranteed rapid breakdown response.',
    deliverables: ['Cloud Telemetry Access', 'Preventive AMC Schedule', '< 2h Emergency Dispatch SLA'],
    icon: ShieldCheck,
  },
];

interface BlueprintCardProps {
  step: (typeof WORK_STEPS)[0];
  idx: number;
  isNight: boolean;
  reducedMotion: boolean;
  isInView: boolean;
}

function BlueprintCard({
  step,
  idx,
  isNight,
  reducedMotion,
  isInView,
}: BlueprintCardProps) {
  const Icon = step.icon;
  const baseDelay = reducedMotion ? 0 : idx * 0.26;

  return (
    <div className="relative group">
      {/* 1. TECHNICAL BLUEPRINT DRAFTING OVERLAY (Active during construction sequence) */}
      {!reducedMotion && (
        <div className="absolute -inset-[2px] pointer-events-none z-20 overflow-visible">
          {/* Step 1: Animated perimeter technical outline stroke */}
          <svg className="w-full h-full overflow-visible">
            <motion.rect
              x="2"
              y="2"
              width="calc(100% - 4px)"
              height="calc(100% - 4px)"
              fill="none"
              stroke="#FFC107"
              strokeWidth="1.25"
              strokeLinecap="square"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={
                isInView
                  ? {
                      pathLength: [0, 1, 1],
                      opacity: [0, 0.95, 0],
                    }
                  : { pathLength: 0, opacity: 0 }
              }
              transition={{
                duration: 1.3,
                delay: baseDelay,
                ease: [0.16, 1, 0.3, 1],
                times: [0, 0.65, 1],
              }}
            />
          </svg>

          {/* Architectural Drafting Corner Brackets & Crosshairs */}
          {/* Top-Left */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={
              isInView
                ? { opacity: [0, 0.85, 0], scale: [0.8, 1, 1] }
                : { opacity: 0 }
            }
            transition={{
              duration: 1.45,
              delay: baseDelay + 0.08,
              times: [0, 0.35, 1],
            }}
            className="absolute top-0.5 left-0.5 w-3 h-3 border-t border-l border-[#FFC107] pointer-events-none"
          />
          {/* Top-Right */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={
              isInView
                ? { opacity: [0, 0.85, 0], scale: [0.8, 1, 1] }
                : { opacity: 0 }
            }
            transition={{
              duration: 1.45,
              delay: baseDelay + 0.08,
              times: [0, 0.35, 1],
            }}
            className="absolute top-0.5 right-0.5 w-3 h-3 border-t border-r border-[#FFC107] pointer-events-none"
          />
          {/* Bottom-Left */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={
              isInView
                ? { opacity: [0, 0.85, 0], scale: [0.8, 1, 1] }
                : { opacity: 0 }
            }
            transition={{
              duration: 1.45,
              delay: baseDelay + 0.08,
              times: [0, 0.35, 1],
            }}
            className="absolute bottom-0.5 left-0.5 w-3 h-3 border-b border-l border-[#FFC107] pointer-events-none"
          />
          {/* Bottom-Right */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={
              isInView
                ? { opacity: [0, 0.85, 0], scale: [0.8, 1, 1] }
                : { opacity: 0 }
            }
            transition={{
              duration: 1.45,
              delay: baseDelay + 0.08,
              times: [0, 0.35, 1],
            }}
            className="absolute bottom-0.5 right-0.5 w-3 h-3 border-b border-r border-[#FFC107] pointer-events-none"
          />

          {/* Precision Measurement Annotations (Fade out into reality) */}
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={
              isInView
                ? { opacity: [0, 0.75, 0], y: [-4, 0, 0] }
                : { opacity: 0 }
            }
            transition={{
              duration: 1.4,
              delay: baseDelay + 0.12,
              times: [0, 0.35, 1],
            }}
            className="absolute -top-3 left-3 text-[8px] font-mono tracking-widest text-[#FFC107] uppercase bg-transparent select-none"
          >
            DWG-0{idx + 1} // TOL: ±0.02
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={
              isInView
                ? { opacity: [0, 0.7, 0] }
                : { opacity: 0 }
            }
            transition={{
              duration: 1.4,
              delay: baseDelay + 0.16,
              times: [0, 0.35, 1],
            }}
            className="absolute -bottom-3 right-3 text-[8px] font-mono tracking-widest text-[#FFC107] uppercase select-none"
          >
            SCALE 1:1 // SEC-0{idx + 1}
          </motion.div>
        </div>
      )}

      {/* 2. REALITY FINISHED CARD (Clean, elegant, durable structure) */}
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 22, scale: 0.98 }}
        animate={
          isInView
            ? { opacity: 1, y: 0, scale: 1 }
            : reducedMotion
            ? { opacity: 1, y: 0, scale: 1 }
            : { opacity: 0, y: 22, scale: 0.98 }
        }
        transition={{
          duration: 0.55,
          delay: baseDelay,
          ease: [0.21, 1, 0.36, 1],
        }}
        className={`relative border p-6 sm:p-8 flex flex-col justify-between space-y-6 transition-all duration-300 h-full ${
          isNight
            ? 'bg-[#0E1318] border-[#1F2731] hover:border-[#FFC107]/50'
            : 'bg-[#F9F8F5] border-[#E2E0D8] hover:border-[#FFC107]/60 shadow-sm'
        }`}
      >
        {/* Step 2: Stage Number & Icon */}
        <div
          className={`flex items-center justify-between border-b pb-4 ${
            isNight ? 'border-[#1E262E]' : 'border-[#E5E3DB]'
          }`}
        >
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 10, filter: 'blur(2px)' }}
            animate={
              isInView
                ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                : reducedMotion
                ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                : { opacity: 0, y: 10, filter: 'blur(2px)' }
            }
            transition={{
              duration: 0.45,
              delay: reducedMotion ? 0 : baseDelay + 0.38,
              ease: 'easeOut',
            }}
            className="flex items-baseline gap-2"
          >
            <span className="font-mono text-4xl font-extrabold text-[#FFC107] tracking-tighter">
              {step.step}
            </span>
            <span
              className={`text-[10px] font-mono tracking-widest uppercase ${
                isNight ? 'text-[#677480]' : 'text-[#7D8894]'
              }`}
            >
              STAGE 0{idx + 1}
            </span>
          </motion.div>

          {/* Technical Icon Box with SVG Outline Draw */}
          <div className="relative w-9 h-9">
            {!reducedMotion && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <motion.rect
                  x="0.5"
                  y="0.5"
                  width="35"
                  height="35"
                  fill="none"
                  stroke="#FFC107"
                  strokeWidth="1"
                  initial={{ pathLength: 0 }}
                  animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
                  transition={{
                    duration: 0.45,
                    delay: baseDelay + 0.46,
                    ease: 'easeOut',
                  }}
                />
              </svg>
            )}

            <motion.div
              initial={reducedMotion ? false : { opacity: 0, scale: 0.8 }}
              animate={
                isInView
                  ? { opacity: 1, scale: 1 }
                  : reducedMotion
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: 0.8 }
              }
              transition={{
                duration: 0.35,
                delay: reducedMotion ? 0 : baseDelay + 0.6,
                ease: 'easeOut',
              }}
              className={`w-full h-full border flex items-center justify-center text-[#FFC107] transition-colors ${
                isNight ? 'bg-[#141B21] border-[#222C35]' : 'bg-[#FFFFFF] border-[#DEDCD4]'
              }`}
            >
              <Icon className="w-4 h-4" />
            </motion.div>

            {/* Subtle amber highlight flash at end of icon drawing */}
            {!reducedMotion && (
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={
                  isInView
                    ? { opacity: [0, 0.9, 0], scale: [0.5, 1.6, 2] }
                    : { opacity: 0 }
                }
                transition={{
                  duration: 0.45,
                  delay: baseDelay + 0.78,
                  ease: 'easeOut',
                }}
                className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#FFC107] pointer-events-none"
              />
            )}
          </div>
        </div>

        {/* Step 3: Content Assembles */}
        <div className="space-y-2">
          {/* Heading */}
          <motion.h3
            initial={reducedMotion ? false : { opacity: 0, y: 10 }}
            animate={
              isInView
                ? { opacity: 1, y: 0 }
                : reducedMotion
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 10 }
            }
            transition={{
              duration: 0.4,
              delay: reducedMotion ? 0 : baseDelay + 0.7,
              ease: 'easeOut',
            }}
            className={`text-xl font-black uppercase tracking-tight ${
              isNight ? 'text-[#F5F5F2]' : 'text-[#11161A]'
            }`}
          >
            {step.name}
          </motion.h3>

          {/* Subtitle */}
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 6 }}
            animate={
              isInView
                ? { opacity: 1, y: 0 }
                : reducedMotion
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 6 }
            }
            transition={{
              duration: 0.35,
              delay: reducedMotion ? 0 : baseDelay + 0.84,
              ease: 'easeOut',
            }}
            className="text-xs font-mono text-[#FFC107]"
          >
            {step.subtitle}
          </motion.div>

          {/* Body Description */}
          <motion.p
            initial={reducedMotion ? false : { opacity: 0, y: 8 }}
            animate={
              isInView
                ? { opacity: 1, y: 0 }
                : reducedMotion
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 8 }
            }
            transition={{
              duration: 0.4,
              delay: reducedMotion ? 0 : baseDelay + 0.98,
              ease: 'easeOut',
            }}
            className={`text-xs sm:text-sm leading-relaxed pt-2 ${
              isNight ? 'text-[#8E97A0]' : 'text-[#55626F]'
            }`}
          >
            {step.description}
          </motion.p>
        </div>

        {/* Deliverables Checklist with Staggered Items */}
        <div
          className={`pt-4 border-t space-y-2 ${
            isNight ? 'border-[#1E262E]' : 'border-[#E5E3DB]'
          }`}
        >
          <motion.span
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={
              isInView
                ? { opacity: 1 }
                : reducedMotion
                ? { opacity: 1 }
                : { opacity: 0 }
            }
            transition={{
              duration: 0.3,
              delay: reducedMotion ? 0 : baseDelay + 1.1,
            }}
            className={`text-[9px] font-mono uppercase tracking-widest block ${
              isNight ? 'text-[#64717C]' : 'text-[#778390]'
            }`}
          >
            KEY DELIVERABLES:
          </motion.span>

          {step.deliverables.map((item, dIdx) => (
            <motion.div
              key={item}
              initial={reducedMotion ? false : { opacity: 0, x: -8 }}
              animate={
                isInView
                  ? { opacity: 1, x: 0 }
                  : reducedMotion
                  ? { opacity: 1, x: 0 }
                  : { opacity: 0, x: -8 }
              }
              transition={{
                duration: 0.32,
                delay: reducedMotion ? 0 : baseDelay + 1.18 + dIdx * 0.08,
                ease: 'easeOut',
              }}
              className={`flex items-center gap-2 text-xs ${
                isNight ? 'text-[#ECEBE6]' : 'text-[#232B32]'
              }`}
            >
              <CheckCircle2 className="w-3 h-3 text-[#FFC107] shrink-0" />
              <span className="truncate">{item}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default function HowWeWork() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const { isNight, reducedMotion } = useTheme();
  const isInView = useInView(gridRef, { amount: 0.2, once: false });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  });

  const lineWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section
      ref={containerRef}
      className={`relative w-full py-20 sm:py-28 overflow-hidden border-t transition-colors duration-700 ${
        isNight ? 'bg-[#0A0D0F] border-[#1C242C]' : 'bg-[#FFFFFF] border-[#E0DDD4]'
      }`}
    >
      <div className="absolute inset-0 bg-tech-grid opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
          <SectionHeading
            tag="ENGINEERING METHODOLOGY"
            title="HOW WE"
            highlight="WORK."
            subtitle="Four disciplined stages led by licensed site electrical engineers from initial audit to continuous uptime assurance."
          />
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-xs font-mono font-semibold tracking-widest text-[#FFC107] hover:underline uppercase self-start lg:self-end"
          >
            <span>COMMISSION AN AUDIT</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* PROGRESSIVE SCROLL ENERGY CONDUIT LINE (Desktop) */}
        <div className="hidden lg:block relative mb-12">
          {/* Base conduit background rail */}
          <div
            className={`w-full h-[2px] transition-colors ${
              isNight ? 'bg-[#1C252E]' : 'bg-[#E2E0D8]'
            }`}
          />
          {/* Animated progressive energy fill line */}
          <motion.div
            style={{ width: reducedMotion ? '100%' : lineWidth }}
            className="absolute top-0 left-0 h-[2px] bg-[#FFC107] shadow-[0_0_12px_#FFC107]"
          />
        </div>

        {/* Four Stages Grid with Blueprint-to-Reality Reveal */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
        >
          {WORK_STEPS.map((step, idx) => (
            <BlueprintCard
              key={step.step}
              step={step}
              idx={idx}
              isNight={isNight}
              reducedMotion={reducedMotion}
              isInView={isInView}
            />
          ))}
        </div>

        {/* Bottom Consultation CTA */}
        <div className="mt-16 text-center">
          <MagneticButton>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#FFC107] hover:bg-[#E6A900] text-[#0A0D0F] text-xs font-bold tracking-widest uppercase transition-all shadow-[0_0_20px_-3px_rgba(255,193,7,0.4)]"
            >
              <span>DISCUSS YOUR PROJECT SCOPE</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
