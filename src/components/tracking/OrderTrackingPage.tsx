import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Search,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  MapPin,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { OrderStatus } from '../../types';

export const OrderTrackingPage: React.FC = () => {
  const { orders, showToast } = useStore();

  const [orderInput, setOrderInput] = useState('ST-2026-9281');
  const [phoneInput, setPhoneInput] = useState('0302-8472911');
  const [searchedOrder, setSearchedOrder] = useState(() => orders[0]);

  const allStatuses: OrderStatus[] = [
    'Pending',
    'Payment Verification',
    'Confirmed',
    'Processing',
    'Shipped',
    'Out for Delivery',
    'Delivered',
  ];

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderInput.trim()) {
      showToast('Please enter an Order ID.', 'error');
      return;
    }

    const cleanId = orderInput.trim().toLowerCase();
    const cleanPhone = phoneInput.trim().replace(/[^0-9]/g, '');

    const found = orders.find(
      (o) =>
        o.id.toLowerCase() === cleanId &&
        (!cleanPhone || o.customer.phone.replace(/[^0-9]/g, '').includes(cleanPhone))
    );

    if (found) {
      setSearchedOrder(found);
      showToast(`Tracking record loaded for Order #${found.id}`);
    } else {
      showToast(
        `No order found with ID "${orderInput}". Check number or try demo orders.`,
        'error'
      );
    }
  };

  const currentStatusIndex = searchedOrder
    ? allStatuses.indexOf(searchedOrder.orderStatus)
    : -1;

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-600">
            Live Shipment Status
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
            Track Your Order
          </h1>
          <p className="text-xs text-slate-500">
            Monitor real-time progress of your technology delivery across Pakistan.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
          <form onSubmit={handleTrack} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-6">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Order ID:
              </label>
              <input
                type="text"
                required
                value={orderInput}
                onChange={(e) => setOrderInput(e.target.value)}
                placeholder="e.g. ST-2026-9281"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono uppercase text-slate-900 focus:outline-hidden focus:border-cyan-500"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number:
              </label>
              <input
                type="text"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="e.g. 0302-8472911"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-cyan-500"
              />
            </div>

            <div className="sm:col-span-2 flex items-end">
              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-cyan-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Track</span>
              </button>
            </div>
          </form>

          {/* Quick Demo Fill Buttons */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Quick Demo Orders:</span>
            {orders.slice(0, 3).map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  setOrderInput(o.id);
                  setPhoneInput(o.customer.phone);
                  setSearchedOrder(o);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-[11px] font-semibold transition-colors"
              >
                {o.id} ({o.orderStatus})
              </button>
            ))}
          </div>
        </div>

        {/* Tracking Details View */}
        {searchedOrder && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xs space-y-8 animate-in fade-in duration-200">
            {/* Top Bar Summary */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900 font-mono">
                    {searchedOrder.id}
                  </h2>
                  <span className="bg-cyan-50 text-cyan-700 font-bold px-2.5 py-0.5 rounded-full text-xs">
                    {searchedOrder.orderStatus}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Placed on {new Date(searchedOrder.createdAt).toLocaleDateString()} · Carrier:{' '}
                  <strong className="text-slate-700">
                    {searchedOrder.trackingNumber || 'TCS Express Air'}
                  </strong>
                </p>
              </div>

              <div className="text-left sm:text-right text-xs">
                <span className="text-slate-400">Estimated Delivery:</span>
                <p className="text-sm font-bold text-slate-900 mt-0.5">
                  {searchedOrder.estimatedDeliveryDate}
                </p>
              </div>
            </div>

            {/* Vertical/Horizontal Status Pipeline */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Shipment Pipeline
              </h3>

              <div className="relative pl-6 sm:pl-0 sm:grid sm:grid-cols-7 gap-2">
                {allStatuses.map((status, index) => {
                  const isCompleted = currentStatusIndex >= index;
                  const isCurrent = currentStatusIndex === index;

                  return (
                    <div
                      key={status}
                      className="relative pb-6 sm:pb-0 sm:text-center flex sm:flex-col items-start sm:items-center gap-3 sm:gap-2"
                    >
                      {/* Circle Indicator */}
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all z-10 shrink-0 ${
                          isCompleted
                            ? 'bg-cyan-500 text-slate-950 shadow-sm shadow-cyan-500/30'
                            : 'bg-slate-100 text-slate-400 border border-slate-200'
                        } ${isCurrent ? 'ring-4 ring-cyan-500/20' : ''}`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <span>{index + 1}</span>
                        )}
                      </div>

                      {/* Line connector */}
                      <div className="hidden sm:block absolute top-4 left-1/2 w-full h-0.5 -z-0 bg-slate-200" />

                      {/* Text */}
                      <div>
                        <p
                          className={`text-xs font-bold ${
                            isCurrent
                              ? 'text-cyan-600'
                              : isCompleted
                              ? 'text-slate-900'
                              : 'text-slate-400'
                          }`}
                        >
                          {status}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Destination & Order Items Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100 text-xs">
              {/* Delivery Address */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-cyan-600" />
                  <span>Delivery Destination</span>
                </h4>
                <p className="font-semibold text-slate-800">
                  {searchedOrder.customer.fullName} ({searchedOrder.customer.phone})
                </p>
                <p className="text-slate-600">{searchedOrder.customer.address}</p>
                <p className="text-slate-500">
                  {searchedOrder.customer.city}, {searchedOrder.customer.province}
                </p>
              </div>

              {/* Items in this parcel */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-cyan-600" />
                  <span>Parcel Contents</span>
                </h4>
                <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
                  {searchedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-slate-700">
                      <span className="truncate max-w-[200px]">
                        {item.quantity}x {item.productName}
                      </span>
                      <span className="font-mono tabular-nums font-semibold shrink-0">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900">
                  <span>Total Amount Paid/Due:</span>
                  <span className="font-mono tabular-nums">
                    Rs. {searchedOrder.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
