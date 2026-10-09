'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, MapPin, Zap, CheckCircle2 } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { useTheme } from './ThemeProvider';
import { useContent } from '@/lib/contentContext';
import MagneticButton from './MagneticButton';

interface ProjectShowcaseItem {
  id: string;
  category: string;
  title: string;
  location: string;
  scope: string;
  status: string;
  image: string;
  specs: { label: string; value: string }[];
}

const PROJECTS_DATA: ProjectShowcaseItem[] = [
  {
    id: 'proj-01',
    category: 'INDUSTRIAL SOLAR',
    title: 'Sanand Industrial Park Photovoltaic Array',
    location: 'Sanand, Gujarat',
    scope: 'Turnkey Rooftop Solar & High-Voltage Grid Interconnection',
    status: 'OPERATIONAL',
    image: '/images/service-solar-solutions.jpg',
    specs: [
      { label: 'Technology', value: 'Bifacial TOPCon Modules' },
      { label: 'Interconnection', value: '11kV HT Substation' },
      { label: 'Standard', value: 'IEC 61439 Synchronized' },
    ],
  },
  {
    id: 'proj-02',
    category: 'COMMERCIAL ELECTRICAL',
    title: 'Ahmedabad Logistics & Cold Storage Infrastructure',
    location: 'Ahmedabad, Gujarat',
    scope: 'Complete HT/LT Power Distribution & APFC Capacitor Banks',
    status: 'OPERATIONAL',
    image: '/images/service-electrical-systems.jpg',
    specs: [
      { label: 'Voltage Grade', value: '415V / 11kV Distribution' },
      { label: 'Busbar Capacity', value: '2500A Copper Busway' },
      { label: 'Uptime SLA', value: '99.98% Guaranteed' },
    ],
  },
  {
    id: 'proj-03',
    category: 'HT/LT DISTRIBUTION',
    title: 'Vadodara Precision Engineering Works',
    location: 'Vadodara, Gujarat',
    scope: 'Vacuum Circuit Breaker Switchgear & PLC Automation Panel',
    status: 'OPERATIONAL',
    image: '/images/service-industrial-power.jpg',
    specs: [
      { label: 'Switchgear', value: '11kV Metal-Clad ArcGuard' },
      { label: 'Fault Rating', value: '26.3 kA (3 sec)' },
      { label: 'Enclosure', value: 'IP54 Standard Gasketed' },
    ],
  },
  {
    id: 'proj-04',
    category: 'FACTORY POWER INFRASTRUCTURE',
    title: 'Kutch Industrial Energy Hub',
    location: 'Kutch, Gujarat',
    scope: 'Substation Earthing Grids, Transformer Bays & Cable Containment',
    status: 'OPERATIONAL',
    image: '/images/hero-engineer-panels.jpg',
    specs: [
      { label: 'Grounding Grid', value: 'Chemical Pipe & Copper' },
      { label: 'Compliance', value: 'IS 3043 Verified' },
      { label: 'Safety Record', value: 'Zero Loss Time Incidents' },
    ],
  },
];

export default function SelectedProjects() {
  const { isNight, reducedMotion } = useTheme();
  const { content } = useContent();
  const projects = content?.projects?.length ? content.projects : PROJECTS_DATA;
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <section
      className={`relative w-full py-20 sm:py-28 overflow-hidden border-t transition-colors duration-700 ${
        isNight ? 'bg-[#080B0D] border-[#1C252E]' : 'bg-[#FAF9F5] border-[#E0DDD4]'
      }`}
    >
      <div className="absolute inset-0 bg-tech-grid opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
          <SectionHeading
            tag="PORTFOLIO HIGHLIGHTS"
            title="SELECTED"
            highlight="PROJECTS."
            subtitle="Demonstrated engineering capability across utility solar, industrial distribution, and automated switchgear substations."
          />
          <Link
            href="/contact#quote"
            className="inline-flex items-center gap-2 text-xs font-mono font-semibold tracking-widest text-[#FFC107] hover:underline uppercase self-start lg:self-end"
          >
            <span>SCHEDULE SITE SURVEY FOR YOUR PROJECT</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {projects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2, margin: '0px 0px -40px 0px' }}
              transition={{ duration: 0.65, delay: idx * 0.12, ease: [0.21, 1, 0.36, 1] }}
              className={`group border flex flex-col justify-between overflow-hidden transition-all duration-300 ${
                isNight
                  ? 'bg-[#0E1318] border-[#202933] hover:border-[#FFC107]/50'
                  : 'bg-[#FFFFFF] border-[#E2E0D8] hover:border-[#FFC107]/60 shadow-sm'
              }`}
            >
              {/* Image Container with Hover Zoom & Badge */}
              <div data-cursor="image" className="relative h-52 xs:h-64 sm:h-72 w-full overflow-hidden border-b border-[#1E262E]">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105 filter contrast-[1.06]"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />

                {/* Ambient Readability Gradient */}
                <div
                  className={`absolute inset-0 pointer-events-none ${
                    isNight
                      ? 'bg-gradient-to-t from-[#0E1318] via-transparent to-transparent'
                      : 'bg-gradient-to-t from-[#FFFFFF]/70 via-transparent to-transparent'
                  }`}
                />

                {/* Category Pill Tag */}
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                  <span
                    className={`text-[10px] font-mono font-bold tracking-widest uppercase border px-2.5 py-1 backdrop-blur-md ${
                      isNight
                        ? 'bg-[#0E1318]/90 text-[#FFC107] border-[#2A3440]'
                        : 'bg-[#FFFFFF]/95 text-[#E6A900] border-[#DDDCD4]'
                    }`}
                  >
                    {project.category}
                  </span>
                </div>

                {/* Location Badge */}
                <div className="absolute bottom-4 left-4 z-10 flex items-center gap-1.5 text-xs font-mono text-[#F5F5F2] bg-[#0A0D0F]/85 border border-[#232C35] px-2.5 py-1 backdrop-blur-sm">
                  <MapPin className="w-3.5 h-3.5 text-[#FFC107]" />
                  <span>{project.location}</span>
                </div>

                {/* Operational Status indicator */}
                <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 text-[10px] font-mono text-[#FFC107] bg-[#0A0D0F]/85 border border-[#232C35] px-2.5 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFC107] animate-pulse" />
                  <span>{project.status}</span>
                </div>
              </div>

              {/* Information & Technical Specs */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                <div>
                  <h3
                    className={`text-xl sm:text-2xl font-black uppercase tracking-tight transition-colors group-hover:text-[#FFC107] ${
                      isNight ? 'text-[#F5F5F2]' : 'text-[#11161A]'
                    }`}
                  >
                    {project.title}
                  </h3>
                  <p
                    className={`text-xs sm:text-sm mt-2 leading-relaxed ${
                      isNight ? 'text-[#8E97A0]' : 'text-[#55626F]'
                    }`}
                  >
                    {project.scope}
                  </p>
                </div>

                {/* Engineering Spec Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-[#1E262E]">
                  {project.specs.map((sp, idx) => (
                    <div
                      key={`${project.id || project.title}-spec-${idx}-${sp.label}`}
                      className={`p-2 border ${
                        isNight
                          ? 'bg-[#12181E] border-[#1E262E]'
                          : 'bg-[#F9F8F5] border-[#E2E0D8]'
                      }`}
                    >
                      <span
                        className={`text-[9px] font-mono uppercase block ${
                          isNight ? 'text-[#64717C]' : 'text-[#778390]'
                        }`}
                      >
                        {sp.label}
                      </span>
                      <span className="text-xs font-mono font-semibold text-[#FFC107] block mt-0.5 truncate">
                        {sp.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
