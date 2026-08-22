'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useTripContext } from '@/context/TripContext';
import { useConfirmDialog } from '@/context/ConfirmDialogContext';
import { ArrowLeft, Copy, Heart, Calendar, MapPin, Sparkles } from 'lucide-react';

export default function CommunityTripDetailPage() {
  const params = useParams();
  const router = useRouter();
  const tripId = params.tripId as string;

  const { communityTrips, cloneCommunityTrip } = useTripContext();
  const { showAlert } = useConfirmDialog();
  const trip = communityTrips.find((t) => t.id === tripId) || communityTrips[0];

  if (!trip) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-sm text-slate-500">Community trip not found.</p>
      </div>
    );
  }

  const handleCopyTrip = async () => {
    const newTripId = await cloneCommunityTrip(trip);
    if (newTripId) {
      await showAlert({
        title: 'Trip Cloned',
        message: `"${trip.title}" copied to your trips! Redirecting to builder...`,
        variant: 'success',
      });
      router.push(`/trips/${newTripId}/builder`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <div className="pl-72 flex-1 flex flex-col min-w-0">
        <Header />

        <main className="pt-20 pb-16 min-h-screen">
          <div
            className="relative w-full h-80 mb-8 flex items-end p-10 bg-cover bg-center shadow-sm"
            style={{
              backgroundImage: `linear-gradient(to top, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.4), transparent), url('${trip.coverImage}')`,
            }}
          >
            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between w-full gap-4 text-white">
              <div>
                <Link href="/community" className="text-xs text-sky-400 font-semibold flex items-center gap-1 mb-2 hover:underline">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Community Showcase
                </Link>
                <h1 className="text-4xl font-bold mb-2">{trip.title}</h1>
                <p className="text-sm text-slate-300">Created by {trip.authorName || 'Community Traveler'}</p>
              </div>

              <button
                onClick={handleCopyTrip}
                className="bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold px-6 py-3 rounded-full transition-all flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <Copy className="w-4 h-4" />
                <span>Copy This Trip</span>
              </button>
            </div>
          </div>

          <div className="px-10 max-w-4xl">
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-3">About this Itinerary</h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">{trip.description}</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 uppercase font-semibold text-[10px] block">Est. Budget</span>
                  <span className="font-bold text-slate-900 text-base">₹{trip.totalBudget.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-semibold text-[10px] block">Travelers</span>
                  <span className="font-bold text-slate-900 text-base">{trip.travelers} Persons</span>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-semibold text-[10px] block">Likes</span>
                  <span className="font-bold text-red-600 text-base flex items-center gap-1">
                    <Heart className="w-4 h-4 fill-red-600" /> {trip.likesCount}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-semibold text-[10px] block">Activities</span>
                  <span className="font-bold text-slate-900 text-base">{trip.activities.length} Included</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
