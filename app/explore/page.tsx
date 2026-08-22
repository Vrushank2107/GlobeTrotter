'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useTripContext } from '@/context/TripContext';
import { useConfirmDialog } from '@/context/ConfirmDialogContext';
import { Compass, MapPin, Star, Sparkles, Search, ArrowRight, Loader2 } from 'lucide-react';

export default function ExplorePage() {
  const { destinations, trips, searchQuery, updateTrip } = useTripContext();
  const { showAlert } = useConfirmDialog();
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [selectedCountry, setSelectedCountry] = useState<string>('All');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [localSearch, setLocalSearch] = useState<string>('');
  const [selectedDestForTrip, setSelectedDestForTrip] = useState<typeof destinations[0] | null>(null);
  const [targetTripId, setTargetTripId] = useState<string>('');
  const [isAddingDest, setIsAddingDest] = useState<boolean>(false);

  const handleAppendDestinationToTrip = async () => {
    if (!selectedDestForTrip || !targetTripId) return;
    const targetTrip = trips.find((t) => t.id === targetTripId);
    if (!targetTrip) return;

    setIsAddingDest(true);
    try {
      const newStop = {
        id: `stop_${Date.now()}`,
        cityName: selectedDestForTrip.name,
        country: selectedDestForTrip.country,
        startDate: targetTrip.startDate,
        endDate: targetTrip.endDate,
        image: selectedDestForTrip.coverImage,
        estimatedCost: selectedDestForTrip.avgCostPerDay * 3,
      };

      await updateTrip(targetTrip.id, {
        destinations: [...targetTrip.destinations, newStop],
      });

      await showAlert({
        title: 'Destination Added',
        message: `Added ${selectedDestForTrip.name} to "${targetTrip.title}"!`,
        variant: 'success',
      });
      setSelectedDestForTrip(null);
      setTargetTripId('');
    } finally {
      setIsAddingDest(false);
    }
  };

  const countriesList = ['All', ...Array.from(new Set(destinations.map((d) => d.country)))];
  const regionsList = ['All', ...Array.from(new Set(destinations.map((d) => d.region)))];

  const effectiveSearch = localSearch || searchQuery;

  const filtered = destinations.filter((dest) => {
    const matchesSearch = effectiveSearch
      ? dest.name.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
        dest.country.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
        dest.description.toLowerCase().includes(effectiveSearch.toLowerCase())
      : true;
    const matchesTag = selectedTag === 'All' || dest.tags.includes(selectedTag);
    const matchesCountry = selectedCountry === 'All' || dest.country === selectedCountry;
    const matchesRegion = selectedRegion === 'All' || dest.region === selectedRegion;
    return matchesSearch && matchesTag && matchesCountry && matchesRegion;
  });

  const availableTags = ['All', 'Beach', 'Culture', 'Nightlife', 'City', 'Food', 'Technology', 'Nature'];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <div className="pl-72 flex-1 flex flex-col min-w-0">
        <Header />

        <main className="pt-24 pb-16 px-10 min-h-screen">
          {/* Hero Banner */}
          <div className="mb-8 bg-slate-900 text-white rounded-3xl p-8 shadow-md relative overflow-hidden">
            <div className="relative z-10 max-w-2xl">
              <span className="text-sky-400 font-semibold text-xs uppercase tracking-widest flex items-center gap-1.5 mb-2">
                <Sparkles className="w-3.5 h-3.5" /> Destination Discovery
              </span>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Explore World Destinations</h1>
              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                Curated travel spots complete with daily estimated budgets, popular activities, and traveler ratings.
              </p>
            </div>
          </div>

          {/* Search & Multi-Filter Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6 shadow-xs flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search city, country, or keyword..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium outline-none focus:border-sky-500"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-1.5 flex-1 md:flex-initial">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Country:</span>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-sky-500"
                >
                  {countriesList.map((c) => (
                    <option key={c} value={c}>
                      {c === 'All' ? 'All Countries' : c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5 flex-1 md:flex-initial">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Region:</span>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-sky-500"
                >
                  {regionsList.map((r) => (
                    <option key={r} value={r}>
                      {r === 'All' ? 'All Regions' : r}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 mb-8 border-b border-slate-200 pb-4 overflow-x-auto">
            {availableTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedTag === tag
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Destination Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((dest) => (
              <div
                key={dest.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-xl transition-all flex flex-col group"
              >
                <div
                  className="w-full h-52 bg-cover bg-center relative"
                  style={{ backgroundImage: `url('${dest.coverImage}')` }}
                >
                  <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/0 transition-colors"></div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/90 backdrop-blur-md text-slate-900 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-xs">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      {dest.rating}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-xl text-slate-900">{dest.name}</h3>
                    <span className="text-xs font-semibold text-slate-500">{dest.country}</span>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed mb-4">{dest.description}</p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {dest.tags.map((t) => (
                      <span
                        key={t}
                        className="bg-slate-100 text-slate-600 text-[10px] font-semibold px-2.5 py-0.5 rounded-full"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                        Avg Cost/Day
                      </span>
                      <span className="font-bold text-slate-900 text-sm">
                        ₹{dest.avgCostPerDay.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedDestForTrip(dest)}
                        className="bg-slate-100 text-slate-800 hover:bg-slate-200 font-semibold px-3 py-2 rounded-full text-xs transition-all cursor-pointer"
                      >
                        + Add to Trip
                      </button>
                      <Link
                        href="/trips/new"
                        className="bg-sky-50 text-sky-700 hover:bg-sky-100 font-semibold px-3.5 py-2 rounded-full text-xs transition-all inline-flex items-center gap-1"
                      >
                        <span>Plan</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add to Trip Modal */}
          {selectedDestForTrip && (
            <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-200 animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-slate-900">Add {selectedDestForTrip.name} to Trip</h3>
                  <button onClick={() => setSelectedDestForTrip(null)} className="text-slate-400 font-bold">
                    ✕
                  </button>
                </div>
                <p className="text-xs text-slate-500 mb-6">
                  Select one of your existing planned itineraries to append {selectedDestForTrip.name} as a stop.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Select Target Trip
                    </label>
                    <select
                      value={targetTripId}
                      onChange={(e) => setTargetTripId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-medium outline-none focus:border-sky-500"
                    >
                      <option value="">-- Choose a Planned Trip --</option>
                      {trips.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.title} ({t.destinations.length} Stops)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => setSelectedDestForTrip(null)}
                      className="bg-slate-100 text-slate-700 font-semibold px-5 py-2.5 rounded-full text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAppendDestinationToTrip}
                      disabled={!targetTripId || isAddingDest}
                      className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-full text-xs shadow-md inline-flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                    >
                      {isAddingDest ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 text-sky-400 animate-spin" />
                          <span>Adding...</span>
                        </>
                      ) : (
                        <span>Confirm Add</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
