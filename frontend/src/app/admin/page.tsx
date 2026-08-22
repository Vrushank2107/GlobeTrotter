'use client';

import React from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Header } from '../../components/layout/Header';
import { useTripContext } from '../../context/TripContext';
import { ShieldAlert, Database, Plus, CheckCircle, MapPin, Tag } from 'lucide-react';

export default function AdminPage() {
  const { destinations } = useTripContext();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <div className="pl-72 flex-1 flex flex-col min-w-0">
        <Header />

        <main className="pt-24 pb-16 px-10 min-h-screen max-w-6xl mx-auto w-full">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Admin Management Panel</h1>
              <p className="text-sm text-slate-500 mt-1">
                Manage global destinations catalog, activity categories, and system parameters.
              </p>
            </div>

            <button
              onClick={() => alert('New Destination modal opened!')}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-3 rounded-full transition-all flex items-center gap-2 shadow-md"
            >
              <Plus className="w-4 h-4 text-sky-400" />
              <span>Add Destination</span>
            </button>
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
      </div>
    </div>
  );
}
