'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useTripContext } from '@/context/TripContext';
import { TripStatus } from '@/types';
import { Plus, Calendar, MapPin, Users, Wallet, Trash2, Edit3, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function MyTripsPage() {
  const { trips, searchQuery, deleteTrip, setActiveTripId } = useTripContext();
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  const filteredTrips = trips.filter((t) => {
    const matchesSearch = searchQuery
      ? t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.destinations.some((d) => d.cityName.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
    const matchesStatus = selectedStatus === 'All' || t.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <div className="pl-72 flex-1 flex flex-col min-w-0">
        <Header />

        <main className="pt-24 pb-16 px-10 min-h-screen">
          {/* Header Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Travel Plans</h1>
              <p className="text-sm text-slate-500 mt-1">
                Manage, edit, and organize all your upcoming and past multi-city itineraries.
              </p>
            </div>

            <Link
              href="/trips/new"
              className="bg-slate-900 text-white hover:bg-slate-800 text-sm font-semibold px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4 text-sky-400" />
              <span>Create New Trip</span>
            </Link>
          </div>

          {/* Status Filter Chips */}
          <div className="flex items-center gap-2 mb-8 border-b border-slate-200 pb-4">
            {['All', 'Planning', 'Confirmed', 'Completed'].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedStatus === status
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {status} {status === 'All' ? `(${trips.length})` : `(${trips.filter((t) => t.status === status).length})`}
              </button>
            ))}
          </div>

          {/* Trip Grid */}
          {filteredTrips.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto my-12">
              <div className="w-16 h-16 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">No trips found</h3>
              <p className="text-xs text-slate-500 mb-6">
                Try adjusting your search filter or start creating your first multi-city trip.
              </p>
              <Link
                href="/trips/new"
                className="bg-sky-500 text-slate-950 font-semibold px-6 py-2.5 rounded-full text-xs transition-all inline-block"
              >
                Plan a New Trip Now
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTrips.map((trip) => {
                const budgetPercent = Math.min(Math.round((trip.spentBudget / trip.totalBudget) * 100), 100);

                return (
                  <div
                    key={trip.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-xs border border-slate-200 hover:shadow-xl transition-all flex flex-col group"
                  >
                    <div
                      className="w-full h-52 bg-cover bg-center relative"
                      style={{ backgroundImage: `url('${trip.coverImage}')` }}
                    >
                      <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/0 transition-colors"></div>

                      <div className="absolute top-4 left-4">
                        <span className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full">
                          {trip.destinations.length} Stop{trip.destinations.length > 1 ? 's' : ''}
                        </span>
                      </div>

                      <div className="absolute top-4 right-4 flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Delete "${trip.title}"?`)) deleteTrip(trip.id);
                          }}
                          className="w-8 h-8 rounded-full bg-white/90 text-red-600 hover:bg-red-600 hover:text-white flex items-center justify-center transition-all shadow-xs"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="absolute bottom-4 left-4 right-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 shadow-xs ${
                            trip.status === 'Confirmed'
                              ? 'bg-emerald-500 text-white'
                              : trip.status === 'Completed'
                              ? 'bg-slate-700 text-white'
                              : 'bg-amber-500 text-white'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {trip.status}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-bold text-xl text-slate-900 mb-1">{trip.title}</h3>
                      <p className="text-xs text-slate-500 mb-4 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {trip.startDate} to {trip.endDate}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {trip.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-slate-100 text-slate-600 text-[10px] font-semibold px-2.5 py-0.5 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Budget Progress bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs font-semibold mb-1">
                          <span className="text-slate-500">Budget Spent</span>
                          <span className={budgetPercent > 90 ? 'text-red-600 font-bold' : 'text-slate-900'}>
                            ₹{trip.spentBudget.toLocaleString()} / ₹{trip.totalBudget.toLocaleString()} ({budgetPercent}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              budgetPercent > 100
                                ? 'bg-red-500'
                                : budgetPercent > 80
                                ? 'bg-amber-500'
                                : 'bg-sky-500'
                            }`}
                            style={{ width: `${budgetPercent}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Action Links */}
                      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 mt-auto">
                        <Link
                          href={`/trips/${trip.id}`}
                          onClick={() => setActiveTripId(trip.id)}
                          className="text-center bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium py-2 rounded-lg transition-colors"
                        >
                          Overview
                        </Link>
                        <Link
                          href={`/trips/${trip.id}/builder`}
                          onClick={() => setActiveTripId(trip.id)}
                          className="text-center bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-semibold py-2 rounded-lg transition-colors"
                        >
                          Itinerary
                        </Link>
                        <Link
                          href={`/trips/${trip.id}/budget`}
                          onClick={() => setActiveTripId(trip.id)}
                          className="text-center bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-semibold py-2 rounded-lg transition-colors"
                        >
                          Budget
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
