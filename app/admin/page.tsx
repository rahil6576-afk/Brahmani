'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Building2,
  TrendingUp,
  Cpu,
  Package,
  Layers,
  Inbox,
  Settings,
  Plus,
  Trash2,
  Edit,
  Save,
  RotateCcw,
  ExternalLink,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  Download,
  Upload,
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  Zap,
  Star,
  Check,
  X,
  MessageSquare,
  HelpCircle,
  Menu,
  ChevronRight,
  ShieldAlert,
  Image as ImageIcon,
  Sun,
  Moon,
  Database,
  RefreshCw,
} from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { useContent, ServiceItem, ProductItem, ProjectItem, StatItem } from '@/lib/contentContext';
import PhotoField from '@/components/admin/PhotoField';
import VideoField from '@/components/admin/VideoField';
import MediaLibraryTab from '@/components/admin/MediaLibraryTab';

type AdminTab =
  | 'overview'
  | 'brand'
  | 'stats'
  | 'services'
  | 'products'
  | 'projects'
  | 'media'
  | 'inquiries'
  | 'settings';

interface InquiryItem {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  location: string;
  projectType: string;
  projectScale: string;
  message: string;
  status: 'New' | 'Contacted' | 'In Review' | 'Closed';
  adminNotes: string;
  createdAt: string;
}

const IMAGE_PRESETS = [
  { label: 'Solar Systems / Array', value: '/images/service-solar-solutions.jpg' },
  { label: 'Electrical Infrastructure', value: '/images/service-electrical-systems.jpg' },
  { label: 'Industrial Power / MCC', value: '/images/service-industrial-power.jpg' },
  { label: 'Maintenance & Diagnostics', value: '/images/service-maintenance.jpg' },
  { label: 'Installation & Containment', value: '/images/service-installation.jpg' },
  { label: 'Energy Efficiency / APFC', value: '/images/service-energy-efficiency.jpg' },
  { label: 'Solar Panel Hardware', value: '/images/product-solar-panel.jpg' },
  { label: 'Inverter Hardware', value: '/images/product-inverter.jpg' },
  { label: 'Cables & Wiring', value: '/images/product-cables.jpg' },
  { label: 'Switchgear Equipment', value: '/images/product-switchgear.jpg' },
  { label: 'High-Bay LED Luminaire', value: '/images/product-led-lighting.jpg' },
  { label: 'PLC Automation Panel', value: '/images/product-control-panels.jpg' },
  { label: 'Engineer with Panels', value: '/images/hero-engineer-panels.jpg' },
  { label: 'Solar Sunrise Panorama', value: '/images/hero-solar-sunrise.jpg' },
];

function AdminContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme, isNight, toggleTheme } = useTheme();
  const {
    content,
    isLoading: isContentLoading,
    updateBrand,
    updateStatistics,
    saveService,
    deleteService,
    saveProduct,
    deleteProduct,
    saveProject,
    deleteProject,
    updateSettings,
    resetToDefaults,
    refreshContent,
  } = useContent();

  const [activeTab, setActiveTab] = useState<AdminTab>(
    (searchParams.get('tab') as AdminTab) || 'overview'
  );

  // Inquiries state
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(true);

  // Toast notifications
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Modals state
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  // Supabase cloud database state
  const [supabaseStatus, setSupabaseStatus] = useState<{
    configured: boolean;
    connected: boolean;
    url: string;
    bucket: string;
    tableCount: number;
  } | null>(null);
  const [syncingSupabase, setSyncingSupabase] = useState(false);

  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);

  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryItem | null>(null);

  const [confirmDeleteModal, setConfirmDeleteModal] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({
    open: false,
    title: '',
    description: '',
    onConfirm: () => {},
  });

  // Mobile sidebar drawer
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Local Brand Form state
  const [brandForm, setBrandForm] = useState(content.brand);
  useEffect(() => {
    if (content.brand) {
      setBrandForm(content.brand);
    }
  }, [content.brand]);

  // Local Stats Form state
  const [statsForm, setStatsForm] = useState(content.statistics || []);
  useEffect(() => {
    if (content.statistics) {
      setStatsForm(content.statistics);
    }
  }, [content.statistics]);

  // Local Settings Form state
  const [settingsForm, setSettingsForm] = useState(content.settings);
  useEffect(() => {
    if (content.settings) {
      setSettingsForm(content.settings);
    }
  }, [content.settings]);

  // Check auth cleanly
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    try {
      const auth = localStorage.getItem('brahmani_admin_auth');
      if (auth !== 'authenticated') {
        router.replace('/admin/login');
      } else {
        setIsAuthenticated(true);
        setAuthChecked(true);
      }
    } catch {
      router.replace('/admin/login');
    }
  }, [router]);

  // Load inquiries only when authenticated
  const fetchInquiries = async () => {
    try {
      setInquiriesLoading(true);
      const res = await fetch('/api/inquiries');
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setInquiries(json.data);
        }
      }
    } catch (err) {
      console.error('Failed to load inquiries:', err);
    } finally {
      setInquiriesLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchInquiries();
      fetchSupabaseStatus();
    }
  }, [isAuthenticated]);

  const fetchSupabaseStatus = async () => {
    try {
      const res = await fetch('/api/supabase/status');
      if (res.ok) {
        const json = await res.json();
        setSupabaseStatus(json);
      }
    } catch {}
  };

  const handleSyncSupabase = async () => {
    setSyncingSupabase(true);
    try {
      const res = await fetch('/api/supabase/status', { method: 'POST' });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast(json.message || 'Synced to Supabase!');
        await fetchSupabaseStatus();
      } else {
        showToast(json.error || 'Failed to sync to Supabase.', 'error');
      }
    } catch {
      showToast('Network error while syncing to Supabase.', 'error');
    } finally {
      setSyncingSupabase(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('brahmani_admin_auth');
      localStorage.removeItem('brahmani_admin_user');
    } catch {}
    router.replace('/admin/login');
  };

  // Brand save
  const handleSaveBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await updateBrand(brandForm);
    if (success) {
      showToast('Brand identity & contact details saved successfully!');
    } else {
      showToast('Failed to save brand details.', 'error');
    }
  };

  // Statistics save
  const handleSaveStatistics = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await updateStatistics(statsForm);
    if (success) {
      showToast('Company metrics and telemetry updated successfully!');
    } else {
      showToast('Failed to save statistics.', 'error');
    }
  };

  // Settings save
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await updateSettings(settingsForm);
    if (success) {
      showToast('Site settings & announcement bar updated successfully!');
    } else {
      showToast('Failed to save site settings.', 'error');
    }
  };

  // Service save handler
  const handleSaveServiceModal = async (service: ServiceItem) => {
    const success = await saveService(service);
    if (success) {
      showToast(`Service "${service.title}" saved successfully!`);
      setServiceModalOpen(false);
    } else {
      showToast('Failed to save service.', 'error');
    }
  };

  // Product save handler
  const handleSaveProductModal = async (product: ProductItem) => {
    const success = await saveProduct(product);
    if (success) {
      showToast(`Product "${product.name}" saved successfully!`);
      setProductModalOpen(false);
    } else {
      showToast('Failed to save product.', 'error');
    }
  };

  // Project save handler
  const handleSaveProjectModal = async (project: ProjectItem) => {
    const success = await saveProject(project);
    if (success) {
      showToast(`Project "${project.title}" saved successfully!`);
      setProjectModalOpen(false);
    } else {
      showToast('Failed to save project.', 'error');
    }
  };

  // Inquiry update
  const handleUpdateInquiry = async (
    id: string,
    status: 'New' | 'Contacted' | 'In Review' | 'Closed',
    adminNotes: string
  ) => {
    try {
      const res = await fetch('/api/inquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, adminNotes }),
      });
      if (res.ok) {
        showToast('Inquiry status updated successfully!');
        fetchInquiries();
        setInquiryModalOpen(false);
      }
    } catch {
      showToast('Failed to update inquiry.', 'error');
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    try {
      const res = await fetch(`/api/inquiries?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Inquiry removed from leads register.');
        fetchInquiries();
      }
    } catch {
      showToast('Failed to delete inquiry.', 'error');
    }
  };

  // Reset to Defaults
  const handleResetDefaults = async () => {
    setConfirmDeleteModal({
      open: true,
      title: 'Reset Site Data to Factory Defaults?',
      description:
        'This will revert all services, products, statistics, brand copy, and showcase projects back to the original seed data. This action cannot be undone.',
      onConfirm: async () => {
        setConfirmDeleteModal((prev) => ({ ...prev, open: false }));
        const success = await resetToDefaults();
        if (success) {
          showToast('Site data reset to original defaults!');
        } else {
          showToast('Failed to reset site data.', 'error');
        }
      },
    });
  };

  // Export full JSON backup
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(content, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `brahmani-site-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Site backup JSON downloaded!');
  };

  // Import JSON backup
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.brand && json.services && json.products) {
          const res = await fetch('/api/content', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(json),
          });
          if (res.ok) {
            await refreshContent();
            showToast('Site data imported and applied successfully!');
          } else {
            showToast('Server rejected imported file format.', 'error');
          }
        } else {
          showToast('Invalid Brahmani JSON backup format.', 'error');
        }
      } catch {
        showToast('Could not parse JSON file.', 'error');
      }
    };
    reader.readAsText(file);
  };

  // Export Inquiries to CSV
  const handleExportInquiriesCSV = () => {
    if (!inquiries.length) {
      showToast('No inquiries to export.', 'info');
      return;
    }
    const headers = ['ID', 'Date', 'Name', 'Company', 'Email', 'Phone', 'Project Type', 'Scale', 'Status', 'Message', 'Admin Notes'];
    const rows = inquiries.map((inq) => [
      `"${inq.id}"`,
      `"${new Date(inq.createdAt).toLocaleString()}"`,
      `"${inq.name.replace(/"/g, '""')}"`,
      `"${inq.company.replace(/"/g, '""')}"`,
      `"${inq.email}"`,
      `"${inq.phone}"`,
      `"${inq.projectType.replace(/"/g, '""')}"`,
      `"${inq.projectScale.replace(/"/g, '""')}"`,
      `"${inq.status}"`,
      `"${(inq.message || '').replace(/"/g, '""')}"`,
      `"${(inq.adminNotes || '').replace(/"/g, '""')}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', encodeURI(csvContent));
    downloadAnchor.setAttribute('download', `brahmani-inquiries-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Inquiries CSV exported successfully!');
  };

  // Search & filter states
  const [serviceSearch, setServiceSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('ALL');
  const [productSearch, setProductSearch] = useState('');
  const [projectSearch, setProjectSearch] = useState('');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState('ALL');
  const [inquirySearch, setInquirySearch] = useState('');

  const filteredServices = useMemo(() => {
    return (content.services || []).filter((s) =>
      s.title.toLowerCase().includes(serviceSearch.toLowerCase()) ||
      s.tagline.toLowerCase().includes(serviceSearch.toLowerCase()) ||
      s.description.toLowerCase().includes(serviceSearch.toLowerCase())
    );
  }, [content.services, serviceSearch]);

  const filteredProducts = useMemo(() => {
    return (content.products || []).filter((p) => {
      const matchCat = productCategoryFilter === 'ALL' || p.category === productCategoryFilter;
      const matchQuery =
        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.subtitle.toLowerCase().includes(productSearch.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [content.products, productCategoryFilter, productSearch]);

  const filteredProjects = useMemo(() => {
    return (content.projects || []).filter((p) =>
      p.title.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.location.toLowerCase().includes(projectSearch.toLowerCase())
    );
  }, [content.projects, projectSearch]);

  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inq) => {
      const matchStatus = inquiryStatusFilter === 'ALL' || inq.status === inquiryStatusFilter;
      const matchQuery =
        inq.name.toLowerCase().includes(inquirySearch.toLowerCase()) ||
        inq.company.toLowerCase().includes(inquirySearch.toLowerCase()) ||
        inq.email.toLowerCase().includes(inquirySearch.toLowerCase()) ||
        inq.phone.toLowerCase().includes(inquirySearch.toLowerCase());
      return matchStatus && matchQuery;
    });
  }, [inquiries, inquiryStatusFilter, inquirySearch]);

  const unreadInquiriesCount = inquiries.filter((i) => i.status === 'New').length;

  if (!authChecked || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#07090C] text-[#FFC107] flex items-center justify-center font-mono text-xs">
        <div className="flex flex-col items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-[#FFC107] animate-ping" />
          <span>AUTHENTICATING COMMAND CONSOLE...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex h-screen bg-[var(--bg-primary)] text-[var(--text-white)] overflow-hidden font-segoe-admin transition-colors duration-300"
      style={{
        fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif",
        fontWeight: 400,
      }}
    >
      
      {/* Toast Alert */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className={`fixed top-6 left-1/2 z-50 px-5 py-3 border shadow-2xl flex items-center gap-3 text-xs font-mono backdrop-blur-xl ${
              toast.type === 'error'
                ? 'bg-red-950/90 border-red-700 text-red-200'
                : toast.type === 'info'
                ? 'bg-blue-950/90 border-blue-700 text-blue-200'
                : 'bg-[#121A22]/95 border-[#FFC107] text-[#FFC107] shadow-[0_0_25px_rgba(255,193,7,0.3)]'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-[#FFC107] shrink-0" />
            )}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SIDEBAR NAVIGATION */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 ${
          isNight ? 'bg-[#0A0D12] border-[#1C242F]' : 'bg-[#FAF9F6] border-[#E2E0D8]'
        } border-r flex flex-col transition-all duration-300 lg:static lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-18 px-5 border-b border-[#18212C] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 bg-[#121820] border border-[#232F3D] flex items-center justify-center p-1">
              <Image
                src="/images/brahmani-mark-dark.png"
                alt="Logo"
                width={24}
                height={24}
                className="object-contain"
              />
            </div>
            <div>
              <div className="text-xs font-black tracking-widest text-white uppercase flex items-center gap-1">
                BRAHMANI <span className="text-[#FFC107]">ADMIN</span>
              </div>
              <div className="text-[10px] font-mono text-[#626E7D]">COMMAND CENTER</div>
            </div>
          </div>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden p-1.5 text-[#8592A0] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Status Pill */}
        <div className="px-5 py-3 border-b border-[#141C25] bg-[#080B0F]/60 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] font-mono text-[#828F9E]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>GRID TELEMETRY: NORMAL</span>
          </div>
          <span className="text-[9px] font-mono px-1.5 py-0.5 bg-[#FFC107]/10 text-[#FFC107] border border-[#FFC107]/30">
            v2.4
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {[
            { id: 'overview', label: 'Dashboard & Telemetry', icon: LayoutDashboard },
            { id: 'brand', label: 'Hero & Identity', icon: Building2 },
            { id: 'stats', label: 'Statistics Strip', icon: TrendingUp },
            { id: 'services', label: 'Services Manager', icon: Cpu, badge: content.services?.length },
            { id: 'products', label: 'Hardware Catalog', icon: Package, badge: content.products?.length },
            { id: 'projects', label: 'Showcase Projects', icon: Layers, badge: content.projects?.length },
            { id: 'media', label: 'Media & Photo Vault', icon: ImageIcon },
            {
              id: 'inquiries',
              label: 'Leads & Inquiries',
              icon: Inbox,
              badge: unreadInquiriesCount > 0 ? `${unreadInquiriesCount} NEW` : inquiries.length,
              badgeColor: unreadInquiriesCount > 0 ? 'bg-[#FFC107] text-[#0A0D0F]' : 'bg-[#1C2530] text-[#8694A2]',
            },
            { id: 'settings', label: 'Settings & Backup', icon: Settings },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as AdminTab);
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-mono transition-all rounded-none cursor-pointer ${
                  isActive
                    ? 'bg-[#FFC107]/10 text-[#FFC107] border-l-2 border-[#FFC107] font-semibold'
                    : 'text-[#8A97A6] hover:bg-[#121922] hover:text-white border-l-2 border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#FFC107]' : 'text-[#6A7887]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 font-bold ${
                      item.badgeColor || 'bg-[#151D26] text-[#7C8B9B]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className={`p-4 border-t ${
          isNight ? 'border-[#18212C] bg-[#080B0F]/90' : 'border-[#E2E0D8] bg-[#FAF9F6]'
        } space-y-2`}>
          <Link
            href="/"
            target="_blank"
            className={`w-full flex items-center justify-center gap-2 py-2 px-3 ${
              isNight
                ? 'bg-[#131B24] hover:bg-[#1A2532] border-[#232F3D] text-[#BAC5D1] hover:text-[#FFC107]'
                : 'bg-[#EDECE6] hover:bg-[#E2DFD4] border-[#D5D2C7] text-[#222B32] hover:text-[#9E7400]'
            } border text-[11px] font-mono transition-all`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Live Website</span>
          </Link>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center justify-center gap-2 py-2 px-3 ${
              isNight
                ? 'bg-red-950/20 hover:bg-red-950/40 border-red-900/40 text-red-400'
                : 'bg-red-50 hover:bg-red-100 border-red-200 text-red-700'
            } border text-[11px] font-mono transition-all cursor-pointer`}
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Operational Bar */}
        <header className={`h-18 ${
          isNight ? 'bg-[#090D12] border-[#1C2531]' : 'bg-[#FFFFFF] border-[#E2E0D8]'
        } border-b px-5 sm:px-8 flex items-center justify-between shrink-0 transition-colors duration-300`}>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className={`lg:hidden p-2 ${
                isNight ? 'text-[#98A5B4] hover:text-white border-[#202A36]' : 'text-[#4A5562] hover:text-[#11161A] border-[#D5D2C7]'
              } border`}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h2 className={`text-sm sm:text-base font-black ${isNight ? 'text-white' : 'text-[#11161A]'} uppercase tracking-wider flex items-center gap-2`}>
                <span>
                  {activeTab === 'overview' && 'SYSTEM OVERVIEW & TELEMETRY'}
                  {activeTab === 'brand' && 'HERO SECTION & COMPANY IDENTITY'}
                  {activeTab === 'stats' && 'STATISTICS & METRICS STRIP'}
                  {activeTab === 'services' && 'ENGINEERING DISCIPLINES (SERVICES)'}
                  {activeTab === 'products' && 'HARDWARE & COMPONENT CATALOG'}
                  {activeTab === 'projects' && 'SELECTED SHOWCASE PROJECTS'}
                  {activeTab === 'media' && 'MEDIA VAULT & PHOTO ASSET MANAGER'}
                  {activeTab === 'inquiries' && 'CLIENT CONSULTATION LEADS'}
                  {activeTab === 'settings' && 'SYSTEM SETTINGS & DATA BACKUP'}
                </span>
              </h2>
              <p className={`text-[11px] font-mono ${isNight ? 'text-[#6A7888]' : 'text-[#66707A]'}`}>
                Brahmani Engineering Administration Console
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Theme Mode Toggle (Day / Night mode) */}
            <button
              onClick={toggleTheme}
              type="button"
              title={`Switch to ${isNight ? 'Day' : 'Night'} Mode`}
              className={`inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 border text-[11px] sm:text-xs font-mono font-semibold transition-all cursor-pointer ${
                isNight
                  ? 'bg-[#141C25] hover:bg-[#1C2734] border-[#243242] text-[#FFC107]'
                  : 'bg-[#EDECE6] hover:bg-[#E2DFD4] border-[#D5D2C7] text-[#9E7400]'
              }`}
            >
              {isNight ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-[#FFC107]" />
                  <span className="hidden sm:inline">DAY MODE</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-[#11161A]" />
                  <span className="hidden sm:inline">NIGHT MODE</span>
                </>
              )}
            </button>

            <button
              onClick={handleResetDefaults}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 ${
                isNight
                  ? 'bg-[#141C25] hover:bg-[#1C2734] border-[#243242] text-[#9BA8B6] hover:text-[#FFC107]'
                  : 'bg-[#EDECE6] hover:bg-[#E2DFD4] border-[#D5D2C7] text-[#222B32] hover:text-[#9E7400]'
              } border text-[11px] font-mono transition-all cursor-pointer`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FFC107] hover:bg-[#E6A900] text-[#0A0D0F] text-xs font-bold font-mono tracking-wider transition-all shadow-[0_0_15px_rgba(255,193,7,0.3)]"
            >
              <span>PREVIEW SITE</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Scrollable Viewport */}
        <main className={`flex-1 overflow-y-auto p-4 sm:p-8 ${
          isNight ? 'bg-[#07090C]' : 'bg-[#F4F3EF]'
        } transition-colors duration-300`}>
          
          {/* 1. OVERVIEW DASHBOARD */}
          {activeTab === 'overview' && (
            <div className="space-y-8 max-w-7xl mx-auto">
              {/* Telemetry KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className={`${isNight ? 'bg-[#0C1016] border-[#1E2734]' : 'bg-white border-[#E2E0D8] shadow-sm'} border p-5 relative overflow-hidden`}>
                  <div className={`flex items-center justify-between text-xs font-mono ${isNight ? 'text-[#788796]' : 'text-[#66707A]'} mb-2`}>
                    <span>ACTIVE SERVICES</span>
                    <Cpu className="w-4 h-4 text-[#FFC107]" />
                  </div>
                  <div className={`text-3xl font-black ${isNight ? 'text-white' : 'text-[#11161A]'} font-mono`}>
                    {content.services?.length || 0}
                  </div>
                  <div className={`mt-2 text-[11px] ${isNight ? 'text-[#5A6878]' : 'text-[#66707A]'} font-mono flex items-center justify-between`}>
                    <span>{content.services?.filter((s) => s.isHome).length || 0} displayed on homepage</span>
                    <button
                      onClick={() => setActiveTab('services')}
                      className="text-[#FFC107] hover:underline cursor-pointer"
                    >
                      Manage &rarr;
                    </button>
                  </div>
                </div>

                <div className={`${isNight ? 'bg-[#0C1016] border-[#1E2734]' : 'bg-white border-[#E2E0D8] shadow-sm'} border p-5 relative overflow-hidden`}>
                  <div className={`flex items-center justify-between text-xs font-mono ${isNight ? 'text-[#788796]' : 'text-[#66707A]'} mb-2`}>
                    <span>HARDWARE CATALOG</span>
                    <Package className="w-4 h-4 text-[#FFC107]" />
                  </div>
                  <div className={`text-3xl font-black ${isNight ? 'text-white' : 'text-[#11161A]'} font-mono`}>
                    {content.products?.length || 0}
                  </div>
                  <div className={`mt-2 text-[11px] ${isNight ? 'text-[#5A6878]' : 'text-[#66707A]'} font-mono flex items-center justify-between`}>
                    <span>{content.products?.filter((p) => p.isFeatured).length || 0} featured hero product</span>
                    <button
                      onClick={() => setActiveTab('products')}
                      className="text-[#FFC107] hover:underline cursor-pointer"
                    >
                      Manage &rarr;
                    </button>
                  </div>
                </div>

                <div className={`${isNight ? 'bg-[#0C1016] border-[#1E2734]' : 'bg-white border-[#E2E0D8] shadow-sm'} border p-5 relative overflow-hidden`}>
                  <div className={`flex items-center justify-between text-xs font-mono ${isNight ? 'text-[#788796]' : 'text-[#66707A]'} mb-2`}>
                    <span>SHOWCASE PROJECTS</span>
                    <Layers className="w-4 h-4 text-[#FFC107]" />
                  </div>
                  <div className={`text-3xl font-black ${isNight ? 'text-white' : 'text-[#11161A]'} font-mono`}>
                    {content.projects?.length || 0}
                  </div>
                  <div className={`mt-2 text-[11px] ${isNight ? 'text-[#5A6878]' : 'text-[#66707A]'} font-mono flex items-center justify-between`}>
                    <span>All operational in Gujarat</span>
                    <button
                      onClick={() => setActiveTab('projects')}
                      className="text-[#FFC107] hover:underline cursor-pointer"
                    >
                      Manage &rarr;
                    </button>
                  </div>
                </div>

                <div className={`${isNight ? 'bg-[#0C1016] border-[#1E2734]' : 'bg-white border-[#E2E0D8] shadow-sm'} border p-5 relative overflow-hidden`}>
                  <div className={`flex items-center justify-between text-xs font-mono ${isNight ? 'text-[#788796]' : 'text-[#66707A]'} mb-2`}>
                    <span>INCOMING LEADS</span>
                    <Inbox className="w-4 h-4 text-[#FFC107]" />
                  </div>
                  <div className={`text-3xl font-black ${isNight ? 'text-white' : 'text-[#11161A]'} font-mono flex items-center gap-2`}>
                    <span>{inquiries.length}</span>
                    {unreadInquiriesCount > 0 && (
                      <span className="text-xs font-bold px-2 py-0.5 bg-[#FFC107] text-[#0A0D0F]">
                        {unreadInquiriesCount} NEW
                      </span>
                    )}
                  </div>
                  <div className={`mt-2 text-[11px] ${isNight ? 'text-[#5A6878]' : 'text-[#66707A]'} font-mono flex items-center justify-between`}>
                    <span>Active consultation bench</span>
                    <button
                      onClick={() => setActiveTab('inquiries')}
                      className="text-[#FFC107] hover:underline cursor-pointer"
                    >
                      Review &rarr;
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Actions & System Status */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left: Quick Launcher */}
                <div className={`lg:col-span-2 ${isNight ? 'bg-[#0C1016] border-[#1E2734]' : 'bg-white border-[#E2E0D8] shadow-sm'} border p-6 space-y-5`}>
                  <div className={`flex items-center justify-between border-b ${isNight ? 'border-[#18212D]' : 'border-[#EAE8E1]'} pb-3`}>
                    <h3 className={`text-sm font-bold ${isNight ? 'text-white' : 'text-[#11161A]'} uppercase tracking-wider font-mono flex items-center gap-2`}>
                      <Zap className="w-4 h-4 text-[#FFC107]" />
                      <span>QUICK DISPATCH WORKBENCH</span>
                    </h3>
                    <span className={`text-[10px] font-mono ${isNight ? 'text-[#6A7888]' : 'text-[#66707A]'}`}>1-CLICK OPERATIONS</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        setEditingService(null);
                        setServiceModalOpen(true);
                      }}
                      className={`p-3.5 ${
                        isNight
                          ? 'bg-[#121822] hover:bg-[#18212E] border-[#232F3F]'
                          : 'bg-[#FAF9F6] hover:bg-[#F2EFE8] border-[#DDD9CE] hover:border-[#FFC107]'
                      } border hover:border-[#FFC107]/50 text-left transition-all flex items-center gap-3 cursor-pointer group`}
                    >
                      <div className={`w-9 h-9 ${isNight ? 'bg-[#1A2330] text-[#FFC107]' : 'bg-[#EDECE6] text-[#B28200]'} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                        <Plus className="w-5 h-5" />
                      </div>
                      <div>
                        <div className={`text-xs font-bold ${isNight ? 'text-white' : 'text-[#11161A]'} font-mono uppercase`}>Add New Service</div>
                        <div className={`text-[11px] ${isNight ? 'text-[#728090]' : 'text-[#66707A]'}`}>Create electrical discipline</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setEditingProduct(null);
                        setProductModalOpen(true);
                      }}
                      className={`p-3.5 ${
                        isNight
                          ? 'bg-[#121822] hover:bg-[#18212E] border-[#232F3F]'
                          : 'bg-[#FAF9F6] hover:bg-[#F2EFE8] border-[#DDD9CE] hover:border-[#FFC107]'
                      } border hover:border-[#FFC107]/50 text-left transition-all flex items-center gap-3 cursor-pointer group`}
                    >
                      <div className={`w-9 h-9 ${isNight ? 'bg-[#1A2330] text-[#FFC107]' : 'bg-[#EDECE6] text-[#B28200]'} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                        <Package className="w-5 h-5" />
                      </div>
                      <div>
                        <div className={`text-xs font-bold ${isNight ? 'text-white' : 'text-[#11161A]'} font-mono uppercase`}>Add New Product</div>
                        <div className={`text-[11px] ${isNight ? 'text-[#728090]' : 'text-[#66707A]'}`}>Insert equipment item</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setEditingProject(null);
                        setProjectModalOpen(true);
                      }}
                      className={`p-3.5 ${
                        isNight
                          ? 'bg-[#121822] hover:bg-[#18212E] border-[#232F3F]'
                          : 'bg-[#FAF9F6] hover:bg-[#F2EFE8] border-[#DDD9CE] hover:border-[#FFC107]'
                      } border hover:border-[#FFC107]/50 text-left transition-all flex items-center gap-3 cursor-pointer group`}
                    >
                      <div className={`w-9 h-9 ${isNight ? 'bg-[#1A2330] text-[#FFC107]' : 'bg-[#EDECE6] text-[#B28200]'} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                        <Layers className="w-5 h-5" />
                      </div>
                      <div>
                        <div className={`text-xs font-bold ${isNight ? 'text-white' : 'text-[#11161A]'} font-mono uppercase`}>Add Portfolio Project</div>
                        <div className={`text-[11px] ${isNight ? 'text-[#728090]' : 'text-[#66707A]'}`}>Add showcase installation</div>
                      </div>
                    </button>

                    <button
                      onClick={() => setActiveTab('brand')}
                      className={`p-3.5 ${
                        isNight
                          ? 'bg-[#121822] hover:bg-[#18212E] border-[#232F3F]'
                          : 'bg-[#FAF9F6] hover:bg-[#F2EFE8] border-[#DDD9CE] hover:border-[#FFC107]'
                      } border hover:border-[#FFC107]/50 text-left transition-all flex items-center gap-3 cursor-pointer group`}
                    >
                      <div className={`w-9 h-9 ${isNight ? 'bg-[#1A2330] text-[#FFC107]' : 'bg-[#EDECE6] text-[#B28200]'} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className={`text-xs font-bold ${isNight ? 'text-white' : 'text-[#11161A]'} font-mono uppercase`}>Modify Hero &amp; Brand</div>
                        <div className={`text-[11px] ${isNight ? 'text-[#728090]' : 'text-[#66707A]'}`}>Update contact &amp; headlines</div>
                      </div>
                    </button>

                    <button
                      onClick={() => setActiveTab('media')}
                      className={`p-3.5 ${
                        isNight
                          ? 'bg-[#121822] hover:bg-[#18212E] border-[#232F3F]'
                          : 'bg-[#FAF9F6] hover:bg-[#F2EFE8] border-[#DDD9CE] hover:border-[#FFC107]'
                      } border hover:border-[#FFC107]/50 text-left transition-all flex items-center gap-3 cursor-pointer group`}
                    >
                      <div className={`w-9 h-9 ${isNight ? 'bg-[#1A2330] text-[#FFC107]' : 'bg-[#EDECE6] text-[#B28200]'} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                        <ImageIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className={`text-xs font-bold ${isNight ? 'text-white' : 'text-[#11161A]'} font-mono uppercase`}>Media &amp; Photo Vault</div>
                        <div className={`text-[11px] ${isNight ? 'text-[#728090]' : 'text-[#66707A]'}`}>Upload &amp; manage site photos</div>
                      </div>
                    </button>
                  </div>

                  {/* Announcement Bar Quick Switch */}
                  <div className={`pt-2 border-t ${isNight ? 'border-[#18212D]' : 'border-[#EAE8E1]'} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
                    <div>
                      <div className={`text-xs font-mono font-bold ${isNight ? 'text-white' : 'text-[#11161A]'}`}>Announcement Banner</div>
                      <div className={`text-[11px] ${isNight ? 'text-[#728090]' : 'text-[#66707A]'}`}>
                        {content.settings?.announcementActive ? 'Currently active across top of hero' : 'Currently hidden'}
                      </div>
                    </div>
                    <button
                      onClick={async () => {
                        const updated = !content.settings?.announcementActive;
                        await updateSettings({ announcementActive: updated });
                        showToast(`Announcement bar ${updated ? 'activated' : 'deactivated'}!`);
                      }}
                      className={`px-3.5 py-1.5 text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                        content.settings?.announcementActive
                          ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300'
                          : isNight ? 'bg-[#16202B] border border-[#243242] text-[#8695A5]' : 'bg-[#EDECE6] border border-[#D8D5CA] text-[#444E58]'
                      }`}
                    >
                      {content.settings?.announcementActive ? 'ACTIVE (CLICK TO DISABLE)' : 'DISABLED (CLICK TO ENABLE)'}
                    </button>
                  </div>
                </div>

                {/* Right: Recent Inquiries Feed */}
                <div className={`${isNight ? 'bg-[#0C1016] border-[#1E2734]' : 'bg-white border-[#E2E0D8] shadow-sm'} border p-6 space-y-4`}>
                  <div className={`flex items-center justify-between border-b ${isNight ? 'border-[#18212D]' : 'border-[#EAE8E1]'} pb-3`}>
                    <h3 className={`text-sm font-bold ${isNight ? 'text-white' : 'text-[#11161A]'} uppercase tracking-wider font-mono flex items-center gap-2`}>
                      <Inbox className="w-4 h-4 text-[#FFC107]" />
                      <span>RECENT LEADS</span>
                    </h3>
                    <button
                      onClick={() => setActiveTab('inquiries')}
                      className="text-[10px] font-mono text-[#FFC107] hover:underline cursor-pointer"
                    >
                      VIEW ALL
                    </button>
                  </div>

                  {inquiriesLoading ? (
                    <div className={`py-8 text-center text-xs font-mono ${isNight ? 'text-[#6A7888]' : 'text-[#66707A]'}`}>Loading inquiries...</div>
                  ) : inquiries.length === 0 ? (
                    <div className={`py-8 text-center text-xs font-mono ${isNight ? 'text-[#6A7888]' : 'text-[#66707A]'}`}>No inquiries received yet.</div>
                  ) : (
                    <div className="space-y-3">
                      {inquiries.slice(0, 3).map((inq) => (
                        <div
                          key={inq.id}
                          onClick={() => {
                            setSelectedInquiry(inq);
                            setInquiryModalOpen(true);
                          }}
                          className={`p-3 ${
                            isNight
                              ? 'bg-[#111720] hover:bg-[#16202C] border-[#202C3A]'
                              : 'bg-[#FAF9F6] hover:bg-[#F2EFE8] border-[#DDD9CE]'
                          } border cursor-pointer transition-all`}
                        >
                          <div className="flex items-center justify-between text-xs font-mono">
                            <span className={`font-bold ${isNight ? 'text-white' : 'text-[#11161A]'}`}>{inq.name}</span>
                            <span
                              className={`text-[9px] px-1.5 py-0.2 font-bold ${
                                inq.status === 'New'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                  : isNight ? 'bg-[#1C2734] text-[#8C9BAA]' : 'bg-[#EDECE6] text-[#333D47] border border-[#DDD9CE]'
                              }`}
                            >
                              {inq.status}
                            </span>
                          </div>
                          <div className={`text-[11px] ${isNight ? 'text-[#8C9AA8]' : 'text-[#555E67]'} truncate mt-0.5`}>{inq.company}</div>
                          <div className={`text-[10px] ${isNight ? 'text-[#5D6B7A]' : 'text-[#66707A]'} font-mono mt-1 flex items-center justify-between`}>
                            <span>{inq.projectType}</span>
                            <span>{new Date(inq.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 2. HERO & BRAND IDENTITY */}
          {activeTab === 'brand' && (
            <div className="max-w-4xl mx-auto space-y-8">
              <form onSubmit={handleSaveBrand} className={`${isNight ? 'bg-[#0C1016] border-[#1E2734]' : 'bg-white border-[#E2E0D8] shadow-sm'} border p-6 sm:p-8 space-y-6`}>
                <div className={`border-b ${isNight ? 'border-[#18212D]' : 'border-[#EAE8E1]'} pb-4`}>
                  <h3 className={`text-base font-bold ${isNight ? 'text-white' : 'text-[#11161A]'} uppercase tracking-wider font-mono`}>
                    HERO BANNER &amp; COMPANY METADATA
                  </h3>
                  <p className={`text-xs ${isNight ? 'text-[#7A8898]' : 'text-[#66707A]'} font-mono mt-1`}>
                    Control the main homepage billboard headline, editorial description, and corporate contact records.
                  </p>
                </div>

                {/* Hero Headline Configuration */}
                <div className="space-y-4">
                  <div className={`text-xs font-mono font-bold ${isNight ? 'text-[#FFC107]' : 'text-[#B28200]'} uppercase tracking-wider`}>
                    HOMEPAGE BILLBOARD HEADLINE
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-[11px] font-mono ${isNight ? 'text-[#8C9BAA]' : 'text-[#4B5663] font-semibold'} uppercase mb-1.5`}>
                        Headline Prefix (Top Word)
                      </label>
                      <input
                        type="text"
                        value={brandForm.heroPrefix || ''}
                        onChange={(e) => setBrandForm({ ...brandForm, heroPrefix: e.target.value })}
                        placeholder="e.g. POWERING"
                        className={`w-full ${
                          isNight
                            ? 'bg-[#121922] border-[#243140] text-white focus:border-[#FFC107]'
                            : 'bg-[#FAF9F6] border-[#DDD9CE] text-[#11161A] focus:border-[#FFC107] focus:bg-white'
                        } border text-xs px-3.5 py-2.5 outline-none font-mono`}
                      />
                    </div>
                    <div>
                      <label className={`block text-[11px] font-mono ${isNight ? 'text-[#8C9BAA]' : 'text-[#4B5663] font-semibold'} uppercase mb-1.5`}>
                        Headline Highlight (Amber Word)
                      </label>
                      <input
                        type="text"
                        value={brandForm.heroHighlight || ''}
                        onChange={(e) => setBrandForm({ ...brandForm, heroHighlight: e.target.value })}
                        placeholder="e.g. TOMORROW."
                        className={`w-full ${
                          isNight
                            ? 'bg-[#121922] border-[#243140] text-[#FFC107] focus:border-[#FFC107]'
                            : 'bg-[#FAF9F6] border-[#DDD9CE] text-[#B28200] focus:border-[#FFC107] focus:bg-white'
                        } border font-bold text-xs px-3.5 py-2.5 outline-none font-mono`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-[11px] font-mono ${isNight ? 'text-[#8C9BAA]' : 'text-[#4B5663] font-semibold'} uppercase mb-1.5`}>
                      Hero Editorial Description
                    </label>
                    <textarea
                      rows={3}
                      value={brandForm.heroDescription || ''}
                      onChange={(e) => setBrandForm({ ...brandForm, heroDescription: e.target.value })}
                      className={`w-full ${
                        isNight
                          ? 'bg-[#121922] border-[#243140] text-white focus:border-[#FFC107]'
                          : 'bg-[#FAF9F6] border-[#DDD9CE] text-[#11161A] focus:border-[#FFC107] focus:bg-white'
                      } border text-xs p-3 outline-none leading-relaxed`}
                    />
                  </div>
                </div>

                {/* Company Contact Information */}
                <div className={`pt-4 border-t ${isNight ? 'border-[#18212D]' : 'border-[#EAE8E1]'} space-y-4`}>
                  <div className={`text-xs font-mono font-bold ${isNight ? 'text-[#FFC107]' : 'text-[#B28200]'} uppercase tracking-wider`}>
                    OFFICIAL CORPORATE CONTACT CHANNELS
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-[11px] font-mono ${isNight ? 'text-[#8C9BAA]' : 'text-[#4B5663] font-semibold'} uppercase mb-1.5`}>
                        Primary Landline Phone
                      </label>
                      <input
                        type="text"
                        value={brandForm.contact?.phone || ''}
                        onChange={(e) =>
                          setBrandForm({
                            ...brandForm,
                            contact: { ...brandForm.contact, phone: e.target.value },
                          })
                        }
                        className={`w-full ${
                          isNight
                            ? 'bg-[#121922] border-[#243140] text-white focus:border-[#FFC107]'
                            : 'bg-[#FAF9F6] border-[#DDD9CE] text-[#11161A] focus:border-[#FFC107] focus:bg-white'
                        } border text-xs px-3.5 py-2.5 outline-none font-mono`}
                      />
                    </div>
                    <div>
                      <label className={`block text-[11px] font-mono ${isNight ? 'text-[#8C9BAA]' : 'text-[#4B5663] font-semibold'} uppercase mb-1.5`}>
                        Mobile &amp; WhatsApp Emergency Hotline
                      </label>
                      <input
                        type="text"
                        value={brandForm.contact?.phoneMobile || ''}
                        onChange={(e) =>
                          setBrandForm({
                            ...brandForm,
                            contact: { ...brandForm.contact, phoneMobile: e.target.value },
                          })
                        }
                        className={`w-full ${
                          isNight
                            ? 'bg-[#121922] border-[#243140] text-white focus:border-[#FFC107]'
                            : 'bg-[#FAF9F6] border-[#DDD9CE] text-[#11161A] focus:border-[#FFC107] focus:bg-white'
                        } border text-xs px-3.5 py-2.5 outline-none font-mono`}
                      />
                    </div>
                    <div>
                      <label className={`block text-[11px] font-mono ${isNight ? 'text-[#8C9BAA]' : 'text-[#4B5663] font-semibold'} uppercase mb-1.5`}>
                        Official Inquiry Email
                      </label>
                      <input
                        type="email"
                        value={brandForm.contact?.email || ''}
                        onChange={(e) =>
                          setBrandForm({
                            ...brandForm,
                            contact: { ...brandForm.contact, email: e.target.value },
                          })
                        }
                        className={`w-full ${
                          isNight
                            ? 'bg-[#121922] border-[#243140] text-white focus:border-[#FFC107]'
                            : 'bg-[#FAF9F6] border-[#DDD9CE] text-[#11161A] focus:border-[#FFC107] focus:bg-white'
                        } border text-xs px-3.5 py-2.5 outline-none font-mono`}
                      />
                    </div>
                    <div>
                      <label className={`block text-[11px] font-mono ${isNight ? 'text-[#8C9BAA]' : 'text-[#4B5663] font-semibold'} uppercase mb-1.5`}>
                        Operating Engineering Hours
                      </label>
                      <input
                        type="text"
                        value={brandForm.contact?.hours || ''}
                        onChange={(e) =>
                          setBrandForm({
                            ...brandForm,
                            contact: { ...brandForm.contact, hours: e.target.value },
                          })
                        }
                        className={`w-full ${
                          isNight
                            ? 'bg-[#121922] border-[#243140] text-white focus:border-[#FFC107]'
                            : 'bg-[#FAF9F6] border-[#DDD9CE] text-[#11161A] focus:border-[#FFC107] focus:bg-white'
                        } border text-xs px-3.5 py-2.5 outline-none font-mono`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-[11px] font-mono ${isNight ? 'text-[#8C9BAA]' : 'text-[#4B5663] font-semibold'} uppercase mb-1.5`}>
                      Corporate Facility Address
                    </label>
                    <input
                      type="text"
                      value={brandForm.contact?.address || ''}
                      onChange={(e) =>
                        setBrandForm({
                          ...brandForm,
                          contact: { ...brandForm.contact, address: e.target.value },
                        })
                      }
                      className={`w-full ${
                        isNight
                          ? 'bg-[#121922] border-[#243140] text-white focus:border-[#FFC107]'
                          : 'bg-[#FAF9F6] border-[#DDD9CE] text-[#11161A] focus:border-[#FFC107] focus:bg-white'
                      } border text-xs px-3.5 py-2.5 outline-none font-mono`}
                    />
                  </div>
                </div>

                {/* Hero Background Videos & Cinematic Media */}
                <div className={`pt-4 border-t ${isNight ? 'border-[#18212D]' : 'border-[#EAE8E1]'} space-y-4`}>
                  <div className={`text-xs font-mono font-bold ${isNight ? 'text-[#FFC107]' : 'text-[#B28200]'} uppercase tracking-wider flex items-center gap-2`}>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>HERO BACKGROUND VIDEOS &amp; CINEMATIC MEDIA</span>
                  </div>
                  <p className={`text-xs ${isNight ? 'text-[#7A8898]' : 'text-[#66707A]'} font-mono`}>
                    Configure dynamic cinematic background videos for Day Mode and Night Mode across the site hero section.
                  </p>

                  <div className="space-y-4">
                    <VideoField
                      label="Day Mode Hero Video (Sunlit Solar & Power Generation)"
                      value={brandForm.heroVideoDay || '/videos/hero-day.mp4'}
                      onChange={(url) => setBrandForm({ ...brandForm, heroVideoDay: url })}
                      defaultUrl="/videos/hero-day.mp4"
                      hint="1080p MP4 or WebM (Day Mode background)"
                    />

                    <VideoField
                      label="Night Mode Hero Video (Grid Automation & Night Operations)"
                      value={brandForm.heroVideoNight || '/videos/hero-night.mp4'}
                      onChange={(url) => setBrandForm({ ...brandForm, heroVideoNight: url })}
                      defaultUrl="/videos/hero-night.mp4"
                      hint="1080p MP4 or WebM (Night Mode background)"
                    />

                    <PhotoField
                      label="Hero Fallback Poster Image (Pre-Load & Low-Bandwidth Devices)"
                      value={brandForm.heroPoster || '/images/hero-solar-sunrise.jpg'}
                      onChange={(url) => setBrandForm({ ...brandForm, heroPoster: url })}
                      hint="Shown before video plays or on mobile data saver"
                      aspectRatio="wide"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#FFC107] hover:bg-[#E6A900] text-[#0A0D0F] text-xs font-bold font-mono tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(255,193,7,0.35)] flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>SAVE IDENTITY CHANGES</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 3. STATISTICS STRIP */}
          {activeTab === 'stats' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <form onSubmit={handleSaveStatistics} className={`${isNight ? 'bg-[#0C1016] border-[#1E2734]' : 'bg-white border-[#E2E0D8] shadow-sm'} border p-6 sm:p-8 space-y-6`}>
                <div className={`border-b ${isNight ? 'border-[#18212D]' : 'border-[#EAE8E1]'} pb-4 flex items-center justify-between`}>
                  <div>
                    <h3 className={`text-base font-bold ${isNight ? 'text-white' : 'text-[#11161A]'} uppercase tracking-wider font-mono`}>
                      CORE ENGINEERING STATISTICS (STAT STRIP)
                    </h3>
                    <p className={`text-xs ${isNight ? 'text-[#7A8898]' : 'text-[#66707A]'} font-mono mt-1`}>
                      Displayed immediately below the hero banner with animated counter telemetry.
                    </p>
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#FFC107] hover:bg-[#E6A900] text-[#0A0D0F] text-xs font-bold font-mono tracking-wider uppercase transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save All</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {statsForm.map((stat, idx) => (
                    <div key={stat.id || idx} className={`p-4 ${isNight ? 'bg-[#111720] border-[#202C3A]' : 'bg-[#FAF9F6] border-[#DDD9CE]'} border space-y-3`}>
                      <div className={`flex items-center justify-between text-xs font-mono font-bold ${isNight ? 'text-[#FFC107]' : 'text-[#B28200]'}`}>
                        <span>METRIC #{idx + 1}</span>
                        <span className={`text-[10px] ${isNight ? 'text-[#637180]' : 'text-[#7D8895]'}`}>ID: {stat.id}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={`block text-[10px] font-mono ${isNight ? 'text-[#8C9AA8]' : 'text-[#4B5663] font-semibold'} uppercase mb-1`}>
                            Numerical Value
                          </label>
                          <input
                            type="number"
                            value={stat.value}
                            onChange={(e) => {
                              const updated = [...statsForm];
                              updated[idx].value = Number(e.target.value);
                              setStatsForm(updated);
                            }}
                            className={`w-full ${isNight ? 'bg-[#16202C] border-[#273648] text-white' : 'bg-white border-[#DDD9CE] text-[#11161A]'} border text-xs px-3 py-2 outline-none font-mono focus:border-[#FFC107]`}
                          />
                        </div>
                        <div>
                          <label className={`block text-[10px] font-mono ${isNight ? 'text-[#8C9AA8]' : 'text-[#4B5663] font-semibold'} uppercase mb-1`}>
                            Suffix
                          </label>
                          <input
                            type="text"
                            value={stat.suffix}
                            onChange={(e) => {
                              const updated = [...statsForm];
                              updated[idx].suffix = e.target.value;
                              setStatsForm(updated);
                            }}
                            placeholder="+, MW+, %"
                            className={`w-full ${isNight ? 'bg-[#16202C] border-[#273648] text-[#FFC107]' : 'bg-white border-[#DDD9CE] text-[#B28200]'} border text-xs px-3 py-2 outline-none font-mono focus:border-[#FFC107]`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className={`block text-[10px] font-mono ${isNight ? 'text-[#8C9AA8]' : 'text-[#4B5663] font-semibold'} uppercase mb-1`}>
                          Label Text
                        </label>
                        <input
                          type="text"
                          value={stat.label}
                          onChange={(e) => {
                            const updated = [...statsForm];
                            updated[idx].label = e.target.value;
                            setStatsForm(updated);
                          }}
                          className={`w-full ${isNight ? 'bg-[#16202C] border-[#273648] text-white' : 'bg-white border-[#DDD9CE] text-[#11161A]'} border text-xs px-3 py-2 outline-none font-mono uppercase focus:border-[#FFC107]`}
                        />
                      </div>

                      <div>
                        <label className={`block text-[10px] font-mono ${isNight ? 'text-[#8C9AA8]' : 'text-[#4B5663] font-semibold'} uppercase mb-1`}>
                          Subtitle / Scope Description
                        </label>
                        <input
                          type="text"
                          value={stat.description}
                          onChange={(e) => {
                            const updated = [...statsForm];
                            updated[idx].description = e.target.value;
                            setStatsForm(updated);
                          }}
                          className={`w-full ${isNight ? 'bg-[#16202C] border-[#273648] text-[#A2B0BF]' : 'bg-white border-[#DDD9CE] text-[#333D47]'} border text-xs px-3 py-2 outline-none focus:border-[#FFC107]`}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#FFC107] hover:bg-[#E6A900] text-[#0A0D0F] text-xs font-bold font-mono tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(255,193,7,0.35)] flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>SAVE ALL 4 STATISTICS</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 4. SERVICES MANAGER */}
          {activeTab === 'services' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              {/* Header Bar with Search & Add */}
              <div className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 ${isNight ? 'bg-[#0C1016] border-[#1E2734]' : 'bg-white border-[#E2E0D8] shadow-sm'} border p-4`}>
                <div className="relative flex-1 max-w-md">
                  <Search className={`w-4 h-4 ${isNight ? 'text-[#606E7E]' : 'text-[#7D8895]'} absolute left-3 top-1/2 -translate-y-1/2`} />
                  <input
                    type="text"
                    value={serviceSearch}
                    onChange={(e) => setServiceSearch(e.target.value)}
                    placeholder="Search engineering disciplines by title or scope..."
                    className={`w-full ${isNight ? 'bg-[#121922] border-[#243140] text-white' : 'bg-[#FAF9F6] border-[#DDD9CE] text-[#11161A]'} border text-xs pl-9 pr-3.5 py-2 outline-none font-mono focus:border-[#FFC107]`}
                  />
                </div>

                <button
                  onClick={() => {
                    setEditingService(null);
                    setServiceModalOpen(true);
                  }}
                  className="px-4 py-2 bg-[#FFC107] hover:bg-[#E6A900] text-[#0A0D0F] text-xs font-bold font-mono tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(255,193,7,0.3)]"
                >
                  <Plus className="w-4 h-4" />
                  <span>ADD NEW SERVICE</span>
                </button>
              </div>

              {/* Services Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map((service) => (
                  <div
                    key={service.id}
                    className={`${isNight ? 'bg-[#0C1016] border-[#1E2734]' : 'bg-white border-[#E2E0D8] shadow-sm'} border hover:border-[#FFC107]/40 transition-all flex flex-col justify-between overflow-hidden group`}
                  >
                    <div>
                      {/* Image Preview with Badge */}
                      <div className={`relative h-44 w-full ${isNight ? 'bg-[#141C25] border-[#1C2532]' : 'bg-[#EDECE6] border-[#E2E0D8]'} overflow-hidden border-b`}>
                        <Image
                          src={service.image}
                          alt={service.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className={`absolute top-3 left-3 px-2 py-0.5 ${isNight ? 'bg-[#0A0D12]/90 border-[#253242] text-[#FFC107]' : 'bg-white/95 border-[#DDD9CE] text-[#B28200]'} border text-[10px] font-mono font-bold`}>
                          #{service.number}
                        </div>
                        {service.isHome && (
                          <div className="absolute top-3 right-3 px-2 py-0.5 bg-emerald-500/90 text-[#0A0D0F] text-[9px] font-mono font-bold tracking-wider uppercase">
                            HOMEPAGE ACTIVE
                          </div>
                        )}
                      </div>

                      <div className="p-5 space-y-3">
                        <div>
                          <div className={`text-[10px] font-mono ${isNight ? 'text-[#FFC107]' : 'text-[#B28200]'} uppercase tracking-wider`}>
                            {service.tagline}
                          </div>
                          <h4 className={`text-sm font-bold ${isNight ? 'text-white' : 'text-[#11161A]'} uppercase font-mono mt-0.5`}>
                            {service.title}
                          </h4>
                        </div>

                        <p className={`text-xs ${isNight ? 'text-[#82909F]' : 'text-[#555E68]'} line-clamp-2 leading-relaxed`}>
                          {service.description}
                        </p>

                        {/* Features chips */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {service.features?.slice(0, 3).map((feat, fidx) => (
                            <span
                              key={fidx}
                              className={`text-[10px] font-mono px-2 py-0.5 ${
                                isNight
                                  ? 'bg-[#141C26] border-[#232F3E] text-[#9BA8B7]'
                                  : 'bg-[#EDECE6] border-[#DDD9CE] text-[#333D47]'
                              } border`}
                            >
                              {feat}
                            </span>
                          ))}
                          {service.features?.length > 3 && (
                            <span className={`text-[10px] font-mono px-1.5 py-0.5 ${isNight ? 'text-[#5F6D7C]' : 'text-[#7D8895]'}`}>
                              +{service.features.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className={`p-4 ${isNight ? 'bg-[#090C10] border-[#18212D]' : 'bg-[#F8F7F3] border-[#E8E6DF]'} border-t flex items-center justify-between`}>
                      <button
                        onClick={async () => {
                          await saveService({ ...service, isHome: !service.isHome });
                          showToast(`Homepage status for ${service.title} updated!`);
                        }}
                        className={`text-[10px] font-mono px-2 py-1 border transition-all cursor-pointer ${
                          service.isHome
                            ? isNight
                              ? 'bg-[#18222E] border-[#253342] text-[#8BA0B5] hover:border-red-500/50 hover:text-red-300'
                              : 'bg-[#EDECE6] hover:bg-[#E2DFD4] border-[#D8D5CA] text-[#444E58] hover:border-red-500/50 hover:text-red-600'
                            : 'bg-[#FFC107]/10 border-[#FFC107]/30 text-[#FFC107] hover:bg-[#FFC107]/20'
                        }`}
                      >
                        {service.isHome ? 'Hide from Home' : 'Show on Home'}
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingService(service);
                            setServiceModalOpen(true);
                          }}
                          className={`p-1.5 ${
                            isNight
                              ? 'bg-[#141C26] hover:bg-[#1D2734] border-[#253342] text-[#A5B2C0] hover:text-[#FFC107]'
                              : 'bg-[#EDECE6] hover:bg-[#E2DFD4] border-[#D8D5CA] text-[#444E58] hover:text-[#B28200]'
                          } border transition-all cursor-pointer`}
                          title="Edit Service"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setConfirmDeleteModal({
                              open: true,
                              title: `Delete Service "${service.title}"?`,
                              description: 'This will remove the discipline from the website catalog permanently.',
                              onConfirm: async () => {
                                setConfirmDeleteModal((prev) => ({ ...prev, open: false }));
                                await deleteService(service.id);
                                showToast(`Service ${service.title} deleted.`);
                              },
                            });
                          }}
                          className={`p-1.5 ${
                            isNight
                              ? 'bg-[#141C26] hover:bg-red-950/60 border-[#253342] hover:border-red-700/60 text-[#A5B2C0] hover:text-red-400'
                              : 'bg-[#EDECE6] hover:bg-red-50 border-[#D8D5CA] hover:border-red-300 text-[#444E58] hover:text-red-600'
                          } border transition-all cursor-pointer`}
                          title="Delete Service"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. HARDWARE PRODUCTS CATALOG */}
          {activeTab === 'products' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              {/* Category Filter & Search */}
              <div className={`${isNight ? 'bg-[#0C1016] border-[#1E2734]' : 'bg-white border-[#E2E0D8] shadow-sm'} border p-4 space-y-4`}>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className={`w-4 h-4 ${isNight ? 'text-[#606E7E]' : 'text-[#7D8895]'} absolute left-3 top-1/2 -translate-y-1/2`} />
                    <input
                      type="text"
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      placeholder="Search hardware by name or subtitle..."
                      className={`w-full ${isNight ? 'bg-[#121922] border-[#243140] text-white' : 'bg-[#FAF9F6] border-[#DDD9CE] text-[#11161A]'} border text-xs pl-9 pr-3.5 py-2 outline-none font-mono focus:border-[#FFC107]`}
                    />
                  </div>

                  <button
                    onClick={() => {
                      setEditingProduct(null);
                      setProductModalOpen(true);
                    }}
                    className="px-4 py-2 bg-[#FFC107] hover:bg-[#E6A900] text-[#0A0D0F] text-xs font-bold font-mono tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(255,193,7,0.3)]"
                  >
                    <Plus className="w-4 h-4" />
                    <span>ADD NEW PRODUCT</span>
                  </button>
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {[
                    'ALL',
                    'SOLAR PANELS',
                    'INVERTERS',
                    'CABLES & WIRING',
                    'SWITCHGEAR',
                    'LED LIGHTING',
                    'CONTROL PANELS',
                  ].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setProductCategoryFilter(cat)}
                      className={`text-[10px] font-mono px-3 py-1.5 shrink-0 transition-all cursor-pointer ${
                        productCategoryFilter === cat
                          ? 'bg-[#FFC107] text-[#0A0D0F] font-bold'
                          : isNight ? 'bg-[#141C25] text-[#8695A5] hover:bg-[#1A2532] hover:text-white' : 'bg-[#EDECE6] text-[#444E58] hover:bg-[#DDD9CE] hover:text-[#11161A]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`${isNight ? 'bg-[#0C1016] border-[#1E2734]' : 'bg-white border-[#E2E0D8] shadow-sm'} border hover:border-[#FFC107]/40 transition-all flex flex-col justify-between overflow-hidden group`}
                  >
                    <div>
                      {/* Image Preview with Category Badge */}
                      <div className={`relative h-44 w-full ${isNight ? 'bg-[#141C25] border-[#1C2532]' : 'bg-[#EDECE6] border-[#E2E0D8]'} overflow-hidden border-b`}>
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className={`absolute top-3 left-3 px-2 py-0.5 ${isNight ? 'bg-[#0A0D12]/90 border-[#253242] text-[#FFC107]' : 'bg-white/95 border-[#DDD9CE] text-[#B28200]'} border text-[10px] font-mono font-bold uppercase`}>
                          {product.category}
                        </div>
                        {product.isFeatured && (
                          <div className="absolute top-3 right-3 px-2 py-0.5 bg-[#FFC107] text-[#0A0D0F] text-[9px] font-mono font-bold tracking-wider uppercase flex items-center gap-1 shadow-md">
                            <Star className="w-3 h-3 fill-current" />
                            <span>FEATURED</span>
                          </div>
                        )}
                      </div>

                      <div className="p-5 space-y-3">
                        <div>
                          <div className={`text-[10px] font-mono ${isNight ? 'text-[#8292A3]' : 'text-[#7D8895]'}`}>
                            {product.subtitle}
                          </div>
                          <h4 className={`text-sm font-bold ${isNight ? 'text-white' : 'text-[#11161A]'} uppercase font-mono mt-0.5`}>
                            {product.name}
                          </h4>
                        </div>

                        <p className={`text-xs ${isNight ? 'text-[#82909F]' : 'text-[#555E68]'} line-clamp-2 leading-relaxed`}>
                          {product.description}
                        </p>

                        {/* Specs Key-Values */}
                        <div className={`pt-2 border-t ${isNight ? 'border-[#18212D]' : 'border-[#EAE8E1]'} space-y-1`}>
                          {product.specs?.slice(0, 3).map((spec, sidx) => (
                            <div key={sidx} className="flex items-center justify-between text-[11px] font-mono">
                              <span className={isNight ? 'text-[#6C7A89]' : 'text-[#66707A]'}>{spec.label}</span>
                              <span className={`${isNight ? 'text-white' : 'text-[#11161A]'} font-medium`}>{spec.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className={`p-4 ${isNight ? 'bg-[#090C10] border-[#18212D]' : 'bg-[#F8F7F3] border-[#E8E6DF]'} border-t flex items-center justify-between`}>
                      <button
                        onClick={async () => {
                          const updatedProducts = content.products.map((p) => ({
                            ...p,
                            isFeatured: p.id === product.id ? !product.isFeatured : false,
                          }));
                          await saveProduct({ ...product, isFeatured: !product.isFeatured });
                          showToast(`Featured product updated!`);
                        }}
                        className={`text-[10px] font-mono px-2 py-1 border transition-all cursor-pointer flex items-center gap-1 ${
                          product.isFeatured
                            ? 'bg-[#FFC107]/20 border-[#FFC107] text-[#FFC107]'
                            : isNight ? 'bg-[#141C25] border-[#253342] text-[#8BA0B5] hover:text-[#FFC107]' : 'bg-[#EDECE6] border-[#D8D5CA] text-[#444E58] hover:text-[#B28200]'
                        }`}
                      >
                        <Star className="w-3 h-3" />
                        <span>{product.isFeatured ? 'Hero Active' : 'Make Hero'}</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingProduct(product);
                            setProductModalOpen(true);
                          }}
                          className={`p-1.5 ${
                            isNight
                              ? 'bg-[#141C26] hover:bg-[#1D2734] border-[#253342] text-[#A5B2C0] hover:text-[#FFC107]'
                              : 'bg-[#EDECE6] hover:bg-[#E2DFD4] border-[#D8D5CA] text-[#444E58] hover:text-[#B28200]'
                          } border transition-all cursor-pointer`}
                          title="Edit Product"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setConfirmDeleteModal({
                              open: true,
                              title: `Delete Product "${product.name}"?`,
                              description: 'This will remove the product from the hardware catalog permanently.',
                              onConfirm: async () => {
                                setConfirmDeleteModal((prev) => ({ ...prev, open: false }));
                                await deleteProduct(product.id);
                                showToast(`Product ${product.name} deleted.`);
                              },
                            });
                          }}
                          className={`p-1.5 ${
                            isNight
                              ? 'bg-[#141C26] hover:bg-red-950/60 border-[#253342] hover:border-red-700/60 text-[#A5B2C0] hover:text-red-400'
                              : 'bg-[#EDECE6] hover:bg-red-50 border-[#D8D5CA] hover:border-red-300 text-[#444E58] hover:text-red-600'
                          } border transition-all cursor-pointer`}
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. SELECTED PROJECTS SHOWCASE */}
          {activeTab === 'projects' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 ${isNight ? 'bg-[#0C1016] border-[#1E2734]' : 'bg-white border-[#E2E0D8] shadow-sm'} border p-4`}>
                <div className="relative flex-1 max-w-md">
                  <Search className={`w-4 h-4 ${isNight ? 'text-[#606E7E]' : 'text-[#7D8895]'} absolute left-3 top-1/2 -translate-y-1/2`} />
                  <input
                    type="text"
                    value={projectSearch}
                    onChange={(e) => setProjectSearch(e.target.value)}
                    placeholder="Search showcase installations by title, scope, location..."
                    className={`w-full ${isNight ? 'bg-[#121922] border-[#243140] text-white' : 'bg-[#FAF9F6] border-[#DDD9CE] text-[#11161A]'} border text-xs pl-9 pr-3.5 py-2 outline-none font-mono focus:border-[#FFC107]`}
                  />
                </div>

                <button
                  onClick={() => {
                    setEditingProject(null);
                    setProjectModalOpen(true);
                  }}
                  className="px-4 py-2 bg-[#FFC107] hover:bg-[#E6A900] text-[#0A0D0F] text-xs font-bold font-mono tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(255,193,7,0.3)]"
                >
                  <Plus className="w-4 h-4" />
                  <span>ADD PORTFOLIO PROJECT</span>
                </button>
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className={`${isNight ? 'bg-[#0C1016] border-[#1E2734]' : 'bg-white border-[#E2E0D8] shadow-sm'} border hover:border-[#FFC107]/40 transition-all flex flex-col justify-between overflow-hidden group`}
                  >
                    <div>
                      <div className={`relative h-52 w-full ${isNight ? 'bg-[#141C25] border-[#1C2532]' : 'bg-[#EDECE6] border-[#E2E0D8]'} overflow-hidden border-b`}>
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className={`absolute top-3 left-3 px-2 py-0.5 ${isNight ? 'bg-[#0A0D12]/90 border-[#253242] text-[#FFC107]' : 'bg-white/95 border-[#DDD9CE] text-[#B28200]'} border text-[10px] font-mono font-bold uppercase`}>
                          {project.category}
                        </div>
                        <div className="absolute top-3 right-3 px-2 py-0.5 bg-emerald-500/90 text-[#0A0D0F] text-[9px] font-mono font-bold tracking-wider uppercase">
                          {project.status || 'OPERATIONAL'}
                        </div>
                      </div>

                      <div className="p-5 space-y-3">
                        <div className={`flex items-center gap-1.5 text-[11px] font-mono ${isNight ? 'text-[#8594A4]' : 'text-[#66707A]'}`}>
                          <MapPin className="w-3.5 h-3.5 text-[#FFC107]" />
                          <span>{project.location}</span>
                        </div>

                        <h4 className={`text-base font-bold ${isNight ? 'text-white' : 'text-[#11161A]'} uppercase font-mono`}>
                          {project.title}
                        </h4>

                        <p className={`text-xs ${isNight ? 'text-[#95A3B3]' : 'text-[#555E68]'} leading-relaxed`}>
                          {project.scope}
                        </p>

                        {/* Specs */}
                        <div className={`pt-2 border-t ${isNight ? 'border-[#18212D]' : 'border-[#EAE8E1]'} space-y-1`}>
                          {project.specs?.map((spec, sidx) => (
                            <div key={sidx} className="flex items-center justify-between text-[11px] font-mono">
                              <span className={isNight ? 'text-[#6C7A89]' : 'text-[#66707A]'}>{spec.label}</span>
                              <span className={`${isNight ? 'text-white' : 'text-[#11161A]'} font-medium`}>{spec.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className={`p-4 ${isNight ? 'bg-[#090C10] border-[#18212D]' : 'bg-[#F8F7F3] border-[#E8E6DF]'} border-t flex items-center justify-end gap-2`}>
                      <button
                        onClick={() => {
                          setEditingProject(project);
                          setProjectModalOpen(true);
                        }}
                        className={`px-3 py-1.5 ${
                          isNight
                            ? 'bg-[#141C26] hover:bg-[#1D2734] border-[#253342] text-[#A5B2C0] hover:text-[#FFC107]'
                            : 'bg-[#EDECE6] hover:bg-[#E2DFD4] border-[#D8D5CA] text-[#444E58] hover:text-[#B28200]'
                        } border text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer`}
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit Project</span>
                      </button>
                      <button
                        onClick={() => {
                          setConfirmDeleteModal({
                            open: true,
                            title: `Delete Project "${project.title}"?`,
                            description: 'This will remove the project from the portfolio showcase.',
                            onConfirm: async () => {
                              setConfirmDeleteModal((prev) => ({ ...prev, open: false }));
                              await deleteProject(project.id);
                              showToast(`Project ${project.title} deleted.`);
                            },
                          });
                        }}
                        className={`p-1.5 ${
                          isNight
                            ? 'bg-[#141C26] hover:bg-red-950/60 border-[#253342] hover:border-red-700/60 text-[#A5B2C0] hover:text-red-400'
                            : 'bg-[#EDECE6] hover:bg-red-50 border-[#D8D5CA] hover:border-red-300 text-[#444E58] hover:text-red-600'
                        } border transition-all cursor-pointer`}
                        title="Delete Project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. MEDIA VAULT & PHOTO ASSET MANAGER */}
          {activeTab === 'media' && <MediaLibraryTab />}

          {/* 8. LEADS & INQUIRIES MANAGER */}
          {activeTab === 'inquiries' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              {/* Header Filters & CSV Export */}
              <div className={`${isNight ? 'bg-[#0C1016] border-[#1E2734]' : 'bg-white border-[#E2E0D8] shadow-sm'} border p-4 space-y-4`}>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className={`w-4 h-4 ${isNight ? 'text-[#606E7E]' : 'text-[#7D8895]'} absolute left-3 top-1/2 -translate-y-1/2`} />
                    <input
                      type="text"
                      value={inquirySearch}
                      onChange={(e) => setInquirySearch(e.target.value)}
                      placeholder="Search inquiries by client name, company, email..."
                      className={`w-full ${isNight ? 'bg-[#121922] border-[#243140] text-white' : 'bg-[#FAF9F6] border-[#DDD9CE] text-[#11161A]'} border text-xs pl-9 pr-3.5 py-2 outline-none font-mono focus:border-[#FFC107]`}
                    />
                  </div>

                  <button
                    onClick={handleExportInquiriesCSV}
                    className={`px-4 py-2 ${
                      isNight
                        ? 'bg-[#141D27] hover:bg-[#1A2633] border-[#253445] text-[#BAC6D3] hover:text-[#FFC107]'
                        : 'bg-[#EDECE6] hover:bg-[#E2DFD4] border-[#D8D5CA] text-[#222B32] hover:text-[#9E7400]'
                    } border text-xs font-mono transition-all flex items-center justify-center gap-2 cursor-pointer`}
                  >
                    <Download className={`w-4 h-4 ${isNight ? 'text-[#FFC107]' : 'text-[#9E7400]'}`} />
                    <span>EXPORT LEADS (CSV)</span>
                  </button>
                </div>

                {/* Status Filter Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {['ALL', 'New', 'Contacted', 'In Review', 'Closed'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setInquiryStatusFilter(st)}
                      className={`text-[10px] font-mono px-3 py-1.5 shrink-0 transition-all cursor-pointer ${
                        inquiryStatusFilter === st
                          ? 'bg-[#FFC107] text-[#0A0D0F] font-bold'
                          : isNight ? 'bg-[#141C25] text-[#8695A5] hover:bg-[#1A2532] hover:text-white' : 'bg-[#EDECE6] text-[#444E58] hover:bg-[#DDD9CE] hover:text-[#11161A]'
                      }`}
                    >
                      {st === 'ALL'
                        ? `ALL LEADS (${inquiries.length})`
                        : `${st} (${inquiries.filter((i) => i.status === st).length})`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Inquiries Table */}
              <div className={`${isNight ? 'bg-[#0C1016] border-[#1E2734]' : 'bg-white border-[#E2E0D8] shadow-sm'} border overflow-hidden`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className={`border-b ${isNight ? 'border-[#18212D] bg-[#090C10] text-[#6A7888]' : 'border-[#EAE8E1] bg-[#EDECE6] text-[#444E58]'} text-[10px] font-mono uppercase tracking-wider`}>
                        <th className="py-3 px-4">Client / Company</th>
                        <th className="py-3 px-4">Project Inquiry</th>
                        <th className="py-3 px-4">Direct Contact</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isNight ? 'divide-[#16202C]' : 'divide-[#EAE8E1]'} text-xs font-mono`}>
                      {inquiriesLoading ? (
                        <tr>
                          <td colSpan={6} className={`py-12 text-center ${isNight ? 'text-[#6A7888]' : 'text-[#7D8895]'}`}>
                            Loading inquiries repository...
                          </td>
                        </tr>
                      ) : filteredInquiries.length === 0 ? (
                        <tr>
                          <td colSpan={6} className={`py-12 text-center ${isNight ? 'text-[#6A7888]' : 'text-[#7D8895]'}`}>
                            No matching inquiry records found.
                          </td>
                        </tr>
                      ) : (
                        filteredInquiries.map((inq) => (
                          <tr key={inq.id} className={`${isNight ? 'hover:bg-[#101620]' : 'hover:bg-[#FAF9F6]'} transition-colors`}>
                            <td className="py-3.5 px-4">
                              <div className={`font-bold ${isNight ? 'text-white' : 'text-[#11161A]'}`}>{inq.name}</div>
                              <div className={`text-[11px] ${isNight ? 'text-[#8290A0]' : 'text-[#555E67]'}`}>{inq.company}</div>
                              {inq.location && (
                                <div className={`text-[10px] ${isNight ? 'text-[#556372]' : 'text-[#7D8895]'}`}>{inq.location}</div>
                              )}
                            </td>

                            <td className="py-3.5 px-4 max-w-xs">
                              <div className={`${isNight ? 'text-white' : 'text-[#11161A]'} font-medium`}>{inq.projectType}</div>
                              {inq.projectScale && (
                                <div className={`text-[11px] ${isNight ? 'text-[#FFC107]' : 'text-[#B28200]'}`}>{inq.projectScale}</div>
                              )}
                              <p className={`text-[11px] ${isNight ? 'text-[#7A8898]' : 'text-[#66707A]'} truncate mt-0.5`}>
                                {inq.message || 'No description provided'}
                              </p>
                            </td>

                            <td className="py-3.5 px-4 space-y-1">
                              <div className="flex items-center gap-2">
                                <a
                                  href={`tel:${inq.phone?.replace(/\s+/g, '')}`}
                                  className={`text-[11px] ${isNight ? 'text-[#A5B2C1]' : 'text-[#444E58]'} hover:text-[#FFC107] transition-colors`}
                                >
                                  {inq.phone}
                                </a>
                              </div>
                              <div>
                                <a
                                  href={`mailto:${inq.email}`}
                                  className={`text-[11px] ${isNight ? 'text-[#7D8C9C]' : 'text-[#555E67]'} hover:text-[#FFC107] transition-colors truncate block max-w-[160px]`}
                                >
                                  {inq.email}
                                </a>
                              </div>
                            </td>

                            <td className={`py-3.5 px-4 text-[11px] ${isNight ? 'text-[#707E8E]' : 'text-[#66707A]'} whitespace-nowrap`}>
                              {new Date(inq.createdAt).toLocaleDateString()}
                            </td>

                            <td className="py-3.5 px-4">
                              <span
                                className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                  inq.status === 'New'
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                    : inq.status === 'In Review'
                                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                                    : inq.status === 'Contacted'
                                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                                    : isNight ? 'bg-[#18212C] text-[#7C8B9B] border border-[#273545]' : 'bg-[#EDECE6] text-[#444E58] border border-[#D8D5CA]'
                                }`}
                              >
                                {inq.status}
                              </span>
                            </td>

                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => {
                                    setSelectedInquiry(inq);
                                    setInquiryModalOpen(true);
                                  }}
                                  className={`px-2.5 py-1 ${
                                    isNight
                                      ? 'bg-[#141C25] hover:bg-[#1E2A38] border-[#263445] text-[#FFC107]'
                                      : 'bg-[#EDECE6] hover:bg-[#E2DFD4] border-[#D8D5CA] text-[#9E7400]'
                                  } border text-[11px] transition-all cursor-pointer`}
                                >
                                  View &amp; Notes
                                </button>
                                <button
                                  onClick={() => {
                                    setConfirmDeleteModal({
                                      open: true,
                                      title: `Delete Inquiry from ${inq.name}?`,
                                      description: 'This will remove the consultation inquiry from the records.',
                                      onConfirm: () => {
                                        setConfirmDeleteModal((prev) => ({ ...prev, open: false }));
                                        handleDeleteInquiry(inq.id);
                                      },
                                    });
                                  }}
                                  className="p-1 text-[#647180] hover:text-red-400 cursor-pointer transition-colors"
                                  title="Delete record"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 8. SETTINGS & MAINTENANCE */}
          {activeTab === 'settings' && (
            <div className="max-w-4xl mx-auto space-y-6">
              
              {/* Site Controls */}
              <form onSubmit={handleSaveSettings} className={`${
                isNight
                  ? 'bg-[#0C1016] border-[#1E2734]'
                  : 'bg-[#F9F8F5] border-[#E2DFD7] shadow-sm'
              } border p-6 sm:p-8 space-y-6`}>
                <div className={`border-b ${isNight ? 'border-[#18212D]' : 'border-[#E6E3DB]'} pb-4`}>
                  <h3 className={`text-base font-bold ${isNight ? 'text-white' : 'text-[#12161A]'} uppercase tracking-wider font-mono`}>
                    SITE CONTROLS &amp; ANNOUNCEMENTS
                  </h3>
                  <p className={`text-xs ${isNight ? 'text-[#7A8898]' : 'text-[#647180]'} font-mono mt-1`}>
                    Manage global flags, maintenance alerts, and top notice bar.
                  </p>
                </div>

                {/* Announcement Bar Toggle & Text */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`text-xs font-mono font-bold ${isNight ? 'text-white' : 'text-[#12161A]'} uppercase`}>
                        Emergency / Notice Banner
                      </div>
                      <div className={`text-[11px] ${isNight ? 'text-[#7A8898]' : 'text-[#647180]'}`}>
                        Appears at the top of the homepage hero video.
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settingsForm.announcementActive}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, announcementActive: e.target.checked })
                      }
                      className="w-5 h-5 accent-[#FFC107] cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className={`block text-[11px] font-mono ${isNight ? 'text-[#8C9BAA]' : 'text-[#5C6B7B]'} uppercase mb-1.5`}>
                      Notice Banner Message
                    </label>
                    <input
                      type="text"
                      value={settingsForm.announcementText || ''}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, announcementText: e.target.value })
                      }
                      className={`w-full ${
                        isNight
                          ? 'bg-[#121922] border-[#243140] text-[#FFC107]'
                          : 'bg-white border-[#D6D3C8] text-[#9E7400]'
                      } border focus:border-[#FFC107] text-xs px-3.5 py-2.5 outline-none font-mono`}
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#FFC107] hover:bg-[#E6A900] text-[#0A0D0F] text-xs font-bold font-mono tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(255,193,7,0.3)] flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>SAVE SETTINGS</span>
                  </button>
                </div>
              </form>

              {/* Data Backup & Restore */}
              <div className={`${
                isNight
                  ? 'bg-[#0C1016] border-[#1E2734]'
                  : 'bg-[#F9F8F5] border-[#E2DFD7] shadow-sm'
              } border p-6 sm:p-8 space-y-6`}>
                <div className={`border-b ${isNight ? 'border-[#18212D]' : 'border-[#E6E3DB]'} pb-4`}>
                  <h3 className={`text-base font-bold ${isNight ? 'text-white' : 'text-[#12161A]'} uppercase tracking-wider font-mono`}>
                    BACKUP &amp; DISASTER RECOVERY
                  </h3>
                  <p className={`text-xs ${isNight ? 'text-[#7A8898]' : 'text-[#647180]'} font-mono mt-1`}>
                    Export your complete site catalog and restore snapshots with zero data loss.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className={`p-4 ${isNight ? 'bg-[#111720] border-[#202C3A]' : 'bg-white border-[#E5E2DA]'} border space-y-3`}>
                    <div className={`flex items-center gap-2 text-xs font-mono font-bold ${isNight ? 'text-white' : 'text-[#12161A]'} uppercase`}>
                      <Download className="w-4 h-4 text-[#FFC107]" />
                      <span>Export Site JSON</span>
                    </div>
                    <p className={`text-[11px] ${isNight ? 'text-[#788796]' : 'text-[#647180]'} leading-relaxed`}>
                      Download complete JSON snapshot including all services, products, showcase projects, and brand copy.
                    </p>
                    <button
                      onClick={handleExportJSON}
                      className={`w-full py-2.5 ${
                        isNight
                          ? 'bg-[#17212C] hover:bg-[#1E2A38] border-[#263546] text-white'
                          : 'bg-[#EDECE6] hover:bg-[#E2DFD4] border-[#D8D5CA] text-[#12161A]'
                      } border text-xs font-mono hover:text-[#FFC107] transition-all flex items-center justify-center gap-2 cursor-pointer`}
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download JSON Backup</span>
                    </button>
                  </div>

                  <div className={`p-4 ${isNight ? 'bg-[#111720] border-[#202C3A]' : 'bg-white border-[#E5E2DA]'} border space-y-3`}>
                    <div className={`flex items-center gap-2 text-xs font-mono font-bold ${isNight ? 'text-white' : 'text-[#12161A]'} uppercase`}>
                      <Upload className="w-4 h-4 text-[#FFC107]" />
                      <span>Restore Site JSON</span>
                    </div>
                    <p className={`text-[11px] ${isNight ? 'text-[#788796]' : 'text-[#647180]'} leading-relaxed`}>
                      Upload a previously exported JSON backup file to overwrite and restore all sections.
                    </p>
                    <label className={`w-full py-2.5 ${
                      isNight
                        ? 'bg-[#17212C] hover:bg-[#1E2A38] border-[#263546] text-white'
                        : 'bg-[#EDECE6] hover:bg-[#E2DFD4] border-[#D8D5CA] text-[#12161A]'
                    } border text-xs font-mono hover:text-[#FFC107] transition-all flex items-center justify-center gap-2 cursor-pointer`}>
                      <Upload className="w-3.5 h-3.5" />
                      <span>Select Backup File...</span>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportJSON}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Reset to Factory Defaults Button */}
                <div className={`pt-4 border-t ${isNight ? 'border-[#18212D]' : 'border-[#E6E3DB]'} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
                  <div>
                    <div className="text-xs font-mono font-bold text-red-500 uppercase">
                      Reset Site to Original Seed Constants
                    </div>
                    <div className={`text-[11px] ${isNight ? 'text-[#728090]' : 'text-[#647180]'}`}>
                      Re-initializes all 6 services, 6 products, 4 projects, and metrics to default state.
                    </div>
                  </div>
                  <button
                    onClick={handleResetDefaults}
                    className="px-4 py-2 bg-red-950/40 hover:bg-red-950/70 border border-red-800 text-red-300 text-xs font-mono font-bold uppercase transition-all cursor-pointer flex items-center gap-2"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset to Defaults</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL: ADD / EDIT SERVICE */}
      <AnimatePresence>
        {serviceModalOpen && (
          <ServiceEditModal
            service={editingService}
            onClose={() => setServiceModalOpen(false)}
            onSave={handleSaveServiceModal}
          />
        )}
      </AnimatePresence>

      {/* MODAL: ADD / EDIT PRODUCT */}
      <AnimatePresence>
        {productModalOpen && (
          <ProductEditModal
            product={editingProduct}
            onClose={() => setProductModalOpen(false)}
            onSave={handleSaveProductModal}
          />
        )}
      </AnimatePresence>

      {/* MODAL: ADD / EDIT PROJECT */}
      <AnimatePresence>
        {projectModalOpen && (
          <ProjectEditModal
            project={editingProject}
            onClose={() => setProjectModalOpen(false)}
            onSave={handleSaveProjectModal}
          />
        )}
      </AnimatePresence>

      {/* MODAL: INQUIRY DETAILS & NOTES */}
      <AnimatePresence>
        {inquiryModalOpen && selectedInquiry && (
          <InquiryDetailsModal
            inquiry={selectedInquiry}
            onClose={() => setInquiryModalOpen(false)}
            onUpdate={handleUpdateInquiry}
          />
        )}
      </AnimatePresence>

      {/* MODAL: CONFIRMATION DIALOG */}
      <AnimatePresence>
        {confirmDeleteModal.open && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-md ${
                isNight
                  ? 'bg-[#0D1217] border-[#24303E]'
                  : 'bg-white border-[#D6D3C8] shadow-2xl'
              } border p-6 space-y-4 shadow-2xl`}
            >
              <div className="flex items-center gap-3 text-red-500">
                <ShieldAlert className="w-6 h-6 shrink-0" />
                <h3 className={`text-sm font-bold uppercase font-mono ${isNight ? 'text-white' : 'text-[#12161A]'}`}>{confirmDeleteModal.title}</h3>
              </div>
              <p className={`text-xs ${isNight ? 'text-[#8E9CA9]' : 'text-[#5C6B7B]'} leading-relaxed font-sans`}>
                {confirmDeleteModal.description}
              </p>
              <div className="pt-3 flex items-center justify-end gap-3 font-mono text-xs">
                <button
                  onClick={() => setConfirmDeleteModal((prev) => ({ ...prev, open: false }))}
                  className={`px-4 py-2 ${
                    isNight
                      ? 'bg-[#141C25] hover:bg-[#1C2734] border-[#253242] text-[#8695A5]'
                      : 'bg-[#EDECE6] hover:bg-[#E2DFD4] border-[#D8D5CA] text-[#5C6B7B]'
                  } border cursor-pointer`}
                >
                  CANCEL
                </button>
                <button
                  onClick={confirmDeleteModal.onConfirm}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold uppercase cursor-pointer"
                >
                  CONFIRM
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ----------------------------------------------------------------------
// MODAL: SERVICE EDIT
// ----------------------------------------------------------------------
function ServiceEditModal({
  service,
  onClose,
  onSave,
}: {
  service: ServiceItem | null;
  onClose: () => void;
  onSave: (s: ServiceItem) => void;
}) {
  const { isNight } = useTheme();
  const [form, setForm] = useState<ServiceItem>(
    service || {
      id: `service-${Date.now()}`,
      number: '07',
      title: '',
      tagline: '',
      description: '',
      features: ['24/7 Monitoring', 'Certified Installation', 'Zero Downtime'],
      specs: [
        { label: 'Standard', value: 'IEC 61439' },
        { label: 'Warranty', value: '5 Years AMC' },
      ],
      image: '/images/service-electrical-systems.jpg',
      icon: 'zap',
      isHome: false,
    }
  );

  const [newFeature, setNewFeature] = useState('');
  const [newSpecLabel, setNewSpecLabel] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');

  const handleAddFeature = () => {
    if (!newFeature.trim()) return;
    setForm((prev) => ({ ...prev, features: [...(prev.features || []), newFeature.trim()] }));
    setNewFeature('');
  };

  const handleRemoveFeature = (idx: number) => {
    setForm((prev) => ({ ...prev, features: prev.features.filter((_, i) => i !== idx) }));
  };

  const handleAddSpec = () => {
    if (!newSpecLabel.trim() || !newSpecValue.trim()) return;
    setForm((prev) => ({
      ...prev,
      specs: [...(prev.specs || []), { label: newSpecLabel.trim(), value: newSpecValue.trim() }],
    }));
    setNewSpecLabel('');
    setNewSpecValue('');
  };

  const handleRemoveSpec = (idx: number) => {
    setForm((prev) => ({ ...prev, specs: prev.specs.filter((_, i) => i !== idx) }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`w-full max-w-2xl ${
          isNight
            ? 'bg-[#0D1217] border-[#232F3E]'
            : 'bg-white border-[#D6D3C8] text-[#12161A] shadow-2xl'
        } border shadow-2xl my-8 overflow-hidden`}
      >
        <div className={`px-6 py-4 border-b ${
          isNight
            ? 'border-[#1A2532] bg-[#0A0E13]'
            : 'border-[#E6E3DB] bg-[#F7F5F0]'
        } flex items-center justify-between`}>
          <h3 className={`text-sm font-bold font-mono ${isNight ? 'text-white' : 'text-[#12161A]'} uppercase flex items-center gap-2`}>
            <Cpu className="w-4 h-4 text-[#FFC107]" />
            <span>{service ? `Edit Discipline: ${service.title}` : 'Add New Engineering Discipline'}</span>
          </h3>
          <button onClick={onClose} className={`p-1 ${isNight ? 'text-[#657383] hover:text-white' : 'text-[#7D8B9B] hover:text-[#12161A]'} cursor-pointer`}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={`block text-[10px] font-mono ${isNight ? 'text-[#8997A7]' : 'text-[#5C6B7B]'} uppercase mb-1`}>Index Number</label>
              <input
                type="text"
                value={form.number}
                onChange={(e) => setForm({ ...form, number: e.target.value })}
                placeholder="01, 02..."
                className={`w-full ${
                  isNight
                    ? 'bg-[#121922] border-[#243140] text-white'
                    : 'bg-white border-[#D6D3C8] text-[#12161A]'
                } border text-xs px-3 py-2 outline-none font-mono`}
              />
            </div>
            <div className="col-span-2">
              <label className={`block text-[10px] font-mono ${isNight ? 'text-[#8997A7]' : 'text-[#5C6B7B]'} uppercase mb-1`}>Service Title</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. SUBSTATION AUTOMATION"
                className={`w-full ${
                  isNight
                    ? 'bg-[#121922] border-[#243140] text-white'
                    : 'bg-white border-[#D6D3C8] text-[#12161A]'
                } border text-xs px-3 py-2 outline-none font-mono uppercase`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-[10px] font-mono ${isNight ? 'text-[#8997A7]' : 'text-[#5C6B7B]'} uppercase mb-1`}>Tagline</label>
            <input
              type="text"
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              placeholder="e.g. Turnkey engineering infrastructure"
              className={`w-full ${
                isNight
                  ? 'bg-[#121922] border-[#243140] text-white'
                  : 'bg-white border-[#D6D3C8] text-[#12161A]'
              } border text-xs px-3 py-2 outline-none`}
            />
          </div>

          <div>
            <label className={`block text-[10px] font-mono ${isNight ? 'text-[#8997A7]' : 'text-[#5C6B7B]'} uppercase mb-1`}>Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={`w-full ${
                isNight
                  ? 'bg-[#121922] border-[#243140] text-white'
                  : 'bg-white border-[#D6D3C8] text-[#12161A]'
              } border text-xs p-2.5 outline-none`}
            />
          </div>

          {/* Service Discipline Photo */}
          <PhotoField
            label="Service Discipline Photo"
            value={form.image || ''}
            onChange={(url) => setForm({ ...form, image: url })}
            hint="Recommended: 1200x800px landscape"
            aspectRatio="landscape"
          />

          {/* Features Editor */}
          <div className={`pt-2 border-t ${isNight ? 'border-[#1C2633]' : 'border-[#E6E3DB]'} space-y-2`}>
            <label className="block text-[10px] font-mono text-[#FFC107] uppercase">Key Features (Bullet Points)</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                placeholder="Type feature bullet point..."
                className={`flex-1 ${
                  isNight
                    ? 'bg-[#121922] border-[#243140] text-white'
                    : 'bg-white border-[#D6D3C8] text-[#12161A]'
                } border text-xs px-3 py-1.5 outline-none font-mono`}
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className={`px-3 py-1.5 ${
                  isNight
                    ? 'bg-[#182330] hover:bg-[#202E3F] text-[#FFC107] border-[#27384A]'
                    : 'bg-[#EDECE6] hover:bg-[#E2DFD4] text-[#9E7400] border-[#D8D5CA]'
                } text-xs font-mono border cursor-pointer`}
              >
                + Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {form.features?.map((feat, idx) => (
                <span
                  key={idx}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${
                    isNight
                      ? 'bg-[#141C25] border-[#232F3D] text-white'
                      : 'bg-[#F2F0E8] border-[#DCD8CE] text-[#12161A]'
                  } border text-[11px] font-mono`}
                >
                  <span>{feat}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(idx)}
                    className="text-[#6C7B8B] hover:text-red-400 cursor-pointer"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Technical Specs Editor */}
          <div className={`pt-2 border-t ${isNight ? 'border-[#1C2633]' : 'border-[#E6E3DB]'} space-y-2`}>
            <label className="block text-[10px] font-mono text-[#FFC107] uppercase">Technical Specifications (Key / Value)</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={newSpecLabel}
                onChange={(e) => setNewSpecLabel(e.target.value)}
                placeholder="Spec Label (e.g. Voltage)"
                className={`${
                  isNight
                    ? 'bg-[#121922] border-[#243140] text-white'
                    : 'bg-white border-[#D6D3C8] text-[#12161A]'
                } border text-xs px-3 py-1.5 outline-none font-mono`}
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSpecValue}
                  onChange={(e) => setNewSpecValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSpec())}
                  placeholder="Value (e.g. 415V to 66kV)"
                  className={`flex-1 ${
                    isNight
                      ? 'bg-[#121922] border-[#243140] text-white'
                      : 'bg-white border-[#D6D3C8] text-[#12161A]'
                  } border text-xs px-3 py-1.5 outline-none font-mono`}
                />
                <button
                  type="button"
                  onClick={handleAddSpec}
                  className={`px-3 py-1.5 ${
                    isNight
                      ? 'bg-[#182330] hover:bg-[#202E3F] text-[#FFC107] border-[#27384A]'
                      : 'bg-[#EDECE6] hover:bg-[#E2DFD4] text-[#9E7400] border-[#D8D5CA]'
                  } text-xs font-mono border cursor-pointer`}
                >
                  + Add
                </button>
              </div>
            </div>
            <div className="space-y-1">
              {form.specs?.map((spec, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between px-3 py-1 ${
                    isNight
                      ? 'bg-[#121922] border-[#202A36]'
                      : 'bg-[#F9F8F5] border-[#E5E2DA]'
                  } border text-[11px] font-mono`}
                >
                  <span className={`${isNight ? 'text-[#8695A5]' : 'text-[#5C6B7B]'}`}>{spec.label}</span>
                  <div className="flex items-center gap-2">
                    <span className={`${isNight ? 'text-white' : 'text-[#12161A]'}`}>{spec.value}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSpec(idx)}
                      className="text-[#6C7B8B] hover:text-red-400 cursor-pointer"
                    >
                      &times;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={`px-6 py-4 border-t ${
          isNight
            ? 'border-[#1A2532] bg-[#0A0E13]'
            : 'border-[#E6E3DB] bg-[#F7F5F0]'
        } flex items-center justify-end gap-3 font-mono text-xs`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 ${
              isNight
                ? 'bg-[#141C25] hover:bg-[#1C2734] border-[#253242] text-[#8695A5]'
                : 'bg-[#EDECE6] hover:bg-[#E2DFD4] border-[#D8D5CA] text-[#5C6B7B]'
            } border cursor-pointer`}
          >
            CANCEL
          </button>
          <button
            onClick={() => onSave(form)}
            className="px-5 py-2 bg-[#FFC107] hover:bg-[#E6A900] text-[#0A0D0F] font-bold uppercase cursor-pointer flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>SAVE DISCIPLINE</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ----------------------------------------------------------------------
// MODAL: PRODUCT EDIT
// ----------------------------------------------------------------------
function ProductEditModal({
  product,
  onClose,
  onSave,
}: {
  product: ProductItem | null;
  onClose: () => void;
  onSave: (p: ProductItem) => void;
}) {
  const { isNight } = useTheme();
  const [form, setForm] = useState<ProductItem>(
    product || {
      id: `product-${Date.now()}`,
      category: 'SOLAR PANELS',
      name: '',
      subtitle: '',
      description: '',
      specs: [
        { label: 'Max Efficiency', value: '22.8%' },
        { label: 'Warranty', value: '25 Years' },
      ],
      image: '/images/product-solar-panel.jpg',
      isFeatured: false,
    }
  );

  const [newSpecLabel, setNewSpecLabel] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');

  const handleAddSpec = () => {
    if (!newSpecLabel.trim() || !newSpecValue.trim()) return;
    setForm((prev) => ({
      ...prev,
      specs: [...(prev.specs || []), { label: newSpecLabel.trim(), value: newSpecValue.trim() }],
    }));
    setNewSpecLabel('');
    setNewSpecValue('');
  };

  const handleRemoveSpec = (idx: number) => {
    setForm((prev) => ({ ...prev, specs: prev.specs.filter((_, i) => i !== idx) }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`w-full max-w-2xl ${
          isNight
            ? 'bg-[#0D1217] border-[#232F3E]'
            : 'bg-white border-[#D6D3C8] text-[#12161A] shadow-2xl'
        } border shadow-2xl my-8 overflow-hidden`}
      >
        <div className={`px-6 py-4 border-b ${
          isNight
            ? 'border-[#1A2532] bg-[#0A0E13]'
            : 'border-[#E6E3DB] bg-[#F7F5F0]'
        } flex items-center justify-between`}>
          <h3 className={`text-sm font-bold font-mono ${isNight ? 'text-white' : 'text-[#12161A]'} uppercase flex items-center gap-2`}>
            <Package className="w-4 h-4 text-[#FFC107]" />
            <span>{product ? `Edit Hardware: ${product.name}` : 'Add New Hardware Equipment'}</span>
          </h3>
          <button onClick={onClose} className={`p-1 ${isNight ? 'text-[#657383] hover:text-white' : 'text-[#7D8B9B] hover:text-[#12161A]'} cursor-pointer`}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block text-[10px] font-mono ${isNight ? 'text-[#8997A7]' : 'text-[#5C6B7B]'} uppercase mb-1`}>Equipment Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                className={`w-full ${
                  isNight
                    ? 'bg-[#121922] border-[#243140] text-white'
                    : 'bg-white border-[#D6D3C8] text-[#12161A]'
                } border text-xs px-3 py-2 outline-none font-mono`}
              >
                <option value="SOLAR PANELS">SOLAR PANELS</option>
                <option value="INVERTERS">INVERTERS</option>
                <option value="CABLES & WIRING">CABLES &amp; WIRING</option>
                <option value="SWITCHGEAR">SWITCHGEAR</option>
                <option value="LED LIGHTING">LED LIGHTING</option>
                <option value="CONTROL PANELS">CONTROL PANELS</option>
              </select>
            </div>
            <div>
              <label className={`block text-[10px] font-mono ${isNight ? 'text-[#8997A7]' : 'text-[#5C6B7B]'} uppercase mb-1`}>Product Model Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Ultra-Power 580W TOPCon"
                className={`w-full ${
                  isNight
                    ? 'bg-[#121922] border-[#243140] text-white'
                    : 'bg-white border-[#D6D3C8] text-[#12161A]'
                } border text-xs px-3 py-2 outline-none font-mono uppercase`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-[10px] font-mono ${isNight ? 'text-[#8997A7]' : 'text-[#5C6B7B]'} uppercase mb-1`}>Subtitle / Specification Tag</label>
            <input
              type="text"
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              placeholder="e.g. N-Type TOPCon Photovoltaic Module"
              className={`w-full ${
                isNight
                  ? 'bg-[#121922] border-[#243140] text-white'
                  : 'bg-white border-[#D6D3C8] text-[#12161A]'
              } border text-xs px-3 py-2 outline-none`}
            />
          </div>

          <div>
            <label className={`block text-[10px] font-mono ${isNight ? 'text-[#8997A7]' : 'text-[#5C6B7B]'} uppercase mb-1`}>Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={`w-full ${
                isNight
                  ? 'bg-[#121922] border-[#243140] text-white'
                  : 'bg-white border-[#D6D3C8] text-[#12161A]'
              } border text-xs p-2.5 outline-none`}
            />
          </div>

          {/* Hardware Equipment Photo */}
          <PhotoField
            label="Hardware Equipment Photo"
            value={form.image || ''}
            onChange={(url) => setForm({ ...form, image: url })}
            hint="Recommended: 800x800px square or 4:3 product shot"
            aspectRatio="square"
          />

          {/* Featured Toggle */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isFeatured"
              checked={form.isFeatured || false}
              onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
              className="w-4 h-4 accent-[#FFC107] cursor-pointer"
            />
            <label htmlFor="isFeatured" className={`text-xs font-mono ${isNight ? 'text-white' : 'text-[#12161A]'} cursor-pointer`}>
              Set as Featured Hero Product (Shows in Homepage Spotlight)
            </label>
          </div>

          {/* Technical Specs Editor */}
          <div className={`pt-2 border-t ${isNight ? 'border-[#1C2633]' : 'border-[#E6E3DB]'} space-y-2`}>
            <label className="block text-[10px] font-mono text-[#FFC107] uppercase">Technical Specifications</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={newSpecLabel}
                onChange={(e) => setNewSpecLabel(e.target.value)}
                placeholder="Spec Label (e.g. Rated Power)"
                className={`${
                  isNight
                    ? 'bg-[#121922] border-[#243140] text-white'
                    : 'bg-white border-[#D6D3C8] text-[#12161A]'
                } border text-xs px-3 py-1.5 outline-none font-mono`}
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSpecValue}
                  onChange={(e) => setNewSpecValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSpec())}
                  placeholder="Value (e.g. 580 Watts)"
                  className={`flex-1 ${
                    isNight
                      ? 'bg-[#121922] border-[#243140] text-white'
                      : 'bg-white border-[#D6D3C8] text-[#12161A]'
                  } border text-xs px-3 py-1.5 outline-none font-mono`}
                />
                <button
                  type="button"
                  onClick={handleAddSpec}
                  className={`px-3 py-1.5 ${
                    isNight
                      ? 'bg-[#182330] hover:bg-[#202E3F] text-[#FFC107] border-[#27384A]'
                      : 'bg-[#EDECE6] hover:bg-[#E2DFD4] text-[#9E7400] border-[#D8D5CA]'
                  } text-xs font-mono border cursor-pointer`}
                >
                  + Add
                </button>
              </div>
            </div>
            <div className="space-y-1">
              {form.specs?.map((spec, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between px-3 py-1 ${
                    isNight
                      ? 'bg-[#121922] border-[#202A36]'
                      : 'bg-[#F9F8F5] border-[#E5E2DA]'
                  } border text-[11px] font-mono`}
                >
                  <span className={`${isNight ? 'text-[#8695A5]' : 'text-[#5C6B7B]'}`}>{spec.label}</span>
                  <div className="flex items-center gap-2">
                    <span className={`${isNight ? 'text-white' : 'text-[#12161A]'}`}>{spec.value}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSpec(idx)}
                      className="text-[#6C7B8B] hover:text-red-400 cursor-pointer"
                    >
                      &times;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={`px-6 py-4 border-t ${
          isNight
            ? 'border-[#1A2532] bg-[#0A0E13]'
            : 'border-[#E6E3DB] bg-[#F7F5F0]'
        } flex items-center justify-end gap-3 font-mono text-xs`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 ${
              isNight
                ? 'bg-[#141C25] hover:bg-[#1C2734] border-[#253242] text-[#8695A5]'
                : 'bg-[#EDECE6] hover:bg-[#E2DFD4] border-[#D8D5CA] text-[#5C6B7B]'
            } border cursor-pointer`}
          >
            CANCEL
          </button>
          <button
            onClick={() => onSave(form)}
            className="px-5 py-2 bg-[#FFC107] hover:bg-[#E6A900] text-[#0A0D0F] font-bold uppercase cursor-pointer flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>SAVE HARDWARE ITEM</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ----------------------------------------------------------------------
// MODAL: PROJECT EDIT
// ----------------------------------------------------------------------
function ProjectEditModal({
  project,
  onClose,
  onSave,
}: {
  project: ProjectItem | null;
  onClose: () => void;
  onSave: (p: ProjectItem) => void;
}) {
  const { isNight } = useTheme();
  const [form, setForm] = useState<ProjectItem>(
    project || {
      id: `proj-${Date.now()}`,
      category: 'INDUSTRIAL SOLAR',
      title: '',
      location: 'Ahmedabad, Gujarat',
      scope: '',
      status: 'OPERATIONAL',
      image: '/images/service-solar-solutions.jpg',
      specs: [
        { label: 'Technology', value: 'Bifacial TOPCon' },
        { label: 'Interconnection', value: '11kV HT Substation' },
      ],
    }
  );

  const [newSpecLabel, setNewSpecLabel] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');

  const handleAddSpec = () => {
    if (!newSpecLabel.trim() || !newSpecValue.trim()) return;
    setForm((prev) => ({
      ...prev,
      specs: [...(prev.specs || []), { label: newSpecLabel.trim(), value: newSpecValue.trim() }],
    }));
    setNewSpecLabel('');
    setNewSpecValue('');
  };

  const handleRemoveSpec = (idx: number) => {
    setForm((prev) => ({ ...prev, specs: prev.specs.filter((_, i) => i !== idx) }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`w-full max-w-2xl ${
          isNight
            ? 'bg-[#0D1217] border-[#232F3E]'
            : 'bg-white border-[#D6D3C8] text-[#12161A] shadow-2xl'
        } border shadow-2xl my-8 overflow-hidden`}
      >
        <div className={`px-6 py-4 border-b ${
          isNight
            ? 'border-[#1A2532] bg-[#0A0E13]'
            : 'border-[#E6E3DB] bg-[#F7F5F0]'
        } flex items-center justify-between`}>
          <h3 className={`text-sm font-bold font-mono ${isNight ? 'text-white' : 'text-[#12161A]'} uppercase flex items-center gap-2`}>
            <Layers className="w-4 h-4 text-[#FFC107]" />
            <span>{project ? `Edit Showcase: ${project.title}` : 'Add Portfolio Showcase Project'}</span>
          </h3>
          <button onClick={onClose} className={`p-1 ${isNight ? 'text-[#657383] hover:text-white' : 'text-[#7D8B9B] hover:text-[#12161A]'} cursor-pointer`}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block text-[10px] font-mono ${isNight ? 'text-[#8997A7]' : 'text-[#5C6B7B]'} uppercase mb-1`}>Project Category</label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="e.g. INDUSTRIAL SOLAR"
                className={`w-full ${
                  isNight
                    ? 'bg-[#121922] border-[#243140] text-white'
                    : 'bg-white border-[#D6D3C8] text-[#12161A]'
                } border text-xs px-3 py-2 outline-none font-mono uppercase`}
              />
            </div>
            <div>
              <label className={`block text-[10px] font-mono ${isNight ? 'text-[#8997A7]' : 'text-[#5C6B7B]'} uppercase mb-1`}>Operational Status</label>
              <input
                type="text"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                placeholder="OPERATIONAL, IN PROGRESS..."
                className={`w-full ${
                  isNight
                    ? 'bg-[#121922] border-[#243140] text-white'
                    : 'bg-white border-[#D6D3C8] text-[#12161A]'
                } border text-xs px-3 py-2 outline-none font-mono uppercase`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-[10px] font-mono ${isNight ? 'text-[#8997A7]' : 'text-[#5C6B7B]'} uppercase mb-1`}>Project Title</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Sanand Industrial Park Photovoltaic Array"
              className={`w-full ${
                isNight
                  ? 'bg-[#121922] border-[#243140] text-white'
                  : 'bg-white border-[#D6D3C8] text-[#12161A]'
              } border text-xs px-3 py-2 outline-none font-mono`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block text-[10px] font-mono ${isNight ? 'text-[#8997A7]' : 'text-[#5C6B7B]'} uppercase mb-1`}>Location</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Sanand, Gujarat"
                className={`w-full ${
                  isNight
                    ? 'bg-[#121922] border-[#243140] text-white'
                    : 'bg-white border-[#D6D3C8] text-[#12161A]'
                } border text-xs px-3 py-2 outline-none`}
              />
            </div>
            <div>
              <label className={`block text-[10px] font-mono ${isNight ? 'text-[#8997A7]' : 'text-[#5C6B7B]'} uppercase mb-1`}>Scope Summary</label>
              <input
                type="text"
                value={form.scope}
                onChange={(e) => setForm({ ...form, scope: e.target.value })}
                placeholder="Turnkey Rooftop Solar & Grid Interconnection"
                className={`w-full ${
                  isNight
                    ? 'bg-[#121922] border-[#243140] text-white'
                    : 'bg-white border-[#D6D3C8] text-[#12161A]'
                } border text-xs px-3 py-2 outline-none`}
              />
            </div>
          </div>

          {/* Project Photo */}
          <PhotoField
            label="Portfolio Project Photo"
            value={form.image || ''}
            onChange={(url) => setForm({ ...form, image: url })}
            hint="Recommended: 1200x800px high-resolution site photo"
            aspectRatio="landscape"
          />

          {/* Technical Specs Editor */}
          <div className={`pt-2 border-t ${isNight ? 'border-[#1C2633]' : 'border-[#E6E3DB]'} space-y-2`}>
            <label className="block text-[10px] font-mono text-[#FFC107] uppercase">Engineering Specs &amp; Capacities</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={newSpecLabel}
                onChange={(e) => setNewSpecLabel(e.target.value)}
                placeholder="Label (e.g. Busbar Capacity)"
                className={`${
                  isNight
                    ? 'bg-[#121922] border-[#243140] text-white'
                    : 'bg-white border-[#D6D3C8] text-[#12161A]'
                } border text-xs px-3 py-1.5 outline-none font-mono`}
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSpecValue}
                  onChange={(e) => setNewSpecValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSpec())}
                  placeholder="Value (e.g. 2500A Copper)"
                  className={`flex-1 ${
                    isNight
                      ? 'bg-[#121922] border-[#243140] text-white'
                      : 'bg-white border-[#D6D3C8] text-[#12161A]'
                  } border text-xs px-3 py-1.5 outline-none font-mono`}
                />
                <button
                  type="button"
                  onClick={handleAddSpec}
                  className={`px-3 py-1.5 ${
                    isNight
                      ? 'bg-[#182330] hover:bg-[#202E3F] text-[#FFC107] border-[#27384A]'
                      : 'bg-[#EDECE6] hover:bg-[#E2DFD4] text-[#9E7400] border-[#D8D5CA]'
                  } text-xs font-mono border cursor-pointer`}
                >
                  + Add
                </button>
              </div>
            </div>
            <div className="space-y-1">
              {form.specs?.map((spec, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between px-3 py-1 ${
                    isNight
                      ? 'bg-[#121922] border-[#202A36]'
                      : 'bg-[#F9F8F5] border-[#E5E2DA]'
                  } border text-[11px] font-mono`}
                >
                  <span className={`${isNight ? 'text-[#8695A5]' : 'text-[#5C6B7B]'}`}>{spec.label}</span>
                  <div className="flex items-center gap-2">
                    <span className={`${isNight ? 'text-white' : 'text-[#12161A]'}`}>{spec.value}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSpec(idx)}
                      className="text-[#6C7B8B] hover:text-red-400 cursor-pointer"
                    >
                      &times;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={`px-6 py-4 border-t ${
          isNight
            ? 'border-[#1A2532] bg-[#0A0E13]'
            : 'border-[#E6E3DB] bg-[#F7F5F0]'
        } flex items-center justify-end gap-3 font-mono text-xs`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 ${
              isNight
                ? 'bg-[#141C25] hover:bg-[#1C2734] border-[#253242] text-[#8695A5]'
                : 'bg-[#EDECE6] hover:bg-[#E2DFD4] border-[#D8D5CA] text-[#5C6B7B]'
            } border cursor-pointer`}
          >
            CANCEL
          </button>
          <button
            onClick={() => onSave(form)}
            className="px-5 py-2 bg-[#FFC107] hover:bg-[#E6A900] text-[#0A0D0F] font-bold uppercase cursor-pointer flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>SAVE PROJECT</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ----------------------------------------------------------------------
// MODAL: INQUIRY DETAILS & NOTES
// ----------------------------------------------------------------------
function InquiryDetailsModal({
  inquiry,
  onClose,
  onUpdate,
}: {
  inquiry: InquiryItem;
  onClose: () => void;
  onUpdate: (id: string, status: 'New' | 'Contacted' | 'In Review' | 'Closed', notes: string) => void;
}) {
  const { isNight } = useTheme();
  const [status, setStatus] = useState(inquiry.status);
  const [notes, setNotes] = useState(inquiry.adminNotes || '');

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`w-full max-w-xl ${
          isNight
            ? 'bg-[#0D1217] border-[#232F3E]'
            : 'bg-white border-[#D6D3C8] text-[#12161A] shadow-2xl'
        } border shadow-2xl my-8 overflow-hidden font-mono`}
      >
        <div className={`px-6 py-4 border-b ${
          isNight
            ? 'border-[#1A2532] bg-[#0A0E13]'
            : 'border-[#E6E3DB] bg-[#F7F5F0]'
        } flex items-center justify-between`}>
          <h3 className={`text-sm font-bold ${isNight ? 'text-white' : 'text-[#12161A]'} uppercase flex items-center gap-2`}>
            <Inbox className="w-4 h-4 text-[#FFC107]" />
            <span>Consultation Lead: {inquiry.name}</span>
          </h3>
          <button onClick={onClose} className={`p-1 ${isNight ? 'text-[#657383] hover:text-white' : 'text-[#7D8B9B] hover:text-[#12161A]'} cursor-pointer`}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs">
          {/* Client summary */}
          <div className={`grid grid-cols-2 gap-3 p-4 ${
            isNight
              ? 'bg-[#111721] border-[#202C3A]'
              : 'bg-[#F9F8F5] border-[#E2DFD6]'
          } border`}>
            <div>
              <span className={`${isNight ? 'text-[#657484]' : 'text-[#7D8B9B]'} text-[10px] block`}>CLIENT NAME</span>
              <span className={`${isNight ? 'text-white' : 'text-[#12161A]'} font-bold`}>{inquiry.name}</span>
            </div>
            <div>
              <span className={`${isNight ? 'text-[#657484]' : 'text-[#7D8B9B]'} text-[10px] block`}>ORGANIZATION</span>
              <span className={`${isNight ? 'text-white' : 'text-[#12161A]'}`}>{inquiry.company}</span>
            </div>
            <div>
              <span className={`${isNight ? 'text-[#657484]' : 'text-[#7D8B9B]'} text-[10px] block`}>PROJECT TYPE</span>
              <span className="text-[#FFC107]">{inquiry.projectType}</span>
            </div>
            <div>
              <span className={`${isNight ? 'text-[#657484]' : 'text-[#7D8B9B]'} text-[10px] block`}>ESTIMATED SCALE</span>
              <span className={`${isNight ? 'text-white' : 'text-[#12161A]'}`}>{inquiry.projectScale || 'Not specified'}</span>
            </div>
          </div>

          {/* Quick Communication Actions */}
          <div className="flex items-center gap-2">
            <a
              href={`tel:${inquiry.phone?.replace(/\s+/g, '')}`}
              className={`flex-1 py-2 px-3 ${
                isNight
                  ? 'bg-[#131C26] hover:bg-[#1A2633] border-[#253344] text-[#FFC107]'
                  : 'bg-[#EDECE6] hover:bg-[#E2DFD4] border-[#D8D5CA] text-[#9E7400]'
              } border text-[11px] flex items-center justify-center gap-1.5`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call ({inquiry.phone})</span>
            </a>
            <a
              href={`mailto:${inquiry.email}`}
              className={`flex-1 py-2 px-3 ${
                isNight
                  ? 'bg-[#131C26] hover:bg-[#1A2633] border-[#253344] text-[#A5B2C0] hover:text-white'
                  : 'bg-[#EDECE6] hover:bg-[#E2DFD4] border-[#D8D5CA] text-[#5C6B7B] hover:text-[#12161A]'
              } border text-[11px] flex items-center justify-center gap-1.5`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Send Email</span>
            </a>
          </div>

          {/* Message Content */}
          <div className="space-y-1.5">
            <label className={`text-[10px] ${isNight ? 'text-[#8594A4]' : 'text-[#5C6B7B]'} uppercase`}>Inquiry Scope / Message</label>
            <div className={`p-3 ${
              isNight
                ? 'bg-[#121922] border-[#232F3D] text-white'
                : 'bg-white border-[#D6D3C8] text-[#12161A]'
            } border leading-relaxed font-sans text-xs`}>
              {inquiry.message || 'No message text provided.'}
            </div>
          </div>

          {/* Lead Status Selector */}
          <div className="space-y-1.5">
            <label className={`text-[10px] ${isNight ? 'text-[#8594A4]' : 'text-[#5C6B7B]'} uppercase`}>Consultation Workflow Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className={`w-full ${
                isNight
                  ? 'bg-[#121922] border-[#243140] text-white'
                  : 'bg-white border-[#D6D3C8] text-[#12161A]'
              } border text-xs px-3 py-2 outline-none font-mono`}
            >
              <option value="New">New (Unreviewed)</option>
              <option value="Contacted">Contacted (Initial outreach made)</option>
              <option value="In Review">In Review (Site survey / technical audit)</option>
              <option value="Closed">Closed (Proposal executed / Archived)</option>
            </select>
          </div>

          {/* Internal Admin Notes */}
          <div className="space-y-1.5">
            <label className={`text-[10px] ${isNight ? 'text-[#8594A4]' : 'text-[#5C6B7B]'} uppercase`}>Internal Admin Notes &amp; Follow-up</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Spoke with plant manager Rajesh, scheduled site audit on Thursday at 11 AM..."
              className={`w-full ${
                isNight
                  ? 'bg-[#121922] border-[#243140] text-white'
                  : 'bg-white border-[#D6D3C8] text-[#12161A]'
              } border text-xs p-2.5 outline-none font-sans`}
            />
          </div>
        </div>

        <div className={`px-6 py-4 border-t ${
          isNight
            ? 'border-[#1A2532] bg-[#0A0E13]'
            : 'border-[#E6E3DB] bg-[#F7F5F0]'
        } flex items-center justify-end gap-3 text-xs`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 ${
              isNight
                ? 'bg-[#141C25] hover:bg-[#1C2734] border-[#253242] text-[#8695A5]'
                : 'bg-[#EDECE6] hover:bg-[#E2DFD4] border-[#D8D5CA] text-[#5C6B7B]'
            } border cursor-pointer`}
          >
            CLOSE
          </button>
          <button
            onClick={() => onUpdate(inquiry.id, status, notes)}
            className="px-5 py-2 bg-[#FFC107] hover:bg-[#E6A900] text-[#0A0D0F] font-bold uppercase cursor-pointer flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>SAVE STATUS &amp; NOTES</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#07090C] text-[#FFC107] flex items-center justify-center font-mono text-xs">
          INITIALIZING CONTROL CENTER...
        </div>
      }
    >
      <AdminContent />
    </React.Suspense>
  );
}
