import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { Search, X, ArrowRight, Tag, Sparkles, Clock } from 'lucide-react';
import { CategoryId } from '../../types';
import { sanitizeImageUrl, PHONE_IMAGE } from '../../data/mockData';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, products, categories, navigateTo } = useStore();
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Titanium Pro',
    'GaN Fast Charger',
    'ANC Earbuds',
    'Ultrabook',
  ]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const trimmed = query.trim().toLowerCase();

  const matchingProducts = trimmed
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(trimmed) ||
          p.brand.toLowerCase().includes(trimmed) ||
          p.category.toLowerCase().includes(trimmed) ||
          p.sku.toLowerCase().includes(trimmed) ||
          p.shortDescription.toLowerCase().includes(trimmed)
      )
    : [];

  const matchingCategories = trimmed
    ? categories.filter((c) => c.name.toLowerCase().includes(trimmed))
    : [];

  const handleSelectProduct = (productId: string, name: string) => {
    if (!recentSearches.includes(name)) {
      setRecentSearches((prev) => [name, ...prev.slice(0, 4)]);
    }
    setIsSearchOpen(false);
    navigateTo('product', { productId });
  };

  const handleSelectCategory = (categoryId: CategoryId) => {
    setIsSearchOpen(false);
    navigateTo('shop', { categoryId });
  };

  const handleRecentClick = (term: string) => {
    setQuery(term);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
        onClick={() => setIsSearchOpen(false)}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden z-10 border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search phones, earbuds, laptops, chargers, or brands..."
            className="w-full text-sm sm:text-base font-medium text-slate-900 placeholder-slate-400 outline-hidden bg-transparent"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-2 py-1 bg-slate-100 rounded-lg"
          >
            ESC
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {/* If query entered */}
          {query.trim() ? (
            <>
              {/* Category Matches */}
              {matchingCategories.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Matching Categories
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {matchingCategories.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => handleSelectCategory(c.id)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-cyan-50 hover:text-cyan-700 text-xs font-semibold text-slate-700 transition-colors"
                      >
                        <Tag className="w-3.5 h-3.5 text-cyan-500" />
                        <span>{c.name}</span>
                        <span className="text-[10px] text-slate-400">({c.productCount})</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Product Matches */}
              {matchingProducts.length > 0 ? (
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Products ({matchingProducts.length})
                  </h4>
                  <div className="divide-y divide-slate-100">
                    {matchingProducts.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => handleSelectProduct(p.id, p.name)}
                        className="py-2.5 px-2 rounded-xl flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={sanitizeImageUrl(p.images?.[0]) || PHONE_IMAGE}
                            alt={p.name}
                            onError={(e) => {
                              if (e.currentTarget.src !== PHONE_IMAGE) {
                                e.currentTarget.src = PHONE_IMAGE;
                              }
                            }}
                            referrerPolicy="no-referrer"
                            className="w-11 h-11 rounded-lg object-cover bg-slate-100 shrink-0"
                          />
                          <div>
                            <p className="text-xs font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">
                              {p.name}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {p.brand} · {p.category.replace('-', ' ')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs font-bold text-slate-900 font-mono tabular-nums">
                            Rs. {p.price.toLocaleString()}
                          </p>
                          {p.discountPercent > 0 && (
                            <span className="text-[10px] font-semibold text-emerald-600">
                              {p.discountPercent}% off
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm font-semibold text-slate-800">
                    No products found for "{query}"
                  </p>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Check spelling or try popular categories like Smartphones, Earbuds, or GaN Chargers.
                  </p>

                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {categories.slice(0, 4).map((c) => (
                      <button
                        key={c.id}
                        onClick={() => handleSelectCategory(c.id)}
                        className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Browse {c.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Idle View: Recent Searches & Suggested */
            <div className="space-y-4">
              {recentSearches.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Recent Searches</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((item) => (
                      <button
                        key={item}
                        onClick={() => handleRecentClick(item)}
                        className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg font-medium transition-colors"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Popular Tech Highlights</span>
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {products.slice(0, 4).map((p) => (
                    <div
                      key={p.id}
                      onClick={() => handleSelectProduct(p.id, p.name)}
                      className="p-2 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50 cursor-pointer flex items-center gap-2.5 transition-all"
                    >
                      <img
                        src={sanitizeImageUrl(p.images?.[0]) || PHONE_IMAGE}
                        alt={p.name}
                        onError={(e) => {
                          if (e.currentTarget.src !== PHONE_IMAGE) {
                            e.currentTarget.src = PHONE_IMAGE;
                          }
                        }}
                        referrerPolicy="no-referrer"
                        className="w-9 h-9 rounded-md object-cover bg-slate-100 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">
                          {p.name}
                        </p>
                        <p className="text-[10px] text-slate-500 font-mono tabular-nums">
                          Rs. {p.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Search in real time across 100% genuine products</span>
          <button
            onClick={() => {
              setIsSearchOpen(false);
              navigateTo('shop');
            }}
            className="text-cyan-600 font-semibold hover:underline flex items-center gap-1"
          >
            <span>Explore Entire Shop</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
