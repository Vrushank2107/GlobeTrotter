'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useTripContext } from '@/context/TripContext';
import { useConfirmDialog } from '@/context/ConfirmDialogContext';
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
} from 'lucide-react';
import { PageSkeleton } from '@/components/ui/skeleton';
import {
  TrendingUp,
  CreditCard,
  PieChart as PieChartIcon,
  CheckCircle2,
  Edit3,
} from 'lucide-react';

export default function TripBudgetPage() {
  const params = useParams();
  const router = useRouter();
  const tripId = params.id as string;

  const { user, trips, addExpense, deleteExpense, updateTrip, loading, isSidebarCollapsed } = useTripContext();
  const { confirm } = useConfirmDialog();
  const trip = trips.find((t) => t.id === tripId) || trips[0];

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);



  const handleDeleteExpense = async (expenseId: string, title: string) => {
    const isConfirmed = await confirm({
      title: 'Delete Expense',
      message: `Are you sure you want to delete "${title}" from expenses?`,
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
      variant: 'danger',
    });
    if (isConfirmed) {
      deleteExpense(trip.id, expenseId);
    }
  };

  const [showModal, setShowModal] = useState<boolean>(false);
  const [showBudgetModal, setShowBudgetModal] = useState<boolean>(false);
  const [newBudget, setNewBudget] = useState<number | ''>(trip?.totalBudget || 50000);

  const [expenseForm, setExpenseForm] = useState({
    title: '',
    category: 'Accommodation' as 'Accommodation' | 'Transport' | 'Activities' | 'Food' | 'Misc',
    amount: '' as string | number,
    date: '2026-10-16',
    paidBy: 'Nirmal Purja',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSaveBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newBudget && Number(newBudget) > 0 && trip) {
      await updateTrip(trip.id, { totalBudget: Number(newBudget) });
      setShowBudgetModal(false);
    }
  };



  // Calculate totals by category for Recharts
  const categoriesList = ['Accommodation', 'Transport', 'Activities', 'Food', 'Misc'];
  const COLORS = ['#0ea5e9', '#0d9488', '#f59e0b', '#6366f1', '#ec4899'];

  // Calculate expense totals by category
  const expenseCategoryTotals: Record<string, number> = {
    Accommodation: 0,
    Transport: 0,
    Activities: 0,
    Food: 0,
    Misc: 0,
  };

  trip.expenses.forEach((exp) => {
    if (expenseCategoryTotals[exp.category] !== undefined) {
      expenseCategoryTotals[exp.category] += exp.amount;
    } else {
      expenseCategoryTotals['Misc'] += exp.amount;
    }
  });

  // Calculate activity estimated costs by category
  const activityCategoryTotals: Record<string, number> = {
    Accommodation: 0,
    Transport: 0,
    Activities: 0,
    Food: 0,
    Misc: 0,
  };

  trip.activities.forEach((act) => {
    // Map activity categories to expense categories
    const categoryMapping: Record<string, string> = {
      'Sightseeing': 'Activities',
      'Food': 'Food',
      'Adventure': 'Activities',
      'Culture': 'Activities',
      'Entertainment': 'Activities',
      'Nature': 'Activities',
      'Shopping': 'Misc',
      'Transport': 'Transport',
      'Accommodation': 'Accommodation',
    };
    
    const mappedCategory = categoryMapping[act.category] || 'Misc';
    if (activityCategoryTotals[mappedCategory] !== undefined) {
      activityCategoryTotals[mappedCategory] += act.cost;
    } else {
      activityCategoryTotals['Misc'] += act.cost;
    }
  });

  // Calculate totals
  const totalEstimatedActivityCosts = Object.values(activityCategoryTotals).reduce((sum, val) => sum + val, 0);
  const totalActualExpenses = Object.values(expenseCategoryTotals).reduce((sum, val) => sum + val, 0);

  // Pie chart data - showing actual expenses
  const pieData = Object.entries(expenseCategoryTotals)
    .filter(([_, val]) => val > 0)
    .map(([name, value]) => ({ name, value }));

  // Bar chart data - comparing estimated vs actual
  const barData = categoriesList.map((cat) => ({
    category: cat,
    Estimated: activityCategoryTotals[cat] || 0,
    Spent: expenseCategoryTotals[cat] || 0,
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

  const isOverBudget = trip.spentBudget > trip.totalBudget || totalEstimatedActivityCosts > trip.totalBudget;
  const isApproachingBudget = !isOverBudget && (trip.spentBudget > trip.totalBudget * 0.85 || totalEstimatedActivityCosts > trip.totalBudget * 0.85);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <div className={`pl-0 flex-1 flex flex-col min-w-0 transition-all duration-300 ${isSidebarCollapsed ? 'md:pl-20' : 'md:pl-72'}`}>
        <Header />

        <main className="pt-20 pb-20 md:pt-24 md:pb-16 px-4 md:px-10 min-h-screen">
          {loading ? (
            <PageSkeleton />
          ) : user ? (
            <>
          {trip ? (
            <>
          {/* Header Action Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 bg-white p-4 md:p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Link href={`/trips/${trip.id}`} className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs px-3 py-1.5 rounded-full transition-all inline-flex items-center gap-1.5 shadow-2xs hover:shadow-xs cursor-pointer border border-slate-200/80">
                  <ArrowLeft className="w-3.5 h-3.5 text-sky-600" />
                  <span className="hidden sm:inline">Back to Trip Details</span>
                  <span className="sm:hidden">Back</span>
                </Link>
                <span className="text-slate-300 hidden sm:inline">•</span>
                <span className="text-xs text-slate-500 font-medium hidden sm:inline">Recharts Analytics</span>
              </div>
              <h1 className="text-xl md:text-3xl font-bold text-slate-900">{trip.title} - Budget & Expenses</h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mt-1">
                <p className="text-xs text-slate-600 font-medium">
                  Budget: <span className="font-bold text-slate-900">₹{trip.totalBudget.toLocaleString()}</span>
                </p>
                <p className="text-xs text-slate-600 font-medium">
                  Est. Activities: <span className="font-bold text-emerald-600">₹{totalEstimatedActivityCosts.toLocaleString()}</span>
                </p>
                <p className="text-xs text-slate-600 font-medium">
                  Spent: <span className="font-bold text-slate-900">₹{trip.spentBudget.toLocaleString()}</span>
                </p>
                <button
                  onClick={() => {
                    setNewBudget(trip.totalBudget);
                    setShowBudgetModal(true);
                  }}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-2.5 py-1 rounded-full transition-all cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit Budget</span>
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 md:px-6 py-2.5 md:py-3 rounded-full shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
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
                  {trip.spentBudget > trip.totalBudget 
                    ? `Your recorded expenses (₹${trip.spentBudget.toLocaleString()}) have exceeded your target budget of ₹${trip.totalBudget.toLocaleString()} by ₹{(trip.spentBudget - trip.totalBudget).toLocaleString()}.`
                    : `Your estimated activity costs (₹${totalEstimatedActivityCosts.toLocaleString()}) exceed your target budget of ₹${trip.totalBudget.toLocaleString()} by ₹{(totalEstimatedActivityCosts - trip.totalBudget).toLocaleString()}.`
                  }
                </p>
              </div>
            </div>
          )}

          {/* Approaching budget banner */}
          {isApproachingBudget && !isOverBudget && (
            <div className="mb-8 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
              <div>
                <h4 className="font-bold text-sm">Approaching Budget Limit</h4>
                <p className="text-xs">
                  {trip.spentBudget > trip.totalBudget * 0.85
                    ? `You have spent ${Math.round((trip.spentBudget / trip.totalBudget) * 100)}% of your total trip budget.`
                    : `Your estimated activity costs are ${Math.round((totalEstimatedActivityCosts / trip.totalBudget) * 100)}% of your total trip budget.`
                  }
                </p>
              </div>
            </div>
          )}

          {/* Budget Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-6 shadow-xs">
              <div className="flex items-center gap-2 md:gap-3 mb-2">
                <div className="bg-sky-100 p-2 rounded-lg">
                  <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-sky-600" />
                </div>
                <span className="text-[10px] md:text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Budget</span>
              </div>
              <p className="text-xl md:text-2xl font-bold text-slate-900">₹{trip.totalBudget.toLocaleString()}</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-6 shadow-xs">
              <div className="flex items-center gap-2 md:gap-3 mb-2">
                <div className="bg-emerald-100 p-2 rounded-lg">
                  <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-emerald-600" />
                </div>
                <span className="text-[10px] md:text-xs font-semibold text-slate-500 uppercase tracking-wider">Est. Activity Costs</span>
              </div>
              <p className="text-xl md:text-2xl font-bold text-slate-900">₹{totalEstimatedActivityCosts.toLocaleString()}</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-6 shadow-xs">
              <div className="flex items-center gap-2 md:gap-3 mb-2">
                <div className="bg-amber-100 p-2 rounded-lg">
                  <CreditCard className="w-4 h-4 md:w-5 md:h-5 text-amber-600" />
                </div>
                <span className="text-[10px] md:text-xs font-semibold text-slate-500 uppercase tracking-wider">Actual Expenses</span>
              </div>
              <p className="text-xl md:text-2xl font-bold text-slate-900">₹{totalActualExpenses.toLocaleString()}</p>
            </div>
          </div>

          {/* Recharts Visualization Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Category Pie Chart - Actual Expenses */}
            <div className="bg-white rounded-3xl border border-slate-200 p-4 md:p-6 shadow-xs">
              <h3 className="text-base md:text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 md:w-5 md:h-5 text-sky-600" />
                <span>Actual Expenses by Category</span>
              </h3>

              {pieData.length === 0 ? (
                <div className="h-48 md:h-64 flex items-center justify-center text-xs text-slate-400">
                  No logged expenses yet.
                </div>
              ) : (
                <div className="h-56 md:h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                        label={false}
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

            {/* Estimated vs Actual Bar Chart */}
            <div className="bg-white rounded-3xl border border-slate-200 p-4 md:p-6 shadow-xs">
              <h3 className="text-base md:text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-teal-600" />
                <span>Estimated vs Actual by Category</span>
              </h3>

              <div className="h-56 md:h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 20, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="category" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip formatter={(val) => `₹${Number(val).toLocaleString()}`} />
                    <Legend />
                    <Bar dataKey="Estimated" fill="#94a3b8" radius={[6, 6, 0, 0]} name="Est. Activity Costs" />
                    <Bar dataKey="Spent" fill="#0ea5e9" radius={[6, 6, 0, 0]} name="Actual Expenses" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Activities Cost Table */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">Planned Activities & Estimated Costs</h2>
              <span className="text-xs font-semibold text-slate-500">
                {trip.activities.length} Activit{trip.activities.length !== 1 ? 'ies' : 'y'} | Total: ₹{totalEstimatedActivityCosts.toLocaleString()}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="py-3 px-4">Activity</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Day</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4 text-right">Est. Cost (₹)</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {trip.activities.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No activities planned yet. Add activities in the itinerary builder.
                      </td>
                    </tr>
                  ) : (
                    trip.activities.map((act) => (
                      <tr key={act.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900">{act.title}</td>
                        <td className="py-3.5 px-4">
                          <span className="bg-sky-100 text-sky-800 px-2.5 py-1 rounded-full font-semibold text-[10px] uppercase">
                            {act.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">Day {act.dayNumber}</td>
                        <td className="py-3.5 px-4 text-slate-500">{act.location}</td>
                        <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                          ₹{act.cost.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {act.completed ? (
                            <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-semibold text-[10px] flex items-center gap-1 inline-flex">
                              <CheckCircle2 className="w-3 h-3" />
                              Done
                            </span>
                          ) : (
                            <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-semibold text-[10px]">
                              Planned
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Expenses Data Table */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">Actual Expense Log</h2>
              <span className="text-xs font-semibold text-slate-500">
                {trip.expenses.length} Expense Item{trip.expenses.length !== 1 ? 's' : ''} | Total: ₹{totalActualExpenses.toLocaleString()}
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
                          onClick={() => handleDeleteExpense(exp.id, exp.title)}
                          className="text-red-600 hover:text-red-800 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
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
            </>
          ) : (
            <div className="px-10 py-20 text-center">
              <p className="text-sm text-slate-500">Trip not found.</p>
            </div>
          )}
            </>
          ) : null}
        </main>

        {/* Expense Modal Drawer */}
        {showModal && user && (
          <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl border border-slate-200 animate-fade-in max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg md:text-xl font-bold text-slate-900">Log New Expense</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-2xl">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      value={expenseForm.amount === 0 ? '' : expenseForm.amount}
                      onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value === '' ? '' : Number(e.target.value) })}
                      placeholder="0"
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

                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="bg-slate-100 text-slate-700 font-semibold px-5 py-2.5 rounded-full text-xs w-full sm:w-auto"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-2.5 rounded-full text-xs shadow-md w-full sm:w-auto"
                  >
                    Save Expense
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Total Budget Modal Drawer */}
        {showBudgetModal && (
          <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl border border-slate-200 animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg md:text-xl font-bold text-slate-900">Edit Total Trip Budget</h3>
                <button onClick={() => setShowBudgetModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-2xl">
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveBudget} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Total Planned Budget (₹)
                  </label>
                  <input
                    type="number"
                    value={newBudget === 0 ? '' : newBudget}
                    onChange={(e) => setNewBudget(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="50000"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  />
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowBudgetModal(false)}
                    className="bg-slate-100 text-slate-700 font-semibold px-5 py-2.5 rounded-full text-xs cursor-pointer w-full sm:w-auto"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-6 py-2.5 rounded-full text-xs shadow-md cursor-pointer w-full sm:w-auto"
                  >
                    Save Budget
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
