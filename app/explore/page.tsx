'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useTripContext } from '@/context/TripContext';
import { useConfirmDialog } from '@/context/ConfirmDialogContext';
import { Compass, MapPin, Star, Sparkles, Search, ArrowRight, Loader2, Plus } from 'lucide-react';

export default function ExplorePage() {
  const { destinations, trips, searchQuery, updateTrip, isSidebarCollapsed } = useTripContext();
  const { showAlert } = useConfirmDialog();
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [selectedCountry, setSelectedCountry] = useState<string>('All');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [localSearch, setLocalSearch] = useState<string>('');
  const [selectedDestForTrip, setSelectedDestForTrip] = useState<typeof destinations[0] | null>(null);
  const [targetTripId, setTargetTripId] = useState<string>('');
  const [isAddingDest, setIsAddingDest] = useState<boolean>(false);

  // Load saved filter states from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTag = localStorage.getItem('explore_selectedTag');
      const savedCountry = localStorage.getItem('explore_selectedCountry');
      const savedRegion = localStorage.getItem('explore_selectedRegion');
      const savedSearch = localStorage.getItem('explore_localSearch');

      if (savedTag) setSelectedTag(savedTag);
      if (savedCountry) setSelectedCountry(savedCountry);
      if (savedRegion) setSelectedRegion(savedRegion);
      if (savedSearch) setLocalSearch(savedSearch);
    }
  }, []);

  // Save filter states to localStorage when they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('explore_selectedTag', selectedTag);
    }
  }, [selectedTag]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('explore_selectedCountry', selectedCountry);
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('explore_selectedRegion', selectedRegion);
    }
  }, [selectedRegion]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('explore_localSearch', localSearch);
    }
  }, [localSearch]);

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
           <div className={`pl-0 flex-1 flex flex-col min-w-0 transition-all duration-300 ${isSidebarCollapsed ? 'md:pl-20' : 'md:pl-72'}`}>
        <Header />

        <main className="pt-20 md:pt-24 pb-24 md:pb-16 px-4 md:px-10 min-h-screen">
          <style>{`
            .line-clamp-2 {
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }
          `}</style>
          {/* Hero Banner */}
          <div className="mb-6 md:mb-8 bg-gradient-to-br from-slate-900 via-slate-800 to-sky-900 text-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-lg relative overflow-hidden">
            {/* Decorative SVG Background Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path fill="#FFFFFF" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,79.6,-46.3C87.4,-33.5,90.1,-18,88.4,-2.9C86.7,12.2,80.7,26.9,71.8,39.4C62.9,51.9,51.1,62.2,37.8,70.1C24.5,78,9.7,83.5,-4.5,89.1C-18.7,94.7,-32.3,100.4,-44.5,94.6C-56.7,88.8,-67.5,71.5,-75.3,54.1C-83.1,36.7,-87.9,19.2,-86.9,2.3C-85.9,-14.6,-79.1,-30.9,-69.2,-44.3C-59.3,-57.7,-46.3,-68.2,-32.7,-75.8C-19.1,-83.4,-4.9,-88.1,6.7,-96.4C18.3,-104.7,27.5,-116.6,38.9,-115.9C50.3,-115.2,63.9,-101.9,71.4,-86.8C78.9,-71.7,80.3,-54.8,76.7,-39.3C73.1,-23.8,64.5,-9.7,53.6,2.3C42.7,14.3,29.5,24.2,17.2,32.1C4.9,40,-6.5,45.9,-16.8,43.6C-27.1,41.3,-36.3,30.8,-42.8,18.9C-49.3,7,-53.2,-6.3,-52.6,-19.8C-52,-33.3,-47.9,-46.4,-39.6,-56.6C-31.3,-66.8,-18.8,-74.1,-5.7,-73.4C7.4,-72.7,21.2,-64,30.5,-51.8L44.7,-76.4Z" transform="translate(100 100)" />
              </svg>
            </div>
            
            {/* Globe SVG */}
            <div className="absolute bottom-0 right-0 w-48 h-48 md:w-64 md:h-64 opacity-20">
              <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="45" fill="none" stroke="white" strokeWidth="1"/>
                <ellipse cx="50" cy="50" rx="45" ry="20" fill="none" stroke="white" strokeWidth="0.5"/>
                <ellipse cx="50" cy="50" rx="20" ry="45" fill="none" stroke="white" strokeWidth="0.5"/>
                <line x1="5" y1="50" x2="95" y2="50" stroke="white" strokeWidth="0.5"/>
                <line x1="50" y1="5" x2="50" y2="95" stroke="white" strokeWidth="0.5"/>
              </svg>
            </div>

            <div className="relative z-10 max-w-2xl">
              <span className="text-sky-400 font-semibold text-[10px] md:text-xs uppercase tracking-widest flex items-center gap-1.5 mb-2">
                <Sparkles className="w-3 h-3 md:w-3.5 md:h-3.5" /> Destination Discovery
              </span>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">Explore World Destinations</h1>
              <p className="text-[10px] md:text-xs text-slate-300 leading-relaxed mb-4 md:mb-6">
                Discover curated travel destinations with detailed cost estimates, must-visit attractions, local cuisine recommendations, and authentic traveler reviews to plan your perfect adventure.
              </p>
              
              {/* Stats Bar */}
              <div className="flex items-center gap-4 md:gap-6 text-[10px] md:text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center">
                    <Compass className="w-4 h-4 text-sky-400" />
                  </div>
                  <div>
                    <span className="font-bold text-white">{destinations.length}+</span>
                    <span className="text-slate-400 block">Destinations</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <Star className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <span className="font-bold text-white">4.8+</span>
                    <span className="text-slate-400 block">Avg Rating</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <span className="font-bold text-white">50+</span>
                    <span className="text-slate-400 block">Countries</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search & Multi-Filter Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-5 mb-6 shadow-xs flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="w-3.5 h-3.5 md:w-4 md:h-4 absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search city, country, or keyword..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 md:pl-10 pr-4 py-2 md:py-2.5 text-[10px] md:text-xs font-medium outline-none focus:border-sky-500"
              />
            </div>

            <div className="flex flex-col items-stretch gap-2 md:gap-3 w-full md:w-auto">
              <div className="flex items-center gap-1 md:gap-1.5 w-full">
                <span className="text-[10px] md:text-xs text-slate-500 font-semibold uppercase tracking-wider shrink-0">Country:</span>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-2 md:px-3 py-2 text-[10px] md:text-xs font-semibold outline-none focus:border-sky-500 flex-1"
                >
                  {countriesList.map((c) => (
                    <option key={c} value={c}>
                      {c === 'All' ? 'All Countries' : c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1 md:gap-1.5 w-full">
                <span className="text-[10px] md:text-xs text-slate-500 font-semibold uppercase tracking-wider shrink-0">Region:</span>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-2 md:px-3 py-2 text-[10px] md:text-xs font-semibold outline-none focus:border-sky-500 flex-1"
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
          <div className="flex items-center gap-2 mb-6 md:mb-8 border-b border-slate-200 pb-4 overflow-x-auto">
            {availableTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 md:px-4 py-2 rounded-full text-[10px] md:text-xs font-semibold transition-all cursor-pointer shrink-0 ${
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
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 transition-all duration-300 ${isSidebarCollapsed ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
            {filtered.map((dest) => (
              <div
                key={dest.id}
                className="bg-white rounded-2xl md:rounded-3xl overflow-hidden border border-slate-200 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col group"
              >
                <div
                  className="w-full h-44 md:h-52 bg-cover bg-center relative"
                  style={{ backgroundImage: `url('${dest.coverImage}')` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
                  
                  {/* Top Badge */}
                  <div className="absolute top-3 md:top-4 left-3 md:left-4">
                    <span className="bg-white/95 backdrop-blur-md text-slate-900 text-[10px] md:text-xs font-bold px-2 md:px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                      <MapPin className="w-3 h-3 md:w-3.5 md:h-3.5 text-sky-600" />
                      {dest.region}
                    </span>
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute top-3 md:top-4 right-3 md:right-4">
                    <span className="bg-white/95 backdrop-blur-md text-slate-900 text-[10px] md:text-xs font-bold px-2 md:px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                      <Star className="w-3 h-3 md:w-3.5 md:h-3.5 text-amber-500 fill-amber-500" />
                      {dest.rating}
                    </span>
                  </div>

                  {/* Country Label at Bottom */}
                  <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4">
                    <span className="text-white text-[10px] md:text-xs font-semibold uppercase tracking-wider bg-slate-900/50 backdrop-blur-md px-2 py-1 rounded-full">
                      {dest.country}
                    </span>
                  </div>
                </div>

                <div className="p-4 md:p-6 flex flex-col flex-1">
                  <div className="mb-2">
                    <h3 className="font-bold text-lg md:text-xl text-slate-900 mb-1">{dest.name}</h3>
                    <p className="text-[10px] md:text-xs text-slate-500 leading-relaxed line-clamp-2">{dest.description}</p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 md:gap-1.5 mb-4">
                    {dest.tags.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="bg-gradient-to-r from-sky-50 to-slate-50 text-sky-700 border border-sky-200/50 text-[10px] font-semibold px-2 md:px-2.5 py-0.5 rounded-full"
                      >
                        {t}
                      </span>
                    ))}
                    {dest.tags.length > 3 && (
                      <span className="bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                        +{dest.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Additional Info Section */}
                  <div className="grid grid-cols-2 gap-2 mb-4 p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                        <span className="text-emerald-600 text-[10px] font-bold">₹</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Avg/Day</span>
                        <span className="text-[10px] md:text-xs font-bold text-slate-900">
                          {dest.avgCostPerDay.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
                        <Star className="w-3 h-3 text-amber-600 fill-amber-600" />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Rating</span>
                        <span className="text-[10px] md:text-xs font-bold text-slate-900">{dest.rating}/5</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-auto pt-3 border-t border-slate-100 flex flex-col md:flex-row items-stretch md:items-center gap-2">
                    <button
                      onClick={() => setSelectedDestForTrip(dest)}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-4 py-2.5 rounded-xl text-[10px] md:text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-3 h-3 md:w-3.5 md:h-3.5" />
                      Add to Trip
                    </button>
                    <Link
                      href="/trips/new"
                      className="flex-1 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-semibold px-4 py-2.5 rounded-xl text-[10px] md:text-xs transition-all inline-flex items-center gap-1.5 justify-center shadow-md hover:shadow-lg"
                    >
                      <span>Plan Trip</span>
                      <ArrowRight className="w-3 h-3 md:w-3.5 md:h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add to Trip Modal */}
          {selectedDestForTrip && (
            <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 md:p-4">
              <div className="bg-white rounded-2xl md:rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl border border-slate-200 animate-fade-in mx-2 md:mx-0">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-base md:text-lg font-bold text-slate-900">Add to Trip</h3>
                    <p className="text-[10px] md:text-xs text-slate-500 mt-1">
                      {selectedDestForTrip.name}, {selectedDestForTrip.country}
                    </p>
                  </div>
                  <button 
                    onClick={() => setSelectedDestForTrip(null)} 
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                  >
                    <span className="text-slate-500 font-bold">✕</span>
                  </button>
                </div>

                {/* Destination Preview */}
                <div className="flex items-center gap-3 mb-6 p-3 bg-slate-50 rounded-xl">
                  <div
                    className="w-16 h-16 rounded-lg bg-cover bg-center"
                    style={{ backgroundImage: `url('${selectedDestForTrip.coverImage}')` }}
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-sm text-slate-900">{selectedDestForTrip.name}</h4>
                    <p className="text-[10px] text-slate-500">{selectedDestForTrip.country}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span className="text-[10px] font-semibold text-slate-700">{selectedDestForTrip.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] md:text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Select Target Trip
                    </label>
                    <select
                      value={targetTripId}
                      onChange={(e) => setTargetTripId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 md:px-4 py-2 md:py-3 text-[10px] md:text-xs font-medium outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                    >
                      <option value="">-- Choose a Planned Trip --</option>
                      {trips.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.title} ({t.destinations.length} Stops)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-end gap-2 md:gap-3 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => setSelectedDestForTrip(null)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 md:px-5 py-2 md:py-2.5 rounded-xl text-[10px] md:text-xs transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAppendDestinationToTrip}
                      disabled={!targetTripId || isAddingDest}
                      className="bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 disabled:opacity-50 text-white font-bold px-4 md:px-6 py-2 md:py-2.5 rounded-xl text-[10px] md:text-xs shadow-md inline-flex items-center gap-1.5 md:gap-2 cursor-pointer disabled:cursor-not-allowed transition-all"
                    >
                      {isAddingDest ? (
                        <>
                          <Loader2 className="w-3 h-3 md:w-3.5 md:h-3.5 text-white animate-spin" />
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
