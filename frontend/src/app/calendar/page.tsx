'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '../../components/layout/Sidebar';
import { Header } from '../../components/layout/Header';
import { useTripContext } from '../../context/TripContext';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, MapPin, Clock, Plus } from 'lucide-react';

export default function CalendarPage() {
  const { trips } = useTripContext();
  const [selectedTripFilter, setSelectedTripFilter] = useState<string>('All');
  const [selectedDate, setSelectedDate] = useState<number | null>(15);

  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  // October 2026 calendar simulation
  const getEventsForDay = (dayNum: number) => {
    const dayStr = `2026-10-${dayNum < 10 ? '0' + dayNum : dayNum}`;
    const matchingActs: { tripTitle: string; title: string; category: string; time: string }[] = [];

    trips.forEach((t) => {
      if (selectedTripFilter !== 'All' && t.id !== selectedTripFilter) return;
      t.activities.forEach((act) => {
        if (act.dateStr === dayStr || (act.dayNumber === dayNum && t.id === 'trip_goa_01')) {
          matchingActs.push({
            tripTitle: t.title,
            title: act.title,
            category: act.category,
            time: act.time,
          });
        }
      });
    });

    return matchingActs;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <div className="pl-72 flex-1 flex flex-col min-w-0">
        <Header />

        <main className="pt-24 pb-16 px-10 min-h-screen">
          {/* Header Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Calendar Schedule</h1>
              <p className="text-sm text-slate-500 mt-1">
                Visual timeline overview of multi-day itineraries and activity events.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={selectedTripFilter}
                onChange={(e) => setSelectedTripFilter(e.target.value)}
                className="bg-white border border-slate-200 text-xs font-semibold px-4 py-2.5 rounded-full outline-none shadow-xs"
              >
                <option value="All">All Trips Timeline</option>
                {trips.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Calendar Grid Container */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
            {/* Calendar Controls */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-slate-900">October 2026</h2>
                <span className="bg-sky-50 text-sky-700 text-xs font-semibold px-3 py-1 rounded-full">
                  Current Planning Month
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>

            {/* Calendar Days Cells */}
            <div className="grid grid-cols-7 gap-2">
              {daysInMonth.map((dayNum) => {
                const events = getEventsForDay(dayNum);
                const isGoaRange = dayNum >= 15 && dayNum <= 22;
                const isSelected = selectedDate === dayNum;

                return (
                  <div
                    key={dayNum}
                    onClick={() => setSelectedDate(dayNum)}
                    className={`min-h-[110px] p-2.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-sky-500 ring-2 ring-sky-100 shadow-md bg-sky-50/30'
                        : isGoaRange
                        ? 'bg-sky-50/50 border-sky-200 hover:border-sky-300'
                        : 'bg-white border-slate-100 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className={`text-xs font-bold ${isSelected ? 'text-sky-600' : 'text-slate-700'}`}>
                        {dayNum}
                      </span>

                      {isGoaRange && (
                        <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
                      )}
                    </div>

                    <div className="space-y-1 my-1">
                      {events.slice(0, 2).map((ev, idx) => (
                        <div
                          key={idx}
                          className="bg-white border border-sky-100 p-1 rounded text-[10px] truncate font-semibold text-slate-800 shadow-2xs"
                        >
                          <span className="text-sky-600 block text-[9px] truncate">{ev.time}</span>
                          {ev.title}
                        </div>
                      ))}

                      {events.length > 2 && (
                        <span className="text-[9px] text-slate-400 font-medium block text-right">
                          +{events.length - 2} more
                        </span>
                      )}
                    </div>

                    {isGoaRange && (
                      <span className="text-[9px] font-bold text-sky-700 uppercase tracking-wider block">
                        Goa Getaway
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
