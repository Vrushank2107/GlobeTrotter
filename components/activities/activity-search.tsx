'use client';

import React from 'react';
import { Search, Filter } from 'lucide-react';
import { ActivityCategory } from '@/types';

interface ActivitySearchProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
}

const CATEGORIES = ['All', 'Sightseeing', 'Food', 'Adventure', 'Culture', 'Entertainment', 'Nature', 'Shopping'];

export default function ActivitySearch({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
}: ActivitySearchProps) {
  return (
    <div className="space-y-4 mb-6">
      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search activity by title, location, or tag..."
          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium outline-none focus:border-sky-500 focus:bg-white transition-all"
        />
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all shrink-0 cursor-pointer ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
