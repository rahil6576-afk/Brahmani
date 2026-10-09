'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Check, ArrowRight, Download, Send } from 'lucide-react';
import { ProductItem } from '@/lib/constants';
import { useTheme } from './ThemeProvider';

interface ProductModalProps {
  product: ProductItem | null;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const { isNight } = useTheme();
  if (!product) return null;

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
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className={`relative w-full max-w-4xl max-h-[92vh] overflow-y-auto border shadow-2xl z-10 my-auto ${
            isNight ? 'bg-[#0E1318] border-[#232C35]' : 'bg-[#FFFFFF] border-[#E0DDD4]'
          }`}
        >
          {/* Top Yellow Bar */}
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#FFC107] to-transparent sticky top-0 z-30" />

          {/* Close button */}
          <button
            onClick={onClose}
            className={`sticky float-right top-3 right-3 z-30 p-2 border transition-colors ${
              isNight
                ? 'bg-[#161D24]/90 border-[#2A3540] text-[#A5ACB2] hover:text-[#FFC107]'
                : 'bg-[#F2F1EC]/90 border-[#DDDCD4] text-[#4A5560] hover:text-[#FFC107]'
            }`}
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-0 clear-both">
            {/* Left: Product Imagery (5 cols) */}
            <div
              className={`md:col-span-5 relative h-60 sm:h-72 md:h-auto min-h-[240px] sm:min-h-[300px] border-b md:border-b-0 md:border-r p-4 sm:p-6 flex flex-col justify-between ${
                isNight
                  ? 'bg-[#0A0D0F] border-[#222B32]'
                  : 'bg-[#F6F5EF] border-[#E2DFD6]'
              }`}
            >
              <div className="relative w-full h-full min-h-[220px]">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain object-center"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              </div>

              {/* Technical badge */}
              <div
                className={`mt-4 flex items-center justify-between text-[11px] font-mono border-t pt-3 ${
                  isNight
                    ? 'text-[#76828E] border-[#1D252E]'
                    : 'text-[#5B6774] border-[#DDDCD0]'
                }`}
              >
                <span>CAT: {product.category}</span>
                <span className="text-[#FFC107]">IN PRODUCTION</span>
              </div>
            </div>

            {/* Right: Technical Specification Sheet (7 cols) */}
            <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div>
                <div
                  className={`inline-block px-2.5 py-0.5 border text-[10px] font-mono font-bold tracking-widest text-[#FFC107] uppercase mb-2 ${
                    isNight ? 'bg-[#141B21] border-[#232C35]' : 'bg-[#F5F4EE] border-[#DEDCD4]'
                  }`}
                >
                  {product.category}
                </div>
                <h3
                  className={`text-2xl font-extrabold uppercase tracking-tight ${
                    isNight ? 'text-[#F5F5F2]' : 'text-[#11161A]'
                  }`}
                >
                  {product.name}
                </h3>
                <p
                  className={`text-xs font-mono mt-1 ${
                    isNight ? 'text-[#8C97A1]' : 'text-[#64717E]'
                  }`}
                >
                  {product.subtitle}
                </p>
                <p
                  className={`text-sm mt-3 leading-relaxed ${
                    isNight ? 'text-[#8E97A0]' : 'text-[#525E6A]'
                  }`}
                >
                  {product.description}
                </p>
              </div>

              {/* Engineering Specs Grid */}
              <div className="space-y-2">
                <h4
                  className={`text-[11px] font-bold font-mono tracking-widest uppercase border-l-2 border-[#FFC107] pl-2 ${
                    isNight ? 'text-[#ECEBE6]' : 'text-[#11161A]'
                  }`}
                >
                  ENGINEERING SPECIFICATIONS
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  {product.specs.map((s, idx) => (
                    <div
                      key={`${product.id || product.name}-spec-${idx}-${s.label}`}
                      className={`border p-2.5 ${
                        isNight
                          ? 'bg-[#131920] border-[#1E262E]'
                          : 'bg-[#F8F7F2] border-[#E0DDD5]'
                      }`}
                    >
                      <span
                        className={`text-[10px] font-mono uppercase block ${
                          isNight ? 'text-[#6B7782]' : 'text-[#7A8693]'
                        }`}
                      >
                        {s.label}
                      </span>
                      <span
                        className={`font-mono font-semibold text-xs mt-0.5 block ${
                          isNight ? 'text-[#F5F5F2]' : 'text-[#11161A]'
                        }`}
                      >
                        {s.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div
                className={`pt-4 border-t flex flex-wrap items-center gap-3 ${
                  isNight ? 'border-[#1E2730]' : 'border-[#E2DFD6]'
                }`}
              >
                <Link
                  href={`/contact?product=${encodeURIComponent(product.name)}#quote`}
                  onClick={onClose}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#FFC107] hover:bg-[#E6A900] text-[#0A0D0F] text-xs font-bold tracking-wider uppercase transition-colors shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>REQUEST QUOTATION &amp; DATASHEET</span>
                </Link>
                <a
                  href="/images/brahmani.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 px-4 py-2.5 border text-xs font-mono uppercase transition-colors ${
                    isNight
                      ? 'bg-[#141A21] border-[#232D36] text-[#A5ACB2] hover:text-[#F5F5F2]'
                      : 'bg-[#F5F4EE] border-[#DDDCD4] text-[#4A5560] hover:text-[#11161A]'
                  }`}
                >
                  <Download className="w-3.5 h-3.5 text-[#FFC107]" />
                  <span>PDF CATALOG</span>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
