import React, { useState, useMemo } from 'react';
import { useStore } from '../../../context/StoreContext';
import {
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  RotateCcw,
  X,
  CreditCard,
  MapPin,
  Package,
  Calendar,
  AlertCircle,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { Order, OrderStatus, PaymentMethodType } from '../../../types';

interface OrdersTabProps {
  initialSelectedOrder?: Order | null;
}

export const OrdersTab: React.FC<OrdersTabProps> = ({ initialSelectedOrder }) => {
  const {
    orders,
    updateOrderStatus,
    verifyOrderPaymentProof,
    showToast,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'total_high' | 'total_low'>('newest');

  // Selected Order for Full Modal
  const [activeOrder, setActiveOrder] = useState<Order | null>(initialSelectedOrder || null);
  const [customTrackingNo, setCustomTrackingNo] = useState('');

  const allStatuses: OrderStatus[] = [
    'Pending',
    'Payment Verification',
    'Confirmed',
    'Processing',
    'Shipped',
    'Out for Delivery',
    'Delivered',
    'Cancelled',
    'Returned',
  ];

  // Filter & sort logic
  const filteredOrders = useMemo(() => {
    return orders
      .filter((o) => {
        if (statusFilter !== 'all' && o.orderStatus !== statusFilter) return false;
        if (paymentFilter !== 'all' && o.paymentMethod !== paymentFilter) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchId = o.id.toLowerCase().includes(q);
          const matchCust = o.customer.fullName.toLowerCase().includes(q);
          const matchPhone = o.customer.phone.includes(q);
          const matchCity = o.customer.city.toLowerCase().includes(q);
          if (!matchId && !matchCust && !matchPhone && !matchCity) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        if (sortBy === 'total_high') return b.total - a.total;
        if (sortBy === 'total_low') return a.total - b.total;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [orders, searchQuery, statusFilter, paymentFilter, sortBy]);

  const handleUpdateStatus = (status: OrderStatus) => {
    if (!activeOrder) return;
    updateOrderStatus(activeOrder.id, status, customTrackingNo || activeOrder.trackingNumber);
    setActiveOrder((prev) => (prev ? { ...prev, orderStatus: status, trackingNumber: customTrackingNo || prev.trackingNumber } : null));
  };

  const handleSaveTracking = () => {
    if (!activeOrder || !customTrackingNo.trim()) return;
    updateOrderStatus(activeOrder.id, activeOrder.orderStatus, customTrackingNo.trim());
    setActiveOrder((prev) => (prev ? { ...prev, trackingNumber: customTrackingNo.trim() } : null));
    showToast(`Courier tracking number ${customTrackingNo} saved.`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Order Pipeline & Logistics</h1>
          <p className="text-xs text-slate-400">
            Audit payments, process dispatch status, and manage courier tracking for nationwide packages.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Total:</span>
          <span className="font-mono font-bold text-cyan-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
            {filteredOrders.length} Orders
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative grow max-w-sm">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Order ID, Customer, Phone, City..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300"
          >
            <option value="all">All Order Statuses</option>
            {allStatuses.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          {/* Payment Method Filter */}
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 capitalize"
          >
            <option value="all">All Payment Methods</option>
            <option value="cod">Cash on Delivery</option>
            <option value="bank_transfer">Bank Transfer (IBFT)</option>
            <option value="jazzcash">JazzCash</option>
            <option value="easypaisa">Easypaisa</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="total_high">Highest Amount</option>
            <option value="total_low">Lowest Amount</option>
          </select>

          {(searchQuery || statusFilter !== 'all' || paymentFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setPaymentFilter('all');
              }}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              title="Reset Filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden overflow-x-auto shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider">
            <tr>
              <th className="p-3.5">Order ID</th>
              <th className="p-3.5">Customer & City</th>
              <th className="p-3.5">Date</th>
              <th className="p-3.5">Items Summary</th>
              <th className="p-3.5">Total (PKR)</th>
              <th className="p-3.5">Payment</th>
              <th className="p-3.5">Order Status</th>
              <th className="p-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {filteredOrders.map((o) => (
              <tr key={o.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="p-3.5 font-mono font-bold text-white">
                  <span>{o.id}</span>
                  {o.trackingNumber && (
                    <span className="block text-[10px] text-cyan-400 font-normal">
                      Trk: {o.trackingNumber}
                    </span>
                  )}
                </td>

                <td className="p-3.5">
                  <span className="font-semibold text-white block">{o.customer.fullName}</span>
                  <span className="text-[11px] text-slate-400">
                    {o.customer.city} · {o.customer.phone}
                  </span>
                </td>

                <td className="p-3.5 text-slate-400 whitespace-nowrap">
                  {new Date(o.createdAt).toLocaleDateString()}
                </td>

                <td className="p-3.5">
                  <span className="text-slate-300 font-medium">
                    {o.items.length} {o.items.length === 1 ? 'item' : 'items'}
                  </span>
                  <span className="block text-[11px] text-slate-500 max-w-xs truncate">
                    {o.items.map((i) => i.productName).join(', ')}
                  </span>
                </td>

                <td className="p-3.5 font-mono font-bold text-white tabular-nums">
                  Rs. {o.total.toLocaleString()}
                </td>

                <td className="p-3.5">
                  <span className="uppercase text-[11px] font-bold block text-slate-200">
                    {o.paymentMethod.replace('_', ' ')}
                  </span>
                  <span
                    className={`text-[10px] font-semibold ${
                      o.paymentStatus === 'Verified' ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    {o.paymentStatus}
                  </span>
                </td>

                <td className="p-3.5">
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${
                      o.orderStatus === 'Delivered'
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                        : o.orderStatus === 'Payment Verification'
                        ? 'bg-amber-950 text-amber-400 border-amber-800'
                        : o.orderStatus === 'Confirmed'
                        ? 'bg-cyan-950 text-cyan-400 border-cyan-800'
                        : o.orderStatus === 'Cancelled'
                        ? 'bg-rose-950 text-rose-400 border-rose-800'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {o.orderStatus}
                  </span>
                </td>

                <td className="p-3.5 text-right">
                  <button
                    onClick={() => {
                      setActiveOrder(o);
                      setCustomTrackingNo(o.trackingNumber || '');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-200 font-bold transition-colors inline-flex items-center gap-1.5 text-xs shadow-xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Details</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FULL ORDER DETAILS MODAL */}
      {activeOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs"
            onClick={() => setActiveOrder(null)}
          />
          <div className="relative bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl z-10 max-h-[92vh] overflow-y-auto space-y-6 text-white text-xs">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="text-base font-bold text-white font-mono">
                    Order #{activeOrder.id}
                  </h3>
                  <span className="bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold px-2 py-0.5 rounded text-[10px]">
                    {activeOrder.orderStatus}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Placed on {new Date(activeOrder.createdAt).toLocaleString()} · Delivery: {activeOrder.deliveryType.toUpperCase()}
                </p>
              </div>
              <button
                onClick={() => setActiveOrder(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Grid 1: Customer Information & Delivery Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                <h4 className="font-bold text-cyan-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Customer & Shipping Address</span>
                </h4>
                <p className="font-bold text-white text-sm">{activeOrder.customer.fullName}</p>
                <p className="text-slate-400">Phone: <strong className="text-slate-200">{activeOrder.customer.phone}</strong></p>
                <p className="text-slate-400">Email: {activeOrder.customer.email}</p>
                <p className="text-slate-300 pt-1 leading-relaxed">{activeOrder.customer.address}</p>
                <p className="text-slate-400">{activeOrder.customer.city}, {activeOrder.customer.province} ({activeOrder.customer.postalCode})</p>
                {activeOrder.customer.notes && (
                  <p className="text-amber-400 pt-1 text-[11px]">Note: "{activeOrder.customer.notes}"</p>
                )}
              </div>

              {/* Courier & Tracking */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="font-bold text-cyan-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5" />
                  <span>Logistics Carrier & Tracking</span>
                </h4>
                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">Carrier Tracking Number (TCS / Leopard / Trax):</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customTrackingNo}
                      onChange={(e) => setCustomTrackingNo(e.target.value)}
                      placeholder="e.g. TCS-98218491"
                      className="grow p-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleSaveTracking}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Estimated Delivery: <strong className="text-white">{activeOrder.estimatedDeliveryDate}</strong>
                </p>
              </div>
            </div>

            {/* Grid 2: Items in Order */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="font-bold text-cyan-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5" />
                <span>Purchased Products ({activeOrder.items.length})</span>
              </h4>
              <div className="divide-y divide-slate-800 max-h-48 overflow-y-auto pr-1">
                {activeOrder.items.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.productName}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-lg object-cover bg-slate-900 shrink-0 border border-slate-800"
                      />
                      <div>
                        <p className="font-bold text-white">{item.productName}</p>
                        {item.variantName && (
                          <p className="text-[11px] text-slate-400">{item.variantName}</p>
                        )}
                        <p className="text-[11px] text-slate-500">
                          Qty: {item.quantity} × Rs. {item.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-white tabular-nums">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Calculations Breakdown */}
              <div className="pt-3 border-t border-slate-800 space-y-1 text-slate-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-white font-semibold">
                    Rs. {activeOrder.subtotal.toLocaleString()}
                  </span>
                </div>
                {activeOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount Coupon ({activeOrder.couponCode})</span>
                    <span className="font-mono font-semibold">
                      - Rs. {activeOrder.discount.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className="font-mono text-white font-semibold">
                    {activeOrder.deliveryFee === 0 ? 'FREE' : `Rs. ${activeOrder.deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-slate-800">
                  <span>Grand Total</span>
                  <span className="font-mono text-cyan-400">
                    Rs. {activeOrder.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Grid 3: Payment Proof Verification */}
            {activeOrder.paymentMethod !== 'cod' ? (
              <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-900/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cyan-400 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                    <CreditCard className="w-4 h-4" />
                    Online Payment Proof Audit ({activeOrder.paymentMethod.toUpperCase()})
                  </span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                      activeOrder.paymentStatus === 'Verified'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}
                  >
                    Payment: {activeOrder.paymentStatus}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 font-mono text-[11px] text-slate-300">
                  <p>Transaction ID: <strong className="text-white">{activeOrder.paymentProof?.transactionId || 'N/A'}</strong></p>
                  <p>Sender Name/Cell: <strong className="text-white">{activeOrder.paymentProof?.accountSender || 'N/A'}</strong></p>
                </div>

                {activeOrder.paymentProof?.receiptUrl && (
                  <div className="pt-2">
                    <p className="text-[11px] text-slate-400 mb-1">Attached Receipt Screenshot:</p>
                    <img
                      src={activeOrder.paymentProof.receiptUrl}
                      alt="Payment Slip Preview"
                      className="max-h-48 rounded-xl border border-slate-800 object-contain bg-slate-900"
                    />
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      verifyOrderPaymentProof(activeOrder.id, true);
                      setActiveOrder((prev) => prev ? { ...prev, paymentStatus: 'Verified', orderStatus: 'Confirmed' } : null);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve Payment & Confirm Order</span>
                  </button>

                  <button
                    onClick={() => {
                      verifyOrderPaymentProof(activeOrder.id, false, 'Invalid Transaction ID / Unreadable slip');
                      setActiveOrder((prev) => prev ? { ...prev, paymentStatus: 'Failed' } : null);
                    }}
                    className="px-4 py-2 bg-rose-950 border border-rose-800 text-rose-300 hover:bg-rose-900 rounded-xl font-bold transition-colors"
                  >
                    Reject Payment Proof
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-400">
                Payment Method: <strong className="text-white">Cash on Delivery (COD)</strong>. Dispatch with invoice slip for rider collection.
              </div>
            )}

            {/* Pipeline Stage Transition Controller */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="block text-slate-300 font-semibold">
                Advance / Update Pipeline Stage:
              </label>
              <div className="flex flex-wrap gap-2">
                {allStatuses.map((st) => (
                  <button
                    key={st}
                    onClick={() => handleUpdateStatus(st)}
                    className={`px-3 py-1.5 rounded-xl font-semibold border transition-all ${
                      activeOrder.orderStatus === st
                        ? 'bg-cyan-500 text-slate-950 border-cyan-500 shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
