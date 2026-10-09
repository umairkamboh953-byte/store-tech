import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Tag,
} from 'lucide-react';
import { sanitizeImageUrl, PHONE_IMAGE } from '../../data/mockData';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    cartCount,
    cartSubtotal,
    updateCartQuantity,
    removeFromCart,
    navigateTo,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    settings,
  } = useStore();

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = applyCoupon(couponCode);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError('');
      setCouponCode('');
    }
  };

  const discountAmount = appliedCoupon
    ? appliedCoupon.discountType === 'percentage'
      ? Math.min(
          Math.round((cartSubtotal * appliedCoupon.discountValue) / 100),
          appliedCoupon.maxDiscount || Infinity
        )
      : appliedCoupon.discountValue
    : 0;

  const isFreeDelivery = cartSubtotal >= settings.freeDeliveryThreshold;
  const deliveryFee = isFreeDelivery || cartSubtotal === 0 ? 0 : settings.standardDeliveryFee;
  const finalTotal = Math.max(0, cartSubtotal - discountAmount + deliveryFee);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-slate-900" />
            <h2 className="font-bold text-base text-slate-900">Your Shopping Bag</h2>
            <span className="text-xs font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-full tabular-nums">
              {cartCount} items
            </span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery Meter */}
        <div className="p-3 bg-slate-50 border-b border-slate-100 text-xs">
          {cartSubtotal >= settings.freeDeliveryThreshold ? (
            <p className="text-emerald-700 font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>You've unlocked Free Nationwide Express Delivery!</span>
            </p>
          ) : (
            <div>
              <p className="text-slate-600 mb-1.5">
                Add{' '}
                <strong className="text-slate-900 font-mono">
                  Rs. {(settings.freeDeliveryThreshold - cartSubtotal).toLocaleString()}
                </strong>{' '}
                more to unlock Free Express Delivery.
              </p>
              <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-500 rounded-full transition-all"
                  style={{
                    width: `${Math.min(
                      100,
                      (cartSubtotal / settings.freeDeliveryThreshold) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Cart Items List */}
        <div className="grow overflow-y-auto p-4 space-y-4">
          {cart.length > 0 ? (
            cart.map((item) => {
              const unitPrice =
                item.product.price + (item.selectedVariant?.priceDelta || 0);
              const lineTotal = unitPrice * item.quantity;

              return (
                <div
                  key={`${item.product.id}-${item.selectedVariant?.id || 'def'}`}
                  className="flex gap-3 p-3 rounded-2xl border border-slate-100 bg-slate-50/50"
                >
                  <img
                    src={sanitizeImageUrl(item.product?.images?.[0]) || PHONE_IMAGE}
                    alt={item.product?.name || 'Product'}
                    onError={(e) => {
                      if (e.currentTarget.src !== PHONE_IMAGE) {
                        e.currentTarget.src = PHONE_IMAGE;
                      }
                    }}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-xl object-cover bg-white shrink-0 border border-slate-200/60"
                  />
                  <div className="grow min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() =>
                            removeFromCart(item.product.id, item.selectedVariant?.id)
                          }
                          className="text-slate-400 hover:text-rose-500 transition-colors p-0.5"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {item.selectedVariant && (
                        <p className="text-[11px] text-slate-500">
                          {item.selectedVariant.name}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-slate-200 rounded-lg bg-white">
                        <button
                          onClick={() =>
                            updateCartQuantity(
                              item.product.id,
                              item.quantity - 1,
                              item.selectedVariant?.id
                            )
                          }
                          className="p-1 text-slate-600 hover:bg-slate-100 rounded-l-md"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold font-mono tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateCartQuantity(
                              item.product.id,
                              item.quantity + 1,
                              item.selectedVariant?.id
                            )
                          }
                          className="p-1 text-slate-600 hover:bg-slate-100 rounded-r-md"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-bold font-mono tabular-nums text-slate-900">
                        Rs. {lineTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-16 space-y-3">
              <div className="h-16 w-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 stroke-1" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Your bag is empty</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Explore our store to discover the latest flagship phones, earbuds, and accessories.
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigateTo('shop');
                }}
                className="mt-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-cyan-600 transition-colors"
              >
                Start Shopping
              </button>
            </div>
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-white space-y-4">
            {/* Promo Code Input */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                  <span className="font-semibold text-emerald-800 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    Coupon: <strong>{appliedCoupon.code}</strong> applied (-Rs.{' '}
                    {discountAmount.toLocaleString()})
                  </span>
                  <button
                    onClick={removeCoupon}
                    className="text-xs font-bold text-emerald-700 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value);
                      setCouponError('');
                    }}
                    placeholder="Enter coupon (e.g. TECH10)"
                    className="grow px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 uppercase focus:outline-hidden focus:border-cyan-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium">{couponError}</p>
              )}
            </div>

            {/* Calculations */}
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums text-slate-900 font-semibold">
                  Rs. {cartSubtotal.toLocaleString()}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span className="font-mono tabular-nums font-semibold">
                    - Rs. {discountAmount.toLocaleString()}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Standard Delivery</span>
                <span className="font-mono tabular-nums text-slate-900 font-semibold">
                  {deliveryFee === 0 ? 'FREE' : `Rs. ${deliveryFee}`}
                </span>
              </div>

              <div className="flex justify-between text-sm font-black text-slate-950 pt-2 border-t border-slate-100">
                <span>Total Amount</span>
                <span className="font-mono tabular-nums">
                  Rs. {finalTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={() => {
                setIsCartOpen(false);
                navigateTo('checkout');
              }}
              className="w-full bg-slate-900 hover:bg-cyan-600 text-white font-bold py-3.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-slate-900/10 active:scale-[0.99]"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
