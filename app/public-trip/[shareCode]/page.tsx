'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Trip } from '@/types';
import { Calendar, Copy, ArrowLeft } from 'lucide-react';
import { useTripContext } from '@/context/TripContext';

export default function PublicTripPage() {
  const params = useParams();
  const router = useRouter();
  const shareCode = params.shareCode as string;
  const { cloneCommunityTrip, isSidebarCollapsed } = useTripContext();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchPublicTrip() {
      try {
        setLoading(true);
        const res = await fetch(`/api/public-trip/${shareCode}`);
        const data = await res.json();
        if (data.success && data.data) {
          setTrip(data.data);
        }
      } catch (err) {
        console.error('Error fetching public trip:', err);
      } finally {
        setLoading(false);
      }
    }
    if (shareCode) fetchPublicTrip();
  }, [shareCode]);

  const [copiedLink, setCopiedLink] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(encodeURIComponent(window.location.href));
    }
  }, []);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const handleCopyTrip = async () => {
    if (!trip) return;
    const newId = await cloneCommunityTrip(trip);
    if (newId) {
      router.push(`/trips/${newId}/builder`);
    }
  };

  const shareText = `Check out this multi-city travel itinerary for ${trip?.title || 'GlobeTrotter'}!`;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-sm text-slate-500">Loading public trip...</p>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Public Trip Not Found</h2>
        <p className="text-xs text-slate-500 mb-6">The link might be invalid or expired.</p>
        <Link href="/community" className="bg-sky-600 text-white text-xs px-6 py-2.5 rounded-full font-semibold">
          Explore Community Trips
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <div className={`pl-0 flex-1 flex flex-col min-w-0 transition-all duration-300 ${isSidebarCollapsed ? 'md:pl-20' : 'md:pl-72'}`}>
        <Header />

        <main className="pt-24 pb-16 px-10 min-h-screen max-w-5xl mx-auto w-full">
          <div className="mb-6 flex items-center justify-between">
            <Link href="/community" className="text-xs text-sky-600 font-semibold flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Back to Community Showcase
            </Link>
            <span className="bg-sky-100 text-sky-800 text-[11px] font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
              Public Shared Itinerary
            </span>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs mb-8">
            <div
              className="h-64 bg-cover bg-center relative p-8 flex items-end"
              style={{ backgroundImage: `url('${trip.coverImage}')` }}
            >
              <div className="absolute inset-0 bg-slate-950/40"></div>
              <div className="relative z-10 text-white">
                <span className="text-sky-300 text-xs uppercase font-bold tracking-widest block mb-1">
                  Shared Itinerary • Code: {shareCode}
                </span>
                <h1 className="text-3xl font-bold">{trip.title}</h1>
                <p className="text-xs text-slate-200 mt-1 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-sky-400" /> {trip.startDate} - {trip.endDate} | Created by {trip.authorName || 'Community Traveler'}
                </p>
              </div>
            </div>

            <div className="p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-lg mb-1">Share & Copy Itinerary</h3>
                <p className="text-xs text-slate-500">
                  Use this public trip as a starting template or share it with fellow travelers.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 items-center">
                <button
                  onClick={handleCopyLink}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs px-4 py-2.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 text-slate-600" />
                  <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
                </button>

                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ')}${currentUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs px-4 py-2.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>WhatsApp</span>
                </a>

                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${currentUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-sky-50 hover:bg-sky-100 text-sky-800 font-semibold text-xs px-4 py-2.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>X / Twitter</span>
                </a>

                <button
                  onClick={handleCopyTrip}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-2.5 rounded-full shadow-md transition-all flex items-center gap-2 cursor-pointer ml-1"
                >
                  <Copy className="w-4 h-4 text-sky-400" />
                  <span>Copy This Trip</span>
                </button>
              </div>
            </div>

            <div className="p-8">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Multi-City Stops</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {trip.destinations.map((dest) => (
                  <div key={dest.id} className="border border-slate-200 rounded-2xl p-4 bg-slate-50">
                    <h4 className="font-bold text-slate-900 text-sm mb-1">{dest.cityName}</h4>
                    <p className="text-xs text-slate-500">{dest.country}</p>
                    <p className="text-[11px] text-slate-400 mt-2">{dest.startDate} to {dest.endDate}</p>
                  </div>
                ))}
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-4">Scheduled Activities ({trip.activities.length})</h3>
              <div className="space-y-3">
                {trip.activities.map((act) => (
                  <div key={act.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-semibold text-slate-900 block text-sm">{act.title}</span>
                      <span className="text-slate-500">{act.location} • Day {act.dayNumber} ({act.time})</span>
                    </div>
                    <span className="font-bold text-slate-900">₹{act.cost.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
