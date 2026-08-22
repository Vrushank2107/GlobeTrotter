'use client';

import React from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useTripContext } from '@/context/TripContext';
import { Globe2, Calendar, Wallet, PlaneTakeoff, ArrowRight, MapPin, DollarSign, Sparkles } from 'lucide-react';

export default function DashboardPage() {
  const { user, trips, searchQuery, setActiveTripId, loading } = useTripContext();

  const filteredTrips = trips.filter((t) =>
    searchQuery
      ? t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.destinations.some((d) => d.cityName.toLowerCase().includes(searchQuery.toLowerCase()))
      : true
  );

  const upcomingTrips = filteredTrips.slice(0, 2);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <div className="pl-72 flex-1 flex flex-col min-w-0">
        <Header />

        <main className="pt-20 pb-16 min-h-screen">
          {/* Cinematic Header */}
          <div
            className="relative w-full h-80 mb-10 flex items-center px-10 parallax-bg overflow-hidden shadow-sm"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.65), rgba(15, 23, 42, 0.2)), url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=80')`,
            }}
          >
            <div className="relative z-10 flex flex-col gap-3 max-w-2xl text-white">
              <span className="text-sky-400 font-semibold text-xs tracking-widest uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Welcome Back
              </span>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Good morning, {user?.name ? user.name.split(' ')[0] : 'Traveler'}.<br />
                <span className="text-sky-300 italic font-light">Ready for your next adventure?</span>
              </h1>
              <p className="text-sm text-slate-300">
                Here is a curated summary of your upcoming travels and recent planning activity.
              </p>
              <div className="mt-4">
                <Link
                  href="/trips/new"
                  className="bg-white text-slate-900 px-6 py-3.5 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 inline-flex items-center gap-2.5 font-semibold text-sm group cursor-pointer"
                >
                  <span>Plan a New Trip</span>
                  <PlaneTakeoff className="w-4 h-4 text-sky-600 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

          <div className="px-10">
            <div className="grid grid-cols-12 gap-8 mb-10">
              <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-6 flex items-center gap-4 shadow-xs hover:shadow-md transition-all hover:-translate-y-0.5">
                    <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                      <Globe2 className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">{user?.countriesVisited ?? 0}</p>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Countries Visited</p>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200/80 rounded-2xl p-6 flex items-center gap-4 shadow-xs hover:shadow-md transition-all hover:-translate-y-0.5">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">{trips.length}</p>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Upcoming Trips</p>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200/80 rounded-2xl p-6 flex items-center gap-4 shadow-xs hover:shadow-md transition-all hover:-translate-y-0.5">
                    <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                      <Wallet className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">₹{(trips.reduce((acc, t) => acc + t.totalBudget, 0) / 1000).toFixed(0)}k</p>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Planned Budget</p>
                    </div>
                  </div>
                </div>

                {/* Upcoming Itineraries Section */}
                <div className="flex flex-col gap-4 mt-2">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-slate-900">Upcoming Itineraries</h2>
                    <Link
                      href="/trips"
                      className="text-sky-600 font-semibold text-xs hover:text-sky-700 flex items-center gap-1 group"
                    >
                      <span>View all</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>

                  {loading && trips.length === 0 ? (
                    <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-sm">
                      Loading your itineraries...
                    </div>
                  ) : upcomingTrips.length === 0 ? (
                    <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-sm">
                      No trips found. Click &quot;Plan a New Trip&quot; to get started!
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {upcomingTrips.map((trip) => (
                        <div
                          key={trip.id}
                          onClick={() => setActiveTripId(trip.id)}
                          className="bg-white rounded-2xl overflow-hidden shadow-xs border border-slate-200 hover:shadow-xl transition-all group cursor-pointer flex flex-col"
                        >
                          <div
                            className="w-full h-48 bg-cover bg-center relative overflow-hidden"
                            style={{ backgroundImage: `url('${trip.coverImage}')` }}
                          >
                            <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/0 transition-colors"></div>
                            <div className="absolute top-4 right-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 shadow-xs ${
                                  trip.status === 'Confirmed'
                                    ? 'bg-emerald-500/90 text-white'
                                    : 'bg-amber-500/90 text-white'
                                }`}
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                                {trip.status}
                              </span>
                            </div>
                          </div>

                          <div className="p-5 flex flex-col flex-1">
                            <h3 className="font-bold text-xl text-slate-900 mb-1 group-hover:text-sky-600 transition-colors">
                              {trip.title}
                            </h3>
                            <p className="text-xs text-slate-500 flex items-center gap-1.5 mb-4">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              {trip.startDate} - {trip.endDate}
                            </p>

                            <div className="grid grid-cols-2 gap-4 mt-auto pt-4 border-t border-slate-100 text-xs">
                              <div>
                                <span className="text-slate-400 font-medium block uppercase tracking-wider text-[10px]">
                                  Destinations
                                </span>
                                <span className="font-semibold text-slate-800 truncate block">
                                  {trip.destinations.map((d) => d.cityName).join(', ') || 'Multi-city'}
                                </span>
                              </div>
                              <div>
                                <span className="text-slate-400 font-medium block uppercase tracking-wider text-[10px]">
                                  Est. Budget
                                </span>
                                <span className="font-semibold text-slate-900">
                                  ₹{trip.totalBudget.toLocaleString()}
                                </span>
                              </div>
                            </div>

                            <div className="mt-4 flex gap-2">
                              <Link
                                href={`/trips/${trip.id}`}
                                className="flex-1 text-center bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium py-2 rounded-lg transition-colors"
                              >
                                View Overview
                              </Link>
                              <Link
                                href={`/trips/${trip.id}/builder`}
                                className="flex-1 text-center bg-sky-50 text-sky-700 hover:bg-sky-100 text-xs font-semibold py-2 rounded-lg transition-colors"
                              >
                                Build Itinerary
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar Recent Activity */}
              <div className="col-span-12 lg:col-span-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs h-full">
                  <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center justify-between">
                    <span>Recent Activity</span>
                    <span className="text-xs text-slate-400 font-normal">Updated live</span>
                  </h2>

                  <div className="relative pl-6 space-y-6">
                    <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-slate-200"></div>

                    {trips.length > 0 ? (
                      trips.slice(0, 3).map((trip) => {
                        const destNames = trip.destinations.map((d) => d.cityName).filter(Boolean).join(' → ');
                        return (
                          <React.Fragment key={trip.id}>
                            <div className="relative">
                              <div className="absolute -left-6 top-1 w-6 h-6 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center ring-4 ring-white text-xs font-bold">
                                <MapPin className="w-3.5 h-3.5" />
                              </div>
                              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-slate-900 font-semibold">Trip Planned</span>
                                  <span className="text-[10px] text-slate-400 font-medium">{trip.status}</span>
                                </div>
                                <p className="text-slate-600 leading-relaxed font-medium text-slate-800">
                                  {trip.title}
                                </p>
                                <p className="text-slate-500 text-[11px] mt-0.5">
                                  {destNames ? `Route: ${destNames}` : `Planned budget: ₹${trip.totalBudget.toLocaleString()}`}
                                </p>
                              </div>
                            </div>

                            {trip.activities && trip.activities.length > 0 && (
                              <div className="relative">
                                <div className="absolute -left-6 top-1 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center ring-4 ring-white text-xs font-bold">
                                  <Calendar className="w-3.5 h-3.5" />
                                </div>
                                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-slate-900 font-semibold">Itinerary Schedule</span>
                                    <span className="text-[10px] text-slate-400 font-medium">{trip.activities.length} items</span>
                                  </div>
                                  <p className="text-slate-600 leading-relaxed">
                                    Added activities including <span className="font-medium text-slate-800">{trip.activities[0].title}</span> for {trip.title}.
                                  </p>
                                </div>
                              </div>
                            )}

                            {trip.totalBudget > 0 && (
                              <div className="relative">
                                <div className="absolute -left-6 top-1 w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center ring-4 ring-white text-xs font-bold">
                                  <DollarSign className="w-3.5 h-3.5" />
                                </div>
                                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-slate-900 font-semibold">Budget Tracking</span>
                                    <span className="text-[10px] text-emerald-600 font-medium">₹{trip.spentBudget.toLocaleString()} spent</span>
                                  </div>
                                  <p className="text-slate-600 leading-relaxed">
                                    Total estimated budget for {trip.title} is set at <span className="font-semibold text-slate-800">₹{trip.totalBudget.toLocaleString()}</span>.
                                  </p>
                                </div>
                              </div>
                            )}
                          </React.Fragment>
                        );
                      })
                    ) : (
                      <>
                        <div className="relative">
                          <div className="absolute -left-6 top-1 w-6 h-6 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center ring-4 ring-white text-xs font-bold">
                            <MapPin className="w-3.5 h-3.5" />
                          </div>
                          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs">
                            <span className="text-slate-900 font-semibold block mb-1">Trip Overview</span>
                            <p className="text-slate-600 leading-relaxed">
                              Plan multi-city destinations with automated route optimization.
                            </p>
                          </div>
                        </div>

                        <div className="relative">
                          <div className="absolute -left-6 top-1 w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center ring-4 ring-white text-xs font-bold">
                            <DollarSign className="w-3.5 h-3.5" />
                          </div>
                          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs">
                            <span className="text-slate-900 font-semibold block mb-1">Budget Tracker</span>
                            <p className="text-slate-600 leading-relaxed">
                              Track expenses and manage allocations across all travel destinations.
                            </p>
                          </div>
                        </div>

                        <div className="relative">
                          <div className="absolute -left-6 top-1 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center ring-4 ring-white text-xs font-bold">
                            <Calendar className="w-3.5 h-3.5" />
                          </div>
                          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs">
                            <span className="text-slate-900 font-semibold block mb-1">Itinerary Scheduling</span>
                            <p className="text-slate-600 leading-relaxed">
                              Organize day-by-day activities, tours, and accommodations.
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
