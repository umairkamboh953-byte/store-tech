import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Tag,
  ArrowLeft,
  Truck,
} from 'lucide-react';
import { sanitizeImageUrl, PHONE_IMAGE } from '../../data/mockData';

export const CartPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    updateCartQuantity,
    removeFromCart,
    navigateTo,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    settings,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

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

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError('');
      setCouponInput('');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-16 bg-slate-50">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 text-center space-y-4 shadow-xs">
          <div className="h-16 w-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <ShoppingBag className="w-8 h-8 stroke-1" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Your Shopping Bag is Empty</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            You haven't added any products yet. Browse through our flagship tech catalog and discover genuine gadgets.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigateTo('shop')}
              className="px-6 py-3 bg-slate-900 hover:bg-cyan-600 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
            >
              Start Shopping Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              Shopping Cart
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Review your items before proceeding to safe nationwide checkout.
            </p>
          </div>
          <button
            onClick={() => navigateTo('shop')}
            className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-cyan-600 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart Table List */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs">
            <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Products in Bag ({cart.length})
              </span>
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <Truck className="w-3.5 h-3.5" />
                Dispatch within 24h
              </span>
            </div>

            <div className="divide-y divide-slate-100 p-4 sm:p-6 space-y-4 sm:space-y-0">
              {cart.map((item) => {
                const unitPrice =
                  item.product.price + (item.selectedVariant?.priceDelta || 0);
                const lineTotal = unitPrice * item.quantity;

                return (
                  <div
                    key={`${item.product.id}-${item.selectedVariant?.id || 'def'}`}
                    className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={sanitizeImageUrl(item.product?.images?.[0]) || PHONE_IMAGE}
                        alt={item.product?.name || 'Product'}
                        onError={(e) => {
                          if (e.currentTarget.src !== PHONE_IMAGE) {
                            e.currentTarget.src = PHONE_IMAGE;
                          }
                        }}
                        referrerPolicy="no-referrer"
                        className="w-20 h-20 rounded-2xl object-cover bg-slate-100 border border-slate-200/60 shrink-0"
                      />
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-600">
                          {item.product.brand}
                        </span>
                        <h3 className="font-bold text-sm text-slate-900">
                          {item.product.name}
                        </h3>
                        {item.selectedVariant && (
                          <p className="text-xs text-slate-500 mt-0.5">
                            Edition: {item.selectedVariant.name}
                          </p>
                        )}
                        <p className="text-xs font-mono tabular-nums text-slate-700 font-semibold mt-1">
                          Rs. {unitPrice.toLocaleString()} each
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                      {/* Stepper */}
                      <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50">
                        <button
                          onClick={() =>
                            updateCartQuantity(
                              item.product.id,
                              item.quantity - 1,
                              item.selectedVariant?.id
                            )
                          }
                          className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 font-bold"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 py-1.5 text-xs font-bold font-mono tabular-nums">
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
                          className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 font-bold"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Total */}
                      <div className="text-right">
                        <p className="text-sm font-black text-slate-950 font-mono tabular-nums">
                          Rs. {lineTotal.toLocaleString()}
                        </p>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() =>
                          removeFromCart(item.product.id, item.selectedVariant?.id)
                        }
                        className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Summary Column */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-xs sticky top-24">
            <h2 className="text-base font-extrabold text-slate-950 tracking-tight">
              Order Summary
            </h2>

            {/* Promo Code Form */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                  <span className="font-semibold text-emerald-800 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    Coupon <strong>{appliedCoupon.code}</strong> applied (-Rs.{' '}
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
                <form onSubmit={handleCouponSubmit} className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Promo Coupon:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value);
                        setCouponError('');
                      }}
                      placeholder="e.g. TECH10"
                      className="grow px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 uppercase focus:outline-hidden focus:border-cyan-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-[11px] text-rose-600 mt-1">{couponError}</p>
                  )}
                </form>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <div className="flex justify-between">
                <span>Subtotal ({cart.length} items)</span>
                <span className="font-mono tabular-nums text-slate-900 font-semibold">
                  Rs. {cartSubtotal.toLocaleString()}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Coupon Discount</span>
                  <span className="font-mono tabular-nums font-semibold">
                    - Rs. {discountAmount.toLocaleString()}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Nationwide Delivery</span>
                <span className="font-mono tabular-nums text-slate-900 font-semibold">
                  {deliveryFee === 0 ? 'FREE' : `Rs. ${deliveryFee}`}
                </span>
              </div>

              <div className="flex justify-between text-base font-black text-slate-950 pt-3 border-t border-slate-100">
                <span>Total Payable</span>
                <span className="font-mono tabular-nums text-cyan-700">
                  Rs. {finalTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Proceed to Checkout Button */}
            <button
              onClick={() => navigateTo('checkout')}
              className="w-full bg-slate-900 hover:bg-cyan-600 text-white font-bold py-3.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-slate-900/10 active:scale-[0.99]"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Safe payment with JazzCash, Easypaisa, Bank Transfer & COD</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
