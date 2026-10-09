'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { BRAND, STATISTICS, ALL_SERVICES, PRODUCTS_LIST, ServiceItem, ProductItem } from './constants';

export type { ServiceItem, ProductItem };

export interface ProjectItem {
  id: string;
  category: string;
  title: string;
  location: string;
  scope: string;
  status: string;
  image: string;
  specs: { label: string; value: string }[];
}

export interface BrandData {
  name: string;
  tagline: string;
  subtitle: string;
  heroPrefix: string;
  heroHighlight: string;
  heroDescription: string;
  heroVideoDay?: string;
  heroVideoNight?: string;
  heroPoster?: string;
  logoHorizontal: string;
  logoDark: string;
  logoOriginal: string;
  logoMark: string;
  contact: {
    phone: string;
    phoneMobile: string;
    email: string;
    address: string;
    city: string;
    hours: string;
  };
}

export interface StatItem {
  id: string;
  value: number;
  suffix: string;
  label: string;
  description: string;
}

export interface SiteSettings {
  announcementActive: boolean;
  announcementText: string;
  maintenanceMode: boolean;
}

export interface SiteContentData {
  brand: BrandData;
  statistics: StatItem[];
  services: ServiceItem[];
  products: ProductItem[];
  projects: ProjectItem[];
  settings: SiteSettings;
}

