import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  User,
  Package,
  Heart,
  MapPin,
  Settings,
  LogOut,
  ChevronRight,
  Truck,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { Order } from '../../types';
import { sanitizeImageUrl, PHONE_IMAGE } from '../../data/mockData';

export const CustomerAccountPage: React.FC = () => {
  const {
    activeUser,
    orders,
    customerLogout,
    navigateTo,
    showToast,
    wishlistCount,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses' | 'settings'>('orders');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  if (!activeUser) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Please Sign In</h2>
        <p className="text-xs text-slate-500 mb-4">
          Sign in to access your order history and account dashboard.
        </p>
        <button
          onClick={() => navigateTo('home')}
          className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold"
        >
          Return to Home
        </button>
      </div>
    );
  }

  // Find user orders (by email or demo user)
  const userOrders = orders.filter(
    (o) =>
      o.customer.email.toLowerCase() === activeUser.email.toLowerCase() ||
      o.customer.fullName.toLowerCase().includes(activeUser.name.toLowerCase().split(' ')[0])
  );

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 mb-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-slate-900 text-cyan-400 font-extrabold text-xl flex items-center justify-center shrink-0">
              {activeUser.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">{activeUser.name}</h1>
                <span className="text-[10px] font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-full">
                  Verified Customer
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{activeUser.email} · {activeUser.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateTo('wishlist')}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
            >
              <Heart className="w-4 h-4 text-rose-500" />
              <span>Wishlist ({wishlistCount})</span>
            </button>
            <button
              onClick={customerLogout}
              className="px-4 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200/90 p-3 shadow-xs space-y-1">
            <button
              onClick={() => {
                setActiveTab('orders');
                setSelectedOrderDetails(null);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'orders'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>My Orders</span>
              <span className="ml-auto text-[10px] opacity-75 font-mono">
                ({userOrders.length})
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('profile');
                setSelectedOrderDetails(null);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'profile'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <User className="w-4 h-4" />
              <span>My Profile</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('addresses');
                setSelectedOrderDetails(null);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'addresses'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Saved Addresses</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('settings');
                setSelectedOrderDetails(null);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'settings'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Account Settings</span>
            </button>

            <div className="pt-3 border-t border-slate-100">
              <button
                onClick={() => navigateTo('admin')}
                className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold text-slate-700 bg-slate-100/70 hover:bg-cyan-50 hover:text-cyan-800 transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-cyan-600" />
                  <span>Admin Operations</span>
                </span>
                <span className="text-[10px] bg-cyan-100 text-cyan-800 px-1.5 py-0.5 rounded font-mono font-bold">Portal</span>
              </button>
            </div>
          </div>

          {/* Main Body */}
          <div className="lg:col-span-9 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <h2 className="text-base font-bold text-slate-900">
                    Order History & Status
                  </h2>
                  <span className="text-xs text-slate-500">
                    Total: {userOrders.length} orders
                  </span>
                </div>

                {userOrders.length > 0 ? (
                  <div className="space-y-4">
                    {userOrders.map((order) => (
                      <div
                        key={order.id}
                        className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200/70 gap-2 text-xs">
                          <div className="flex items-center gap-3">
                            <span className="font-mono font-bold text-slate-900 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                              {order.id}
                            </span>
                            <span className="text-slate-500">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`font-bold px-2.5 py-0.5 rounded-md text-[11px] ${
                                order.orderStatus === 'Delivered'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : order.orderStatus === 'Payment Verification'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-cyan-100 text-cyan-800'
                              }`}
                            >
                              {order.orderStatus}
                            </span>
                            <span className="text-[11px] text-slate-500 font-medium">
                              Payment: {order.paymentStatus}
                            </span>
                          </div>
                        </div>

                        {/* Order Items Summary */}
                        <div className="space-y-2">
                          {order.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between text-xs"
                            >
                              <div className="flex items-center gap-2.5">
                                <img
                                  src={sanitizeImageUrl(item.image) || PHONE_IMAGE}
                                  alt={item.productName}
                                  onError={(e) => {
                                    if (e.currentTarget.src !== PHONE_IMAGE) {
                                      e.currentTarget.src = PHONE_IMAGE;
                                    }
                                  }}
                                  referrerPolicy="no-referrer"
                                  className="w-10 h-10 rounded-lg object-cover bg-white shrink-0 border border-slate-200"
                                />
                                <div>
                                  <p className="font-bold text-slate-900">
                                    {item.productName}
                                  </p>
                                  {item.variantName && (
                                    <p className="text-[11px] text-slate-400">
                                      {item.variantName}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <span className="font-mono tabular-nums font-semibold text-slate-800">
                                {item.quantity} × Rs. {item.price.toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Order Footer & Actions */}
                        <div className="pt-3 border-t border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                          <div>
                            <span className="text-slate-500">Total Bill: </span>
                            <strong className="text-slate-950 font-mono text-sm">
                              Rs. {order.total.toLocaleString()}
                            </strong>
                            <span className="text-slate-400 ml-2">
                              via {order.paymentMethod.toUpperCase()}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => navigateTo('order-tracking')}
                              className="px-3.5 py-1.5 bg-slate-900 text-white rounded-xl font-semibold hover:bg-cyan-600 transition-colors flex items-center gap-1"
                            >
                              <Truck className="w-3.5 h-3.5" />
                              <span>Track Package</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 py-8 text-center">
                    No orders placed yet. Explore the shop to place your first tech order!
                  </p>
                )}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
                  Customer Profile
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Full Name</label>
                    <p className="p-3 bg-slate-50 rounded-xl font-bold text-slate-900 border border-slate-100">
                      {activeUser.name}
                    </p>
                  </div>
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Email Address</label>
                    <p className="p-3 bg-slate-50 rounded-xl font-bold text-slate-900 border border-slate-100">
                      {activeUser.email}
                    </p>
                  </div>
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Phone Number</label>
                    <p className="p-3 bg-slate-50 rounded-xl font-bold text-slate-900 border border-slate-100">
                      {activeUser.phone}
                    </p>
                  </div>
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Account Role</label>
                    <p className="p-3 bg-slate-50 rounded-xl font-bold text-cyan-700 capitalize border border-slate-100">
                      {activeUser.role} (PTA Verified)
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Saved Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h2 className="text-base font-bold text-slate-900">Saved Addresses</h2>
                  <button
                    onClick={() => showToast('Address manager ready.')}
                    className="text-xs font-semibold text-cyan-600 hover:underline"
                  >
                    + Add New Address
                  </button>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">Default Delivery Address</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                      Primary
                    </span>
                  </div>
                  <p className="text-slate-700 pt-1">House #42, Street 8, Phase 5 DHA</p>
                  <p className="text-slate-500">Lahore, Punjab (54792) · Pakistan</p>
                  <p className="text-slate-500">Contact: {activeUser.phone}</p>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
                  Account Preferences
                </h2>
                <div className="space-y-3 text-xs">
                  <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/50 cursor-pointer">
                    <input type="checkbox" defaultChecked className="h-4 w-4 text-cyan-600 rounded-sm" />
                    <span>Receive SMS tracking notifications for order updates</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/50 cursor-pointer">
                    <input type="checkbox" defaultChecked className="h-4 w-4 text-cyan-600 rounded-sm" />
                    <span>Subscribe to flash discounts and new arrival alerts</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
