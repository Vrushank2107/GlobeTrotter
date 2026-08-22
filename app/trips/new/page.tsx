'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useTripContext } from '@/context/TripContext';
import { useConfirmDialog } from '@/context/ConfirmDialogContext';
import { tripDetailsSchema } from '@/lib/validations/trip';
import { MapPin, Calendar, DollarSign, Users, Tag, Check, ArrowRight, ArrowLeft, Sparkles, Loader2 } from 'lucide-react';

export default function NewTripPage() {
  const router = useRouter();
  const { destinations, addTrip } = useTripContext();
  const { showAlert } = useConfirmDialog();

  const [step, setStep] = useState<number>(1);
  const [selectedDestIds, setSelectedDestIds] = useState<string[]>([]);
  const [isCreatingTrip, setIsCreatingTrip] = useState<boolean>(false);

  // Form State
  const [formData, setFormData] = useState({
    title: 'New Trip',
    description: 'A multi-city coastal getaway combining historical charm with beaches.',
    startDate: '2026-10-15',
    endDate: '2026-10-22',
    totalBudget: 40000 as number | string,
    travelers: 2 as number | string,
    tags: ['Beach', 'Culture', 'Food'],
    coverImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Generate trip title based on selected destinations
  const generateTripTitle = (selectedIds: string[]) => {
    const selectedDests = selectedIds
      .map((id) => destinations.find((d) => d.id === id))
      .filter(Boolean);

    if (selectedDests.length === 0) return 'New Trip';
    if (selectedDests.length === 1) return `${selectedDests[0]!.name} Trip`;
    if (selectedDests.length === 2) return `${selectedDests[0]!.name} & ${selectedDests[1]!.name} Tour`;
    return `${selectedDests[0]!.name} + ${selectedDests.length - 1} Cities Tour`;
  };

  // Update title when destinations change
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      title: generateTripTitle(selectedDestIds),
    }));
  }, [selectedDestIds, destinations]);

  const toggleDestination = (destId: string) => {
    setSelectedDestIds((prev) =>
      prev.includes(destId) ? prev.filter((id) => id !== destId) : [...prev, destId]
    );
  };

  const handleNextStep = async () => {
    if (selectedDestIds.length === 0) {
      await showAlert({
        title: 'Select Destination',
        message: 'Please select at least 1 destination for your trip before proceeding.',
        variant: 'warning',
      });
      return;
    }
    setStep(2);
  };

  const handleCreateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Convert empty strings to default values for validation
    const formToValidate = {
      ...formData,
      totalBudget: formData.totalBudget === '' ? 40000 : Number(formData.totalBudget),
      travelers: formData.travelers === '' ? 2 : Number(formData.travelers),
    };

    const validation = tripDetailsSchema.safeParse(formToValidate);
    if (!validation.success) {
      const formatted: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) formatted[issue.path[0] as string] = issue.message;
      });
      setErrors(formatted);
      return;
    }

    setIsCreatingTrip(true);
    try {
      const selectedDests = selectedDestIds
        .map((id) => destinations.find((d) => d.id === id))
        .filter(Boolean);

      const tripStops = selectedDests.map((d) => ({
        id: d!.id,
        cityName: d!.name,
        country: d!.country,
        startDate: formData.startDate,
        endDate: formData.endDate,
        image: d!.coverImage,
        estimatedCost: d!.avgCostPerDay * 3,
      }));

      const newTripId = await addTrip({
        title: formData.title,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate,
        totalBudget: formToValidate.totalBudget,
        travelers: formToValidate.travelers,
        tags: formData.tags,
        coverImage: formData.coverImage,
        destinations: tripStops,
        status: 'Planning',
      });

      if (newTripId) {
        router.push(`/trips/${newTripId}/builder`);
      }
    } catch {
      setIsCreatingTrip(false);
    }
  };

  const availableTags = ['Beach', 'Culture', 'Food', 'Adventure', 'Nature', 'City', 'Romance', 'Relaxation'];

  const handleDaysChange = (daysCount: number) => {
    if (!formData.startDate) return;
    const start = new Date(formData.startDate);
    if (isNaN(start.getTime())) return;
    start.setDate(start.getDate() + (daysCount - 1));
    const newEndDate = start.toISOString().split('T')[0];
    setFormData((prev) => ({ ...prev, endDate: newEndDate }));
  };

  const getPlannedDaysCount = () => {
    if (!formData.startDate || !formData.endDate) return 7;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffMs = end.getTime() - start.getTime();
    if (isNaN(diffMs) || diffMs < 0) return 1;
    return Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <div className="pl-72 flex-1 flex flex-col min-w-0">
        <Header />

        <main className="pt-24 pb-16 px-10 max-w-5xl mx-auto w-full min-h-screen">
          {/* Progress Indicator */}
          <div className="mb-8 flex items-center justify-center gap-4">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-sky-600 font-bold' : 'text-slate-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${step >= 1 ? 'bg-sky-600 text-white' : 'bg-slate-200'}`}>
                1
              </div>
              <span className="text-sm">Destinations</span>
            </div>

            <div className="w-12 h-0.5 bg-slate-200"></div>

            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-sky-600 font-bold' : 'text-slate-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${step >= 2 ? 'bg-sky-600 text-white' : 'bg-slate-200'}`}>
                2
              </div>
              <span className="text-sm">Trip Details</span>
            </div>
          </div>

          {step === 1 ? (
            /* STEP 1: Select Destinations */
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
              <div className="mb-8 text-center max-w-xl mx-auto">
                <span className="text-sky-600 font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-1 mb-1">
                  <Sparkles className="w-3.5 h-3.5" /> Step 1 of 2
                </span>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Where are you heading?</h1>
                <p className="text-xs text-slate-500">
                  Select one or multiple cities to build your multi-city itinerary route.
                </p>
              </div>

              {/* Destination Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {destinations.map((dest) => {
                  const selectedIndex = selectedDestIds.indexOf(dest.id);
                  const isSelected = selectedIndex !== -1;
                  const orderNumber = selectedIndex + 1;

                  return (
                    <div
                      key={dest.id}
                      onClick={() => toggleDestination(dest.id)}
                      className={`relative rounded-2xl overflow-hidden cursor-pointer border-2 transition-all group ${
                        isSelected
                          ? 'border-sky-500 ring-4 ring-sky-100 shadow-md scale-[1.02]'
                          : 'border-slate-200 hover:border-slate-300 shadow-xs'
                      }`}
                    >
                      <div
                        className="h-44 bg-cover bg-center relative"
                        style={{ backgroundImage: `url('${dest.coverImage}')` }}
                      >
                        <div className="absolute inset-0 bg-slate-950/30 group-hover:bg-slate-950/10 transition-colors"></div>

                        {isSelected && (
                          <div className="absolute top-3 right-3 bg-sky-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-md">
                            #{orderNumber}
                          </div>
                        )}
                      </div>

                      <div className="p-4 bg-white">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-bold text-base text-slate-900">{dest.name}</h3>
                          <span className="text-xs font-semibold text-slate-500">{dest.country}</span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2 mb-3">{dest.description}</p>
                        <div className="flex justify-between items-center text-[11px] text-slate-600 font-medium">
                          <span>Avg ₹{dest.avgCostPerDay.toLocaleString()}/day</span>
                          <span className="text-amber-500 font-bold">★ {dest.rating}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Nav */}
              <div className="flex justify-between items-center border-t border-slate-100 pt-6">
                <button
                  onClick={() => router.push('/trips')}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-6 py-3 rounded-full text-xs transition-all flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to My Trips</span>
                </button>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-slate-500 font-medium">
                    {selectedDestIds.length} destination{selectedDestIds.length !== 1 ? 's' : ''} selected
                  </span>
                  <button
                    onClick={handleNextStep}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-8 py-3 rounded-full text-xs transition-all flex items-center gap-2"
                  >
                    <span>Continue to Details</span>
                    <ArrowRight className="w-4 h-4 text-sky-400" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* STEP 2: Enter Details */
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
              <div className="mb-8 text-center max-w-xl mx-auto">
                <span className="text-sky-600 font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-1 mb-1">
                  <Sparkles className="w-3.5 h-3.5" /> Step 2 of 2
                </span>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Trip Specifications</h1>
                <p className="text-xs text-slate-500">
                  Set planned duration, dates, budget targets, and traveler details for your trip.
                </p>
              </div>

              <form onSubmit={handleCreateTrip} className="space-y-6 max-w-2xl mx-auto">
                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Trip Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all"
                  />
                  {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
                </div>

                {/* Duration Choice: How many days are you planning? */}
                <div className="bg-sky-50/60 border border-sky-200/80 p-5 rounded-2xl">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-xs font-bold text-sky-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-sky-600" />
                      How many days are you planning?
                    </label>
                    <span className="bg-sky-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                      {getPlannedDaysCount()} {getPlannedDaysCount() === 1 ? 'Day' : 'Days'} Planned
                    </span>
                  </div>

                  {/* Preset Chips */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {[1, 3, 5, 7, 10, 14].map((num) => {
                      const isSelected = getPlannedDaysCount() === num;
                      return (
                        <button
                          key={num}
                          type="button"
                          onClick={() => handleDaysChange(num)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-sky-600 text-white shadow-md scale-105'
                              : 'bg-white text-slate-700 hover:bg-sky-100/80 border border-slate-200'
                          }`}
                        >
                          {num} {num === 1 ? 'Day' : 'Days'}
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Days Input */}
                  <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-sky-200/60">
                    <span className="text-xs text-slate-600 font-semibold pl-2">Custom Duration:</span>
                    <input
                      type="number"
                      min={1}
                      max={60}
                      value={getPlannedDaysCount()}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (val > 0) handleDaysChange(val);
                      }}
                      className="w-20 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-900 text-center outline-none focus:border-sky-500"
                    />
                    <span className="text-xs text-slate-500 font-medium">days in planning stage</span>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => {
                        const newStart = e.target.value;
                        const currentDays = getPlannedDaysCount();
                        setFormData((prev) => ({ ...prev, startDate: newStart }));
                        if (newStart) {
                          const start = new Date(newStart);
                          if (!isNaN(start.getTime())) {
                            start.setDate(start.getDate() + (currentDays - 1));
                            setFormData((prev) => ({ ...prev, startDate: newStart, endDate: start.toISOString().split('T')[0] }));
                          }
                        }
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all"
                    />
                    {errors.startDate && <p className="text-xs text-red-500 mt-1">{errors.startDate}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all"
                    />
                    {errors.endDate && <p className="text-xs text-red-500 mt-1">{errors.endDate}</p>}
                  </div>
                </div>

                {/* Budget & Travelers */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Total Planned Budget (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.totalBudget === 0 ? '' : formData.totalBudget}
                      onChange={(e) => setFormData({ ...formData, totalBudget: e.target.value === '' ? '' : Number(e.target.value) })}
                      placeholder="40000"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all"
                    />
                    {errors.totalBudget && <p className="text-xs text-red-500 mt-1">{errors.totalBudget}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Number of Travelers
                    </label>
                    <input
                      type="number"
                      value={formData.travelers === 0 ? '' : formData.travelers}
                      onChange={(e) => setFormData({ ...formData, travelers: e.target.value === '' ? '' : Number(e.target.value) })}
                      placeholder="2"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all"
                    />
                    {errors.travelers && <p className="text-xs text-red-500 mt-1">{errors.travelers}</p>}
                  </div>
                </div>

                {/* Travel Style Tags */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Travel Style Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag) => {
                      const isSelected = formData.tags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              tags: isSelected
                                ? formData.tags.filter((t) => t !== tag)
                                : [...formData.tags, tag],
                            });
                          }}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                            isSelected
                              ? 'bg-sky-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                  {errors.tags && <p className="text-xs text-red-500 mt-1">{errors.tags}</p>}
                </div>

                {/* Bottom Nav */}
                <div className="flex justify-between items-center border-t border-slate-100 pt-6">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-6 py-3 rounded-full text-xs transition-all flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Destinations</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isCreatingTrip}
                    className="bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white font-bold px-8 py-3 rounded-full text-xs transition-all flex items-center gap-2 shadow-md hover:shadow-lg disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isCreatingTrip ? (
                      <>
                        <Loader2 className="w-4 h-4 text-sky-400 animate-spin" />
                        <span>Creating & Building Itinerary...</span>
                      </>
                    ) : (
                      <>
                        <span>Create & Build Itinerary</span>
                        <ArrowRight className="w-4 h-4 text-sky-400" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
