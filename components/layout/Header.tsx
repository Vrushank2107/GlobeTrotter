'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTripContext } from '@/context/TripContext';
import { LogOut, Plus, Zap, MapPin, Loader2, LogIn, UserPlus } from 'lucide-react';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, trips, refreshData, isSidebarCollapsed } = useTripContext();
  const [loggingOut, setLoggingOut] = React.useState(false);

  const isGuest = !user || user.id === 'usr_guest' || user.email === 'user@globetrotter.com';

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      await refreshData();
      router.push('/login');
    } catch {
      setLoggingOut(false);
    }
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
      className={`fixed top-0 right-0 h-16 md:h-20 bg-slate-50/80 backdrop-blur-xl z-40 px-3 md:px-8 flex items-center justify-between border-b border-slate-200/50 transition-all duration-300 left-0 md:${
        isSidebarCollapsed ? 'left-20' : 'left-72'
      }`}
    >
      {/* Left side: Quick Action Pills */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Page Title Pill - Always visible on mobile, simplified */}
        <div className="flex items-center gap-1.5 md:gap-2 bg-white border border-slate-200/80 px-2.5 md:px-3.5 py-1 md:py-1.5 rounded-full shadow-xs">
          <MapPin className="w-3 h-3 md:w-3.5 md:h-3.5 text-sky-600" />
          <span className="text-[10px] md:text-xs font-bold text-slate-800 tracking-tight hidden sm:block">{getPageTitle()}</span>
        </div>

        {/* Plan Trip Quick Pill - Hidden on small mobile */}
        <Link
          href="/trips/new"
          className="hidden sm:flex items-center gap-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200/80 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-xs hover:shadow-md transition-all group cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-sky-600 group-hover:rotate-90 transition-transform duration-200" />
          <span>+ Plan Trip</span>
        </Link>

        {/* Quick Stats Pill - Hidden on small mobile */}
        <Link
          href="/trips"
          className="hidden md:flex items-center gap-1.5 bg-amber-50/90 hover:bg-amber-100/90 text-amber-900 border border-amber-200/80 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
          <span>⚡ {trips.length} {trips.length === 1 ? 'Trip' : 'Trips'} Active</span>
        </Link>
      </div>

      {/* Right side: Action Controls */}
      <div className="flex items-center gap-2 md:gap-3">
        {isGuest ? (
          <>
            {/* Sign In Button */}
            <Link
              href="/login"
              className="flex items-center gap-1 md:gap-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200/80 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-[10px] md:text-xs font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              <LogIn className="w-3 h-3 md:w-3.5 md:h-3.5 text-sky-600" />
              <span className="hidden sm:inline">Sign In</span>
            </Link>

            {/* Sign Up Button */}
            <Link
              href="/register"
              className="flex items-center gap-1 md:gap-1.5 bg-sky-600 hover:bg-sky-700 text-white border border-sky-600 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-[10px] md:text-xs font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              <UserPlus className="w-3 h-3 md:w-3.5 md:h-3.5 text-white" />
              <span className="hidden sm:inline">Sign Up</span>
            </Link>
          </>
        ) : (
          <>
            {/* User Profile Link Pill - Simplified on mobile */}
            <Link
              href="/profile"
              className="flex items-center gap-1.5 md:gap-2 bg-white hover:bg-slate-100 border border-slate-200 px-2 md:px-3 py-1 md:py-1.5 rounded-full text-[10px] md:text-xs font-semibold text-slate-700 transition-all cursor-pointer"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-4 h-4 md:w-5 md:h-5 rounded-full object-cover"
              />
              <span className="hidden md:inline">{user.name}</span>
            </Link>

            {/* Sign Out Button - Icon only on mobile */}
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="bg-red-50 hover:bg-red-100 disabled:opacity-60 text-red-700 border border-red-200 text-[10px] md:text-xs font-semibold px-2 md:px-4 py-1.5 md:py-2.5 rounded-full shadow-xs transition-all flex items-center gap-1 md:gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {loggingOut ? (
                <Loader2 className="w-3 h-3 md:w-4 md:h-4 text-red-600 animate-spin" />
              ) : (
                <LogOut className="w-3 h-3 md:w-4 md:h-4 text-red-600" />
              )}
              <span className="hidden md:inline">{loggingOut ? 'Signing Out...' : 'Sign Out'}</span>
            </button>
          </>
        )}
      </div>
    </header>
  );
};

