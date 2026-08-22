'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sidebar } from '../../../../components/layout/Sidebar';
import { Header } from '../../../../components/layout/Header';
import { useTripContext } from '../../../../context/TripContext';
import { ActivityCategory } from '../../../../types';
import { activitySchema } from '../../../../lib/validations/trip';
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Info,
  DollarSign,
  ChevronRight,
  Sparkles,
  ArrowLeft,
  PieChart,
} from 'lucide-react';

export default function ItineraryBuilderPage() {
  const params = useParams();
  const router = useRouter();
  const tripId = params.id as string;

  const { trips, addActivity, deleteActivity, toggleActivityCompleted } = useTripContext();
  const trip = trips.find((t) => t.id === tripId) || trips[0];

  const [activeDay, setActiveDay] = useState<number>(1);
  const [showModal, setShowModal] = useState<boolean>(false);

  // Modal Form State
  const [activityForm, setActivityForm] = useState({
    title: '',
    category: 'Sightseeing' as ActivityCategory,
    location: '',
    time: '10:00 AM',
    durationMinutes: 90,
    cost: 1000,
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!trip) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-sm text-slate-500">Trip not found.</p>
      </div>
    );
  }

  // Generate days array (e.g. Day 1, Day 2, Day 3, Day 4, Day 5, Day 6, Day 7)
  const totalDays = 7;
  const daysList = Array.from({ length: totalDays }, (_, i) => i + 1);

  const dayActivities = trip.activities.filter((a) => a.dayNumber === activeDay);
  const dayInsights = trip.smartInsights.filter((i) => i.dayNumber === activeDay || !i.dayNumber);

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = activitySchema.safeParse({
      ...activityForm,
      cost: Number(activityForm.cost),
      durationMinutes: Number(activityForm.durationMinutes),
      dayNumber: activeDay,
    });

    if (!validation.success) {
      const formatted: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) formatted[issue.path[0] as string] = issue.message;
      });
      setErrors(formatted);
      return;
    }

    addActivity(trip.id, {
      ...activityForm,
      cost: Number(activityForm.cost),
      durationMinutes: Number(activityForm.durationMinutes),
      dayNumber: activeDay,
      completed: false,
    });

    setShowModal(false);
    setActivityForm({
      title: '',
      category: 'Sightseeing',
      location: '',
      time: '10:00 AM',
      durationMinutes: 90,
      cost: 1000,
      notes: '',
    });
  };

  const categories: ActivityCategory[] = [
    'Sightseeing',
    'Food',
    'Adventure',
    'Culture',
    'Entertainment',
    'Nature',
    'Shopping',
    'Transport',
    'Accommodation',
  ];

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
                <Link href="/trips" className="text-xs text-sky-600 hover:underline font-semibold flex items-center gap-1">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to My Trips
                </Link>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500 font-medium">Multi-City Itinerary</span>
              </div>
              <h1 className="text-3xl font-bold text-slate-900">{trip.title}</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {trip.destinations.map((d) => d.cityName).join(' → ')} | {trip.startDate} to {trip.endDate}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={`/trips/${trip.id}/budget`}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-4 py-2.5 rounded-full transition-colors flex items-center gap-1.5"
              >
                <PieChart className="w-4 h-4 text-teal-600" />
                <span>View Budget Breakdown</span>
              </Link>
              <button
                onClick={() => setShowModal(true)}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-sky-400" />
                <span>Add Activity to Day {activeDay}</span>
              </button>
            </div>
          </div>

          {/* Smart Insights Alert Banner */}
          {dayInsights.length > 0 && (
            <div className="mb-8 space-y-3">
              {dayInsights.map((insight) => (
                <div
                  key={insight.id}
                  className={`p-4 rounded-2xl border flex items-start gap-3 shadow-xs ${
                    insight.severity === 'critical'
                      ? 'bg-red-50 border-red-200 text-red-900'
                      : insight.severity === 'warning'
                      ? 'bg-amber-50 border-amber-200 text-amber-900'
                      : 'bg-sky-50 border-sky-200 text-sky-900'
                  }`}
                >
                  <AlertTriangle
                    className={`w-5 h-5 shrink-0 mt-0.5 ${
                      insight.severity === 'critical'
                        ? 'text-red-600'
                        : insight.severity === 'warning'
                        ? 'text-amber-600'
                        : 'text-sky-600'
                    }`}
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-sm mb-0.5 flex items-center gap-2">
                      <span>{insight.title}</span>
                      <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-white/80">
                        Smart Intelligence
                      </span>
                    </h4>
                    <p className="text-xs leading-relaxed">{insight.message}</p>
                    {insight.suggestion && (
                      <p className="text-xs font-semibold mt-1 opacity-90">
                        💡 Suggestion: {insight.suggestion}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Day Tabs Selector */}
          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 border-b border-slate-200">
            {daysList.map((dayNum) => {
              const count = trip.activities.filter((a) => a.dayNumber === dayNum).length;
              return (
                <button
                  key={dayNum}
                  onClick={() => setActiveDay(dayNum)}
                  className={`px-5 py-3 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer flex flex-col items-center gap-1 ${
                    activeDay === dayNum
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span>Day {dayNum}</span>
                  <span
                    className={`text-[10px] px-2 py-0.2 rounded-full font-medium ${
                      activeDay === dayNum ? 'bg-sky-500 text-slate-950' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {count} Events
                  </span>
                </button>
              );
            })}
          </div>

          {/* Timeline & Activities List */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <span>Day {activeDay} Schedule Timeline</span>
                <span className="text-xs font-normal text-slate-400">
                  ({dayActivities.length} activity item{dayActivities.length !== 1 ? 's' : ''})
                </span>
              </h2>

              <button
                onClick={() => setShowModal(true)}
                className="text-sky-600 font-semibold text-xs hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Item
              </button>
            </div>

            {dayActivities.length === 0 ? (
              <div className="py-16 text-center border-2 border-dashed border-slate-200 rounded-2xl my-4">
                <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h3 className="font-bold text-slate-800 text-base mb-1">No activities for Day {activeDay} yet</h3>
                <p className="text-xs text-slate-400 mb-4 max-w-sm mx-auto">
                  Click below to add sightseeing tours, food stops, transport, or hotel check-in items.
                </p>
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-sky-500 text-slate-950 font-semibold px-6 py-2.5 rounded-full text-xs hover:bg-sky-400 transition-all"
                >
                  + Add First Activity
                </button>
              </div>
            ) : (
              <div className="relative pl-8 space-y-6">
                <div className="absolute left-3.5 top-3 bottom-3 w-0.5 bg-slate-200"></div>

                {dayActivities.map((act) => (
                  <div
                    key={act.id}
                    className={`relative bg-slate-50 border rounded-2xl p-5 transition-all hover:shadow-md ${
                      act.completed ? 'opacity-70 bg-slate-100 border-slate-200' : 'border-slate-200'
                    }`}
                  >
                    <div className="absolute -left-8 top-5 w-7 h-7 rounded-full bg-white border-2 border-sky-500 text-sky-600 flex items-center justify-center text-xs font-bold ring-4 ring-slate-50">
                      <Clock className="w-3.5 h-3.5" />
                    </div>

                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1.5">
                          <span className="bg-sky-100 text-sky-800 font-semibold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            {act.category}
                          </span>
                          <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" /> {act.time} ({act.durationMinutes} mins)
                          </span>
                        </div>

                        <h3 className={`font-bold text-lg text-slate-900 mb-1 ${act.completed ? 'line-through' : ''}`}>
                          {act.title}
                        </h3>

                        <p className="text-xs text-slate-600 flex items-center gap-1.5 mb-2">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" /> {act.location}
                        </p>

                        {act.notes && (
                          <p className="text-xs text-slate-500 bg-white p-2.5 rounded-lg border border-slate-100 mt-2 italic">
                            &quot;{act.notes}&quot;
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <span className="font-bold text-slate-900 text-sm">
                          ₹{act.cost.toLocaleString()}
                        </span>

                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => toggleActivityCompleted(trip.id, act.id)}
                            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                              act.completed
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                            }`}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteActivity(trip.id, act.id)}
                            className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        {/* Add Activity Modal Drawer */}
        {showModal && (
          <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-slate-200 animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">Add Activity to Day {activeDay}</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddActivity} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Activity Title
                  </label>
                  <input
                    type="text"
                    value={activityForm.title}
                    onChange={(e) => setActivityForm({ ...activityForm, title: e.target.value })}
                    placeholder="e.g. Parasailing at Calangute Beach"
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
                      value={activityForm.category}
                      onChange={(e) => setActivityForm({ ...activityForm, category: e.target.value as ActivityCategory })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:border-sky-500"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Start Time
                    </label>
                    <input
                      type="text"
                      value={activityForm.time}
                      onChange={(e) => setActivityForm({ ...activityForm, time: e.target.value })}
                      placeholder="e.g. 10:30 AM"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={activityForm.location}
                    onChange={(e) => setActivityForm({ ...activityForm, location: e.target.value })}
                    placeholder="e.g. Panaji, Goa"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:border-sky-500"
                  />
                  {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Duration (Minutes)
                    </label>
                    <input
                      type="number"
                      value={activityForm.durationMinutes}
                      onChange={(e) => setActivityForm({ ...activityForm, durationMinutes: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Est. Cost (₹)
                    </label>
                    <input
                      type="number"
                      value={activityForm.cost}
                      onChange={(e) => setActivityForm({ ...activityForm, cost: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Notes & Special Guidance
                  </label>
                  <textarea
                    rows={2}
                    value={activityForm.notes}
                    onChange={(e) => setActivityForm({ ...activityForm, notes: e.target.value })}
                    placeholder="e.g. Remember to bring sunscreen and entry pass"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs outline-none focus:border-sky-500"
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
                    Save Activity
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
