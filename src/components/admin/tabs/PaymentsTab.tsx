import React, { useState, useMemo } from 'react';
import { useStore } from '../../../context/StoreContext';
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  Eye,
  X,
  DollarSign,
  Clock,
  ShieldCheck,
  Building2,
  Smartphone,
} from 'lucide-react';
import { Order, PaymentMethodType } from '../../../types';

export const PaymentsTab: React.FC = () => {
  const { orders, approvePayment, rejectPayment, showToast } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedProofOrder, setSelectedProofOrder] = useState<Order | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Extract payment records from orders
  const paymentRecords = useMemo(() => {
    return orders.map((o) => ({
      paymentId: `PAY-${o.id.replace('ST-2026-', '')}`,
      orderId: o.id,
      customerName: o.customer.fullName,
      customerPhone: o.customer.phone,
      method: o.paymentMethod,
      amount: o.total,
      date: o.createdAt,
      paymentStatus: o.paymentStatus,
      orderStatus: o.orderStatus,
      proof: o.paymentProof,
      rawOrder: o,
    }));
  }, [orders]);

  // Filtered
  const filteredRecords = useMemo(() => {
    return paymentRecords.filter((r) => {
      if (methodFilter !== 'all' && r.method !== methodFilter) return false;
      if (statusFilter !== 'all' && r.paymentStatus !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = r.paymentId.toLowerCase().includes(q);
        const matchOrder = r.orderId.toLowerCase().includes(q);
        const matchName = r.customerName.toLowerCase().includes(q);
        const matchTid = r.proof?.transactionId?.toLowerCase().includes(q);
        if (!matchId && !matchOrder && !matchName && !matchTid) return false;
      }
      return true;
    });
  }, [paymentRecords, searchQuery, methodFilter, statusFilter]);

  // Aggregate Metrics
  const totalVerifiedAmount = useMemo(() => {
    return orders
      .filter((o) => o.paymentStatus === 'Verified')
      .reduce((sum, o) => sum + o.total, 0);
  }, [orders]);

  const pendingVerificationAmount = useMemo(() => {
    return orders
      .filter((o) => o.paymentStatus === 'Pending' && o.paymentMethod !== 'cod')
      .reduce((sum, o) => sum + o.total, 0);
  }, [orders]);

  const codDueAmount = useMemo(() => {
    return orders
      .filter((o) => o.paymentMethod === 'cod' && o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled')
      .reduce((sum, o) => sum + o.total, 0);
  }, [orders]);

  const handleApprove = (orderId: string) => {
    approvePayment(orderId);
    setSelectedProofOrder(null);
  };

  const handleReject = (orderId: string) => {
    rejectPayment(orderId, rejectReason || 'Transaction ID not verified or illegible slip');
    setSelectedProofOrder(null);
    setRejectReason('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Payment Verification & Ledgers</h1>
          <p className="text-xs text-slate-400">
            Audit bank transfer slips, JazzCash receipts, Easypaisa confirmations, and COD invoices.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Verified Settled Revenue</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black font-mono tabular-nums text-emerald-400">
            Rs. {totalVerifiedAmount.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-400">
            Meezan IBFT, JazzCash & Easypaisa confirmed
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Pending Slip Audits</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black font-mono tabular-nums text-amber-400">
            Rs. {pendingVerificationAmount.toLocaleString()}
          </p>
          <p className="text-[11px] text-amber-400 font-semibold">
            Requires staff proof verification
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Cash on Delivery in Transit</span>
            <CreditCard className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-black font-mono tabular-nums text-white">
            Rs. {codDueAmount.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-400">
            Due upon courier package handover
          </p>
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
            placeholder="Search Payment ID, Order, TID, Customer..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 capitalize"
          >
            <option value="all">All Payment Methods</option>
            <option value="cod">Cash on Delivery</option>
            <option value="bank_transfer">Direct Bank Transfer</option>
            <option value="jazzcash">JazzCash Mobile</option>
            <option value="easypaisa">Easypaisa Wallet</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300"
          >
            <option value="all">All Payment Statuses</option>
            <option value="Verified">Verified</option>
            <option value="Pending">Pending Audit</option>
            <option value="Failed">Rejected / Failed</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden overflow-x-auto shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider">
            <tr>
              <th className="p-3.5">Payment ID</th>
              <th className="p-3.5">Order ID</th>
              <th className="p-3.5">Customer</th>
              <th className="p-3.5">Method</th>
              <th className="p-3.5">Amount (PKR)</th>
              <th className="p-3.5">Date</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {filteredRecords.map((r) => (
              <tr key={r.paymentId} className="hover:bg-slate-800/40 transition-colors">
                <td className="p-3.5 font-mono font-bold text-white">{r.paymentId}</td>
                <td className="p-3.5 font-mono text-cyan-400 font-semibold">{r.orderId}</td>
                <td className="p-3.5">
                  <span className="font-semibold text-white block">{r.customerName}</span>
                  <span className="text-[11px] text-slate-500">{r.customerPhone}</span>
                </td>
                <td className="p-3.5 uppercase text-[11px] font-bold text-slate-300">
                  {r.method.replace('_', ' ')}
                  {r.proof?.transactionId && (
                    <span className="block text-[10px] text-cyan-400 font-mono font-normal">
                      TID: {r.proof.transactionId}
                    </span>
                  )}
                </td>
                <td className="p-3.5 font-mono font-bold text-white tabular-nums">
                  Rs. {r.amount.toLocaleString()}
                </td>
                <td className="p-3.5 text-slate-400">
                  {new Date(r.date).toLocaleDateString()}
                </td>
                <td className="p-3.5">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      r.paymentStatus === 'Verified'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : r.paymentStatus === 'Failed'
                        ? 'bg-rose-950 text-rose-400 border border-rose-800'
                        : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}
                  >
                    {r.paymentStatus}
                  </span>
                </td>
                <td className="p-3.5 text-right">
                  {r.method !== 'cod' ? (
                    <button
                      onClick={() => setSelectedProofOrder(r.rawOrder)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-white font-bold transition-colors inline-flex items-center gap-1.5 shadow-xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Audit Slip</span>
                    </button>
                  ) : (
                    <span className="text-slate-500 text-[11px]">COD Handover</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAYMENT AUDIT & PROOF MODAL */}
      {selectedProofOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs"
            onClick={() => setSelectedProofOrder(null)}
          />
          <div className="relative bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl z-10 text-white space-y-5 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white font-mono">
                  Audit Payment: Order #{selectedProofOrder.id}
                </h3>
                <span className="text-slate-400 text-[11px]">
                  Method: {selectedProofOrder.paymentMethod.toUpperCase()} · Rs. {selectedProofOrder.total.toLocaleString()}
                </span>
              </div>
              <button
                onClick={() => setSelectedProofOrder(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1 font-mono text-[11px]">
              <p className="text-slate-400">Customer: <strong className="text-white">{selectedProofOrder.customer.fullName}</strong></p>
              <p className="text-slate-400">Phone: <strong className="text-white">{selectedProofOrder.customer.phone}</strong></p>
              <p className="text-slate-400">
                Transaction ID (TID):{' '}
                <span className="text-cyan-400 font-bold">{selectedProofOrder.paymentProof?.transactionId || 'Not provided'}</span>
              </p>
              <p className="text-slate-400">
                Sender Account: <span className="text-white">{selectedProofOrder.paymentProof?.accountSender || 'N/A'}</span>
              </p>
              <p className="text-slate-400">
                Time Submitted: <span className="text-white">{selectedProofOrder.paymentProof?.submittedAt || 'N/A'}</span>
              </p>
            </div>

            {selectedProofOrder.paymentProof?.receiptUrl ? (
              <div className="space-y-1">
                <span className="text-slate-400 block font-semibold">Attached Slip Screenshot:</span>
                <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950 p-2 flex items-center justify-center">
                  <img
                    src={selectedProofOrder.paymentProof.receiptUrl}
                    alt="Receipt Slip"
                    className="max-h-60 rounded object-contain"
                  />
                </div>
              </div>
            ) : (
              <div className="p-3 bg-slate-950 rounded-xl text-slate-400 text-center border border-slate-800">
                No screenshot file was attached; verified using Transaction ID reference.
              </div>
            )}

            <div>
              <label className="block text-slate-400 mb-1">Rejection Reason (if invalid):</label>
              <input
                type="text"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Transaction ID not found on Meezan Bank statement"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => handleApprove(selectedProofOrder.id)}
                className="w-1/2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-emerald-600/20"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve Payment</span>
              </button>

              <button
                onClick={() => handleReject(selectedProofOrder.id)}
                className="w-1/2 py-3 bg-rose-950 border border-rose-800 text-rose-300 hover:bg-rose-900 font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject Payment</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
