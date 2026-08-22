'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useTripContext } from '@/context/TripContext';
import { useConfirmDialog } from '@/context/ConfirmDialogContext';
import { Trip } from '@/types';
import { Compass, Copy, Heart, Calendar, MapPin, Sparkles, Search } from 'lucide-react';

export default function CommunityPage() {
  const router = useRouter();
  const { communityTrips, cloneCommunityTrip } = useTripContext();
  const { showAlert } = useConfirmDialog();
  const [filterTag, setFilterTag] = useState<string>('All');
  const [search, setSearch] = useState<string>('');

  const filtered = communityTrips.filter((t) => {
    const matchesTag = filterTag === 'All' || t.tags.includes(filterTag);
    const matchesSearch = search
      ? t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchesTag && matchesSearch;
  });

  const handleCopyTrip = async (trip: Trip) => {
    const newTripId = await cloneCommunityTrip(trip);
    if (newTripId) {
      await showAlert({
        title: 'Trip Cloned',
        message: `"${trip.title}" copied to your trips! Redirecting to builder...`,
        variant: 'success',
      });
      router.push(`/trips/${newTripId}/builder`);
    }
  };

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
                <Sparkles className="w-3.5 h-3.5" /> Global Traveler Network
              </span>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Explore Community Itineraries</h1>
              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                Discover curated travel plans created by experienced globe trotters. Use &quot;Copy This Trip&quot; to adapt any published itinerary as your starting template.
              </p>

              {/* Search Bar */}
              <div className="relative max-w-md">
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
          <div className="flex items-center gap-2 mb-8 border-b border-slate-200 pb-4">
            {['All', 'Romance', 'Art', 'Nature', 'Adventure', 'Food'].map((tag) => (
              <button
                key={tag}
                onClick={() => setFilterTag(tag)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filtered.map((trip) => (
              <div
                key={trip.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-xl transition-all flex flex-col group"
              >
                <div
                  className="w-full h-56 bg-cover bg-center relative"
                  style={{ backgroundImage: `url('${trip.coverImage}')` }}
                >
                  <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/0 transition-colors"></div>

                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <img
                      src={trip.authorAvatar}
                      alt={trip.authorName}
                      className="w-8 h-8 rounded-full ring-2 ring-white object-cover"
                    />
                    <span className="bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {trip.authorName}
                    </span>
                  </div>

                  <div className="absolute top-4 right-4">
                    <span className="bg-white/90 backdrop-blur-md text-slate-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-xs">
                      <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                      {trip.likesCount}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-bold text-xl text-slate-900 mb-2">{trip.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">{trip.description}</p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {trip.tags.map((t) => (
                      <span
                        key={t}
                        className="bg-sky-50 text-sky-700 text-[10px] font-semibold px-2.5 py-0.5 rounded-full"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                        Estimated Budget
                      </span>
                      <span className="font-bold text-slate-900 text-sm">
                        ₹{trip.totalBudget.toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopyTrip(trip)}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-full text-xs transition-all flex items-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5 text-sky-400" />
                      <span>Copy This Trip</span>
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
