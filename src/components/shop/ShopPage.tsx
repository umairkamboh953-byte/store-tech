import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../common/ProductCard';
import {
  SlidersHorizontal,
  X,
  Search,
  RotateCcw,
  Star,
  Check,
  ChevronDown,
} from 'lucide-react';
import { CategoryId } from '../../types';

export const ShopPage: React.FC = () => {
  const {
    products,
    categories,
    selectedCategoryId,
    navigateTo,
  } = useStore();

  // Filters state
  const [searchFilter, setSearchFilter] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>(selectedCategoryId || 'all');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number>(350000);
  const [minRating, setMinRating] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [discountOnly, setDiscountOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'price-low' | 'price-high' | 'rating'>('featured');

  // Mobile filters drawer
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Pagination / Load more
  const [displayCount, setDisplayCount] = useState(8);

  // Extract all unique brands
  const allBrands = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.brand))).sort();
  }, [products]);

  // Handle brand toggle
  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchFilter('');
    setActiveCategory('all');
    setSelectedBrands([]);
    setPriceRange(350000);
    setMinRating(0);
    setInStockOnly(false);
    setDiscountOnly(false);
    setSortBy('featured');
    setDisplayCount(8);
  };

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search
        if (searchFilter.trim()) {
          const q = searchFilter.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchBrand = p.brand.toLowerCase().includes(q);
          const matchDesc = p.shortDescription.toLowerCase().includes(q);
          if (!matchName && !matchBrand && !matchDesc) return false;
        }

        // Category
        if (activeCategory !== 'all' && p.category !== activeCategory) {
          return false;
        }

        // Brand
        if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) {
          return false;
        }

        // Price
        if (p.price > priceRange) {
          return false;
        }

        // Rating
        if (minRating > 0 && p.rating < minRating) {
          return false;
        }

        // In stock
        if (inStockOnly && (!p.inStock || p.stock <= 0)) {
          return false;
        }

        // Discount
        if (discountOnly && p.discountPercent <= 0) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        // featured default
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [
    products,
    searchFilter,
    activeCategory,
    selectedBrands,
    priceRange,
    minRating,
    inStockOnly,
    discountOnly,
    sortBy,
  ]);

  const visibleProducts = filteredProducts.slice(0, displayCount);

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Banner */}
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 mb-8 text-white relative overflow-hidden">
          <div className="max-w-xl space-y-2 relative z-10">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Complete Catalog
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              All Products
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Explore authentic high-grade electronics with manufacturer warranty and fast delivery across 200+ Pakistani cities.
            </p>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-xs">
          {/* Search inside shop */}
          <div className="relative grow max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter by keyword, model, or brand..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-3 justify-between md:justify-end">
            {/* Filter Drawer Toggle for Mobile */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50"
            >
              <SlidersHorizontal className="w-4 h-4 text-slate-500" />
              <span>Filters</span>
            </button>

            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium whitespace-nowrap hidden sm:inline">
                Sort by:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-cyan-500 cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Layout: Sidebar + Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Left Sidebar Filters */}
          <aside className="hidden lg:block lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-6 shadow-xs sticky top-24">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-cyan-600" />
                  <span>Filters</span>
                </span>
                <button
                  onClick={resetFilters}
                  className="text-xs font-medium text-slate-500 hover:text-cyan-600 flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Category
                </h4>
                <div className="space-y-1">
                  <button
                    onClick={() => setActiveCategory('all')}
                    className={`w-full text-left px-2.5 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                      activeCategory === 'all'
                        ? 'bg-slate-900 text-white font-bold shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-md bg-slate-800 text-cyan-400 flex items-center justify-center text-[10px] font-black shrink-0">
                        ALL
                      </div>
                      <span>All Categories</span>
                    </div>
                    <span className="text-[10px] opacity-70">({products.length})</span>
                  </button>

                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setActiveCategory(c.id)}
                      className={`w-full text-left px-2.5 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                        activeCategory === c.id
                          ? 'bg-slate-900 text-white font-bold shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        {c.image ? (
                          <img
                            src={c.image}
                            alt=""
                            referrerPolicy="no-referrer"
                            className="h-6 w-6 rounded-md object-cover bg-slate-100 shrink-0 border border-slate-200"
                          />
                        ) : (
                          <div className="h-6 w-6 rounded-md bg-slate-200 shrink-0" />
                        )}
                        <span className="truncate">{c.name}</span>
                      </div>
                      <span className="text-[10px] opacity-70 ml-2 shrink-0">
                        ({products.filter((p) => p.category === c.id).length})
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand Filter */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Brand
                </h4>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {allBrands.map((brand) => {
                    const isChecked = selectedBrands.includes(brand);
                    return (
                      <label
                        key={brand}
                        className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer hover:text-slate-900 select-none"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleBrand(brand)}
                          className="h-4 w-4 rounded-sm border-slate-300 text-cyan-600 focus:ring-cyan-500"
                        />
                        <span>{brand}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Price Filter */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-2">
                  <span className="uppercase tracking-wider text-slate-500">Max Price</span>
                  <span className="font-mono tabular-nums text-cyan-600">
                    Rs. {priceRange.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min={1000}
                  max={350000}
                  step={5000}
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-cyan-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                  <span>Rs. 1,000</span>
                  <span>Rs. 350,000</span>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Minimum Rating
                </h4>
                <div className="space-y-1">
                  {[4.5, 4.0, 0].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setMinRating(rating)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        minRating === rating
                          ? 'bg-amber-50 text-amber-900 font-bold border border-amber-200'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span className="flex items-center gap-1">
                        {rating > 0 ? (
                          <>
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{rating} Stars & above</span>
                          </>
                        ) : (
                          <span>All Ratings</span>
                        )}
                      </span>
                      {minRating === rating && <Check className="w-3.5 h-3.5 text-amber-600" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="h-4 w-4 rounded-sm border-slate-300 text-cyan-600 focus:ring-cyan-500"
                  />
                  <span>In Stock Only</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={discountOnly}
                    onChange={(e) => setDiscountOnly(e.target.checked)}
                    className="h-4 w-4 rounded-sm border-slate-300 text-cyan-600 focus:ring-cyan-500"
                  />
                  <span>Discount Deals Only</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Right Main Grid */}
          <main className="lg:col-span-3 space-y-6">
            {/* Results count & Active filters badges */}
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>
                Showing <strong className="text-slate-900">{visibleProducts.length}</strong> of{' '}
                <strong className="text-slate-900">{filteredProducts.length}</strong> products
              </span>
            </div>

            {/* Product Grid: 4 cols on desktop, 3 on tablet, 2 on mobile */}
            {visibleProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
                {visibleProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-3">
                <div className="h-14 w-14 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">No matching products found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try broadening your price range, clearing brand selections, or searching for general terms.
                </p>
                <div className="pt-2">
                  <button
                    onClick={resetFilters}
                    className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-cyan-600 transition-colors"
                  >
                    Reset All Filters
                  </button>
                </div>
              </div>
            )}

            {/* Load More Button */}
            {visibleProducts.length < filteredProducts.length && (
              <div className="text-center pt-8">
                <button
                  onClick={() => setDisplayCount((c) => c + 4)}
                  className="px-8 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 hover:border-slate-400 hover:bg-slate-50 text-xs font-bold transition-all shadow-xs"
                >
                  Load More Products ({filteredProducts.length - visibleProducts.length} remaining)
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Slide-Out Filter Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto p-5 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Filter Products</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 mb-2">Category</h4>
              <select
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-slate-200"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-800 mb-1">
                <span>Max Price</span>
                <span>Rs. {priceRange.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={1000}
                max={350000}
                step={5000}
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-cyan-600"
              />
            </div>

            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                />
                <span>In Stock Only</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={discountOnly}
                  onChange={(e) => setDiscountOnly(e.target.checked)}
                />
                <span>Discount Deals Only</span>
              </label>
            </div>

            <div className="mt-auto pt-4 border-t border-slate-100 flex gap-2">
              <button
                onClick={resetFilters}
                className="w-1/2 py-2 text-xs font-semibold rounded-lg border border-slate-200"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-1/2 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
