'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useTripContext } from '@/context/TripContext';
import { useConfirmDialog } from '@/context/ConfirmDialogContext';
import { ActivityCategory } from '@/types';
import { activitySchema } from '@/lib/validations/trip';
import ActivitySelector from '@/components/activities/activity-selector';
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
  ArrowUp,
  ArrowDown,
  Compass,
  Loader2,
} from 'lucide-react';

export default function ItineraryBuilderPage() {
  const params = useParams();
  const router = useRouter();
  const tripId = params.id as string;

  const { trips, destinations, addActivity, deleteActivity, toggleActivityCompleted, updateTrip } = useTripContext();
  const { confirm, showAlert } = useConfirmDialog();
  const trip = trips.find((t) => t.id === tripId) || trips[0];

  const [activeDay, setActiveDay] = useState<number>(1);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalTab, setModalTab] = useState<'custom' | 'catalog'>('custom');
  const [showAddStopModal, setShowAddStopModal] = useState<boolean>(false);
  const [selectedCityId, setSelectedCityId] = useState<string>('');
  const [isAddingStop, setIsAddingStop] = useState<boolean>(false);
  const [isAddingActivity, setIsAddingActivity] = useState<boolean>(false);

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

  const handleAdjustDuration = async (newTotalDays: number) => {
    if (newTotalDays < 1 || !trip || !trip.startDate) return;
    const start = new Date(trip.startDate);
    if (isNaN(start.getTime())) return;
    start.setDate(start.getDate() + (newTotalDays - 1));
    const newEndDate = start.toISOString().split('T')[0];
    await updateTrip(trip.id, { endDate: newEndDate });
    if (activeDay > newTotalDays) {
      setActiveDay(newTotalDays);
    }
  };

  const dayActivities = trip.activities.filter((a) => a.dayNumber === activeDay);
  const dayInsights = trip.smartInsights.filter((i) => i.dayNumber === activeDay || !i.dayNumber);

  const generateTripTitleFromStops = (stops: { cityName: string }[]) => {
    if (!stops || stops.length === 0) return 'New Trip';
    if (stops.length === 1) return `${stops[0].cityName} Trip`;
    if (stops.length === 2) return `${stops[0].cityName} & ${stops[1].cityName} Tour`;
    return `${stops[0].cityName} + ${stops.length - 1} Cities Tour`;
  };

  const handleAddStop = async () => {
    if (!selectedCityId || !trip) return;
    const dest = destinations.find((d) => d.id === selectedCityId);
    if (!dest) return;

    setIsAddingStop(true);
    try {
      const newStop = {
        id: `stop_${Date.now()}`,
        destinationId: dest.id,
        cityName: dest.name,
        country: dest.country,
        startDate: trip.startDate,
        endDate: trip.endDate,
        image: dest.coverImage,
        estimatedCost: dest.avgCostPerDay * 3,
      };

      const updatedStops = [...trip.destinations, newStop];
      const newTitle = generateTripTitleFromStops(updatedStops);

      await updateTrip(trip.id, {
        title: newTitle,
        destinations: updatedStops,
      });
      setShowAddStopModal(false);
      setSelectedCityId('');
    } finally {
      setIsAddingStop(false);
    }
  };

  const handleMoveStop = async (index: number, direction: 'up' | 'down') => {
    if (!trip) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= trip.destinations.length) return;

    const updated = [...trip.destinations];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    const newTitle = generateTripTitleFromStops(updated);

    await updateTrip(trip.id, {
      title: newTitle,
      destinations: updated,
    });
  };

  const handleDeleteStop = async (stopId: string) => {
    if (!trip || trip.destinations.length <= 1) {
      await showAlert({
        title: 'Cannot Delete Stop',
        message: 'Trip must have at least 1 destination stop.',
        variant: 'warning',
      });
      return;
    }
    const isConfirmed = await confirm({
      title: 'Delete Destination Stop',
      message: 'Are you sure you want to delete this stop from your trip itinerary?',
      confirmText: 'Yes, Delete Stop',
      cancelText: 'Cancel',
      variant: 'danger',
    });
    if (isConfirmed) {
      const updated = trip.destinations.filter((d) => d.id !== stopId);
      const newTitle = generateTripTitleFromStops(updated);

      await updateTrip(trip.id, {
        title: newTitle,
        destinations: updated,
      });
    }
  };

  const handleDeleteActivity = async (activityId: string, activityTitle: string) => {
    const isConfirmed = await confirm({
      title: 'Delete Activity',
      message: `Are you sure you want to delete "${activityTitle}" from your itinerary?`,
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
      variant: 'danger',
    });
    if (isConfirmed) {
      deleteActivity(trip.id, activityId);
    }
  };

  const handleAddActivity = async (e: React.FormEvent) => {
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

    setIsAddingActivity(true);
    try {
      await addActivity(trip.id, {
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
    } finally {
      setIsAddingActivity(false);
    }
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
      <div className="pl-0 md:pl-72 flex-1 flex flex-col min-w-0">
        <Header />

        <main className="pt-20 md:pt-24 pb-24 md:pb-16 px-4 md:px-10 min-h-screen">
          {/* Header Action Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8 bg-white p-4 md:p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Link href="/trips" className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-[10px] md:text-xs px-3 md:px-3.5 py-1.5 rounded-full transition-all inline-flex items-center gap-1.5 shadow-2xs hover:shadow-xs cursor-pointer border border-slate-200/80">
                  <ArrowLeft className="w-3 h-3 md:w-3.5 md:h-3.5 text-sky-600" />
                  <span className="hidden sm:inline">Back to My Trips</span>
                </Link>
                <span className="text-slate-300 hidden sm:inline">•</span>
                <span className="text-[10px] md:text-xs text-slate-500 font-medium hidden sm:inline">Multi-City Itinerary</span>
              </div>
              <h1 className="text-xl md:text-3xl font-bold text-slate-900">{trip.title}</h1>
              <p className="text-[10px] md:text-xs text-slate-500 mt-0.5">
                {trip.destinations.map((d) => d.cityName).join(' → ')} | {trip.startDate} to {trip.endDate}
              </p>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <Link
                href={`/trips/${trip.id}/budget`}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] md:text-xs font-semibold px-3 md:px-4 py-2 md:py-2.5 rounded-full transition-colors flex items-center gap-1.5"
              >
                <PieChart className="w-3.5 h-3.5 md:w-4 md:h-4 text-teal-600" />
                <span className="hidden sm:inline">View Budget Breakdown</span>
              </Link>
              <button
                onClick={() => {
                  setModalTab('custom');
                  setShowModal(true);
                }}
                className="bg-slate-900 hover:bg-slate-800 text-white text-[10px] md:text-xs font-bold px-3 md:px-5 py-2 md:py-2.5 rounded-full shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 md:gap-2 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 md:w-4 md:h-4 text-sky-400" />
                <span className="hidden sm:inline">Add Activity to Day {activeDay}</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>
          </div>

          {/* Route Destination Stops Bar */}
          <div className="bg-slate-900 text-white p-4 md:p-5 rounded-2xl mb-6 md:mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md">
            <div>
              <span className="text-sky-400 font-semibold text-[10px] uppercase tracking-widest block mb-0.5">
                {trip.destinations.length === 1 ? 'Destination Stop' : 'Multi-City Route Sequence'} ({trip.destinations.length} {trip.destinations.length === 1 ? 'City' : 'Cities'})
              </span>
              <p className="text-[10px] md:text-xs text-slate-300 font-medium">
                {trip.destinations.length === 1
                  ? 'Single city itinerary. Click "+ Add City" to turn this into a multi-city route.'
                  : 'Reorder stops or manage destination sequence for your journey.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {trip.destinations.map((stop, idx) => (
                <div
                  key={stop.id}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-2 md:px-3 py-1.5 flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs font-medium"
                >
                  <span className="bg-sky-500 text-slate-950 font-bold text-[10px] w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="truncate max-w-[80px] md:max-w-none">{stop.cityName}</span>

                  <div className="flex items-center gap-0.5 ml-1 border-l border-slate-700 pl-1">
                    {idx > 0 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          handleMoveStop(idx, 'up');
                        }}
                        title="Move Stop Earlier"
                        className="p-1 hover:text-sky-400 transition-colors cursor-pointer"
                      >
                        <ArrowUp className="w-2.5 h-2.5 md:w-3 md:h-3" />
                      </button>
                    )}
                    {idx < trip.destinations.length - 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          handleMoveStop(idx, 'down');
                        }}
                        title="Move Stop Later"
                        className="p-1 hover:text-sky-400 transition-colors cursor-pointer"
                      >
                        <ArrowDown className="w-2.5 h-2.5 md:w-3 md:h-3" />
                      </button>
                    )}
                    {trip.destinations.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          handleDeleteStop(stop.id);
                        }}
                        title="Remove Stop"
                        className="p-1 hover:text-red-400 transition-colors ml-1 cursor-pointer"
                      >
                        <Trash2 className="w-2.5 h-2.5 md:w-3 md:h-3 text-red-400" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => setShowAddStopModal(true)}
                className="bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 rounded-xl px-2 md:px-3 py-1.5 flex items-center gap-1 md:gap-1.5 text-[10px] md:text-xs font-semibold transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-3 h-3 md:w-3.5 md:h-3.5" />
                <span className="hidden sm:inline">Add City</span>
                <span className="sm:hidden">Add</span>
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
          <div className="mb-6 md:mb-8 bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] md:text-xs font-bold text-sky-600 uppercase tracking-wider block">
                  Planning Stage ({totalDays} {totalDays === 1 ? 'Day' : 'Days'} Total)
                </span>
                <p className="text-[10px] md:text-xs text-slate-500">Only showing planned days for your itinerary.</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleAdjustDuration(totalDays - 1)}
                  disabled={totalDays <= 1}
                  className="text-[10px] md:text-xs font-semibold px-2 md:px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1 cursor-pointer"
                  title="Remove last day from trip duration"
                >
                  <span className="hidden sm:inline">- Remove Day</span>
                  <span className="sm:hidden">- Day</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAdjustDuration(totalDays + 1)}
                  className="text-[10px] md:text-xs font-semibold px-2 md:px-3.5 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                  title="Add 1 more day to planning stage"
                >
                  <Plus className="w-3 h-3 md:w-3.5 md:h-3.5 text-sky-600" />
                  <span className="hidden sm:inline">Add Day</span>
                  <span className="sm:hidden">Add</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {daysList.map((dayNum) => {
                const count = trip.activities.filter((a) => a.dayNumber === dayNum).length;
                return (
                  <button
                    key={dayNum}
                    onClick={() => setActiveDay(dayNum)}
                    className={`px-3 md:px-5 py-2 md:py-3 rounded-xl text-[10px] md:text-xs font-semibold transition-all shrink-0 cursor-pointer flex flex-col items-center gap-1 ${
                      activeDay === dayNum
                        ? 'bg-slate-900 text-white shadow-md scale-[1.02]'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                    }`}
                  >
                    <span>Day {dayNum}</span>
                    <span
                      className={`text-[9px] md:text-[10px] px-2 py-0.2 rounded-full font-medium ${
                        activeDay === dayNum ? 'bg-sky-500 text-slate-950 font-bold' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {count} Events
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Timeline & Activities List */}
          <div className="bg-white rounded-3xl border border-slate-200 p-4 md:p-8 shadow-xs">
            <div className="flex justify-between items-center mb-4 md:mb-6 pb-4 border-b border-slate-100">
              <h2 className="text-base md:text-xl font-bold text-slate-900 flex items-center gap-2">
                <span>Day {activeDay} Schedule Timeline</span>
                <span className="text-[10px] md:text-xs font-normal text-slate-400">
                  ({dayActivities.length} activity item{dayActivities.length !== 1 ? 's' : ''})
                </span>
              </h2>

              <button
                onClick={() => setShowModal(true)}
                className="text-sky-600 font-semibold text-[10px] md:text-xs hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" /> Add Item
              </button>
            </div>

            {dayActivities.length === 0 ? (
              <div className="py-12 md:py-16 text-center border-2 border-dashed border-slate-200 rounded-2xl my-4">
                <Calendar className="w-8 h-8 md:w-10 md:h-10 text-slate-300 mx-auto mb-3" />
                <h3 className="font-bold text-slate-800 text-sm md:text-base mb-1">No activities for Day {activeDay} yet</h3>
                <p className="text-[10px] md:text-xs text-slate-400 mb-4 max-w-sm mx-auto">
                  Click below to add sightseeing tours, food stops, transport, or hotel check-in items.
                </p>
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-sky-500 text-slate-950 font-semibold px-4 md:px-6 py-2 md:py-2.5 rounded-full text-[10px] md:text-xs hover:bg-sky-400 transition-all"
                >
                  + Add First Activity
                </button>
              </div>
            ) : (
              <div className="relative pl-6 md:pl-8 space-y-4 md:space-y-6">
                <div className="absolute left-2.5 md:left-3.5 top-3 bottom-3 w-0.5 bg-slate-200"></div>

                {dayActivities.map((act) => (
                  <div
                    key={act.id}
                    className={`relative bg-slate-50 border rounded-2xl p-4 md:p-5 transition-all hover:shadow-md ${
                      act.completed ? 'opacity-70 bg-slate-100 border-slate-200' : 'border-slate-200'
                    }`}
                  >
                    <div className="absolute -left-6 md:-left-8 top-4 md:top-5 w-6 h-6 md:w-7 md:h-7 rounded-full bg-white border-2 border-sky-500 text-sky-600 flex items-center justify-center text-[10px] md:text-xs font-bold ring-4 ring-slate-50">
                      <Clock className="w-3 h-3 md:w-3.5 md:h-3.5" />
                    </div>

                    <div className="flex items-start justify-between gap-3 md:gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 md:gap-3 mb-1.5 flex-wrap">
                          <span className="bg-sky-100 text-sky-800 font-semibold text-[9px] md:text-[10px] px-2 md:px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            {act.category}
                          </span>
                          <span className="text-[10px] md:text-xs text-slate-500 font-medium flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5 md:w-3 md:h-3 text-slate-400" /> {act.time} ({act.durationMinutes} mins)
                          </span>
                        </div>

                        <h3 className={`font-bold text-sm md:text-lg text-slate-900 mb-1 ${act.completed ? 'line-through' : ''}`}>
                          {act.title}
                        </h3>

                        <p className="text-[10px] md:text-xs text-slate-600 flex items-center gap-1.5 mb-2">
                          <MapPin className="w-3 h-3 md:w-3.5 md:h-3.5 text-slate-400" /> {act.location}
                        </p>

                        {act.notes && (
                          <p className="text-[10px] md:text-xs text-slate-500 bg-white p-2 md:p-2.5 rounded-lg border border-slate-100 mt-2 italic">
                            &quot;{act.notes}&quot;
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className="font-bold text-slate-900 text-xs md:text-sm">
                          ₹{act.cost.toLocaleString()}
                        </span>

                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => toggleActivityCompleted(trip.id, act.id)}
                            className={`p-1 md:p-1.5 rounded-lg text-[10px] md:text-xs font-semibold flex items-center gap-1 transition-colors ${
                              act.completed
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                            }`}
                          >
                            <CheckCircle className="w-3 h-3 md:w-4 md:h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteActivity(act.id, act.title)}
                            className="p-1 md:p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
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
          <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-50 flex items-center justify-center p-2 md:p-4">
            <div className="bg-white rounded-2xl md:rounded-3xl max-w-2xl w-full p-4 md:p-8 shadow-2xl border border-slate-200 animate-fade-in max-h-[90vh] overflow-y-auto mx-2 md:mx-0">
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <div>
                  <h3 className="text-base md:text-xl font-bold text-slate-900">Add Activity to Day {activeDay}</h3>
                  <p className="text-[10px] md:text-xs text-slate-500 mt-0.5">Create a custom item or pick from our curated activity catalog</p>
                </div>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg md:text-xl">
                  ✕
                </button>
              </div>

              {/* Modal Tabs */}
              <div className="flex border-b border-slate-200 mb-4 md:mb-6 gap-4 md:gap-6 overflow-x-auto">
                <button
                  onClick={() => setModalTab('custom')}
                  className={`pb-3 text-[10px] md:text-xs font-bold border-b-2 transition-all cursor-pointer shrink-0 ${
                    modalTab === 'custom' ? 'border-sky-600 text-sky-600' : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Custom Activity Form
                </button>
                <button
                  onClick={() => setModalTab('catalog')}
                  className={`pb-3 text-[10px] md:text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    modalTab === 'catalog' ? 'border-sky-600 text-sky-600' : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Sparkles className="w-3 h-3 md:w-3.5 md:h-3.5" />
                  <span>Browse Activity Catalog</span>
                </button>
              </div>

              {modalTab === 'catalog' ? (
                <ActivitySelector
                  onSelectActivity={(act) => {
                    addActivity(trip.id, {
                      ...act,
                      dayNumber: activeDay,
                      time: '11:00 AM',
                      completed: false,
                    });
                  }}
                  onClose={() => setShowModal(false)}
                />
              ) : (
                <form onSubmit={handleAddActivity} className="space-y-3 md:space-y-4">
                  <div>
                    <label className="block text-[10px] md:text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Activity Title
                    </label>
                    <input
                      type="text"
                      value={activityForm.title}
                      onChange={(e) => setActivityForm({ ...activityForm, title: e.target.value })}
                      placeholder="e.g. Parasailing at Calangute Beach"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm font-medium outline-none focus:border-sky-500"
                    />
                    {errors.title && <p className="text-[10px] md:text-xs text-red-500 mt-1">{errors.title}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    <div>
                      <label className="block text-[10px] md:text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                        Category
                      </label>
                      <select
                        value={activityForm.category}
                        onChange={(e) => setActivityForm({ ...activityForm, category: e.target.value as ActivityCategory })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm font-medium outline-none focus:border-sky-500"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] md:text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                        Start Time
                      </label>
                      <input
                        type="text"
                        value={activityForm.time}
                        onChange={(e) => setActivityForm({ ...activityForm, time: e.target.value })}
                        placeholder="e.g. 10:30 AM"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm font-medium outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] md:text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={activityForm.location}
                      onChange={(e) => setActivityForm({ ...activityForm, location: e.target.value })}
                      placeholder="e.g. Panaji, Goa"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm font-medium outline-none focus:border-sky-500"
                    />
                    {errors.location && <p className="text-[10px] md:text-xs text-red-500 mt-1">{errors.location}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    <div>
                      <label className="block text-[10px] md:text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                        Duration (Minutes)
                      </label>
                      <input
                        type="number"
                        value={activityForm.durationMinutes === 0 ? '' : activityForm.durationMinutes}
                        onChange={(e) => {
                          const val = e.target.value;
                          setActivityForm({ ...activityForm, durationMinutes: val === '' ? 0 : Number(val) });
                        }}
                        placeholder="90"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm font-medium outline-none focus:border-sky-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] md:text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                        Est. Cost (₹)
                      </label>
                      <input
                        type="number"
                        value={activityForm.cost === 0 ? '' : activityForm.cost}
                        onChange={(e) => {
                          const val = e.target.value;
                          setActivityForm({ ...activityForm, cost: val === '' ? 0 : Number(val) });
                        }}
                        placeholder="0"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm font-medium outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] md:text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Notes & Special Guidance
                    </label>
                    <textarea
                      rows={2}
                      value={activityForm.notes}
                      onChange={(e) => setActivityForm({ ...activityForm, notes: e.target.value })}
                      placeholder="e.g. Remember to bring sunscreen and entry pass"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 md:px-4 py-2 text-[10px] md:text-xs outline-none focus:border-sky-500"
                    />
                  </div>

                  <div className="flex justify-end gap-2 md:gap-3 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="bg-slate-100 text-slate-700 font-semibold px-4 md:px-5 py-2 md:py-2.5 rounded-full text-[10px] md:text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isAddingActivity}
                      className="bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white font-bold px-4 md:px-6 py-2 md:py-2.5 rounded-full text-[10px] md:text-xs shadow-md inline-flex items-center gap-1.5 md:gap-2 cursor-pointer disabled:cursor-not-allowed"
                    >
                      {isAddingActivity ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-sky-400 animate-spin" />
                          <span>Adding...</span>
                        </>
                      ) : (
                        <span>Add Activity</span>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Add Stop Modal Drawer */}
        {showAddStopModal && (
          <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-200 animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Add City Stop to Route</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Select a destination city to insert into your trip plan</p>
                </div>
                <button onClick={() => setShowAddStopModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Select Destination City
                  </label>
                  <select
                    value={selectedCityId}
                    onChange={(e) => setSelectedCityId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-medium outline-none focus:border-sky-500"
                  >
                    <option value="">-- Choose a Destination --</option>
                    {destinations.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}, {d.country} (Avg ₹{d.avgCostPerDay}/day)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAddStopModal(false)}
                    className="bg-slate-100 text-slate-700 font-semibold px-5 py-2.5 rounded-full text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddStop}
                    disabled={!selectedCityId || isAddingStop}
                    className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-full text-xs shadow-md inline-flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                  >
                    {isAddingStop ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 text-sky-400 animate-spin" />
                        <span>Adding Stop...</span>
                      </>
                    ) : (
                      <span>Append Stop</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
