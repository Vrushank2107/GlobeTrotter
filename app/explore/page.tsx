'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useTripContext } from '@/context/TripContext';
import { Compass, MapPin, Star, Sparkles, Search, ArrowRight } from 'lucide-react';

export default function ExplorePage() {
  const { destinations, searchQuery } = useTripContext();
  const [selectedTag, setSelectedTag] = useState<string>('All');

  const filtered = destinations.filter((dest) => {
    const matchesSearch = searchQuery
      ? dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesTag = selectedTag === 'All' || dest.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
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

                  <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                        Avg Cost/Day
                      </span>
                      <span className="font-bold text-slate-900 text-sm">
                        ₹{dest.avgCostPerDay.toLocaleString()}
                      </span>
                    </div>

                    <Link
                      href="/trips/new"
                      className="bg-sky-50 text-sky-700 hover:bg-sky-100 font-semibold px-4 py-2 rounded-full text-xs transition-all inline-flex items-center gap-1"
                    >
                      <span>Plan Trip</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
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
