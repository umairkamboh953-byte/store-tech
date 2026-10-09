import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { sanitizeImageUrl, PHONE_IMAGE } from '../../data/mockData';

export const WishlistPage: React.FC = () => {
  const {
    wishlist,
    products,
    removeFromWishlist,
    moveWishlistToCart,
    navigateTo,
    clearCart,
  } = useStore();

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  if (wishlistProducts.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-16 bg-slate-50">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 text-center space-y-4 shadow-xs">
          <div className="h-16 w-16 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center">
            <Heart className="w-8 h-8 stroke-1" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Your Wishlist is Empty</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Save items you love by tapping the heart icon on any product card.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigateTo('shop')}
              className="px-6 py-3 bg-slate-900 hover:bg-cyan-600 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
            >
              Discover Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              My Wishlist
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {wishlistProducts.length} saved products in your collection
            </p>
          </div>
          <button
            onClick={() => navigateTo('shop')}
            className="text-xs font-semibold text-slate-600 hover:text-cyan-600 flex items-center gap-1"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Wishlist Grid - 2 cols on mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
          {wishlistProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs flex flex-col justify-between group hover:shadow-lg transition-all w-full min-w-0"
            >
              <div className="relative aspect-4/3 bg-slate-100 overflow-hidden shrink-0">
                <img
                  src={sanitizeImageUrl(product.images?.[0]) || PHONE_IMAGE}
                  alt={product.name}
                  onError={(e) => {
                    if (e.currentTarget.src !== PHONE_IMAGE) {
                      e.currentTarget.src = PHONE_IMAGE;
                    }
                  }}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute top-2 sm:top-3 right-2 sm:right-3 h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-white/90 text-slate-400 hover:text-rose-500 hover:bg-white flex items-center justify-center shadow-xs transition-colors"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-2.5 sm:p-4 flex flex-col grow justify-between">
                <div>
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-cyan-600 block mb-0.5 truncate">
                    {product.brand}
                  </span>
                  <h3
                    onClick={() => navigateTo('product', { productId: product.id })}
                    className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-2 hover:text-cyan-600 cursor-pointer transition-colors mb-1.5 leading-snug min-h-[2rem] sm:min-h-auto"
                  >
                    {product.name}
                  </h3>

                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2 mb-2 sm:mb-3">
                    <span className="text-xs sm:text-base font-black text-slate-950 font-mono tabular-nums leading-tight">
                      Rs. {product.price.toLocaleString()}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-[9px] sm:text-xs text-slate-400 line-through font-mono tabular-nums">
                        Rs. {product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => moveWishlistToCart(product.id)}
                  className="w-full bg-slate-900 hover:bg-cyan-600 text-white font-bold py-1.5 sm:py-2 px-2 sm:px-3 rounded-xl text-[11px] sm:text-xs flex items-center justify-center gap-1 sm:gap-1.5 transition-colors shadow-xs"
                >
                  <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Move to Bag</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
