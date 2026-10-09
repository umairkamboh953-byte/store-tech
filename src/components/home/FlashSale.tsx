import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Flame, Clock, ArrowRight, Zap, ShoppingBag, Eye, Heart } from 'lucide-react';
import { sanitizeImageUrl, PHONE_IMAGE } from '../../data/mockData';

export const FlashSale: React.FC = () => {
  const { products, navigateTo, addToCart, toggleWishlist, isInWishlist, setQuickViewProduct } = useStore();

  // Working countdown timer
  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 42,
    seconds: 19,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 12, minutes: 0, seconds: 0 }; // Resets gracefully
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const flashProducts = products.filter((p) => p.isFlashDeal || p.discountPercent >= 20).slice(0, 4);

  return (
    <section className="py-16 bg-slate-900 text-white relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header with timer */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 pb-6 border-b border-slate-800 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 text-xs font-bold mb-2">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>Up to 40% OFF · Limited Quantities</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Limited Time Deals
            </h2>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 p-3 rounded-2xl">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold px-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Ends In:</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono">
              <div className="bg-slate-800 text-white px-2.5 py-1.5 rounded-lg text-sm font-bold min-w-9 text-center tabular-nums">
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
              <span className="text-slate-500 font-bold">:</span>
              <div className="bg-slate-800 text-white px-2.5 py-1.5 rounded-lg text-sm font-bold min-w-9 text-center tabular-nums">
                {String(timeLeft.minutes).padStart(2, '0')}
              </div>
              <span className="text-slate-500 font-bold">:</span>
              <div className="bg-cyan-500 text-slate-950 px-2.5 py-1.5 rounded-lg text-sm font-black min-w-9 text-center tabular-nums">
                {String(timeLeft.seconds).padStart(2, '0')}
              </div>
            </div>
          </div>
        </div>

        {/* Product Cards Grid - 2 cols on mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
          {flashProducts.map((product) => {
            const inWishlist = isInWishlist(product.id);
            const soldPercent = product.flashSoldPercent || 72;

            return (
              <div
                key={product.id}
                className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 hover:shadow-2xl transition-all duration-200 flex flex-col justify-between group w-full min-w-0"
              >
                {/* Visual */}
                <div className="relative aspect-4/3 bg-slate-900 overflow-hidden cursor-pointer shrink-0">
                  <img
                    src={sanitizeImageUrl(product.images?.[0]) || PHONE_IMAGE}
                    alt={product.name}
                    onError={(e) => {
                      if (e.currentTarget.src !== PHONE_IMAGE) {
                        e.currentTarget.src = PHONE_IMAGE;
                      }
                    }}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-rose-600 text-white text-[9px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 rounded-md">
                    -{product.discountPercent}% OFF
                  </div>

                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-2 sm:top-3 right-2 sm:right-3 h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-slate-900/80 text-white hover:text-rose-400 flex items-center justify-center transition-colors"
                  >
                    <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>

                  <div className="absolute inset-x-2 sm:inset-x-3 bottom-2 sm:bottom-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setQuickViewProduct(product)}
                      className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-[11px] sm:text-xs font-bold py-1.5 sm:py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Quick View</span>
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="p-2.5 sm:p-4 flex flex-col grow justify-between">
                  <div>
                    <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-cyan-400 block mb-0.5 truncate">
                      {product.brand}
                    </span>
                    <h3
                      onClick={() => navigateTo('product', { productId: product.id })}
                      className="font-bold text-xs sm:text-sm text-white line-clamp-2 hover:text-cyan-400 cursor-pointer transition-colors mb-1.5 leading-snug min-h-[2rem] sm:min-h-auto"
                    >
                      {product.name}
                    </h3>

                    {/* Price */}
                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2 mb-2 sm:mb-3">
                      <span className="text-xs sm:text-base font-black text-cyan-300 font-mono tabular-nums leading-tight">
                        Rs. {product.price.toLocaleString()}
                      </span>
                      <span className="text-[9px] sm:text-xs text-slate-500 line-through font-mono tabular-nums">
                        Rs. {product.originalPrice.toLocaleString()}
                      </span>
                    </div>

                    {/* Stock Progress Bar */}
                    <div className="space-y-1 mb-2.5 sm:mb-4">
                      <div className="flex justify-between text-[9px] sm:text-[11px] text-slate-400 font-medium">
                        <span>Stock</span>
                        <span className="text-cyan-400 font-semibold">{soldPercent}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-linear-to-r from-amber-400 to-rose-500 rounded-full"
                          style={{ width: `${soldPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => addToCart(product, product.variants[0], 1)}
                    className="w-full bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-white py-1.5 sm:py-2 px-2 sm:px-3 rounded-xl text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1 sm:gap-1.5 transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">Claim Deal</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer CTA */}
        <div className="mt-10 text-center">
          <button
            onClick={() => navigateTo('shop')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs tracking-tight transition-colors border border-slate-700"
          >
            <span>Shop All Deals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
