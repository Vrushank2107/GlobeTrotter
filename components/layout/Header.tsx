'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTripContext } from '@/context/TripContext';
import { Search, Bell, Plus, ChevronRight, Home } from 'lucide-react';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { searchQuery, setSearchQuery } = useTripContext();

  const getBreadcrumb = () => {
    if (pathname === '/dashboard') return 'Dashboard';
    if (pathname === '/trips') return 'My Trips';
    if (pathname === '/trips/new') return 'Plan New Trip';
    if (pathname.includes('/builder')) return 'Itinerary Builder';
    if (pathname.includes('/budget')) return 'Trip Budget';
    if (pathname.startsWith('/trips/')) return 'Trip Details';
    if (pathname === '/calendar') return 'Calendar Schedule';
    if (pathname === '/community') return 'Community Showcase';
    if (pathname === '/profile') return 'User Profile';
    if (pathname === '/admin') return 'Admin Dashboard';
    return 'Overview';
  };

  return (
    <header className="fixed top-0 left-72 right-0 h-20 bg-slate-50/80 backdrop-blur-xl z-40 px-8 flex items-center justify-between border-b border-slate-200/50">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-slate-500 text-sm">
        <Link href="/dashboard" className="flex items-center gap-1 hover:text-sky-600 transition-colors">
          <Home className="w-4 h-4" />
          <span>Home</span>
        </Link>
        <ChevronRight className="w-4 h-4 text-slate-300" />
        <span className="font-semibold text-slate-900">{getBreadcrumb()}</span>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search destinations, trips..."
            className="bg-white border border-slate-200 h-10 pl-10 pr-4 rounded-full text-xs outline-none w-64 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all shadow-xs"
          />
        </div>

        {/* Notifications */}
        <button className="p-2.5 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 relative shadow-xs transition-all cursor-pointer">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
        </button>

        {/* Plan New Trip CTA */}
        <Link
          href="/trips/new"
          className="bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold px-4 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4 text-sky-400" />
          <span>Plan New Trip</span>
        </Link>
      </div>
    </header>
  );
};
