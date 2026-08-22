'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useTripContext } from '@/context/TripContext';
import { useConfirmDialog } from '@/context/ConfirmDialogContext';
import {
  ShieldAlert,
  Database,
  Plus,
  CheckCircle,
  MapPin,
  Tag,
  TrendingUp,
  Users,
  Calendar,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Search,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export default function AdminPage() {
  const { destinations, trips, user } = useTripContext();
  const { showAlert } = useConfirmDialog();
  const [showAddDestModal, setShowAddDestModal] = useState(false);
  const [newCity, setNewCity] = useState({
    name: '',
    country: '',
    region: 'Asia',
    avgCostPerDay: 3500,
    coverImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80',
  });

  // Dynamic Platform Calculations
  const totalTrips = trips.length;
  const activeTravelers = trips.reduce((sum, t) => sum + (t.travelers || 1), 0);
  const curatedDestinationsCount = destinations.length;
  const totalVolume = trips.reduce((sum, t) => sum + (t.totalBudget || 0), 0);
  const formattedVolume = totalVolume >= 100000 
    ? `₹${(totalVolume / 100000).toFixed(1)}L` 
    : `₹${(totalVolume / 1000).toFixed(0)}k`;

  // Dynamic Top Visited Cities
  const cityCounts: Record<string, number> = {};
  trips.forEach((t) => {
    t.destinations.forEach((d) => {
      const city = d.cityName || 'Other';
      cityCounts[city] = (cityCounts[city] || 0) + 1;
    });
  });

  const topCitiesData = Object.entries(cityCounts)
    .map(([city, tripsCount]) => ({ city, tripsCount }))
    .sort((a, b) => b.tripsCount - a.tripsCount)
    .slice(0, 5);

  if (topCitiesData.length === 0) {
    topCitiesData.push(
      { city: 'Goa', tripsCount: 3 },
      { city: 'Mumbai', tripsCount: 2 },
      { city: 'Jaipur', tripsCount: 1 }
    );
  }

  // Dynamic Activity Category Breakdown
  const catCounts: Record<string, number> = {};
  trips.forEach((t) => {
    t.activities.forEach((a) => {
      const cat = a.category || 'Sightseeing';
      catCounts[cat] = (catCounts[cat] || 0) + 1;
    });
  });

  const categoryData = Object.entries(catCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  if (categoryData.length === 0) {
    categoryData.push(
      { name: 'Sightseeing', count: 12 },
      { name: 'Food', count: 8 },
      { name: 'Culture', count: 5 },
      { name: 'Adventure', count: 4 }
    );
  }

  const COLORS = ['#0ea5e9', '#0d9488', '#f59e0b', '#6366f1', '#ec4899'];

  const handleAddDestination = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCity.name || !newCity.country) return;

    destinations.push({
      id: `dest_${Date.now()}`,
      name: newCity.name,
      country: newCity.country,
      region: newCity.region,
      description: `Beautiful city of ${newCity.name} in ${newCity.country}.`,
      coverImage: newCity.coverImage,
      avgCostPerDay: Number(newCity.avgCostPerDay),
      rating: 4.8,
      tags: ['Popular', 'Culture'],
      popularActivities: [],
    });

    setShowAddDestModal(false);
    await showAlert({
      title: 'Destination Added',
      message: `Destination "${newCity.name}" added to global catalog!`,
      variant: 'success',
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <div className="pl-72 flex-1 flex flex-col min-w-0">
        <Header />

        <main className="pt-24 pb-16 px-10 min-h-screen max-w-6xl mx-auto w-full space-y-8">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Admin & Analytics Dashboard</h1>
              <p className="text-sm text-slate-500 mt-1">
                Monitor app adoption, popular cities, user engagement trends, and manage global catalogs.
              </p>
            </div>

            <button
              onClick={() => setShowAddDestModal(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-3 rounded-full transition-all flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4 text-sky-400" />
              <span>Add New Destination</span>
            </button>
          </div>

          {/* Key Platform Stats Widgets */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-3">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold text-slate-900 block">{totalTrips}</span>
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                Total Trips Created
              </span>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold text-slate-900 block">{activeTravelers}</span>
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                Active Travelers
              </span>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold text-slate-900 block">{curatedDestinationsCount}</span>
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                Curated Destinations
              </span>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold text-slate-900 block">{formattedVolume}</span>
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                Estimated Volume
              </span>
            </div>
          </div>

          {/* Platform Analytics Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Visited Cities Bar Chart */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <BarChartIcon className="w-5 h-5 text-sky-600" />
                <span>Top Visited Destinations</span>
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topCitiesData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="city" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="tripsCount" fill="#006591" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Popular Activity Categories Pie Chart */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-teal-600" />
                <span>Popular Activity Types</span>
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Catalog Table */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Database className="w-5 h-5 text-sky-600" />
              <span>Global Destination Catalog ({destinations.length})</span>
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="py-3 px-4">City</th>
                    <th className="py-3 px-4">Country</th>
                    <th className="py-3 px-4">Region</th>
                    <th className="py-3 px-4">Avg Spend/Day</th>
                    <th className="py-3 px-4">Rating</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {destinations.map((dest) => (
                    <tr key={dest.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-3">
                        <img
                          src={dest.coverImage}
                          alt={dest.name}
                          className="w-10 h-10 rounded-xl object-cover"
                        />
                        <span>{dest.name}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{dest.country}</td>
                      <td className="py-3.5 px-4 text-slate-600">{dest.region}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        ₹{dest.avgCostPerDay.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-amber-500 font-bold">★ {dest.rating}</td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-semibold text-[10px] uppercase inline-flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>

        {/* Add Destination Modal */}
        {showAddDestModal && (
          <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-200 animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">Add Destination to Catalog</h3>
                <button onClick={() => setShowAddDestModal(false)} className="text-slate-400 font-bold">
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddDestination} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    City Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newCity.name}
                    onChange={(e) => setNewCity({ ...newCity, name: e.target.value })}
                    placeholder="e.g. Udaipur"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    required
                    value={newCity.country}
                    onChange={(e) => setNewCity({ ...newCity, country: e.target.value })}
                    placeholder="e.g. India"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-sky-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Region
                    </label>
                    <select
                      value={newCity.region}
                      onChange={(e) => setNewCity({ ...newCity, region: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-sky-500"
                    >
                      <option value="Asia">Asia</option>
                      <option value="Europe">Europe</option>
                      <option value="Americas">Americas</option>
                      <option value="Africa">Africa</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Avg Spend/Day (₹)
                    </label>
                    <input
                      type="number"
                      value={newCity.avgCostPerDay}
                      onChange={(e) => setNewCity({ ...newCity, avgCostPerDay: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAddDestModal(false)}
                    className="bg-slate-100 text-slate-700 font-semibold px-5 py-2.5 rounded-full text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-2.5 rounded-full text-xs shadow-md"
                  >
                    Save Destination
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
