import React, { useState } from 'react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { Star, Heart, Eye, ShoppingBag, Check } from 'lucide-react';
import { sanitizeImageUrl, PHONE_IMAGE } from '../../data/mockData';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    navigateTo,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setQuickViewProduct,
  } = useStore();

  const [imageError, setImageError] = useState(false);
  const inWishlist = isInWishlist(product.id);

  const mainImage = sanitizeImageUrl(product.images?.[0]) || PHONE_IMAGE;

  return (
    <div className="group relative bg-white border border-slate-200/90 rounded-2xl overflow-hidden hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col h-full w-full min-w-0">
      {/* Visual Area */}
      <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden cursor-pointer shrink-0">
        {!imageError ? (
          <img
            src={mainImage}
            alt={product.name}
            onError={(e) => {
              if (e.currentTarget.src !== PHONE_IMAGE) {
                e.currentTarget.src = PHONE_IMAGE;
              } else {
                setImageError(true);
              }
            }}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-linear-to-br from-slate-100 to-slate-200 text-slate-500">
            <ShoppingBag className="w-10 h-10 mb-2 stroke-1 text-slate-400" />
            <span className="text-xs font-semibold text-center">{product.name}</span>
          </div>
        )}

        {/* Top Floating Badges */}
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col gap-1 z-10">
          {product.discountPercent > 0 && (
            <span className="bg-slate-900/90 backdrop-blur-xs text-white text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md tracking-wider">
              SAVE {product.discountPercent}%
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-cyan-500 text-slate-950 text-[9px] sm:text-[10px] font-extrabold px-1.5 sm:px-2 py-0.5 rounded-md tracking-wider">
              NEW
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2 sm:top-3 right-2 sm:right-3 h-7 w-7 sm:h-8 sm:w-8 rounded-full flex items-center justify-center transition-all duration-200 z-10 ${
            inWishlist
              ? 'bg-rose-50 text-rose-500 shadow-xs'
              : 'bg-white/90 backdrop-blur-xs text-slate-600 hover:text-rose-500 hover:bg-white shadow-xs'
          }`}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${inWishlist ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Overlay on Hover */}
        <div className="absolute inset-x-2 sm:inset-x-3 bottom-2 sm:bottom-3 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            className="w-full bg-slate-900/90 hover:bg-slate-950 backdrop-blur-xs text-white text-[11px] sm:text-xs font-semibold py-1.5 sm:py-2 px-2.5 sm:px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-2.5 sm:p-4 flex flex-col grow justify-between">
        <div>
          {/* Category & Brand Metadata */}
          <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-slate-500 font-medium mb-1">
            <span className="uppercase tracking-wider font-semibold text-slate-600 truncate max-w-[70px] sm:max-w-none">
              {product.brand}
            </span>
            <span aria-hidden="true">·</span>
            <span className="capitalize truncate text-[9px] sm:text-[11px]">{product.category.replace('-', ' ')}</span>
          </div>

          {/* Product Name */}
          <h3
            onClick={() => navigateTo('product', { productId: product.id })}
            className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-2 hover:text-cyan-600 transition-colors cursor-pointer mb-1 leading-snug min-h-[2rem] sm:min-h-auto"
          >
            {product.name}
          </h3>

          {/* Rating & Reviews */}
          <div className="flex items-center gap-1 mb-1.5 sm:mb-3 text-[10px] sm:text-xs">
            <div className="flex items-center text-amber-500">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
              <span className="ml-1 font-bold text-slate-900 tabular-nums">
                {product.rating}
              </span>
            </div>
            <span className="text-slate-400 text-[10px] sm:text-[11px]">
              ({product.reviewsCount})
            </span>
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="pt-2 sm:pt-3 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2 mb-2 sm:mb-3">
            <span className="text-xs sm:text-base font-extrabold text-slate-950 font-mono tabular-nums leading-tight">
              Rs. {product.price.toLocaleString()}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-[9px] sm:text-xs text-slate-400 line-through font-mono tabular-nums">
                Rs. {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => addToCart(product, product.variants[0] || undefined, 1)}
              className="grow bg-slate-900 hover:bg-cyan-600 active:scale-[0.98] text-white py-1.5 sm:py-2 px-2 sm:px-3 rounded-xl text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1 sm:gap-1.5 transition-colors shadow-xs"
            >
              <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span className="truncate">Add to Bag</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
