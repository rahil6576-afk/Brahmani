'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { ProductItem } from '@/lib/constants';
import { useTheme } from './ThemeProvider';
import InteractivePanelImage from './InteractivePanelImage';

interface ProductCardProps {
  product: ProductItem;
  onSelect: (product: ProductItem) => void;
  onCompare?: (product: ProductItem) => void;
}

export default function ProductCard({ product, onSelect, onCompare }: ProductCardProps) {
  const { theme } = useTheme();
  const isNight = theme === 'night';
  const [isHovered, setIsHovered] = useState(false);

  const isSolar = product.category === 'SOLAR PANELS';

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-cursor="product"
      className={`group relative border transition-colors duration-300 flex flex-col justify-between overflow-hidden ${
        isNight
          ? 'bg-[#0D1217] border-[#1E262E] hover:border-[#FFC107]/40'
          : 'bg-[#FFFFFF] border-[#E2E0D8] hover:border-[#FFC107]/60 shadow-sm'
      }`}
      style={{ borderRadius: '2px' }}
    >
      {/* 1. Image Area with 3D perspective tilt & light sweep */}
      <div
        className={`relative h-60 sm:h-64 w-full overflow-hidden border-b ${
          isNight ? 'bg-[#080B0D] border-[#1A2229]' : 'bg-[#F2F1EB] border-[#E5E3DB]'
        }`}
        onClick={() => onSelect(product)}
      >
        <InteractivePanelImage
          src={product.image}
          alt={product.name}
          isSolar={isSolar}
          className="w-full h-full cursor-pointer"
        />

        {/* Category Pill Tag */}
        <div className="absolute top-3 left-3 z-10 pointer-events-none">
          <span
            className={`text-[10px] font-mono font-bold tracking-widest uppercase border px-2.5 py-1 backdrop-blur-sm ${
              isNight
                ? 'bg-[#0D1217]/90 text-[#FFC107] border-[#232C35]'
                : 'bg-[#FFFFFF]/95 text-[#E6A900] border-[#DDDCD4]'
            }`}
          >
            {product.category}
          </span>
        </div>

        {/* Engineering corner marks */}
        <div
          className={`absolute top-3 right-3 text-[10px] font-mono px-2 py-0.5 border pointer-events-none ${
            isNight
              ? 'text-[#6A7580] bg-[#0D1217]/80 border-[#1E262E]'
              : 'text-[#7A8692] bg-[#FFFFFF]/90 border-[#DDDCD4]'
          }`}
        >
          REF // 0{product.specs.length}
        </div>
      </div>

      {/* 2. Content Info */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div onClick={() => onSelect(product)} className="cursor-pointer">
          <h3
            className={`text-base sm:text-lg font-bold transition-colors duration-200 line-clamp-1 uppercase tracking-tight ${
              isNight
                ? 'text-[#F5F5F2] group-hover:text-white'
                : 'text-[#11161A] group-hover:text-black'
            }`}
          >
            {product.name}
          </h3>
          <p
            className={`text-[11px] font-mono mt-0.5 uppercase tracking-wider line-clamp-1 ${
              isNight ? 'text-[#7B8792]' : 'text-[#6E7B88]'
            }`}
          >
            {product.subtitle}
          </p>
          <p
            className={`text-xs mt-3 line-clamp-2 leading-relaxed ${
              isNight ? 'text-[#8E97A0]' : 'text-[#55626E]'
            }`}
          >
            {product.description}
          </p>
        </div>

        {/* Technical Specification Snippets with corrected label rendering */}
        <div
          className={`mt-5 pt-3 border-t grid grid-cols-2 gap-2 text-[11px] font-mono ${
            isNight ? 'border-[#1C242C]' : 'border-[#E8E6DE]'
          }`}
        >
          {product.specs.slice(0, 2).map((sp, idx) => (
            <div
              key={`${product.id || product.name}-spec-${idx}-${sp.label}`}
              className={`p-2 border ${
                isNight
                  ? 'bg-[#12181E] border-[#1E2730]'
                  : 'bg-[#F6F5EF] border-[#E0DED5]'
              }`}
            >
              <span
                className={`text-[9px] block uppercase truncate ${
                  isNight ? 'text-[#626E7A]' : 'text-[#75818E]'
                }`}
              >
                {sp.label}
              </span>
              <span className="text-[#FFC107] font-semibold block truncate mt-0.5">
                {sp.value}
              </span>
            </div>
          ))}
        </div>

        {/* 3. Action Footer */}
        <div
          className={`mt-5 pt-3 flex items-center justify-between border-t ${
            isNight ? 'border-[#1C242C]' : 'border-[#E8E6DE]'
          }`}
        >
          <button
            type="button"
            onClick={() => onSelect(product)}
            className={`text-xs font-mono font-semibold tracking-wider uppercase transition-colors flex items-center gap-1.5 focus:outline-none ${
              isNight
                ? 'text-[#A5ACB2] group-hover:text-[#FFC107]'
                : 'text-[#505D68] group-hover:text-[#FFC107]'
            }`}
          >
            <span>VIEW DETAILS</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1 text-[#FFC107]" />
          </button>

          {onCompare && (
            <button
              type="button"
              onClick={() => onCompare(product)}
              className="text-[10px] font-mono text-[#7D8894] hover:text-[#FFC107] transition-colors"
            >
              + COMPARE
            </button>
          )}
        </div>
      </div>

      {/* Yellow technical line */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden pointer-events-none ${
          isNight ? 'bg-[#1E262E]' : 'bg-[#E0DDD5]'
        }`}
      >
        <motion.div
          animate={{
            scaleX: isHovered ? 1 : 0,
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="w-full h-full bg-[#FFC107] origin-left shadow-[0_0_8px_#FFC107]"
        />
      </div>
    </div>
  );
}
