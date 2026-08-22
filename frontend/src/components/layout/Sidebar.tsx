'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTripContext } from '../../context/TripContext';
import {
  LayoutDashboard,
  Compass,
  Users,
  CalendarDays,
  User,
  ShieldAlert,
  Globe2,
  MoreVertical,
  Luggage,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { user } = useTripContext();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Trips', path: '/trips', icon: Luggage },
    { label: 'Explore & Community', path: '/community', icon: Users },
    { label: 'Calendar View', path: '/calendar', icon: CalendarDays },
    { label: 'Profile', path: '/profile', icon: User },
    { label: 'Admin Panel', path: '/admin', icon: ShieldAlert },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-white z-50 flex flex-col border-r border-slate-200 shadow-xs">
      {/* Brand Header */}
      <Link href="/dashboard" className="p-6 flex items-center gap-3 border-b border-slate-100">
        <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-md">
          <Globe2 className="w-6 h-6 text-sky-400" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-xl text-slate-900 tracking-tight flex items-center gap-1">
            GlobeTrotter
          </span>
          <span className="text-xs text-sky-600 font-medium tracking-wider uppercase">
            Travel Planner
          </span>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Planning Hub
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path || (item.path !== '/dashboard' && pathname.startsWith(item.path));

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center px-4 py-3 rounded-xl transition-all gap-3.5 text-sm font-medium ${
                isActive
                  ? 'bg-sky-50 text-sky-700 font-semibold shadow-xs border border-sky-100'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile Card */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <Link href="/profile" className="flex items-center gap-3 p-3 bg-white rounded-xl hover:shadow-xs transition-all border border-slate-200/80 cursor-pointer">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-sky-100"
          />
          <div className="flex flex-col min-w-0 flex-1">
            <span className="font-semibold text-sm text-slate-900 truncate">{user.name}</span>
            <span className="text-xs text-sky-600 font-medium truncate">{user.memberType}</span>
          </div>
          <MoreVertical className="w-4 h-4 text-slate-400 shrink-0" />
        </Link>
      </div>
    </aside>
  );
};
