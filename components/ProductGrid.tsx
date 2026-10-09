'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftRight } from 'lucide-react';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import ProductComparison from './ProductComparison';
import { PRODUCTS_LIST, ProductItem } from '@/lib/constants';
import { useContent } from '@/lib/contentContext';

const CATEGORIES = [
  'ALL PRODUCTS',
  'SOLAR PANELS',
  'INVERTERS',
  'CABLES & WIRING',
  'SWITCHGEAR',
  'LED LIGHTING',
  'CONTROL PANELS',
] as const;

export default function ProductGrid() {
  const { content } = useContent();
  const products = content?.products?.length ? content.products : PRODUCTS_LIST;
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL PRODUCTS');
  const [activeModalProduct, setActiveModalProduct] = useState<ProductItem | null>(null);
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const [compareItems, setCompareItems] = useState<ProductItem[]>([products[0] || PRODUCTS_LIST[0], products[1] || PRODUCTS_LIST[1]]);

  const filteredProducts = selectedCategory === 'ALL PRODUCTS'
    ? products
    : products.filter(p => p.category === selectedCategory);

  const handleTriggerCompare = (product: ProductItem) => {
    setCompareItems((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) return prev;
      return [prev[0] || PRODUCTS_LIST[0], product];
    });
    setComparisonOpen(true);
  };

  return (
    <div className="w-full">
      {/* Category Tabs & Comparison Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 mb-8 border-b border-[#1E262E]">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-mono font-semibold tracking-wider uppercase whitespace-nowrap transition-all duration-200 border ${
                  isActive
                    ? 'bg-[#FFC107] text-[#0A0D0F] border-[#FFC107] shadow-[0_0_12px_rgba(255,193,7,0.3)]'
                    : 'bg-[#10151A] text-[#8E97A0] border-[#222B32] hover:text-[#F5F5F2] hover:border-[#33404B]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Compare Trigger Button */}
        <button
          onClick={() => setComparisonOpen(true)}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3.5 py-2.5 sm:py-2 bg-[#141B22] border border-[#283542] hover:border-[#FFC107] text-[#ECEBE6] hover:text-[#FFC107] text-xs font-mono uppercase tracking-wider transition-colors shrink-0"
        >
          <ArrowLeftRight className="w-3.5 h-3.5 text-[#FFC107]" />
          <span>SPEC COMPARISON MATRIX</span>
        </button>
      </div>

      {/* Grid: Responsive columns */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
      >
        <AnimatePresence>
          {filteredProducts.map((product, idx) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.15, margin: "0px 0px -40px 0px" }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.55, delay: (idx % 3) * 0.08, ease: [0.21, 1, 0.36, 1] }}
              key={product.id}
            >
              <ProductCard
                product={product}
                onSelect={(prod) => setActiveModalProduct(prod)}
                onCompare={handleTriggerCompare}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Product Detail Datasheet Modal */}
      <ProductModal
        product={activeModalProduct}
        onClose={() => setActiveModalProduct(null)}
      />

      {/* Product Comparison Matrix */}
      <ProductComparison
        isOpen={comparisonOpen}
        initialProducts={compareItems}
        onClose={() => setComparisonOpen(false)}
      />
    </div>
  );
}
