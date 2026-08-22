'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useTripContext } from '@/context/TripContext';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  Plus,
  Luggage,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  DollarSign,
} from 'lucide-react';

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export default function CalendarPage() {
  const { trips } = useTripContext();
  const [selectedTripFilter, setSelectedTripFilter] = useState<string>('All');
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(9); // 0-indexed: 9 = October
  const [selectedDate, setSelectedDate] = useState<number | null>(15);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
    setSelectedDate(null);
  };

  const formatDateStr = (dayNum: number) => {
    const mStr = String(currentMonth + 1).padStart(2, '0');
    const dStr = String(dayNum).padStart(2, '0');
    return `${currentYear}-${mStr}-${dStr}`;
  };

  // Get trips active on specific day
  const getTripsForDay = (dayNum: number) => {
    const dayStr = formatDateStr(dayNum);
    return trips.filter((t) => {
      if (selectedTripFilter !== 'All' && t.id !== selectedTripFilter) return false;
      if (!t.startDate || !t.endDate) return false;
      return dayStr >= t.startDate && dayStr <= t.endDate;
    });
  };

  // Get activities scheduled on specific day
  const getActivitiesForDay = (dayNum: number) => {
    const dayStr = formatDateStr(dayNum);
    const results: { tripId: string; tripTitle: string; activity: any }[] = [];

    trips.forEach((t) => {
      if (selectedTripFilter !== 'All' && t.id !== selectedTripFilter) return;
      (t.activities || []).forEach((act) => {
        let matches = act.dateStr === dayStr;
        if (!matches && t.startDate) {
          const start = new Date(t.startDate);
          const current = new Date(currentYear, currentMonth, dayNum);
          const diffDays = Math.floor((current.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
          if (diffDays === act.dayNumber) {
            matches = true;
          }
        }
        if (matches) {
          results.push({ tripId: t.id, tripTitle: t.title, activity: act });
        }
      });
    });

    return results;
  };

  const selectedDateStr = selectedDate ? formatDateStr(selectedDate) : null;
  const selectedDayTrips = selectedDate ? getTripsForDay(selectedDate) : [];
  const selectedDayActivities = selectedDate ? getActivitiesForDay(selectedDate) : [];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <div className="pl-0 md:pl-72 flex-1 flex flex-col min-w-0">
        <Header />

        <main className="pt-20 md:pt-24 pb-24 md:pb-16 px-4 md:px-10 min-h-screen">
          {/* Header Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
            <div>
              <span className="text-sky-600 font-semibold text-[10px] md:text-xs tracking-widest uppercase flex items-center gap-1.5 mb-1">
                <CalendarIcon className="w-3 h-3 md:w-3.5 md:h-3.5" /> Interactive Schedule
              </span>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Calendar Schedule</h1>
              <p className="text-[10px] md:text-sm text-slate-500 mt-1 hidden sm:block">
                Visual timeline overview of multi-day itineraries, destinations, and activities.
              </p>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <select
                value={selectedTripFilter}
                onChange={(e) => setSelectedTripFilter(e.target.value)}
                className="bg-white border border-slate-200 text-[10px] md:text-xs font-semibold px-3 md:px-4 py-2 md:py-2.5 rounded-full outline-none shadow-xs cursor-pointer hover:border-slate-300 transition-colors"
              >
                <option value="All">All Trips ({trips.length})</option>
                {trips.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>

              <Link
                href="/trips/new"
                className="flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white text-[10px] md:text-xs font-semibold px-3 md:px-4 py-2 md:py-2.5 rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Plan Trip</span>
                <span className="sm:hidden">Plan</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
            {/* Calendar Grid Container */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-4 md:p-8 shadow-xs">
              {/* Calendar Controls */}
              <div className="flex justify-between items-center mb-4 md:mb-6 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2 md:gap-3">
                  <h2 className="text-lg md:text-2xl font-bold text-slate-900">
                    {MONTH_NAMES[currentMonth]} {currentYear}
                  </h2>
                  <span className="bg-sky-50 text-sky-700 text-[10px] md:text-xs font-semibold px-2 md:px-3 py-1 rounded-full border border-sky-100">
                    Active Month
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevMonth}
                    title="Previous Month"
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </button>
                  <button
                    onClick={handleNextMonth}
                    title="Next Month"
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </button>
                </div>
              </div>

              {/* Days of Week Header */}
              <div className="grid grid-cols-7 gap-1 md:gap-2 text-center text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                <div>Sun</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
              </div>

              {/* Calendar Days Grid */}
              <div className="grid grid-cols-7 gap-1 md:gap-2">
                {/* Empty cells for leading days of previous month */}
                {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
                  <div key={`empty-${idx}`} className="min-h-[60px] md:min-h-[100px] p-2 bg-slate-50/40 rounded-2xl border border-slate-100/50 pointer-events-none" />
                ))}

                {/* Actual Month Days */}
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((dayNum) => {
                  const dayTrips = getTripsForDay(dayNum);
                  const activities = getActivitiesForDay(dayNum);
                  const isSelected = selectedDate === dayNum;
                  const hasTrip = dayTrips.length > 0;

                  return (
                    <div
                      key={dayNum}
                      onClick={() => setSelectedDate(dayNum)}
                      className={`min-h-[65px] md:min-h-[105px] p-1.5 md:p-2.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
                        isSelected
                          ? 'border-sky-500 ring-2 ring-sky-200 shadow-md bg-sky-50/40'
                          : hasTrip
                          ? 'bg-sky-50/30 border-sky-200 hover:border-sky-400 hover:shadow-xs'
                          : 'bg-white border-slate-100 hover:bg-slate-50 hover:border-slate-200'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span
                          className={`text-[10px] md:text-xs font-bold ${
                            isSelected
                              ? 'text-sky-600'
                              : hasTrip
                              ? 'text-sky-900'
                              : 'text-slate-700'
                          }`}
                        >
                          {dayNum}
                        </span>

                        {hasTrip && (
                          <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-sky-500 animate-pulse" title="Active Trip" />
                        )}
                      </div>

                      {/* Event Snippets */}
                      <div className="space-y-0.5 md:space-y-1 my-0.5 md:my-1 hidden sm:block">
                        {activities.slice(0, 2).map((item, idx) => (
                          <div
                            key={idx}
                            className="bg-white border border-sky-100 p-0.5 md:p-1 rounded text-[9px] md:text-[10px] truncate font-semibold text-slate-800 shadow-2xs"
                          >
                            <span className="text-sky-600 block text-[8px] md:text-[9px] truncate">{item.activity.time}</span>
                            {item.activity.title}
                          </div>
                        ))}

                        {activities.length > 2 && (
                          <span className="text-[8px] md:text-[9px] text-slate-400 font-semibold block text-right">
                            +{activities.length - 2} more
                          </span>
                        )}
                      </div>

                      {/* Trip Badge Snippet */}
                      {dayTrips.length > 0 && (
                        <span className="text-[8px] md:text-[9px] font-bold text-sky-700 uppercase tracking-wider block truncate">
                          {dayTrips[0].title}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Date Details Drawer */}
            <div className="bg-white rounded-3xl border border-slate-200 p-4 md:p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                  <div>
                    <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Day Breakdown</span>
                    <h3 className="text-xl font-bold text-slate-900">
                      {selectedDate
                        ? `${MONTH_NAMES[currentMonth]} ${selectedDate}, ${currentYear}`
                        : 'Select a Date'}
                    </h3>
                  </div>
                  <CalendarIcon className="w-5 h-5 text-slate-400" />
                </div>

                {!selectedDate ? (
                  <div className="py-16 text-center text-slate-400">
                    <CalendarIcon className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                    <p className="text-sm font-medium">Click any calendar date to view scheduled activities & trips.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Active Trips on this day */}
                    {selectedDayTrips.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                          Active Trip
                        </h4>
                        {selectedDayTrips.map((t) => (
                          <div
                            key={t.id}
                            className="bg-slate-900 text-white p-4 rounded-2xl shadow-md mb-3 flex items-center justify-between"
                          >
                            <div className="min-w-0 pr-2">
                              <span className="text-[10px] text-sky-400 font-bold uppercase tracking-wider">
                                {t.status}
                              </span>
                              <h5 className="font-bold text-sm truncate">{t.title}</h5>
                              <p className="text-xs text-slate-300 truncate mt-0.5">
                                {t.startDate} → {t.endDate}
                              </p>
                            </div>
                            <Link
                              href={`/trips/${t.id}`}
                              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors shrink-0"
                              title="View Trip Details"
                            >
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Activities List */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                        Scheduled Activities ({selectedDayActivities.length})
                      </h4>

                      {selectedDayActivities.length === 0 ? (
                        <div className="py-8 bg-slate-50 rounded-2xl text-center border border-dashed border-slate-200">
                          <Clock className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                          <p className="text-xs font-semibold text-slate-600">No activities on this date.</p>
                          <p className="text-[11px] text-slate-400 mt-1">Select an active trip day to view items.</p>
                        </div>
                      ) : (
                        <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                          {selectedDayActivities.map(({ tripId, tripTitle, activity }, idx) => (
                            <div
                              key={idx}
                              className="p-3.5 bg-slate-50 hover:bg-sky-50/50 rounded-2xl border border-slate-200/80 transition-all flex items-start justify-between gap-3 group"
                            >
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="bg-sky-100 text-sky-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                                    {activity.time || 'All Day'}
                                  </span>
                                  <span className="text-[10px] font-semibold text-slate-400 truncate">
                                    {activity.category}
                                  </span>
                                </div>
                                <h6 className="font-bold text-xs text-slate-900 group-hover:text-sky-700 transition-colors">
                                  {activity.title}
                                </h6>
                                {activity.location && (
                                  <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                                    <MapPin className="w-3 h-3 text-slate-400" />
                                    {activity.location}
                                  </p>
                                )}
                              </div>

                              {activity.cost > 0 && (
                                <span className="text-xs font-bold text-slate-700 shrink-0 bg-white border border-slate-200 px-2 py-1 rounded-lg">
                                  ₹{activity.cost.toLocaleString()}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Actions Footer */}
              {selectedDayTrips.length > 0 && (
                <div className="pt-4 border-t border-slate-100 mt-4">
                  <Link
                    href={`/trips/${selectedDayTrips[0].id}/builder`}
                    className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-3 px-4 rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    <span>Edit Itinerary Builder</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
