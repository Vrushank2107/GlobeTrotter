'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useTripContext } from '@/context/TripContext';
import { useConfirmDialog } from '@/context/ConfirmDialogContext';
import { Trip } from '@/types';
import { Compass, Copy, Heart, Calendar, MapPin, Sparkles, Search, Loader2 } from 'lucide-react';

export default function CommunityPage() {
  const router = useRouter();
  const { communityTrips, cloneCommunityTrip, isSidebarCollapsed } = useTripContext();
  const { showAlert } = useConfirmDialog();
  const [filterTag, setFilterTag] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const [cloningId, setCloningId] = useState<string | null>(null);

  const filtered = communityTrips.filter((t) => {
    const matchesTag = filterTag === 'All' || t.tags.includes(filterTag);
    const q = search.toLowerCase();
    const destinationNames = t.destinations.map((d) =>
      `${d.cityName} ${d.country}`.toLowerCase()
    );
    const matchesSearch = search
      ? t.title.toLowerCase().includes(q) ||
        (t.description || '').toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        destinationNames.some((name) => name.includes(q))
      : true;
    return matchesTag && matchesSearch;
  });

  const handleCopyTrip = async (trip: Trip) => {
    setCloningId(trip.id);
    try {
      const newTripId = await cloneCommunityTrip(trip);
      if (newTripId) {
        await showAlert({
          title: 'Trip Cloned',
          message: `"${trip.title}" copied to your trips! Redirecting to builder...`,
          variant: 'success',
        });
        router.push(`/trips/${newTripId}/builder`);
      }
    } finally {
      setCloningId(null);
    }
  };

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
          <div className="mb-6 md:mb-8 bg-slate-900 text-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-md relative overflow-hidden">
            <div className="relative z-10 max-w-2xl">
              <span className="text-sky-400 font-semibold text-[10px] md:text-xs uppercase tracking-widest flex items-center gap-1.5 mb-2">
                <Sparkles className="w-3 h-3 md:w-3.5 md:h-3.5" /> Global Traveler Network
              </span>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">Explore Community Itineraries</h1>
              <p className="text-[10px] md:text-xs text-slate-300 leading-relaxed mb-4 md:mb-6">
                Discover curated travel plans created by experienced globe trotters. Use &quot;Copy This Trip&quot; to adapt any published itinerary as your starting template.
              </p>

              {/* Search Bar */}
              <div className="relative max-w-full md:max-w-md">
                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search community trips by keyword..."
                  className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-400 rounded-full pl-11 pr-4 py-2.5 text-xs outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 mb-6 md:mb-8 border-b border-slate-200 pb-4 overflow-x-auto">
            {['All', 'Sightseeing', 'Culture', 'Nature', 'Adventure', 'Food', 'Entertainment'].map((tag) => (
              <button
                key={tag}
                onClick={() => setFilterTag(tag)}
                className={`px-3 md:px-4 py-2 rounded-full text-[10px] md:text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                  filterTag === tag
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Community Trip Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {filtered.map((trip) => (
              <div
                key={trip.id}
                className="bg-white rounded-2xl md:rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-xl transition-all flex flex-col group"
              >
                <div
                  className="w-full h-48 md:h-56 bg-cover bg-center relative"
                  style={{ backgroundImage: `url('${trip.coverImage}')` }}
                >
                  <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/0 transition-colors"></div>

                  <div className="absolute top-3 md:top-4 left-3 md:left-4 flex items-center gap-2">
                    <img
                      src={trip.authorAvatar}
                      alt={trip.authorName}
                      className="w-7 h-7 md:w-8 md:h-8 rounded-full ring-2 ring-white object-cover"
                    />
                    <span className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] md:text-xs font-semibold px-2 md:px-3 py-1 rounded-full">
                      {trip.authorName}
                    </span>
                  </div>

                  <div className="absolute top-3 md:top-4 right-3 md:right-4">
                    <span className="bg-white/90 backdrop-blur-md text-slate-800 text-[10px] md:text-xs font-bold px-2 md:px-3 py-1 rounded-full flex items-center gap-1 shadow-xs">
                      <Heart className="w-3 h-3 md:w-3.5 md:h-3.5 text-red-500 fill-red-500" />
                      {trip.likesCount}
                    </span>
                  </div>
                </div>

                <div className="p-4 md:p-6 flex flex-col flex-1">
                  <h3 className="font-bold text-lg md:text-xl text-slate-900 mb-2">{trip.title}</h3>
                  <p className="text-[10px] md:text-xs text-slate-500 leading-relaxed mb-3 md:mb-4 line-clamp-2">{trip.description}</p>

                  <div className="flex flex-wrap gap-1.5 mb-4 md:mb-6">
                    {trip.tags.map((t) => (
                      <span
                        key={t}
                        className="bg-sky-50 text-sky-700 text-[10px] font-semibold px-2 md:px-2.5 py-0.5 rounded-full"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto pt-3 md:pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                        Estimated Budget
                      </span>
                      <span className="font-bold text-slate-900 text-xs md:text-sm">
                        ₹{trip.totalBudget.toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopyTrip(trip)}
                      disabled={cloningId === trip.id}
                      className="bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white font-bold px-3 md:px-5 py-2 md:py-2.5 rounded-full text-[10px] md:text-xs transition-all flex items-center gap-1.5 md:gap-2 shadow-md hover:shadow-lg cursor-pointer disabled:cursor-not-allowed"
                    >
                      {cloningId === trip.id ? (
                        <>
                          <Loader2 className="w-3 h-3 md:w-3.5 md:h-3.5 text-sky-400 animate-spin" />
                          <span className="hidden md:inline">Copying...</span>
                          <span className="md:hidden">...</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 md:w-3.5 md:h-3.5 text-sky-400" />
                          <span className="hidden md:inline">Copy This Trip</span>
                          <span className="md:hidden">Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
