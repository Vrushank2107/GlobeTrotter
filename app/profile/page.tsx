'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useTripContext } from '@/context/TripContext';
import { User, MapPin, Globe2, Award, Calendar, Wallet, Heart, Edit3 } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, trips, refreshData } = useTripContext();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <div className="pl-72 flex-1 flex flex-col min-w-0">
        <Header />

        <main className="pt-24 pb-16 px-10 min-h-screen max-w-5xl mx-auto w-full">
          {/* Profile Header Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs mb-8 flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-28 h-28 rounded-full object-cover ring-4 ring-sky-100 shadow-md"
              />
              <span className="absolute bottom-1 right-1 bg-sky-500 text-slate-950 p-1.5 rounded-full border-2 border-white">
                <Award className="w-4 h-4" />
              </span>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">{user.name}</h1>
                  <span className="text-sky-600 font-semibold text-xs uppercase tracking-wider">
                    {user.memberType} • {user.email}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => alert('Profile settings saved!')}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-5 py-2.5 rounded-full transition-all inline-flex items-center gap-2"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-sky-400" />
                    <span>Edit Profile</span>
                  </button>
                  <button
                    onClick={async () => {
                      await fetch('/api/auth/logout', { method: 'POST' });
                      await refreshData();
                      router.push('/login');
                    }}
                    className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-semibold text-xs px-5 py-2.5 rounded-full transition-all inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed max-w-xl mb-4">{user.bio}</p>

              <div className="flex flex-wrap gap-2">
                {user.favoriteDestinations.map((dest) => (
                  <span
                    key={dest}
                    className="bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1"
                  >
                    <MapPin className="w-3 h-3 text-sky-600" />
                    {dest}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs text-center">
              <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-3">
                <Globe2 className="w-6 h-6" />
              </div>
              <span className="text-3xl font-bold text-slate-900 block">{user.countriesVisited}</span>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Countries Visited
              </span>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs text-center">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6" />
              </div>
              <span className="text-3xl font-bold text-slate-900 block">{trips.length}</span>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Trips Planned
              </span>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs text-center">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-3">
                <Wallet className="w-6 h-6" />
              </div>
              <span className="text-3xl font-bold text-slate-900 block">
                ₹{(user.totalBudgetSpent / 100000).toFixed(2)}L
              </span>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Total Lifetime Spend
              </span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
