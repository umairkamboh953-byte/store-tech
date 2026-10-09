import React, { useState, useMemo } from 'react';
import { useStore } from '../../../context/StoreContext';
import {
  Package,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Search,
  Plus,
  Minus,
  Save,
  RotateCcw,
  Warehouse,
} from 'lucide-react';
import { Product } from '../../../types';

export const InventoryTab: React.FC = () => {
  const { products, quickUpdateStock, showToast } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [stockStatusFilter, setStockStatusFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');

  // Stock edit tracking
  const [pendingStockEdits, setPendingStockEdits] = useState<Record<string, number>>({});

  const lowStockThresholdDefault = 10;

  const lowStockProducts = useMemo(
    () => products.filter((p) => p.stock > 0 && p.stock <= (p.lowStockThreshold || lowStockThresholdDefault)),
    [products]
  );

  const outOfStockProducts = useMemo(
    () => products.filter((p) => p.stock <= 0),
    [products]
  );

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const threshold = p.lowStockThreshold || lowStockThresholdDefault;
      if (stockStatusFilter === 'in_stock' && p.stock <= threshold) return false;
      if (stockStatusFilter === 'low_stock' && (p.stock > threshold || p.stock === 0)) return false;
      if (stockStatusFilter === 'out_of_stock' && p.stock > 0) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [products, stockStatusFilter, searchQuery]);

  const handleStockChange = (productId: string, val: number) => {
    setPendingStockEdits((prev) => ({
      ...prev,
      [productId]: Math.max(0, val),
    }));
  };

  const handleSaveStock = (productId: string) => {
    const newVal = pendingStockEdits[productId];
    if (newVal !== undefined) {
      quickUpdateStock(productId, newVal);
      setPendingStockEdits((prev) => {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Inventory & Warehouse Management</h1>
          <p className="text-xs text-slate-400">
            Real-time stock audit, replenishment thresholds, and warehouse dispatch metrics.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Warehouse className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-300 font-semibold">Lahore & Karachi Hubs</span>
        </div>
      </div>

      {/* Low Stock Warning Banner */}
      {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
        <div className="bg-amber-950/40 border border-amber-800/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white text-sm">Replenishment Alert:</p>
              <p className="text-amber-300/90 mt-0.5">
                {outOfStockProducts.length} items out of stock and {lowStockProducts.length} items below safe operating inventory threshold (10 units).
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setStockStatusFilter('low_stock')}
              className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold whitespace-nowrap hover:bg-amber-400"
            >
              Filter Low Stock
            </button>
            <button
              onClick={() => setStockStatusFilter('out_of_stock')}
              className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-bold whitespace-nowrap hover:bg-rose-500"
            >
              Filter Out of Stock
            </button>
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative grow max-w-sm">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search SKU, Product Name, Brand..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {(['all', 'in_stock', 'low_stock', 'out_of_stock'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setStockStatusFilter(mode)}
              className={`px-3 py-1.5 rounded-xl font-semibold capitalize transition-all ${
                stockStatusFilter === mode
                  ? 'bg-cyan-500 text-slate-950 shadow-xs'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {mode.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden overflow-x-auto shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider">
            <tr>
              <th className="p-3.5">Product</th>
              <th className="p-3.5">SKU / Brand</th>
              <th className="p-3.5">Warehouse Hub</th>
              <th className="p-3.5">Current Stock</th>
              <th className="p-3.5">Low Stock Limit</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Quick Stock Adjustment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {filteredProducts.map((p) => {
              const currentVal = pendingStockEdits[p.id] !== undefined ? pendingStockEdits[p.id] : p.stock;
              const threshold = p.lowStockThreshold || lowStockThresholdDefault;
              const isLow = currentVal > 0 && currentVal <= threshold;
              const isOut = currentVal <= 0;
              const hasUnsavedChanges = pendingStockEdits[p.id] !== undefined;

              return (
                <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 flex items-center gap-3">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-lg object-cover bg-slate-800 shrink-0 border border-slate-800"
                    />
                    <div>
                      <span className="font-bold text-white block max-w-xs truncate">
                        {p.name}
                      </span>
                      <span className="text-[11px] text-slate-500 capitalize">
                        {p.category.replace('-', ' ')}
                      </span>
                    </div>
                  </td>

                  <td className="p-3.5 font-mono">
                    <span className="text-cyan-400 font-bold block">{p.sku}</span>
                    <span className="text-slate-400 font-sans">{p.brand}</span>
                  </td>

                  <td className="p-3.5 text-slate-300">Lahore Central Hub</td>

                  <td className="p-3.5 font-mono">
                    <span className="text-base font-bold text-white tabular-nums">
                      {p.stock}
                    </span>
                    <span className="text-slate-500 text-[11px] ml-1">units</span>
                  </td>

                  <td className="p-3.5 font-mono text-slate-400">
                    {threshold} units
                  </td>

                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isOut
                          ? 'bg-rose-950 text-rose-400 border border-rose-800'
                          : isLow
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      }`}
                    >
                      {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'Optimal'}
                    </span>
                  </td>

                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="flex items-center border border-slate-700 bg-slate-950 rounded-xl overflow-hidden">
                        <button
                          type="button"
                          onClick={() => handleStockChange(p.id, currentVal - 1)}
                          className="px-2.5 py-1 text-slate-400 hover:text-white hover:bg-slate-800 font-bold"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={currentVal}
                          onChange={(e) => handleStockChange(p.id, Number(e.target.value))}
                          className="w-14 text-center bg-transparent text-white font-mono font-bold text-xs outline-hidden"
                        />
                        <button
                          type="button"
                          onClick={() => handleStockChange(p.id, currentVal + 1)}
                          className="px-2.5 py-1 text-slate-400 hover:text-white hover:bg-slate-800 font-bold"
                        >
                          +
                        </button>
                      </div>

                      {hasUnsavedChanges && (
                        <button
                          type="button"
                          onClick={() => handleSaveStock(p.id)}
                          className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all flex items-center gap-1 shadow-sm"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
