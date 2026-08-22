'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTripContext } from '@/context/TripContext';
import { LogOut, Plus, Zap, MapPin } from 'lucide-react';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { trips, refreshData, isSidebarCollapsed } = useTripContext();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    await refreshData();
    router.push('/login');
  };

  const getPageTitle = () => {
    if (pathname === '/dashboard') return 'Dashboard';
    if (pathname === '/trips') return 'My Trips';
    if (pathname === '/trips/new') return 'Plan New Trip';
    if (pathname.includes('/builder')) return 'Itinerary Builder';
    if (pathname.includes('/budget')) return 'Trip Budget';
    if (pathname.startsWith('/trips/')) return 'Trip Details';
    if (pathname === '/calendar') return 'Calendar Schedule';
    if (pathname === '/community') return 'Community Showcase';
    if (pathname === '/explore') return 'Explore Destinations';
    if (pathname === '/profile') return 'User Profile';
    if (pathname === '/admin') return 'Admin Dashboard';
    return 'Overview';
  };

  return (
    <header
      className={`fixed top-0 right-0 h-20 bg-slate-50/80 backdrop-blur-xl z-40 px-8 flex items-center justify-between border-b border-slate-200/50 transition-all duration-300 ${
        isSidebarCollapsed ? 'left-20' : 'left-72'
      }`}
    >
      {/* Left side: Quick Action Pills */}
      <div className="flex items-center gap-3">
        {/* Page Title Pill */}
        <div className="flex items-center gap-2 bg-white border border-slate-200/80 px-3.5 py-1.5 rounded-full shadow-xs">
          <MapPin className="w-3.5 h-3.5 text-sky-600" />
          <span className="text-xs font-bold text-slate-800 tracking-tight">{getPageTitle()}</span>
        </div>

        {/* Plan Trip Quick Pill */}
        <Link
          href="/trips/new"
          className="flex items-center gap-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200/80 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-xs hover:shadow-md transition-all group cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-sky-600 group-hover:rotate-90 transition-transform duration-200" />
          <span>+ Plan Trip</span>
        </Link>

        {/* Quick Stats Pill */}
        <Link
          href="/trips"
          className="flex items-center gap-1.5 bg-amber-50/90 hover:bg-amber-100/90 text-amber-900 border border-amber-200/80 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
          <span>⚡ {trips.length} {trips.length === 1 ? 'Trip' : 'Trips'} Active</span>
        </Link>
      </div>

      {/* Right side: Action Controls */}
      <div className="flex items-center gap-4">
        {/* Sign Out Button */}
        <button
          onClick={handleLogout}
          className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-semibold px-4 py-2.5 rounded-full shadow-xs transition-all flex items-center gap-2 cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-red-600" />
          <span>Sign Out</span>
        </button>
      </div>
    </header>
  );
};
