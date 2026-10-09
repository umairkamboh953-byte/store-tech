import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Smartphone,
  Laptop,
  Watch,
  Headphones,
  Gamepad2,
  Shield,
  Cpu,
  Zap,
  Home,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { CategoryId } from '../../types';
import { sanitizeImageUrl, PHONE_IMAGE } from '../../data/mockData';

export const CategorySection: React.FC = () => {
  const { categories, navigateTo, products } = useStore();

  const iconMap: Record<string, React.ElementType> = {
    Smartphone,
    Laptop,
    Watch,
    Headphones,
    Gamepad2,
    Shield,
    Cpu,
    Zap,
    Home,
  };

  return (
    <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cyan-600 mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated Electronics Catalog</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Shop By Category
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Authentic technology with official brand warranty and PTA verification across Pakistan.
            </p>
          </div>
          <button
            onClick={() => navigateTo('shop')}
            className="text-xs font-bold text-slate-700 hover:text-cyan-600 flex items-center gap-1.5 transition-colors self-start sm:self-auto group"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Category Grid with Real Product Images */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-4 md:gap-5">
          {categories.map((cat) => {
            const IconComponent = iconMap[cat.iconName] || Smartphone;
            const liveCount = products.filter((p) => p.category === cat.id).length || cat.productCount;

            return (
              <div
                key={cat.id}
                onClick={() => navigateTo('shop', { categoryId: cat.id as CategoryId })}
                className="group bg-white rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 border border-slate-200/80 hover:border-cyan-500/80 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 cursor-pointer flex flex-col justify-between w-full min-w-0"
              >
                <div>
                  {/* Real Product Image Container */}
                  <div className="aspect-square w-full rounded-xl sm:rounded-2xl bg-slate-100 overflow-hidden relative mb-2.5 sm:mb-4 border border-slate-100 group-hover:border-cyan-200 transition-colors shrink-0">
                    <img
                      src={sanitizeImageUrl(cat.image) || PHONE_IMAGE}
                      alt={cat.name}
                      onError={(e) => {
                        if (e.currentTarget.src !== PHONE_IMAGE) {
                          e.currentTarget.src = PHONE_IMAGE;
                        }
                      }}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Subtle Category Icon Tag in Corner */}
                    <div className="absolute top-2 right-2 h-7 w-7 rounded-lg bg-white/90 backdrop-blur-md text-slate-700 shadow-xs flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">
                      <IconComponent className="w-3.5 h-3.5" />
                    </div>

                    <div className="absolute inset-0 bg-linear-to-t from-slate-950/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Text Details */}
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-cyan-600 transition-colors line-clamp-1 mb-0.5">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium">
                    {liveCount}+ Products
                  </p>
                </div>

                <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 group-hover:text-cyan-600 font-semibold transition-colors">
                  <span>Explore</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
