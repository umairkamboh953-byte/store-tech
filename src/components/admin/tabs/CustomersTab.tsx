import React, { useState, useMemo } from 'react';
import { useStore } from '../../../context/StoreContext';
import {
  Users,
  Search,
  Eye,
  ShieldAlert,
  ShieldCheck,
  MapPin,
  Package,
  Calendar,
  X,
  Phone,
  Mail,
  Ban,
  CheckCircle,
} from 'lucide-react';
import { Order } from '../../../types';

interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  registeredDate: string;
  orderCount: number;
  totalSpent: number;
  isBlocked: boolean;
  orders: Order[];
}

export const CustomersTab: React.FC = () => {
  const { orders, showToast } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(null);
  const [blockedEmails, setBlockedEmails] = useState<string[]>([]);

  // Build customer directory from orders + default records
  const customersList = useMemo<CustomerRecord[]>(() => {
    const map = new Map<string, CustomerRecord>();

    // Seeded accounts
    const initialSeed = [
      {
        id: 'c-1',
        name: 'Muhammad Usman',
        email: 'usman.tech@gmail.com',
        phone: '0302-8472911',
        city: 'Lahore',
        registeredDate: '2026-01-14',
      },
      {
        id: 'c-2',
        name: 'Sarah Rehman',
        email: 'sarah.rehman@outlook.com',
        phone: '0333-5129481',
        city: 'Karachi',
        registeredDate: '2026-02-02',
      },
      {
        id: 'c-3',
        name: 'Farhan Ali',
        email: 'farhan.ali@gmail.com',
        phone: '0312-9988776',
        city: 'Islamabad',
        registeredDate: '2026-02-18',
      },
      {
        id: 'c-4',
        name: 'Hamza Tariq',
        email: 'hamza.tariq@gmail.com',
        phone: '0321-4455667',
        city: 'Lahore',
        registeredDate: '2026-03-01',
      },
      {
        id: 'c-5',
        name: 'Ayesha Khan',
        email: 'ayesha.khan@yahoo.com',
        phone: '0300-8899112',
        city: 'Karachi',
        registeredDate: '2026-03-10',
      },
    ];

    initialSeed.forEach((s) => {
      map.set(s.email.toLowerCase(), {
        id: s.id,
        name: s.name,
        email: s.email,
        phone: s.phone,
        city: s.city,
        registeredDate: s.registeredDate,
        orderCount: 0,
        totalSpent: 0,
        isBlocked: blockedEmails.includes(s.email.toLowerCase()),
        orders: [],
      });
    });

    // Populate order statistics
    orders.forEach((o) => {
      const email = o.customer.email.toLowerCase();
      let record = map.get(email);
      if (!record) {
        record = {
          id: `c-${map.size + 1}`,
          name: o.customer.fullName,
          email: o.customer.email,
          phone: o.customer.phone,
          city: o.customer.city,
          registeredDate: o.createdAt.slice(0, 10),
          orderCount: 0,
          totalSpent: 0,
          isBlocked: blockedEmails.includes(email),
          orders: [],
        };
        map.set(email, record);
      }
      record.orderCount += 1;
      record.totalSpent += o.total;
      record.orders.push(o);
    });

    return Array.from(map.values());
  }, [orders, blockedEmails]);

  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return customersList;
    const q = searchQuery.toLowerCase();
    return customersList.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.city.toLowerCase().includes(q)
    );
  }, [customersList, searchQuery]);

  const toggleBlock = (email: string) => {
    const clean = email.toLowerCase();
    setBlockedEmails((prev) => {
      const isBlocked = prev.includes(clean);
      if (isBlocked) {
        showToast(`Customer ${email} has been unblocked.`);
        return prev.filter((e) => e !== clean);
      } else {
        showToast(`Customer ${email} has been blocked from placing orders.`, 'error');
        return [...prev, clean];
      }
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Customer Database</h1>
          <p className="text-xs text-slate-400">
            View profiles, historical order value, saved addresses, and manage access privileges.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Active Shoppers:</span>
          <span className="font-mono font-bold text-cyan-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
            {customersList.length} Accounts
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs">
        <div className="relative grow max-w-sm">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Customer Name, Email, Phone, City..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden overflow-x-auto shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider">
            <tr>
              <th className="p-3.5">Customer Name</th>
              <th className="p-3.5">Contact Details</th>
              <th className="p-3.5">City</th>
              <th className="p-3.5">Total Orders</th>
              <th className="p-3.5">Total Spent (PKR)</th>
              <th className="p-3.5">Member Since</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {filteredCustomers.map((c) => (
              <tr key={c.email} className="hover:bg-slate-800/40 transition-colors">
                <td className="p-3.5 font-bold text-white flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-full bg-slate-800 text-cyan-400 font-bold flex items-center justify-center shrink-0">
                    {c.name.charAt(0)}
                  </div>
                  <span>{c.name}</span>
                </td>

                <td className="p-3.5">
                  <span className="block text-white">{c.email}</span>
                  <span className="text-[11px] text-slate-500">{c.phone}</span>
                </td>

                <td className="p-3.5 text-slate-300">{c.city}</td>

                <td className="p-3.5 font-mono">{c.orderCount} orders</td>

                <td className="p-3.5 font-mono font-bold text-cyan-400 tabular-nums">
                  Rs. {c.totalSpent.toLocaleString()}
                </td>

                <td className="p-3.5 text-slate-400">{c.registeredDate}</td>

                <td className="p-3.5">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      c.isBlocked
                        ? 'bg-rose-950 text-rose-400 border border-rose-800'
                        : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    }`}
                  >
                    {c.isBlocked ? 'Blocked' : 'Active'}
                  </span>
                </td>

                <td className="p-3.5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => setSelectedCustomer(c)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold inline-flex items-center gap-1 text-[11px]"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Profile</span>
                    </button>

                    <button
                      onClick={() => toggleBlock(c.email)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        c.isBlocked
                          ? 'bg-emerald-950 text-emerald-400 hover:bg-emerald-900'
                          : 'bg-rose-950/60 text-rose-400 hover:bg-rose-900'
                      }`}
                      title={c.isBlocked ? 'Unblock customer' : 'Block customer'}
                    >
                      {c.isBlocked ? <CheckCircle className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CUSTOMER PROFILE & ORDER HISTORY MODAL */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs"
            onClick={() => setSelectedCustomer(null)}
          />
          <div className="relative bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl z-10 text-white space-y-6 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center font-extrabold text-lg">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{selectedCustomer.name}</h3>
                  <span className="text-[11px] text-slate-400">
                    Customer ID: {selectedCustomer.id} · Registered: {selectedCustomer.registeredDate}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 text-[11px] block">Total Orders</span>
                <span className="text-lg font-bold font-mono text-white">{selectedCustomer.orderCount}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 text-[11px] block">Lifetime Value</span>
                <span className="text-lg font-bold font-mono text-cyan-400">
                  Rs. {selectedCustomer.totalSpent.toLocaleString()}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 text-[11px] block">Access Status</span>
                <span className={`text-xs font-bold ${selectedCustomer.isBlocked ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {selectedCustomer.isBlocked ? 'Blocked' : 'Active Verified'}
                </span>
              </div>
            </div>

            {/* Contact Details */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <h4 className="font-bold text-cyan-400 uppercase tracking-wider text-[11px]">Contact Information</h4>
              <p className="flex items-center gap-2 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>{selectedCustomer.email}</span>
              </p>
              <p className="flex items-center gap-2 text-slate-300">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span>{selectedCustomer.phone}</span>
              </p>
              <p className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>{selectedCustomer.city}, Pakistan</span>
              </p>
            </div>

            {/* Order History */}
            <div className="space-y-3">
              <h4 className="font-bold text-cyan-400 uppercase tracking-wider text-[11px]">
                Order History ({selectedCustomer.orders.length})
              </h4>
              {selectedCustomer.orders.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedCustomer.orders.map((o) => (
                    <div key={o.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="font-mono font-bold text-white block">{o.id}</span>
                        <span className="text-[11px] text-slate-500">
                          {new Date(o.createdAt).toLocaleDateString()} · {o.items.length} items
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-cyan-400 block">
                          Rs. {o.total.toLocaleString()}
                        </span>
                        <span className="text-[10px] bg-slate-900 text-slate-300 px-2 py-0.5 rounded border border-slate-800">
                          {o.orderStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-xs py-2">No historical order transactions recorded yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
