'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Check, SlidersHorizontal, ArrowLeftRight } from 'lucide-react';
import { ProductItem, PRODUCTS_LIST } from '@/lib/constants';
import { useTheme } from './ThemeProvider';

interface ProductComparisonProps {
  initialProducts?: ProductItem[];
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductComparison({
  initialProducts = [PRODUCTS_LIST[0], PRODUCTS_LIST[1]],
  isOpen,
  onClose,
}: ProductComparisonProps) {
  const { isNight } = useTheme();
  const [selectedIds, setSelectedIds] = useState<string[]>(
    initialProducts.map((p) => p.id).slice(0, 2)
  );

  const selectedProducts = PRODUCTS_LIST.filter((p) => selectedIds.includes(p.id));

  const toggleProduct = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) {
        setSelectedIds(selectedIds.filter((item) => item !== id));
      }
    } else {
      if (selectedIds.length < 3) {
        setSelectedIds([...selectedIds, id]);
      } else {
        // Replace second
        setSelectedIds([selectedIds[0], id]);
      }
    }
  };

  if (!isOpen) return null;

  // Comparison metrics extractable across products
  const comparisonLabels = [
    'Category',
    'Rated Power / Output',
    'System Efficiency',
    'Durability / Protection',
    'Standard / Technology',
    'Warranty',
  ];

  const getMetricValue = (product: ProductItem, metric: string): string => {
    if (metric === 'Category') return product.category;
    if (metric === 'Rated Power / Output') {
      const sp = product.specs.find((s) => s.label.toLowerCase().includes('power') || s.label.toLowerCase().includes('voltage'));
      return sp ? sp.value : 'Project Engineered';
    }
    if (metric === 'System Efficiency') {
      const sp = product.specs.find((s) => s.label.toLowerCase().includes('efficiency') || s.label.toLowerCase().includes('efficacy'));
      return sp ? sp.value : 'IEC Standard';
    }
    if (metric === 'Durability / Protection') {
      const sp = product.specs.find((s) => s.label.toLowerCase().includes('durability') || s.label.toLowerCase().includes('protection') || s.label.toLowerCase().includes('enclosure'));
      return sp ? sp.value : 'Industrial IP Grade';
    }
    if (metric === 'Standard / Technology') {
      const sp = product.specs.find((s) => s.label.toLowerCase().includes('cell') || s.label.toLowerCase().includes('standards') || s.label.toLowerCase().includes('controller'));
      return sp ? sp.value : product.subtitle;
    }
    if (metric === 'Warranty') {
      const sp = product.specs.find((s) => s.label.toLowerCase().includes('warranty') || s.label.toLowerCase().includes('lifespan'));
      return sp ? sp.value : 'Manufacturer Standard';
    }
    return '—';
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#06080A]/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className={`relative w-full max-w-5xl max-h-[92vh] overflow-y-auto border shadow-2xl z-10 my-auto ${
            isNight ? 'bg-[#0E1318] border-[#222C35]' : 'bg-[#FFFFFF] border-[#E0DDD4]'
          }`}
        >
          {/* Top Yellow Bar */}
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#FFC107] to-transparent sticky top-0 z-30" />

          {/* Header */}
          <div className="p-4 sm:p-8 border-b flex items-center justify-between border-[#1E262E]">
            <div className="pr-2">
              <div className="inline-flex items-center gap-2 text-[10px] font-mono tracking-widest text-[#FFC107] uppercase">
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span>ENGINEERING MATRIX</span>
              </div>
              <h3 className={`text-base sm:text-2xl font-black uppercase tracking-tight mt-1 ${isNight ? 'text-[#F5F5F2]' : 'text-[#11161A]'}`}>
                SPECIFICATION COMPARISON
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 border text-[#A5ACB2] hover:text-[#FFC107] transition-colors border-[#26313C] shrink-0"
              aria-label="Close comparison"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Selector pills */}
          <div className="px-6 sm:px-8 py-3 bg-[#0A0D0F]/40 border-b border-[#1E262E] flex flex-wrap gap-2 items-center">
            <span className="text-[11px] font-mono text-[#7B8692] mr-2">SELECT UP TO 3:</span>
            {PRODUCTS_LIST.map((prod) => {
              const isSelected = selectedIds.includes(prod.id);
              return (
                <button
                  key={prod.id}
                  onClick={() => toggleProduct(prod.id)}
                  className={`text-[10px] font-mono px-2.5 py-1 border transition-colors ${
                    isSelected
                      ? 'bg-[#FFC107] text-[#0A0D0F] border-[#FFC107] font-bold'
                      : 'bg-[#12181E] text-[#8E97A0] border-[#222B32] hover:border-[#FFC107]/50'
                  }`}
                >
                  {prod.name.split(' ').slice(0, 3).join(' ')}
                </button>
              );
            })}
          </div>

          {/* Comparison Table */}
          <div className="p-6 sm:p-8 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b ${isNight ? 'border-[#1E262E]' : 'border-[#E2DFD6]'}`}>
                  <th className={`py-4 px-3 text-[11px] font-mono uppercase w-1/4 ${isNight ? 'text-[#737F8C]' : 'text-[#65717E]'}`}>
                    TECHNICAL PARAMETER
                  </th>
                  {selectedProducts.map((p) => (
                    <th key={p.id} className={`py-4 px-3 text-sm font-bold uppercase ${isNight ? 'text-[#F5F5F2]' : 'text-[#11161A]'}`}>
                      <div className="flex flex-col">
                        <span className="text-xs text-[#FFC107] font-mono font-normal">
                          {p.category}
                        </span>
                        <span>{p.name}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className={`divide-y ${isNight ? 'divide-[#1A2229]' : 'divide-[#ECE9E0]'}`}>
                {comparisonLabels.map((metric) => (
                  <tr key={metric} className="hover:bg-[#FFC107]/5 transition-colors">
                    <td className={`py-3 px-3 text-xs font-mono uppercase ${isNight ? 'text-[#8C98A4]' : 'text-[#5B6774]'}`}>
                      {metric}
                    </td>
                    {selectedProducts.map((p) => (
                      <td key={p.id} className={`py-3 px-3 text-xs font-mono ${isNight ? 'text-[#ECEBE6]' : 'text-[#1D252D]'}`}>
                        {getMetricValue(p, metric)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer CTAs */}
          <div className="p-6 sm:p-8 border-t border-[#1E262E] flex flex-wrap items-center justify-between gap-4">
            <span className="text-[11px] font-mono text-[#788490]">
              All specifications align with manufacturer factory test datasheets.
            </span>
            <div className="flex items-center gap-3">
              <Link
                href="/contact"
                onClick={onClose}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#FFC107] hover:bg-[#E6A900] text-[#0A0D0F] text-xs font-bold tracking-widest uppercase transition-all shadow-[0_0_15px_-3px_rgba(255,193,7,0.35)]"
              >
                <span>REQUEST SYSTEM PROPOSAL</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
