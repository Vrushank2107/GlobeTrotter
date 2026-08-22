'use client';

import React, { useState } from 'react';
import { Plus, Clock, MapPin, Tag, CheckCircle2 } from 'lucide-react';
import ActivitySearch from './activity-search';
import { ActivityCategory } from '@/types';

export interface CatalogActivity {
  id: string;
  title: string;
  category: ActivityCategory;
  location: string;
  durationMinutes: number;
  cost: number;
  image: string;
  notes: string;
}

const PRESET_ACTIVITIES: CatalogActivity[] = [
  {
    id: 'act_goa_01',
    title: 'Scuba Diving & Watersports at Grand Island',
    category: 'Adventure',
    location: 'Grand Island, Goa',
    durationMinutes: 180,
    cost: 3500,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
    notes: 'Includes speed boat transfer and certified instructor.',
  },
  {
    id: 'act_goa_02',
    title: 'Sunset Cruise on Mandovi River',
    category: 'Sightseeing',
    location: 'Panaji Jetty, Goa',
    durationMinutes: 90,
    cost: 800,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    notes: 'Live Goan folk dance performance on board.',
  },
  {
    id: 'act_mum_01',
    title: 'Gateway of India & Elephanta Caves Tour',
    category: 'Culture',
    location: 'Colaba, Mumbai',
    durationMinutes: 240,
    cost: 1200,
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80',
    notes: 'Ferry tickets included.',
  },
  {
    id: 'act_mum_02',
    title: 'Khau Galli Street Food Walk',
    category: 'Food',
    location: 'Mohammad Ali Road, Mumbai',
    durationMinutes: 120,
    cost: 750,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
    notes: 'Guided food tasting tour.',
  },
  {
    id: 'act_jpr_01',
    title: 'Amber Fort Elephant Ride & Palace Tour',
    category: 'Culture',
    location: 'Amer, Jaipur',
    durationMinutes: 150,
    cost: 1500,
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80',
    notes: 'Best visited during early morning hours.',
  },
  {
    id: 'act_jpr_02',
    title: 'Chokhi Dhani Ethnic Resort Dinner',
    category: 'Entertainment',
    location: 'Tonk Road, Jaipur',
    durationMinutes: 180,
    cost: 1100,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
    notes: 'Traditional Rajasthani thali & cultural shows.',
  },
];

interface ActivitySelectorProps {
  onSelectActivity: (act: Omit<CatalogActivity, 'id' | 'image'>) => void;
  onClose?: () => void;
}

export default function ActivitySelector({ onSelectActivity, onClose }: ActivitySelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [addedIds, setAddedIds] = useState<string[]>([]);

  const filtered = PRESET_ACTIVITIES.filter((act) => {
    const matchesSearch = searchQuery
      ? act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        act.location.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesCat = selectedCategory === 'All' || act.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleAdd = (act: CatalogActivity) => {
    onSelectActivity({
      title: act.title,
      category: act.category,
      location: act.location,
      durationMinutes: act.durationMinutes,
      cost: act.cost,
      notes: act.notes,
    });
    setAddedIds((prev) => [...prev, act.id]);
  };

  return (
    <div className="space-y-4">
      <ActivitySearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-1">
        {filtered.map((act) => {
          const isAdded = addedIds.includes(act.id);

          return (
            <div
              key={act.id}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between hover:shadow-md transition-all p-3"
            >
              <div className="flex gap-3 items-start">
                <img
                  src={act.image}
                  alt={act.title}
                  className="w-16 h-16 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="bg-sky-50 text-sky-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mb-1 inline-block">
                    {act.category}
                  </span>
                  <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{act.title}</h4>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" /> {act.location}
                  </p>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3 text-slate-400 shrink-0" /> {act.durationMinutes} mins
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900">₹{act.cost.toLocaleString()}</span>

                <button
                  type="button"
                  onClick={() => handleAdd(act)}
                  disabled={isAdded}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                    isAdded
                      ? 'bg-emerald-100 text-emerald-700 cursor-default'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" /> Added
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5 text-sky-400" /> Add Activity
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
