import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Star, ShoppingBag, ArrowRight, Check, Shield, Truck } from 'lucide-react';
import { ProductVariant } from '../../types';
import { sanitizeImageUrl, PHONE_IMAGE } from '../../data/mockData';

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, setQuickViewProduct, addToCart, navigateTo } = useStore();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const activeVariant = selectedVariant || product.variants[0];
  const unitPrice = product.price + (activeVariant?.priceDelta || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
        onClick={() => setQuickViewProduct(null)}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 border border-slate-200">
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 text-slate-500 hover:text-slate-900 shadow-xs hover:bg-slate-100 transition-colors"
          aria-label="Close Quick View"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Product Visual */}
          <div className="relative aspect-4/3 md:aspect-auto bg-slate-100 p-6 flex items-center justify-center">
            <img
              src={sanitizeImageUrl(product.images?.[0]) || PHONE_IMAGE}
              alt={product.name}
              onError={(e) => {
                if (e.currentTarget.src !== PHONE_IMAGE) {
                  e.currentTarget.src = PHONE_IMAGE;
                }
              }}
              referrerPolicy="no-referrer"
              className="max-h-80 w-auto object-contain drop-shadow-md"
            />
          </div>

          {/* Right: Info & Actions */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                <span className="font-bold uppercase tracking-wider text-cyan-600">
                  {product.brand}
                </span>
                <span aria-hidden="true">·</span>
                <span>SKU: {product.sku}</span>
              </div>

              <h2 className="text-xl font-bold text-slate-950 mb-2 leading-tight">
                {product.name}
              </h2>

              <div className="flex items-center gap-2 mb-4 text-xs">
                <div className="flex items-center text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="ml-1 font-bold text-slate-900">{product.rating}</span>
                </div>
                <span className="text-slate-400">·</span>
                <span className="text-slate-500 font-medium">{product.reviewsCount} verified reviews</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2.5 mb-4">
                <span className="text-2xl font-black text-slate-950 font-mono tabular-nums">
                  Rs. {unitPrice.toLocaleString()}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-sm text-slate-400 line-through font-mono tabular-nums">
                    Rs. {product.originalPrice.toLocaleString()}
                  </span>
                )}
                {product.discountPercent > 0 && (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Save {product.discountPercent}%
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-5 line-clamp-3">
                {product.shortDescription}
              </p>

              {/* Variants */}
              {product.variants.length > 0 && (
                <div className="mb-5">
                  <label className="block text-xs font-semibold text-slate-800 mb-2">
                    Select Edition / Color:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((variant) => {
                      const isSelected = (activeVariant?.id || '') === variant.id;
                      return (
                        <button
                          key={variant.id}
                          onClick={() => setSelectedVariant(variant)}
                          className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                            isSelected
                              ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                              : 'border-slate-200 text-slate-700 hover:border-slate-400 bg-white'
                          }`}
                        >
                          {variant.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Trust markers */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 mb-6 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                  <span>Fast Delivery Across Pakistan</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{product.warranty}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-2 text-slate-600 hover:bg-slate-200 transition-colors text-sm font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 py-2 text-xs font-bold font-mono tabular-nums text-slate-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3 py-2 text-slate-600 hover:bg-slate-200 transition-colors text-sm font-bold"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => {
                    addToCart(product, activeVariant, quantity);
                    setQuickViewProduct(null);
                  }}
                  className="grow bg-slate-900 hover:bg-cyan-600 text-white font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </button>
              </div>

              <button
                onClick={() => {
                  setQuickViewProduct(null);
                  navigateTo('product', { productId: product.id });
                }}
                className="w-full text-center text-xs font-semibold text-slate-600 hover:text-cyan-600 flex items-center justify-center gap-1.5 transition-colors py-1"
              >
                <span>View Full Specifications & Customer Reviews</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
