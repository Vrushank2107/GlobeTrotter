'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useTripContext } from '@/context/TripContext';
import {
  Calendar as CalendarIcon,
  List,
  MapPin,
  Clock,
  ArrowLeft,
  PieChart,
  DollarSign,
  Grid,
  CheckCircle2,
  Edit3,
} from 'lucide-react';

export default function ItineraryViewPage() {
  const params = useParams();
  const tripId = params.id as string;
  const router = useRouter();
  const { user, trips, loading, isSidebarCollapsed } = useTripContext();

  const trip = trips.find((t) => t.id === tripId) || trips[0];
  const [viewMode, setViewMode] = useState<'timeline' | 'calendar' | 'cities'>('timeline');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-sm text-slate-500">Trip not found.</p>
      </div>
    );
  }

  const getTripDaysCount = (tripObj: typeof trip) => {
    if (!tripObj) return 7;
    let daysFromDates = 7;
    if (tripObj.startDate && tripObj.endDate) {
      const start = new Date(tripObj.startDate);
      const end = new Date(tripObj.endDate);
      const diffMs = end.getTime() - start.getTime();
      if (!isNaN(diffMs) && diffMs >= 0) {
        daysFromDates = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
      }
    }
    const maxActDay = (tripObj.activities || []).reduce((max, a) => Math.max(max, a.dayNumber || 1), 1);
    return Math.max(1, daysFromDates, maxActDay);
  };

  const totalDays = getTripDaysCount(trip);
  const daysList = Array.from({ length: totalDays }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <div className={`pl-72 flex-1 flex flex-col min-w-0 transition-all duration-300 ${isSidebarCollapsed ? 'md:pl-20' : 'md:pl-72'}`}>
        <Header />

        <main className="pt-24 pb-16 px-10 min-h-screen">
          {/* Header Action Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Link href="/trips" className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs px-3.5 py-1.5 rounded-full transition-all inline-flex items-center gap-1.5 shadow-2xs hover:shadow-xs cursor-pointer border border-slate-200/80">
                  <ArrowLeft className="w-3.5 h-3.5 text-sky-600" />
                  <span>Back to My Trips</span>
                </Link>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500 font-medium">Itinerary View</span>
              </div>
              <h1 className="text-3xl font-bold text-slate-900">{trip.title}</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {trip.destinations.map((d) => d.cityName).join(' → ')} | {trip.startDate} to {trip.endDate}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* View Mode Toggle Switch */}
              <div className="bg-slate-100 p-1 rounded-full flex items-center gap-1 border border-slate-200">
                <button
                  onClick={() => setViewMode('timeline')}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    viewMode === 'timeline'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  <span>Timeline</span>
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    viewMode === 'calendar'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <CalendarIcon className="w-3.5 h-3.5" />
                  <span>Calendar</span>
                </button>
                <button
                  onClick={() => setViewMode('cities')}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    viewMode === 'cities'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Grid className="w-3.5 h-3.5" />
                  <span>By Cities</span>
                </button>
              </div>

              <Link
                href={`/trips/${trip.id}/builder`}
                className="bg-sky-50 text-sky-700 hover:bg-sky-100 text-xs font-semibold px-4 py-2.5 rounded-full transition-colors flex items-center gap-1.5"
              >
                <Edit3 className="w-4 h-4 text-sky-600" />
                <span>Edit Builder</span>
              </Link>
            </div>
          </div>

          {/* VIEW MODE CONTENT */}
          {viewMode === 'timeline' && (
            <div className="space-y-8">
              {daysList.map((dayNum) => {
                const dayActs = trip.activities.filter((a) => a.dayNumber === dayNum);

                return (
                  <div key={dayNum} className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                      <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                        <span className="bg-slate-900 text-white w-8 h-8 rounded-full flex items-center justify-center text-xs">
                          {dayNum}
                        </span>
                        <span>Day {dayNum} Itinerary</span>
                      </h3>
                      <span className="text-xs font-semibold text-slate-400">
                        {dayActs.length} scheduled event{dayActs.length !== 1 ? 's' : ''}
                      </span>
                    </div>

                    {dayActs.length === 0 ? (
                      <p className="text-xs text-slate-400 italic py-4">No activities planned for this day.</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {dayActs.map((act) => (
                          <div key={act.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="bg-sky-100 text-sky-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                                  {act.category}
                                </span>
                                <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-slate-400" /> {act.time}
                                </span>
                              </div>
                              <h4 className="font-bold text-sm text-slate-900">{act.title}</h4>
                              <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                                <MapPin className="w-3 h-3 text-slate-400" /> {act.location}
                              </p>
                            </div>
                            <span className="font-bold text-sm text-slate-900 shrink-0">₹{act.cost.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {viewMode === 'calendar' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Visual Day-by-Day Matrix</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {daysList.map((dayNum) => {
                  const dayActs = trip.activities.filter((a) => a.dayNumber === dayNum);
                  return (
                    <div key={dayNum} className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 min-h-[160px] flex flex-col">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-bold text-xs text-slate-900">Day {dayNum}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">{dayActs.length} Items</span>
                      </div>
                      <div className="space-y-1.5 flex-1">
                        {dayActs.map((act) => (
                          <div key={act.id} className="bg-white p-2 rounded-lg border border-slate-200 text-[11px] font-semibold text-slate-800 shadow-2xs">
                            <span className="text-sky-600 block text-[9px]">{act.time}</span>
                            {act.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {viewMode === 'cities' && (
            <div className="space-y-6">
              {trip.destinations.map((stop) => {
                const cityActs = trip.activities.filter((a) => a.location.toLowerCase().includes(stop.cityName.toLowerCase()));
                return (
                  <div key={stop.id} className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
                    <div className="flex items-center gap-4 mb-6">
                      <img src={stop.image} alt={stop.cityName} className="w-16 h-16 rounded-2xl object-cover" />
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900">{stop.cityName}</h3>
                        <p className="text-xs text-slate-500">{stop.country} • Est. Cost: ₹{stop.estimatedCost.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {cityActs.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">No specific activities explicitly tagged for {stop.cityName}.</p>
                      ) : (
                        cityActs.map((act) => (
                          <div key={act.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                            <div>
                              <span className="font-bold text-slate-900 block text-sm">{act.title}</span>
                              <span className="text-slate-500">Day {act.dayNumber} ({act.time}) • {act.category}</span>
                            </div>
                            <span className="font-bold text-slate-900">₹{act.cost.toLocaleString()}</span>
                          </div>
                        ))
                      )}
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
