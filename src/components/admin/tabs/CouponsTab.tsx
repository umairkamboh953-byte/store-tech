import React, { useState } from 'react';
import { useStore } from '../../../context/StoreContext';
import { Tag, Plus, Edit2, Trash2, X, Check, AlertCircle, Copy } from 'lucide-react';
import { Coupon } from '../../../types';

export const CouponsTab: React.FC = () => {
  const { coupons, addCoupon, updateCoupon, deleteCoupon, showToast } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  // Form State
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState(10);
  const [minOrderAmount, setMinOrderAmount] = useState(5000);
  const [maxDiscount, setMaxDiscount] = useState(2500);
  const [startDate, setStartDate] = useState('2026-01-01');
  const [expiryDate, setExpiryDate] = useState('2026-12-31');
  const [usageLimit, setUsageLimit] = useState(500);
  const [isActive, setIsActive] = useState(true);

  const handleOpenAdd = () => {
    setEditingCoupon(null);
    setCode('');
    setDiscountType('percentage');
    setDiscountValue(15);
    setMinOrderAmount(8000);
    setMaxDiscount(3000);
    setStartDate('2026-01-01');
    setExpiryDate('2026-12-31');
    setUsageLimit(500);
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cp: Coupon) => {
    setEditingCoupon(cp);
    setCode(cp.code);
    setDiscountType(cp.discountType);
    setDiscountValue(cp.discountValue);
    setMinOrderAmount(cp.minOrderAmount);
    setMaxDiscount(cp.maxDiscount || 0);
    setStartDate(cp.startDate || '2026-01-01');
    setExpiryDate(cp.expiryDate);
    setUsageLimit(cp.usageLimit);
    setIsActive(cp.isActive);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      showToast('Coupon code is required.', 'error');
      return;
    }

    if (editingCoupon) {
      updateCoupon(editingCoupon.id, {
        code: code.trim().toUpperCase(),
        discountType,
        discountValue: Number(discountValue),
        minOrderAmount: Number(minOrderAmount),
        maxDiscount: Number(maxDiscount),
        startDate,
        expiryDate,
        usageLimit: Number(usageLimit),
        isActive,
      });
    } else {
      addCoupon({
        code: code.trim().toUpperCase(),
        discountType,
        discountValue: Number(discountValue),
        minOrderAmount: Number(minOrderAmount),
        maxDiscount: Number(maxDiscount),
        startDate,
        expiryDate,
        usageLimit: Number(usageLimit),
        isActive,
      });
    }
    setIsModalOpen(false);
  };

  const handleToggleActive = (cp: Coupon) => {
    updateCoupon(cp.id, { isActive: !cp.isActive });
    showToast(`Coupon "${cp.code}" is now ${!cp.isActive ? 'Active' : 'Disabled'}.`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Coupon & Discount Management</h1>
          <p className="text-xs text-slate-400">
            Create promotional coupon codes, percentage reductions, and minimum spend rules.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-lg shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Coupon</span>
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden overflow-x-auto shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider">
            <tr>
              <th className="p-3.5">Code</th>
              <th className="p-3.5">Discount Type</th>
              <th className="p-3.5">Value</th>
              <th className="p-3.5">Min Order</th>
              <th className="p-3.5">Usage / Limit</th>
              <th className="p-3.5">Expiry Date</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {coupons.map((cp) => (
              <tr key={cp.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="p-3.5 font-mono font-bold text-cyan-400 text-sm">
                  {cp.code}
                </td>

                <td className="p-3.5 capitalize text-slate-300">
                  {cp.discountType === 'percentage' ? 'Percentage (%)' : 'Fixed PKR'}
                </td>

                <td className="p-3.5 font-mono font-bold text-white">
                  {cp.discountType === 'percentage' ? `${cp.discountValue}%` : `Rs. ${cp.discountValue.toLocaleString()}`}
                </td>

                <td className="p-3.5 font-mono text-slate-300">
                  Rs. {cp.minOrderAmount.toLocaleString()}
                </td>

                <td className="p-3.5 font-mono">
                  {cp.usedCount} / {cp.usageLimit}
                </td>

                <td className="p-3.5 text-slate-400">{cp.expiryDate}</td>

                <td className="p-3.5">
                  <button
                    onClick={() => handleToggleActive(cp)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
                      cp.isActive
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                        : 'bg-rose-950 text-rose-400 border border-rose-800'
                    }`}
                  >
                    {cp.isActive ? 'Active' : 'Disabled'}
                  </button>
                </td>

                <td className="p-3.5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(cp)}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                      title="Edit coupon"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteCoupon(cp.id)}
                      className="p-1.5 rounded-lg bg-rose-950/60 text-rose-400 hover:bg-rose-900"
                      title="Delete coupon"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl z-10 text-white space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-bold text-sm text-white">
                {editingCoupon ? `Edit Coupon: ${editingCoupon.code}` : 'Create Discount Voucher'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. FLASH25"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed (Rs.)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Value *</label>
                  <input
                    type="number"
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Min Order Amount (PKR)</label>
                  <input
                    type="number"
                    value={minOrderAmount}
                    onChange={(e) => setMinOrderAmount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Max Discount Cap (PKR)</label>
                  <input
                    type="number"
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Usage Limit</label>
                  <input
                    type="number"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
