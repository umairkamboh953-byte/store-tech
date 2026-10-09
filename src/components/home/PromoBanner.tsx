import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { PROMO_IMAGE } from '../../data/mockData';

export const PromoBanner: React.FC = () => {
  const { navigateTo } = useStore();

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 p-8 sm:p-12 lg:p-16 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Premium Hardware Showcase
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Upgrade Your Everyday Tech.
              </h2>

              <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-md">
                Explore the latest gadgets designed for modern life. Superior build materials, lossless studio acoustics, and ultra-fast GaN power delivery.
              </p>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Precision CNC machined unibody construction</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Verified PTA compliance across all cellular devices</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Doorstep delivery with TCS & Leopard Express</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => navigateTo('shop')}
                  className="px-7 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm tracking-tight inline-flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/20 active:scale-95"
                >
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Visual Image */}
            <div className="lg:col-span-6 h-64 sm:h-80 lg:h-full min-h-[360px] relative">
              <img
                src={PROMO_IMAGE}
                alt="Studio Headphones and Tech Accessories"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-linear-to-r from-slate-950/80 via-transparent to-transparent lg:block hidden" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
