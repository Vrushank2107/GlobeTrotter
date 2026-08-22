'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useTripContext } from '@/context/TripContext';
import { Expense } from '@/types';
import { expenseSchema } from '@/lib/validations/trip';
import {
  PieChart as RePieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Plus,
  Trash2,
  AlertTriangle,
  ArrowLeft,
  DollarSign,
  TrendingUp,
  CreditCard,
  PieChartIcon,
  CheckCircle2,
} from 'lucide-react';

export default function TripBudgetPage() {
  const params = useParams();
  const tripId = params.id as string;

  const { trips, addExpense, deleteExpense } = useTripContext();
  const trip = trips.find((t) => t.id === tripId) || trips[0];

  const [showModal, setShowModal] = useState<boolean>(false);
  const [expenseForm, setExpenseForm] = useState({
    title: '',
    category: 'Accommodation' as 'Accommodation' | 'Transport' | 'Activities' | 'Food' | 'Misc',
    amount: '' as string | number,
    date: '2026-10-16',
    paidBy: 'Nirmal Purja',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!trip) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-sm text-slate-500">Trip not found.</p>
      </div>
    );
  }

  // Calculate totals by category for Recharts
  const categoriesList = ['Accommodation', 'Transport', 'Activities', 'Food', 'Misc'];
  const COLORS = ['#0ea5e9', '#0d9488', '#f59e0b', '#6366f1', '#ec4899'];

  const categoryTotals: Record<string, number> = {
    Accommodation: 0,
    Transport: 0,
    Activities: 0,
    Food: 0,
    Misc: 0,
  };

  trip.expenses.forEach((exp) => {
    if (categoryTotals[exp.category] !== undefined) {
      categoryTotals[exp.category] += exp.amount;
    } else {
      categoryTotals['Misc'] += exp.amount;
    }
  });

  const pieData = Object.entries(categoryTotals)
    .filter(([_, val]) => val > 0)
    .map(([name, value]) => ({ name, value }));

  const barData = categoriesList.map((cat) => ({
    category: cat,
    Spent: categoryTotals[cat] || 0,
    EstBudget: Math.round(trip.totalBudget / 4),
  }));

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Convert empty string to 0 for validation
    const formToValidate = {
      ...expenseForm,
      amount: expenseForm.amount === '' ? 0 : Number(expenseForm.amount),
    };

    const validation = expenseSchema.safeParse(formToValidate);

    if (!validation.success) {
      const formatted: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) formatted[issue.path[0] as string] = issue.message;
      });
      setErrors(formatted);
      return;
    }

    addExpense(trip.id, formToValidate);

    setShowModal(false);
    setExpenseForm({
      title: '',
      category: 'Accommodation',
      amount: '',
      date: '2026-10-16',
      paidBy: 'Nirmal Purja',
    });
  };

  const isOverBudget = trip.spentBudget > trip.totalBudget;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <div className="pl-72 flex-1 flex flex-col min-w-0">
        <Header />

        <main className="pt-24 pb-16 px-10 min-h-screen">
          {/* Header Action Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Link href={`/trips/${trip.id}`} className="text-xs text-sky-600 hover:underline font-semibold flex items-center gap-1">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Trip Details
                </Link>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500 font-medium">Recharts Analytics</span>
              </div>
              <h1 className="text-3xl font-bold text-slate-900">{trip.title} - Budget & Expenses</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Total Budget: ₹{trip.totalBudget.toLocaleString()} | Spent: ₹{trip.spentBudget.toLocaleString()}
              </p>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-sky-400" />
              <span>Log New Expense</span>
            </button>
          </div>

          {/* Over budget banner */}
          {isOverBudget && (
            <div className="mb-8 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600 shrink-0" />
              <div>
                <h4 className="font-bold text-sm">Over-Budget Warning</h4>
                <p className="text-xs">
                  Your recorded expenses (₹{trip.spentBudget.toLocaleString()}) have exceeded your target budget of ₹{trip.totalBudget.toLocaleString()} by ₹{(trip.spentBudget - trip.totalBudget).toLocaleString()}.
                </p>
              </div>
            </div>
          )}

          {/* Recharts Visualization Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Category Pie Chart */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-sky-600" />
                <span>Expense Breakdown by Category</span>
              </h3>

              {pieData.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-xs text-slate-400">
                  No logged expenses yet.
                </div>
              ) : (
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={95}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                      >
                        {pieData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
                      <Legend />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Category Comparison Bar Chart */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-teal-600" />
                <span>Category Spend vs Estimated Target</span>
              </h3>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(val) => `₹${Number(val).toLocaleString()}`} />
                    <Legend />
                    <Bar dataKey="Spent" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="EstBudget" fill="#cbd5e1" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Expenses Data Table */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">Itemized Expense Log</h2>
              <span className="text-xs font-semibold text-slate-500">
                {trip.expenses.length} Expense Item{trip.expenses.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="py-3 px-4">Title</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Paid By</th>
                    <th className="py-3 px-4 text-right">Amount (₹)</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {trip.expenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{exp.title}</td>
                      <td className="py-3.5 px-4">
                        <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-semibold text-[10px] uppercase">
                          {exp.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">{exp.date}</td>
                      <td className="py-3.5 px-4 text-slate-500">{exp.paidBy || 'Nirmal Purja'}</td>
                      <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                        ₹{exp.amount.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => deleteExpense(trip.id, exp.id)}
                          className="text-red-600 hover:text-red-800 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>

        {/* Expense Modal Drawer */}
        {showModal && (
          <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-200 animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">Log New Expense</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddExpense} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Expense Description
                  </label>
                  <input
                    type="text"
                    value={expenseForm.title}
                    onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
                    placeholder="e.g. Resort Booking Deposit"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:border-sky-500"
                  />
                  {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Category
                    </label>
                    <select
                      value={expenseForm.category}
                      onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value as Expense['category'] })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:border-sky-500"
                    >
                      {categoriesList.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={expenseForm.amount}
                      onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value === '' ? '' : Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:border-sky-500"
                    />
                    {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={expenseForm.date}
                    onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:border-sky-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="bg-slate-100 text-slate-700 font-semibold px-5 py-2.5 rounded-full text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-2.5 rounded-full text-xs shadow-md"
                  >
                    Save Expense
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