const DEFAULT_PROJECTS: ProjectItem[] = [
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

const DEFAULT_CONTENT: SiteContentData = {
  brand: {
    ...BRAND,
    heroPrefix: 'POWERING',
    heroHighlight: 'TOMORROW.',
    heroDescription:
      'Precision electrical infrastructure, utility-scale commercial solar arrays, and certified industrial switchgear engineered for long-term operational resilience.',
    heroVideoDay: '/videos/hero-day.mp4',
    heroVideoNight: '/videos/hero-night.mp4',
    heroPoster: '/images/service-electrical-systems.jpg',
  },
  statistics: STATISTICS.map((s, idx) => ({ id: `stat-${idx + 1}`, ...s })),
  services: ALL_SERVICES.map((s, idx) => ({ ...s, isHome: idx < 4 })),
  products: PRODUCTS_LIST,
  projects: DEFAULT_PROJECTS,
  settings: {
    announcementActive: true,
    announcementText: 'ISO 9001:2015 Certified EPC Contractor | Approved by GEDA & Chief Electrical Inspector',
    maintenanceMode: false,
  },
};

interface ContentContextType {
  content: SiteContentData;
  isLoading: boolean;
  saveFullContent: (newContent: SiteContentData) => Promise<boolean>;
  updateBrand: (newBrand: Partial<BrandData>) => Promise<boolean>;
  updateStatistics: (newStats: StatItem[]) => Promise<boolean>;
  updateServices: (newServices: ServiceItem[]) => Promise<boolean>;
  saveService: (service: ServiceItem) => Promise<boolean>;
  deleteService: (id: string) => Promise<boolean>;
  updateProducts: (newProducts: ProductItem[]) => Promise<boolean>;
  saveProduct: (product: ProductItem) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  updateProjects: (newProjects: ProjectItem[]) => Promise<boolean>;
  saveProject: (project: ProjectItem) => Promise<boolean>;
  deleteProject: (id: string) => Promise<boolean>;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<boolean>;
  resetToDefaults: () => Promise<boolean>;
  refreshContent: () => Promise<void>;
}

const ContentContext = createContext<ContentContextType | null>(null);

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<SiteContentData>(DEFAULT_CONTENT);
  const [isLoading, setIsLoading] = useState(true);

  // Load exclusively from API (backed by Supabase)
  const refreshContent = useCallback(async () => {
    try {
      const res = await fetch('/api/content');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setContent(json.data);
          setIsLoading(false);
          return;
        }
      }
    } catch (err) {
      console.error('Failed to load content from Supabase API:', err);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Purge any stale legacy localStorage content cache to ensure clean Supabase state
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('brahmani_site_content');
      }
    } catch {}

    refreshContent();
  }, [refreshContent]);

  const saveFullContent = async (newContent: SiteContentData): Promise<boolean> => {
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContent),
      });

      if (res.ok) {
        setContent(newContent);
        return true;
      } else {
        console.error('Failed to save to Supabase. Server returned:', res.status);
        return false;
      }
    } catch (err) {
      console.error('Error saving content to Supabase:', err);
      return false;
    }
  };

  const updateBrand = async (newBrand: Partial<BrandData>) => {
    const updated: SiteContentData = {
      ...content,
      brand: { ...content.brand, ...newBrand },
    };
    return saveFullContent(updated);
  };

  const updateStatistics = async (newStats: StatItem[]) => {
    const updated: SiteContentData = {
      ...content,
      statistics: newStats,
    };
    return saveFullContent(updated);
  };

  const updateServices = async (newServices: ServiceItem[]) => {
    const updated: SiteContentData = {
      ...content,
      services: newServices,
    };
    return saveFullContent(updated);
  };

  const saveService = async (service: ServiceItem) => {
    const existingIndex = content.services.findIndex((s) => s.id === service.id);
    let updatedServices: ServiceItem[];
    if (existingIndex >= 0) {
      updatedServices = [...content.services];
      updatedServices[existingIndex] = service;
    } else {
      updatedServices = [...content.services, service];
    }
    return updateServices(updatedServices);
  };

  const deleteService = async (id: string) => {
    const updatedServices = content.services.filter((s) => s.id !== id);
    return updateServices(updatedServices);
  };

  const updateProducts = async (newProducts: ProductItem[]) => {
    const updated: SiteContentData = {
      ...content,
      products: newProducts,
    };
    return saveFullContent(updated);
  };

  const saveProduct = async (product: ProductItem) => {
    const existingIndex = content.products.findIndex((p) => p.id === product.id);
    let updatedProducts: ProductItem[];
    if (existingIndex >= 0) {
      updatedProducts = [...content.products];
      updatedProducts[existingIndex] = product;
    } else {
      updatedProducts = [...content.products, product];
    }
    return updateProducts(updatedProducts);
  };

  const deleteProduct = async (id: string) => {
    const updatedProducts = content.products.filter((p) => p.id !== id);
    return updateProducts(updatedProducts);
  };

  const updateProjects = async (newProjects: ProjectItem[]) => {
    const updated: SiteContentData = {
      ...content,
      projects: newProjects,
    };
    return saveFullContent(updated);
  };

  const saveProject = async (project: ProjectItem) => {
    const existingIndex = content.projects.findIndex((p) => p.id === project.id);
    let updatedProjects: ProjectItem[];
    if (existingIndex >= 0) {
      updatedProjects = [...content.projects];
      updatedProjects[existingIndex] = project;
    } else {
      updatedProjects = [...content.projects, project];
    }
    return updateProjects(updatedProjects);
  };

  const deleteProject = async (id: string) => {
    const updatedProjects = content.projects.filter((p) => p.id !== id);
    return updateProjects(updatedProjects);
  };

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    const updated: SiteContentData = {
      ...content,
      settings: { ...content.settings, ...newSettings },
    };
    return saveFullContent(updated);
  };

  const resetToDefaults = async () => {
    try {
      const res = await fetch('/api/content/reset', { method: 'POST' });
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setContent(json.data);
          return true;
        }
      }
    } catch (err) {
      console.error('Reset error:', err);
    }
    return false;
  };

  return (
    <ContentContext.Provider
      value={{
        content,
        isLoading,
        saveFullContent,
        updateBrand,
        updateStatistics,
        updateServices,
        saveService,
        deleteService,
        updateProducts,
        saveProduct,
        deleteProduct,
        updateProjects,
        saveProject,
        deleteProject,
        updateSettings,
        resetToDefaults,
        refreshContent,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (!context) {
    // Return graceful fallback if rendered outside provider
    return {
      content: DEFAULT_CONTENT,
      isLoading: false,
      saveFullContent: async () => false,
      updateBrand: async () => false,
      updateStatistics: async () => false,
      updateServices: async () => false,
      saveService: async () => false,
      deleteService: async () => false,
      updateProducts: async () => false,
      saveProduct: async () => false,
      deleteProduct: async () => false,
      updateProjects: async () => false,
      saveProject: async () => false,
      deleteProject: async () => false,
      updateSettings: async () => false,
      resetToDefaults: async () => false,
      refreshContent: async () => {},
    };
  }
  return context;
}
