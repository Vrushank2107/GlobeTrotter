'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTripContext } from '@/context/TripContext';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  User,
  Globe2,
  Luggage,
  Compass,
  ChevronLeft,
  ChevronRight,
  X,
  Menu,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { user, isSidebarCollapsed: isCollapsed, toggleSidebar, isMounted } = useTripContext();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Don't render sidebar until mounted to prevent hydration mismatch
  if (!isMounted) {
    return null;
  }

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Trips', path: '/trips', icon: Luggage },
    { label: 'Explore Destinations', path: '/explore', icon: Compass },
    { label: 'Community Showcase', path: '/community', icon: Users },
    { label: 'Calendar View', path: '/calendar', icon: CalendarDays },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  const closeMobileMenu = () => setIsMobileOpen(false);

  return (
    <>


      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white border border-slate-200 text-slate-600 p-2 rounded-xl shadow-md hover:bg-slate-50 transition-all"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Desktop spacer for header */}
      <div className="hidden md:block h-20" />

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          onClick={closeMobileMenu}
          className="md:hidden fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-40 transition-opacity"
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-screen bg-white z-50 flex flex-col border-r border-slate-200/90 shadow-sm transition-all duration-300 select-none ${
          isCollapsed ? 'w-20' : 'w-72'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        {/* Mobile Close Button */}
        <button
          onClick={closeMobileMenu}
          className="md:hidden absolute top-4 right-4 z-50 bg-slate-100 text-slate-600 p-2 rounded-xl hover:bg-slate-200 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Floating Desktop Toggle Button */}
        <button
          onClick={toggleSidebar}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          className="hidden md:flex absolute -right-3.5 top-6 z-[60] bg-white border border-slate-200 text-slate-600 hover:text-sky-600 hover:border-sky-300 hover:scale-110 items-center justify-center w-7 h-7 rounded-full shadow-md transition-all cursor-pointer group"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          ) : (
            <ChevronLeft className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          )}
        </button>

        {/* Brand Header */}
        <div className={`p-4 flex items-center border-b border-slate-100 min-h-[73px] ${isCollapsed ? 'justify-center' : 'px-6'}`}>
          <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden group" onClick={closeMobileMenu}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0">
              <Globe2 className="w-6 h-6 text-sky-400" />
            </div>

            {!isCollapsed && (
              <div className="flex flex-col whitespace-nowrap animate-fade-in">
                <span className="font-bold text-xl text-slate-900 tracking-tight flex items-center gap-1">
                  GlobeTrotter
                </span>
                <span className="text-[10px] text-sky-600 font-bold tracking-widest uppercase">
                  Travel Planner
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto overflow-x-hidden">
          {!isCollapsed && (
            <div className="px-3 mb-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              Planning Hub
            </div>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path || (item.path !== '/dashboard' && pathname.startsWith(item.path));

            return (
              <div key={item.path} className="relative group">
                <Link
                  href={item.path}
                  onClick={closeMobileMenu}
                  className={`flex items-center rounded-xl transition-all font-medium text-sm ${
                    isCollapsed
                      ? 'justify-center w-12 h-12 mx-auto'
                      : 'px-4 py-3 gap-3.5'
                  } ${
                    isActive
                      ? isCollapsed
                        ? 'bg-slate-900 text-white shadow-md'
                        : 'bg-sky-50 text-sky-700 font-semibold shadow-xs border border-sky-100'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 shrink-0 ${
                      isActive
                        ? isCollapsed
                          ? 'text-sky-400'
                          : 'text-sky-600'
                        : 'text-slate-400 group-hover:text-slate-700'
                    }`}
                  />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </Link>

                {/* Floating Tooltip Label in Collapsed Mode */}
                {isCollapsed && (
                  <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-50 transform translate-x-1 group-hover:translate-x-0 flex items-center gap-1.5">
                    <span>{item.label}</span>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
};