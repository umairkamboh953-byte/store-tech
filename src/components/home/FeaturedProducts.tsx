import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../common/ProductCard';
import { ArrowRight } from 'lucide-react';
import { CategoryId } from '../../types';

export const FeaturedProducts: React.FC = () => {
  const { products, navigateTo } = useStore();
  const [activeTab, setActiveTab] = useState<'all' | CategoryId>('all');

  const filterTabs = [
    { label: 'All Featured', value: 'all' as const },
    { label: 'Smartphones', value: 'smartphones' as const },
    { label: 'Laptops', value: 'laptops' as const },
    { label: 'Audio & Earbuds', value: 'earbuds' as const },
    { label: 'Smart Watches', value: 'smart-watches' as const },
  ];

  const filteredProducts = products.filter((p) => {
    if (!p.isFeatured) return false;
    if (activeTab === 'all') return true;
    if (activeTab === 'earbuds') return p.category === 'earbuds' || p.category === 'headphones';
    return p.category === activeTab;
  });

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 block mb-1">
              Handpicked Flagships
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Featured Products
            </h2>
          </div>

          {/* Interactive filter tabs (segmented control) */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto max-w-full">
            {filterTabs.map((tab) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.value)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                  activeTab === tab.value
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid - 2 cols on mobile, 3-4 cols on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Section Footer */}
        <div className="mt-12 text-center">
          <button
            onClick={() => navigateTo('shop')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-cyan-600 text-white font-bold text-xs tracking-tight transition-colors shadow-xs"
          >
            <span>Explore All Catalog ({products.length} Products)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
