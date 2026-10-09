import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../common/ProductCard';
import {
  Star,
  Heart,
  ShoppingBag,
  Truck,
  Shield,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  Send,
  Zap,
} from 'lucide-react';
import { ProductVariant } from '../../types';
import { sanitizeImageUrl, PHONE_IMAGE } from '../../data/mockData';

export const ProductDetailPage: React.FC = () => {
  const {
    selectedProductId,
    products,
    reviews,
    addToCart,
    toggleWishlist,
    isInWishlist,
    navigateTo,
    addReview,
    showToast,
  } = useStore();

  const product = products.find((p) => p.id === selectedProductId) || products[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants[0]
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews' | 'shipping'>('desc');

  // Review Form
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewCity, setNewReviewCity] = useState('Lahore');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-base font-bold text-slate-900">Product not found.</p>
        <button
          onClick={() => navigateTo('shop')}
          className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const activeVariant = selectedVariant || product.variants[0];
  const unitPrice = product.price + (activeVariant?.priceDelta || 0);
  const inWishlist = isInWishlist(product.id);

  const productReviews = reviews.filter((r) => r.productId === product.id);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) {
      showToast('Please fill in your name and review details.', 'error');
      return;
    }
    addReview({
      productId: product.id,
      userName: newReviewAuthor.trim(),
      city: newReviewCity,
      rating: newReviewRating,
      comment: newReviewComment.trim(),
      verifiedPurchase: true,
    });
    setNewReviewAuthor('');
    setNewReviewComment('');
    setNewReviewRating(5);
  };

  const handleBuyNow = () => {
    addToCart(product, activeVariant, quantity);
    navigateTo('checkout');
  };

  // Related products from the same category
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <button onClick={() => navigateTo('home')} className="hover:text-slate-900">
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <button
            onClick={() => navigateTo('shop', { categoryId: product.category })}
            className="hover:text-slate-900 capitalize"
          >
            {product.category.replace('-', ' ')}
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Main Product Section */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left: Product Images Gallery */}
            <div className="lg:col-span-6 space-y-4">
              {/* Main Image Stage */}
              <div className="relative aspect-4/3 rounded-2xl bg-slate-100 overflow-hidden border border-slate-100 flex items-center justify-center p-4">
                <img
                  src={sanitizeImageUrl(product.images[activeImageIndex] || product.images[0]) || PHONE_IMAGE}
                  alt={product.name}
                  onError={(e) => {
                    if (e.currentTarget.src !== PHONE_IMAGE) {
                      e.currentTarget.src = PHONE_IMAGE;
                    }
                  }}
                  referrerPolicy="no-referrer"
                  className="max-h-full max-w-full object-contain drop-shadow-md hover:scale-105 transition-transform duration-300"
                />

                {product.discountPercent > 0 && (
                  <span className="absolute top-4 left-4 bg-slate-900 text-white text-xs font-bold px-2.5 py-1 rounded-md">
                    SAVE {product.discountPercent}%
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`h-20 w-20 rounded-xl bg-slate-100 overflow-hidden border-2 shrink-0 transition-all ${
                        activeImageIndex === idx
                          ? 'border-cyan-600 ring-2 ring-cyan-500/20'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={sanitizeImageUrl(img) || PHONE_IMAGE}
                        alt={`Thumbnail ${idx + 1}`}
                        onError={(e) => {
                          if (e.currentTarget.src !== PHONE_IMAGE) {
                            e.currentTarget.src = PHONE_IMAGE;
                          }
                        }}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Contiguous Purchase Module */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div>
                {/* Meta */}
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                  <span className="font-bold uppercase tracking-wider text-cyan-600">
                    {product.brand}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>SKU: {product.sku}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    In Stock ({product.stock} units in Lahore/Karachi)
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight leading-snug mb-3">
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-3 mb-5 text-xs">
                  <div className="flex items-center text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="ml-1 font-bold text-slate-900 tabular-nums">
                      {product.rating}
                    </span>
                  </div>
                  <span className="text-slate-400">·</span>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className="text-slate-600 hover:text-cyan-600 underline font-medium"
                  >
                    {product.reviewsCount} customer reviews
                  </button>
                </div>

                {/* Price */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-6 flex items-baseline justify-between">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-black text-slate-950 font-mono tabular-nums">
                      Rs. {unitPrice.toLocaleString()}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-sm text-slate-400 line-through font-mono tabular-nums">
                        Rs. {product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-md">
                    Tax & PTA Included
                  </span>
                </div>

                {/* Short Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  {product.shortDescription}
                </p>

                {/* Variants Selection */}
                {product.variants.length > 0 && (
                  <div className="space-y-3 mb-6">
                    <label className="block text-xs font-bold text-slate-900">
                      Select Variant / Color:
                    </label>
                    <div className="flex flex-wrap gap-2.5">
                      {product.variants.map((variant) => {
                        const isSelected = (activeVariant?.id || '') === variant.id;
                        return (
                          <button
                            key={variant.id}
                            onClick={() => setSelectedVariant(variant)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 ${
                              isSelected
                                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                            }`}
                          >
                            {variant.colorHex && (
                              <span
                                className="w-3 h-3 rounded-full border border-white/40"
                                style={{ backgroundColor: variant.colorHex }}
                              />
                            )}
                            <span>{variant.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Quantity & Actions */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3">
                    {/* Stepper */}
                    <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="px-3.5 py-2.5 text-slate-600 hover:bg-slate-200 font-bold"
                      >
                        -
                      </button>
                      <span className="px-4 py-2.5 text-xs font-bold font-mono tabular-nums text-slate-900">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity((q) => q + 1)}
                        className="px-3.5 py-2.5 text-slate-600 hover:bg-slate-200 font-bold"
                      >
                        +
                      </button>
                    </div>

                    {/* Add to Bag */}
                    <button
                      onClick={() => addToCart(product, activeVariant, quantity)}
                      className="grow bg-slate-900 hover:bg-cyan-600 text-white font-bold py-3 px-5 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Shopping Bag</span>
                    </button>

                    {/* Wishlist */}
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className={`p-3 rounded-xl border transition-colors ${
                        inWishlist
                          ? 'border-rose-200 bg-rose-50 text-rose-500'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                      aria-label="Toggle Wishlist"
                    >
                      <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Buy Now Button */}
                  <button
                    onClick={handleBuyNow}
                    className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold py-3 px-5 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-md shadow-cyan-500/10 active:scale-[0.99]"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Buy Now with 1-Click Checkout</span>
                  </button>
                </div>
              </div>

              {/* Pakistani Trust Grid */}
              <div className="grid grid-cols-2 gap-3 pt-6 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>24-48h Delivery in Lahore & Karachi</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{product.warranty}</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>7-Day Replacement Policy</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Cash on Delivery & Bank Transfer</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Specifications, Reviews & Policy Section */}
        <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs">
          {/* Tab Headers */}
          <div className="flex border-b border-slate-200 bg-slate-50/70 overflow-x-auto">
            <button
              onClick={() => setActiveTab('desc')}
              className={`px-6 py-4 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'desc'
                  ? 'border-cyan-600 text-cyan-600 bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Detailed Overview
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`px-6 py-4 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'specs'
                  ? 'border-cyan-600 text-cyan-600 bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Technical Specifications
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-6 py-4 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'reviews'
                  ? 'border-cyan-600 text-cyan-600 bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Customer Reviews ({productReviews.length})
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`px-6 py-4 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'shipping'
                  ? 'border-cyan-600 text-cyan-600 bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Shipping, Warranty & Returns
            </button>
          </div>

          {/* Tab Body */}
          <div className="p-6 sm:p-10">
            {activeTab === 'desc' && (
              <div className="max-w-3xl space-y-4 text-slate-700 text-sm leading-relaxed">
                <h3 className="text-base font-bold text-slate-900">
                  Engineered for Performance & Durability
                </h3>
                <p>{product.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <h4 className="font-bold text-xs text-slate-900 mb-1">Authenticity Guaranteed</h4>
                    <p className="text-xs text-slate-500">
                      Sourced directly from verified global brand distributors. No refurbished or re-boxed stock.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <h4 className="font-bold text-xs text-slate-900 mb-1">PTA Approved Compliance</h4>
                    <p className="text-xs text-slate-500">
                      All cellular enabled products have customs duty cleared and dual IMEI registration active in Pakistan.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="max-w-3xl space-y-6">
                {product.specifications.map((group) => (
                  <div key={group.group}>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                      {group.group}
                    </h4>
                    <div className="border border-slate-200 rounded-2xl divide-y divide-slate-100 overflow-hidden">
                      {group.items.map((item) => (
                        <div key={item.label} className="grid grid-cols-3 p-3.5 text-xs">
                          <span className="font-semibold text-slate-500">{item.label}</span>
                          <span className="col-span-2 text-slate-900 font-medium">
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Reviews List */}
                <div className="lg:col-span-7 space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 mb-2">
                    Verified Customer Feedback
                  </h3>
                  {productReviews.length > 0 ? (
                    productReviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900">
                              {rev.userName}
                            </span>
                            {rev.city && (
                              <span className="text-[11px] text-slate-400">· {rev.city}</span>
                            )}
                            <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold">
                              Verified Purchase
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400">{rev.date}</span>
                        </div>

                        <div className="flex items-center text-amber-400">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 py-4">
                      Be the first Pakistani tech enthusiast to review this item!
                    </p>
                  )}
                </div>

                {/* Write Review Form */}
                <div className="lg:col-span-5 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 mb-4">
                    Leave a Customer Review
                  </h4>
                  <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        Your Full Name:
                      </label>
                      <input
                        type="text"
                        required
                        value={newReviewAuthor}
                        onChange={(e) => setNewReviewAuthor(e.target.value)}
                        placeholder="e.g. Asad Naveed"
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700 mb-1">City:</label>
                      <input
                        type="text"
                        value={newReviewCity}
                        onChange={(e) => setNewReviewCity(e.target.value)}
                        placeholder="e.g. Lahore / Karachi"
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700 mb-1">Rating:</label>
                      <div className="flex gap-2">
                        {[5, 4, 3, 2, 1].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setNewReviewRating(num)}
                            className={`px-3 py-1.5 rounded-lg border text-xs font-bold ${
                              newReviewRating === num
                                ? 'bg-amber-400 text-slate-950 border-amber-400'
                                : 'bg-white border-slate-200 text-slate-600'
                            }`}
                          >
                            {num} ★
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700 mb-1">Your Review:</label>
                      <textarea
                        required
                        rows={3}
                        value={newReviewComment}
                        onChange={(e) => setNewReviewComment(e.target.value)}
                        placeholder="Describe your experience with the build quality, delivery speed, and performance..."
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-slate-900"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-slate-900 hover:bg-cyan-600 text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Review</span>
                    </button>
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="max-w-3xl space-y-5 text-xs text-slate-600 leading-relaxed">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 mb-1">Delivery Across Pakistan</h4>
                  <p>
                    All orders are packed in antistatic shock-absorbing bubble cartons with official security seal tape.
                    We ship daily from our fulfillment hubs in Gulberg Lahore and Clifton Karachi via TCS, Leopard Express, and Trax.
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-slate-700 font-medium">
                    <li>Lahore, Karachi, Islamabad & Rawalpindi: 24 to 48 Hours</li>
                    <li>Faisalabad, Multan, Peshawar, Sialkot, Quetta: 2 to 3 Business Days</li>
                    <li>Free shipping applied on all orders above Rs. 15,000</li>
                  </ul>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <h4 className="font-bold text-sm text-slate-900 mb-1">7-Day Replacement Guarantee</h4>
                  <p>
                    If the product arrives damaged or exhibits any hardware defect within 7 days of delivery, our support team will organize a reverse pickup and supply an instant replacement at zero shipping cost.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6 pt-4">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              Related Technology Products
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
