import { NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';
import { BRAND, STATISTICS, ALL_SERVICES, PRODUCTS_LIST } from '@/lib/constants';

import { isSupabaseConfigured, saveSiteContentToSupabase } from '@/lib/supabase';

const DATA_FILE = path.join(process.cwd(), 'data', 'site-content.json');

const INITIAL_PROJECTS = [
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
      { label: 'Standard', value: 'IEC 61439 Synchronized' }
    ]
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
      { label: 'Uptime SLA', value: '99.98% Guaranteed' }
    ]
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
      { label: 'Enclosure', value: 'IP54 Standard Gasketed' }
    ]
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
      { label: 'Safety Record', value: 'Zero Loss Time Incidents' }
    ]
  }
];

export async function POST() {
  try {
    const defaultData = {
      brand: {
        ...BRAND,
        heroPrefix: "POWERING",
        heroHighlight: "TOMORROW.",
        heroDescription: "Precision electrical infrastructure, utility-scale commercial solar arrays, and certified industrial switchgear engineered for long-term operational resilience."
      },
      statistics: STATISTICS.map((s, idx) => ({ id: `stat-${idx + 1}`, ...s })),
      services: ALL_SERVICES.map((s, idx) => ({ ...s, isHome: idx < 4 })),
      products: PRODUCTS_LIST,
      projects: INITIAL_PROJECTS,
      settings: {
        announcementActive: true,
        announcementText: "ISO 9001:2015 Certified EPC Contractor | Approved by GEDA & Chief Electrical Inspector",
        maintenanceMode: false
      }
    };

    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');

    let supabaseSynced = false;
    if (isSupabaseConfigured()) {
      supabaseSynced = await saveSiteContentToSupabase(defaultData);
    }

    return NextResponse.json({ success: true, data: defaultData, supabaseSynced });
  } catch (err) {
    console.error('Reset error:', err);
    return NextResponse.json({ success: false, error: 'Failed to reset content' }, { status: 500 });
  }
}
